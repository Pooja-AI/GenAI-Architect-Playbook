## How does a Delegator handle Worker failures?

The Delegator is responsible for **detecting the Worker failure, classifying it, retrying when appropriate, and deciding whether the domain workflow can continue**.

The flow is:

```text
Worker
  ↓
Failure
  ↓
Delegator
  ↓
Classify failure
  ↓
Retryable?
 ┌───────┴────────┐
YES               NO
 ↓                 ↓
Retry          Handle failure
 ↓                 ↓
Success?       Mandatory?
 ┌─┴─┐          ┌──┴──┐
YES  NO         YES   NO
 ↓    ↓          ↓     ↓
Continue  Exhausted   Stop   Continue
                     /partial
```

### 1. Worker returns a structured failure

For example:

```python
{
    "worker": "ContractWorker",
    "status": "FAILED",
    "error_type": "TIMEOUT",
    "retryable": True,
    "message": "Contract API timed out"
}
```

The Worker **reports the failure**; the Delegator decides what to do next.

---

### 2. Delegator classifies the failure

Typical **retryable** failures:

```text
Timeout
429 Too Many Requests
502
503
Temporary network failure
Connection reset
Temporary database failure
```

Typical **non-retryable** failures:

```text
Invalid customer ID
Unauthorized
Forbidden
Invalid request
Unsupported operation
Business validation failure
```

---

### 3. Retry transient failures

If the failure is retryable:

```text
ContractWorker
     ↓
Timeout
     ↓
Delegator
     ↓
Retry #1
     ↓
Timeout
     ↓
Retry #2
     ↓
Success
```

Use **exponential backoff + jitter** rather than immediately retrying.

Example:

```text
Attempt 1 → wait 1 sec
Attempt 2 → wait 2 sec
Attempt 3 → wait 4 sec
```

with jitter to prevent many requests retrying simultaneously.

---

### 4. Don't rerun successful Workers

Suppose:

```text
CustomerProfileWorker → SUCCESS
ContractWorker        → SUCCESS
SalesHistoryWorker    → FAILED
```

The Delegator should **not rerun all three**.

It persists the state:

```text
CustomerProfileWorker → SUCCESS
ContractWorker        → SUCCESS
SalesHistoryWorker    → FAILED
```

Then only retries:

```text
SalesHistoryWorker
```

This is where **LangGraph checkpointing** is useful.

---

### 5. What if retries are exhausted?

Suppose:

```text
SalesHistoryWorker
       ↓
Retry 1 → Failed
Retry 2 → Failed
Retry 3 → Failed
```

Now the Delegator checks whether the Worker is **mandatory or optional**.

#### Optional Worker

```text
Worker failed
     ↓
Partial result allowed
     ↓
Continue
     ↓
Warning added
```

Example:

```text
Customer Profile → SUCCESS
Contract          → SUCCESS
Sales History     → FAILED

Domain result → PARTIAL_SUCCESS
```

#### Mandatory Worker

```text
Worker failed
     ↓
Mandatory
     ↓
Domain workflow incomplete
```

The Delegator returns something like:

```python
{
    "status": "INCOMPLETE",
    "results": {...},
    "errors": [
        {
            "worker": "ContractWorker",
            "error": "TIMEOUT"
        }
    ]
}
```

The Coordinator then decides how that affects the **overall CWD workflow**.

---

### 6. What about Worker dependencies?

Suppose:

```text
CustomerProfileWorker
        ↓
RiskAnalysisWorker
```

If `CustomerProfileWorker` fails:

```text
CustomerProfileWorker → FAILED
        ↓
RiskAnalysisWorker → BLOCKED
```

The Delegator should not execute `RiskAnalysisWorker` because its required input is unavailable.

So the result becomes:

```text
CustomerProfileWorker → FAILED
RiskAnalysisWorker     → BLOCKED
```

This is different from saying RiskAnalysisWorker itself failed.

---

### 7. What if the Worker is failing repeatedly?

The Delegator can use a **circuit breaker** for an unhealthy downstream system.

```text
CLOSED
  ↓ repeated failures
OPEN
  ↓
Stop sending requests
  ↓
HALF-OPEN
  ↓
Test request
  ↓
Success → CLOSED
```

This prevents CWD from continuously calling an unhealthy Salesforce/ServiceNow/API dependency.

---

### 8. State and observability

Every failure should be recorded with information such as:

```text
request_id
run_id
delegator_id
worker_id
attempt_number
error_type
timestamp
latency
retry_count
tool/API
final_status
```

This allows you to trace:

```text
Request
  ↓
Delegator
  ↓
Worker
  ↓
MCP Tool
  ↓
API
  ↓
Timeout
  ↓
Retry
  ↓
Success/Failure
```

---

## Complete example

Suppose Sales Delegator has:

```text
CustomerProfileWorker → SUCCESS
ContractWorker        → TIMEOUT
SalesHistoryWorker    → SUCCESS
```

The Delegator does:

```text
1. Detect ContractWorker failure
             ↓
2. Classify TIMEOUT as retryable
             ↓
3. Retry with backoff
             ↓
4. If successful → continue
             ↓
5. If retries exhausted
             ↓
6. Check mandatory/optional policy
             ↓
7. Mandatory → INCOMPLETE
   Optional  → PARTIAL_SUCCESS
```

LangGraph checkpoints the state so the completed Workers don't need to run again.



> **"The Delegator handles Worker failures through structured error handling. First, it classifies the failure as retryable or non-retryable. For transient failures such as timeout, 429, or 503, it performs bounded retries using exponential backoff and jitter. LangGraph checkpointing allows us to retry only the failed Worker rather than rerunning successful Workers. If retries are exhausted, the Delegator checks whether the Worker is mandatory or optional. Optional failures can produce a partial result, while mandatory failures make the domain workflow incomplete. We also use timeouts, circuit breakers, idempotency, and observability for production reliability."**

**One line to remember:**

> **"Worker reports the failure; Delegator classifies, retries, and applies mandatory/optional policy; LangGraph preserves state for recovery."**
