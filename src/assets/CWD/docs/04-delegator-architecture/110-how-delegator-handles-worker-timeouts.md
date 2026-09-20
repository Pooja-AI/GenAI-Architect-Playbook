In **CWD**, Worker timeouts are handled by defining a **timeout/deadline**, detecting when the Worker exceeds it, classifying the timeout as a **retryable failure**, and then applying the workflow's recovery policy.

### 1. Define a timeout for each Worker

Different Workers may have different expected execution times.

For example:

```python
WORKER_POLICY = {
    "CustomerProfileWorker": {
        "timeout_seconds": 10,
        "max_retries": 2
    },
    "ContractWorker": {
        "timeout_seconds": 20,
        "max_retries": 2
    },
    "SalesHistoryWorker": {
        "timeout_seconds": 30,
        "max_retries": 2
    }
}
```

The timeout should be an **explicit workflow policy**, not something the LLM decides dynamically.

---

### 2. Delegator starts the Worker

For example:

```text id="4t7l0d"
SalesDelegator
      ↓
ContractWorker
      ↓
MCP
      ↓
Salesforce
```

The Delegator starts the Worker with a deadline:

```text
ContractWorker
Timeout = 20 seconds
```

The timeout should ideally propagate downstream as well:

```text id="n6kv9e"
Delegator
   ↓ 20 sec deadline
Worker
   ↓
MCP Client
   ↓
Salesforce API
```

This prevents the downstream call from continuing indefinitely.

---

### 3. Worker exceeds the timeout

Suppose Salesforce doesn't respond:

```text id="8t9u0r"
0 sec → Worker starts
10 sec
15 sec
20 sec → TIMEOUT
```

The Delegator receives:

```python
{
    "worker_id": "ContractWorker",
    "status": "FAILED",
    "error_type": "TIMEOUT",
    "retryable": True
}
```

The important point is that a timeout becomes a **structured Worker failure**, rather than leaving the workflow hanging.

---

### 4. Delegator decides whether to retry

A timeout is normally a transient failure, so the Delegator can retry.

For example:

```text id="6g3q4f"
Attempt 1 → TIMEOUT
       ↓
Wait with exponential backoff + jitter
       ↓
Attempt 2 → TIMEOUT
       ↓
Wait
       ↓
Attempt 3 → SUCCESS
```

Example:

```text
Retry 1 → 2 sec
Retry 2 → 4 sec
Retry 3 → 8 sec
```

with jitter to avoid many Workers retrying simultaneously.

The retry count is bounded.

---

### 5. Don't retry forever

CWD should enforce:

```text id="3e1yce"
max_retries = 2
max_execution_time = 60 sec
```

So:

```text
Worker
  ↓
Timeout
  ↓
Retry
  ↓
Timeout
  ↓
Retry limit reached
  ↓
STOP
```

This prevents infinite retries and protects cost and system capacity.

---

### 6. What happens after retries fail?

Now the Delegator checks whether the Worker is **mandatory or optional**.

#### Optional Worker

```text id="x3a0yf"
SalesHistoryWorker
       ↓
Timeout
       ↓
Retries exhausted
       ↓
OPTIONAL
       ↓
Continue
       ↓
PARTIAL_SUCCESS
```

Other successful Worker results are preserved.

#### Mandatory Worker

```text id="c7q4gs"
ContractWorker
       ↓
Timeout
       ↓
Retries exhausted
       ↓
MANDATORY
       ↓
INCOMPLETE / RECOVERY REQUIRED
```

The workflow should not pretend the business request completed successfully.

---

### 7. Parallel Workers behave independently

Suppose:

```text id="x6gr1f"
CustomerProfileWorker → SUCCESS
ContractWorker        → TIMEOUT
SalesHistoryWorker    → SUCCESS
```

The timeout of ContractWorker should not automatically cancel the other independent Workers.

The state becomes:

```text
CustomerProfileWorker → SUCCESS
ContractWorker        → TIMEOUT
SalesHistoryWorker    → SUCCESS
```

Then the Aggregator applies the partial-success policy.

This is especially important in **fan-out/fan-in** workflows.

---

### 8. Dependent Workers are handled differently

Suppose:

```text id="ax7m0d"
CustomerProfileWorker
        ↓
ContractWorker
```

If CustomerProfileWorker times out:

```text
CustomerProfileWorker → TIMEOUT
        ↓
ContractWorker → BLOCKED
```

ContractWorker should not execute because its prerequisite wasn't successfully completed.

But an independent Worker can continue:

```text
CustomerProfileWorker → TIMEOUT
ContractWorker        → BLOCKED
SalesHistoryWorker    → EXECUTE
```

---

### 9. Circuit breaker protects the downstream system

If Salesforce is continuously timing out:

```text id="5n0m0c"
Worker
 ↓
Salesforce
 ↓
TIMEOUT
 ↓
TIMEOUT
 ↓
TIMEOUT
```

Repeated retries could make the problem worse.

So CWD can use a **circuit breaker**:

```text id="a1yq9b"
CLOSED
  ↓ repeated failures
OPEN
  ↓
Stop sending requests temporarily
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

This protects both CWD and the downstream service.

---

### 10. Observability records the timeout

Every timeout should be traceable.

For example:

```python
{
    "request_id": "REQ-123",
    "run_id": "RUN-456",
    "delegator": "SalesDelegator",
    "worker": "ContractWorker",
    "attempt": 2,
    "timeout_seconds": 20,
    "error_type": "TIMEOUT",
    "downstream": "Salesforce",
    "latency_ms": 20145,
    "status": "FAILED"
}
```

You can monitor this through:

* **Azure Application Insights**
* **Log Analytics**
* **OpenTelemetry**
* **Langfuse**

This helps determine whether the timeout is coming from the Worker itself, MCP, network, or Salesforce.

---

### 11. LangGraph's role

LangGraph manages the workflow state and transitions:

```text id="20d5f8"
Worker execution
      ↓
Timeout
      ↓
Update State
      ↓
Retry?
   /       \
 Yes        No
 ↓           ↓
Retry      Failure Policy
              ↓
       Continue / Pause / Fail
```

Checkpointing also ensures that successful Workers don't have to be rerun unnecessarily.

---

## Technology mapping

| Component                        | Responsibility                                   |
| -------------------------------- | ------------------------------------------------ |
| **Worker**                       | Performs the actual operation                    |
| **MCP**                          | Calls downstream enterprise tool                 |
| **Delegator**                    | Detects timeout and applies retry/failure policy |
| **LangGraph**                    | Controls workflow state and retry transitions    |
| **Checkpointing**                | Preserves progress                               |
| **Circuit Breaker**              | Prevents repeated calls to unhealthy systems     |
| **Service Bus**                  | Useful for long-running/asynchronous work        |
| **App Insights / OpenTelemetry** | Tracks timeout and latency                       |
| **Worker Policy/Registry**       | Defines timeout and retry limits                 |



> **“In CWD, every Worker has a defined timeout and retry policy. The Delegator executes the Worker with a deadline, and if the Worker or its downstream MCP/API call exceeds that deadline, it returns a structured timeout failure. The Delegator retries transient timeouts using bounded exponential backoff with jitter. After retries are exhausted, it checks whether the Worker is mandatory or optional. Optional failures can result in partial success, while mandatory failures make the workflow incomplete or trigger recovery. LangGraph maintains the execution state and checkpoint, and circuit breakers protect downstream systems from repeated timeout failures.”**

**One line to remember:**

**Timeout → classify → bounded retry → mandatory/optional policy → recover, continue, or fail.**
