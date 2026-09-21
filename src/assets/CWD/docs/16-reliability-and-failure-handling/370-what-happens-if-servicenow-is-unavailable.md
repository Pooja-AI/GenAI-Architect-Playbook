## What happens if ServiceNow is unavailable?

In **CWD**, ServiceNow is a downstream system accessed through the **MCP Server** by the **Incident Worker**. If ServiceNow is unavailable, I isolate the failure to the Incident Worker and let the Coordinator decide whether the workflow can continue.

### CWD flow

```text
Coordinator
    ↓ A2A
IT Delegator
    ↓
Incident Worker
    ↓
MCP Client
    ↓
MCP Server
    ↓
ServiceNow ❌ unavailable
```

### 1. Detect the failure

For example:

```text
ServiceNow → HTTP 503 / timeout
```

The MCP layer returns the error to the Worker.

```text
Incident Worker
      ↓
MCP call
      ↓
ServiceNow timeout
      ↓
Worker = dependency failure
```

I capture:

```text
correlation_id
trace_id
task_id
worker_id
mcp_tool
error_type
latency
retry_count
```

### 2. Retry transient failures

For timeout/503:

```text
Attempt 1 → timeout
Attempt 2 → timeout
Attempt 3 → timeout
```

I use **limited retries + exponential backoff + jitter**.

I don't retry indefinitely.

### 3. Circuit breaker

If ServiceNow continues failing:

```text
CLOSED
   ↓ repeated failures
OPEN
   ↓
Stop calling ServiceNow
   ↓
Cooldown
   ↓
HALF-OPEN
   ↓
Test request
   ↓
Success → CLOSED
Failure → OPEN
```

This protects both CWD and ServiceNow from unnecessary repeated calls.

### 4. Worker returns structured failure

For example:

```json id="7y6v6x"
{
  "worker": "IncidentWorker",
  "status": "failed",
  "dependency": "ServiceNow",
  "error_type": "DEPENDENCY_UNAVAILABLE",
  "retryable": true
}
```

The Delegator sends this result to the Coordinator.

### 5. Coordinator decides whether to continue

Suppose Customer Briefing needs:

```text
Sales Delegator
 └── Customer Worker → Salesforce ✅

IT Delegator
 └── Incident Worker → ServiceNow ❌
```

The Coordinator now has:

```text
Customer information → available
Incident information → unavailable
```

If incident information is optional:

```text
→ Return partial result
```

If incident information is mandatory:

```text
→ Fail workflow / HITL
```

### 6. Never hallucinate incidents

This is particularly important for enterprise support.

If ServiceNow is unavailable:

```text
ServiceNow unavailable
       ↓
No authoritative incident data
       ↓
LLM must NOT invent incidents
       ↓
Return "incident information unavailable"
```

For example:

> **“ServiceNow is temporarily unavailable, so current incident information could not be retrieved.”**

Instead of allowing the LLM to guess whether the customer has open incidents.

### 7. What about cached incidents?

For **read-only** requests, an approved cache can be used if business policy allows it:

```text
ServiceNow unavailable
        ↓
Check cache
        ↓
Fresh + authorized?
     /        \
   YES         NO
    ↓           ↓
Use cache    Return unavailable
```

The cached response should include its freshness timestamp, for example:

```text
last_updated = 10 minutes ago
```

I would not use stale incident information for a critical operational decision unless explicitly permitted.

### 8. What about creating/updating ServiceNow tickets?

For writes:

```text
Create Incident
Update Incident
Close Incident
```

I would use **idempotency + durable messaging** where appropriate.

```text
Worker
  ↓
MCP
  ↓
ServiceNow unavailable
  ↓
Service Bus / durable queue
  ↓
Retry when ServiceNow recovers
```

The idempotency key prevents duplicate ticket creation if the request actually succeeded but the response was lost.

---

## Interview-ready answer

> **“If ServiceNow is unavailable, the Incident Worker detects the MCP or downstream failure. For transient errors such as timeout or 503, I retry with exponential backoff and jitter. If the dependency continues failing, I open a circuit breaker to prevent repeated calls. The Worker returns a structured dependency-unavailable response to the IT Delegator, which passes it to the Coordinator. The Coordinator determines whether incident information is mandatory. If optional, we can return a partial result or approved cached data; if mandatory, we fail or route to HITL. For write operations, I use idempotency and durable queuing where appropriate. Most importantly, I never allow the LLM to fabricate ServiceNow incident information.”**

### Strong interview line

> **“ServiceNow being unavailable should degrade the affected capability, not destabilize the entire CWD workflow.”**

**Easy memory:**
**ServiceNow down → Retry → Circuit breaker → Cache/Queue → Worker failure → Coordinator decides → Never hallucinate.**
