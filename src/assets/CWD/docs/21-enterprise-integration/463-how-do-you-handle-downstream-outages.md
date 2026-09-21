## How do you handle downstream outages in CWD?

In CWD, a **downstream outage** means an enterprise dependency such as **Salesforce, ServiceNow, Oracle, Snowflake, SharePoint, an MCP server, or an LLM service** is unavailable or unhealthy.

The key principle is:

> **Detect → Isolate → Retry safely → Fail fast → Degrade gracefully → Recover → Resume**

### CWD flow

```text id="h8e6k7"
Worker
  ↓
MCP Server
  ↓
Enterprise System
  X
  ↓
Timeout / 5xx / Connection Failure
  ↓
Retry + Backoff
  ↓
Circuit Breaker
  ↓
Structured Failure
  ↓
Coordinator
  ↓
Partial Result / Queue / HITL / Fail
```

---

## 1. Detect the outage

I detect failures using:

* HTTP 5xx
* Timeout
* Connection failure
* DNS/network failure
* 429 throttling
* Health-check failures
* MCP connection errors
* Increased latency
* Repeated tool failures

For example:

```text id="6g4e3p"
Incident Worker
      ↓
ServiceNow MCP
      ↓
ServiceNow
      X
   503 / timeout
```

The MCP layer reports a structured failure instead of returning an ambiguous response.

---

## 2. Retry only transient failures

For temporary failures:

```text id="l9h1u2"
Attempt 1
   ↓
503
   ↓
wait + jitter
   ↓
Attempt 2
   ↓
503
   ↓
wait + jitter
   ↓
Attempt 3
```

I use **bounded retries with exponential backoff**.

Typically, I'd start with a small retry budget such as 2–3 attempts and tune it based on the dependency's SLA and behavior.

I don't retry forever.

### Usually retryable

```text
429
502
503
504
temporary timeout
temporary network failure
```

### Usually not retryable

```text
400
401
403
invalid parameters
schema validation failure
business validation failure
```

---

## 3. Use a circuit breaker

If ServiceNow is continuously failing, repeatedly retrying from hundreds of Workers can make the outage worse.

So I use a circuit breaker:

```text id="1w6vqs"
        CLOSED
          ↓
Repeated failures
          ↓
         OPEN
          ↓
Stop calls temporarily
          ↓
      Wait period
          ↓
      HALF-OPEN
       ↙       ↘
Success       Failure
  ↓              ↓
CLOSED          OPEN
```

For example:

```text id="lqk3kz"
ServiceNow MCP
      ↓
Circuit Breaker
      ↓
ServiceNow
```

When the circuit is open, new calls fail fast instead of continuously hitting ServiceNow.

---

## 4. Return structured errors

The Worker shouldn't return:

> "Something went wrong."

Instead:

```json id="pjq7n3"
{
  "status": "DEPENDENCY_UNAVAILABLE",
  "dependency": "ServiceNow",
  "operation": "get_open_incidents",
  "retryable": true
}
```

This allows the Coordinator to make a deterministic decision.

---

# 5. Coordinator decides whether the dependency is critical

This is very important in your CWD architecture.

Suppose the Customer Briefing needs:

```text id="xq3g9r"
Salesforce → Customer information
ServiceNow → Open incidents
Snowflake   → Sales analytics
```

If ServiceNow is down:

```text id="9v0v2g"
Salesforce  → SUCCESS
Snowflake    → SUCCESS
ServiceNow   → FAILED
```

The Coordinator doesn't necessarily fail the entire workflow.

If incidents are optional:

```text
→ Return partial Customer Briefing
→ Clearly indicate ServiceNow data unavailable
```

If incident data is mandatory:

```text
→ Pause workflow
→ Queue/retry
→ HITL if appropriate
```

---

## 6. Graceful degradation

This is called **graceful degradation**.

For example:

```text id="cx9yqt"
Customer Briefing
      |
      +-- Salesforce ✓
      |
      +-- Snowflake  ✓
      |
      +-- ServiceNow ✗
```

The final response can still contain the available information.

But it must clearly identify:

```text
ServiceNow incident information:
UNAVAILABLE
```

**Never replace missing enterprise data with an LLM-generated guess.**

---

## 7. Use fallback only when it is safe

A fallback should be **predefined and approved**, not invented dynamically by the LLM.

For example:

```text id="l4m8t5"
ServiceNow
    ↓ unavailable
Approved Cache
    ↓
Recent validated incident data
```

But the cache must satisfy:

* Correct tenant
* Correct authorization
* Acceptable freshness
* Known timestamp
* Appropriate data sensitivity

For real-time incident information, stale cache may not be acceptable.

So:

> **Availability should never come at the cost of correctness.**

---

## 8. Queue asynchronous operations

For long-running or write operations, I can use **Azure Service Bus**.

Example:

```text id="h1e6vo"
Worker
 ↓
Service Bus
 ↓
MCP
 ↓
ServiceNow
```

If ServiceNow is temporarily unavailable:

```text id="b5l4qy"
Message
 ↓
Retry
 ↓
Retry
 ↓
ServiceNow still unavailable
 ↓
DLQ
```

After ServiceNow recovers:

```text id="c9v4a7"
Fix dependency
    ↓
Replay failed task
    ↓
Idempotency check
    ↓
ServiceNow
```

This is particularly important for **write operations**, where we don't want to lose requests.

---

# 9. Idempotency prevents duplicate transactions

Imagine:

```text id="s0b5bg"
create_incident()
       ↓
ServiceNow processes request
       ↓
Network timeout
       ↓
Worker thinks it failed
       ↓
Retry
```

Without idempotency:

```text
→ Incident #1
→ Incident #2  ❌
```

With an idempotency key:

```text id="l5p4ck"
workflow_id + task_id + operation
             ↓
       Idempotency Key
             ↓
ServiceNow / MCP
```

The retry can safely determine that the operation was already processed.

---

# 10. Persist workflow state

Suppose:

```text id="xxr4xg"
Customer Worker      ✓
Opportunity Worker   ✓
Incident Worker      ✗
```

CWD checkpoints:

```json id="3z7f8q"
{
  "workflow_id": "WF-1001",
  "completed_tasks": [
    "customer_worker",
    "opportunity_worker"
  ],
  "failed_tasks": [
    "incident_worker"
  ],
  "status": "PARTIALLY_COMPLETED"
}
```

When ServiceNow recovers, CWD doesn't restart everything.

It resumes:

```text id="h5d0av"
Load checkpoint
      ↓
Skip completed Workers
      ↓
Retry Incident Worker
      ↓
Aggregate
```

This is one of the major reasons we use **LangGraph + durable checkpointing**.

---

# 11. Don't create cascading failures

Imagine:

```text id="e5f9hz"
ServiceNow outage
      ↓
Incident Worker retries
      ↓
100 Workers retry
      ↓
MCP overloaded
      ↓
Coordinator overloaded
      ↓
CWD outage
```

I prevent this using:

* Circuit breakers
* Bounded retries
* Exponential backoff + jitter
* Concurrency limits
* Queue/backpressure
* Rate limiting
* Timeouts
* Bulkhead isolation
* Priority handling

### Bulkhead isolation

For example:

```text id="jq4fcy"
Salesforce Workers     → Pool A
ServiceNow Workers     → Pool B
Oracle Workers         → Pool C
Snowflake Workers      → Pool D
```

If ServiceNow fails, its workload shouldn't consume all resources needed by Salesforce.

---

# 12. Monitor and alert

I track downstream health using observability.

Example:

```json id="wz9s8g"
{
  "dependency": "ServiceNow",
  "mcp_server": "servicenow-mcp",
  "tool": "get_open_incidents",
  "status": "FAILED",
  "error_type": "TIMEOUT",
  "latency_ms": 10000,
  "retry_count": 2,
  "circuit_state": "OPEN",
  "workflow_id": "WF-1001",
  "trace_id": "TR-9001"
}
```

Metrics:

* Dependency error rate
* P95/P99 latency
* Timeout rate
* 429 rate
* Retry count
* Circuit-breaker state
* Queue depth
* MCP availability
* Worker failure rate
* Partial workflow rate

Alerts can trigger when failure rate or latency crosses defined thresholds.

---

# Example: ServiceNow outage in CWD

```text id="m3z9uy"
User
 ↓
Coordinator
 ↓
IT Delegator
 ↓
Incident Worker
 ↓
MCP
 ↓
ServiceNow
 X
503
 ↓
Retry + Backoff
 ↓
503
 ↓
Circuit Breaker
 ↓
Structured Failure
 ↓
Coordinator
```

Meanwhile:

```text id="r8k0y4"
Sales Delegator
 ├── Customer Worker ✓
 └── Opportunity Worker ✓

IT Delegator
 └── Incident Worker ✗
```

Coordinator:

```text id="s5z9t2"
Validate results
      ↓
Salesforce data ✓
ServiceNow data ✗
      ↓
Is ServiceNow critical?
      ↓
No
      ↓
Return partial Customer Briefing
```

If ServiceNow is critical:

```text id="7i8q2k"
ServiceNow failure
      ↓
Persist checkpoint
      ↓
Pause / Queue
      ↓
ServiceNow recovers
      ↓
Resume Incident Worker
      ↓
Aggregate
```

---

# Interview-ready answer

> **“In CWD, I handle downstream outages using timeouts, bounded retries with exponential backoff and jitter, circuit breakers, concurrency limits, queues, and graceful degradation. When an enterprise dependency such as Salesforce, ServiceNow, Oracle, or Snowflake fails, the MCP layer detects the failure and returns a structured dependency error. We retry only transient failures and avoid retrying errors such as authentication, authorization, invalid parameters, or business validation failures. If the dependency continues to fail, the circuit breaker prevents additional traffic. The Coordinator then determines whether that dependency is critical. If it is optional, we return a clearly marked partial result; if it is critical, we persist the workflow checkpoint and pause or queue the task for recovery. For write operations, we use idempotency keys to prevent duplicate transactions. Once the dependency recovers, CWD resumes from the checkpoint and reprocesses only the failed work instead of restarting the entire workflow.”**

### Easy memory

**Detect → Timeout → Retry → Circuit Breaker → Isolate → Queue → Partial/Fail → Checkpoint → Resume**

### Strong interview line

> **“An enterprise outage should degrade the affected capability, not bring down the entire CWD platform.”**
