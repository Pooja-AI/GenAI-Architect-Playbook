## What happens if Salesforce is unavailable?

In **CWD**, Salesforce is a downstream enterprise dependency accessed through the **MCP Server**. If Salesforce is unavailable, I isolate the failure to the affected Worker rather than failing the entire CWD workflow immediately.

### CWD flow

```text
Customer Worker
      ↓
MCP Client
      ↓
MCP Server
      ↓
Salesforce ❌ Unavailable
      ↓
Timeout / 5xx
      ↓
Retry + Circuit Breaker
      ↓
Worker failure
      ↓
Delegator
      ↓
Coordinator
```

### 1. Detect the Salesforce failure

For example:

```text
Customer Worker
      ↓
MCP → Salesforce
      ↓
HTTP 503 / timeout
```

I capture:

```text
correlation_id
trace_id
task_id
worker_id
MCP tool
Salesforce error
latency
retry_count
```

### 2. Retry transient failures

If Salesforce returns a temporary error such as `503` or timeout:

```text
Attempt 1 → timeout
Attempt 2 → 503
Attempt 3 → success
```

I use **limited retries + exponential backoff + jitter**.

I would not continuously retry because that could make the Salesforce outage worse.

### 3. Use a circuit breaker

If Salesforce continues failing:

```text
CLOSED
  ↓ failures increase
OPEN
  ↓
Stop sending requests to Salesforce temporarily
  ↓
After cooldown
  ↓
HALF-OPEN
  ↓
Test request
  ↓
Success → CLOSED
Failure → OPEN
```

This prevents CWD from repeatedly hitting an unavailable Salesforce service.

### 4. What happens to the Worker?

The Customer Worker returns a structured failure:

```json id="q5k8zs"
{
  "worker": "CustomerWorker",
  "status": "failed",
  "dependency": "Salesforce",
  "error_type": "DEPENDENCY_UNAVAILABLE",
  "retryable": true
}
```

The **Delegator** sends this result to the **Coordinator**.

### 5. Coordinator decides whether to continue

Suppose Customer Briefing uses:

```text
Sales Delegator
 ├── Customer Worker → Salesforce ❌
 └── Opportunity Worker → Salesforce ❌

IT Delegator
 └── Incident Worker → ServiceNow ✅
```

The Coordinator sees:

```text
Sales information → unavailable
IT information    → available
```

If Salesforce data is mandatory:

```text
→ Workflow failed / HITL
```

If it is optional:

```text
→ Return partial result
```

But importantly, I would clearly tell the user that Salesforce information was unavailable.

### 6. Don't hallucinate Salesforce data

This is critical.

If Salesforce is unavailable:

```text
Salesforce data unavailable
        ↓
No authoritative customer data
        ↓
Do NOT ask LLM to guess
        ↓
Return unavailable / partial result
```

For example:

> "Customer CRM information could not be retrieved because Salesforce is temporarily unavailable."

Not:

> "The customer has $2M in active opportunities."

### 7. What about cached data?

If the business allows it, I can use **cached, read-only data** for non-critical information:

```text
Salesforce unavailable
       ↓
Check approved cache
       ↓
Fresh enough?
   ┌──────┴──────┐
  YES            NO
   ↓              ↓
Use cache      Mark unavailable
```

The cache must respect:

* tenant
* user authorization
* data classification
* freshness/TTL

I would never use stale cached data for a critical transaction without an explicit business policy.

### 8. What about write operations?

For operations such as:

```text
Create Salesforce case
Update opportunity
Create customer record
```

I would use **idempotency keys** and, where appropriate, a durable queue such as **Azure Service Bus**.

```text
Worker
  ↓
MCP
  ↓
Salesforce unavailable
  ↓
Durable queue
  ↓
Retry later
```

This is safer than repeatedly calling Salesforce directly.

---

## Interview-ready answer

> **“If Salesforce is unavailable, the Worker detects the MCP/downstream failure and treats it as a dependency failure. For transient errors such as timeout or 503, I use limited retries with exponential backoff and jitter. If failures continue, I use a circuit breaker to stop sending traffic to Salesforce temporarily. The Worker returns a structured dependency-unavailable status to the Delegator, which passes it to the Coordinator. The Coordinator determines whether Salesforce data is mandatory or optional. If optional, we can return a partial result or approved cached data; if mandatory, we fail or route to HITL. Most importantly, we never ask the LLM to fabricate missing Salesforce information. For write operations, I use idempotency and durable queuing where appropriate.”**

### Strong interview line

> **“When Salesforce is down, I fail safely, not silently: retry transient failures, open the circuit when necessary, preserve state, and never hallucinate unavailable enterprise data.”**

**Easy memory:**
**Detect → Retry → Circuit breaker → Check cache/queue → Worker failure → Coordinator decides → Never hallucinate.**
