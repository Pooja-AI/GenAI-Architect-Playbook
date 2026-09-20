## How does LangGraph support retries?

**LangGraph supports retry patterns by allowing a failed node/task to be executed again, typically using retry policies or explicit retry logic around the node.**

In your **CWD architecture**, retries are important because Workers may call MCP servers, Salesforce, ServiceNow, LLMs, or other downstream services.

### CWD example

```text id="v0b6m3"
Coordinator
     ↓
IT Delegator
     ↓
Incident Worker
     ↓
MCP
     ↓
ServiceNow
     ↓
   Timeout
     ↓
   Retry
     ↓
ServiceNow
     ↓
 Success
```

---

## 1. Retry a failed node

A LangGraph node can be configured with a retry policy.

Conceptually:

```python id="w8y3re"
from langgraph.types import RetryPolicy

graph.add_node(
    "incident_worker",
    incident_worker,
    retry_policy=RetryPolicy(
        max_attempts=3
    )
)
```

The idea is:

```text id="4m5k8h"
Attempt 1
   ↓
Failure
   ↓
Attempt 2
   ↓
Failure
   ↓
Attempt 3
   ↓
Success
```

The exact retry configuration can be adjusted for the failure type and deployment.

---

## 2. Don't retry every error

This is very important in production.

### Retryable errors

Usually transient problems:

```text id="t5y9kd"
Timeout
HTTP 429
Temporary network failure
Temporary 5xx
Service unavailable
```

### Non-retryable errors

Don't repeatedly retry:

```text id="u8n6q1"
Invalid customer_id
Invalid request
Unauthorized
Forbidden
Invalid tool parameters
Schema validation failure
Business-rule rejection
```

For example:

```python id="9i3d9c"
if error_is_transient(error):
    retry()
else:
    fail()
```

---

# 3. Exponential backoff

You don't want three requests hitting ServiceNow immediately.

Instead:

```text id="u2q5bh"
Attempt 1 → failure
      ↓
wait 1 sec

Attempt 2 → failure
      ↓
wait 2 sec

Attempt 3 → failure
      ↓
wait 4 sec

Attempt 4 → failure
      ↓
Stop / fallback
```

This reduces pressure on a struggling downstream service.

In a production implementation, you can combine LangGraph retry behavior with the retry/backoff mechanisms of your HTTP/MCP client or service layer.

---

# 4. What happens after retries are exhausted?

Suppose:

```text id="7x0x9d"
Incident Worker
      ↓
MCP → ServiceNow
      ↓
Timeout
      ↓
Retry #1 → Timeout
      ↓
Retry #2 → Timeout
      ↓
Retry #3 → Timeout
```

Don't keep retrying forever.

You can route the workflow to an error/recovery node:

```text id="7qz8kn"
Worker
  ↓
Retry
  ↓
Max Attempts?
  ↓ YES
Failure Handler
  ↓
 ┌───────────────┐
 ↓               ↓
Fallback        DLQ
```

For CWD, the failure handler could record:

```python id="nd7j4s"
{
    "worker": "incident_worker",
    "status": "failed",
    "error": "ServiceNow timeout",
    "retryable": True,
    "attempts": 3
}
```

The Coordinator can then decide whether to:

* Return partial results
* Ask for human intervention
* Use a fallback
* Mark the workflow failed

---

# 5. Retry + checkpointing

This is particularly important for your CWD workflow.

Suppose:

```text id="u7q6n8"
W1 → SUCCESS
W2 → SUCCESS
W3 → FAILURE
```

The workflow has persisted progress:

```text id="8n6xak"
Checkpoint:
W1 = completed
W2 = completed
W3 = failed
```

After recovery:

```text id="wq3f5p"
Resume
  ↓
Retry W3
  ↓
Success
  ↓
Aggregate W1 + W2 + W3
```

You don't want to execute W1 and W2 again unnecessarily.

---

# 6. Retry + idempotency

This is a **very important senior-level interview point**.

Suppose the Worker calls:

```text
MCP → ServiceNow → Create Ticket
```

The request succeeds, but the response is lost because of a network timeout.

The Worker doesn't know whether the ticket was created.

If you blindly retry:

```text
Create Ticket
Create Ticket
```

you could create **duplicate tickets**.

So for state-changing operations, use an **idempotency key** or business transaction ID.

Example:

```python id="9v1f7a"
request = {
    "customer_id": "C12345",
    "description": "Production incident",
    "idempotency_key": "CWD-T1001-W3"
}
```

If the same request is retried, the downstream system can recognize it as the same transaction.

### Interview point

> **Retries without idempotency can create duplicate side effects.**

---

# 7. Retry vs circuit breaker

They solve different problems.

### Retry

Handles an **individual transient failure**:

```text
Request
 ↓
Failure
 ↓
Retry
```

### Circuit breaker

Protects the system when a dependency is **continuously failing**:

```text
ServiceNow
   ↓
Repeated failures
   ↓
Circuit OPEN
   ↓
Stop sending requests temporarily
```

Then later:

```text
Circuit HALF-OPEN
       ↓
Test request
       ↓
Success
       ↓
Circuit CLOSED
```

In CWD:

```text
LangGraph
   ↓
Worker
   ↓
MCP
   ↓
Circuit Breaker
   ↓
ServiceNow
```

---

## Interview-ready answer

> **“LangGraph supports retry patterns through retry policies and node-level retry handling. In CWD, if an Incident Worker calls ServiceNow through MCP and receives a transient timeout or 5xx error, we can retry with a bounded number of attempts and exponential backoff. We don't retry non-transient errors such as authorization or invalid parameters. If retries are exhausted, we route to a failure or fallback path, potentially using a DLQ for asynchronous workflows. We combine retries with checkpointing so successful work isn't unnecessarily repeated, and we use idempotency keys for state-changing operations to prevent duplicate transactions.”**

### Easy memory

**Retry = transient failure**
**Backoff = wait between retries**
**Max attempts = don't retry forever**
**Checkpoint = don't redo successful work**
**Idempotency = don't create duplicates**
**Circuit breaker = protect against repeated downstream failure**
