In **CWD**, timeouts prevent one slow Worker, Delegator, external API, or LLM call from blocking the entire workflow indefinitely.

### 1. Set timeouts at multiple levels

We don't use one global timeout. We define timeouts at different layers:

```text
User Request
     ↓
Coordinator timeout
     ↓
Delegator timeout
     ↓
Worker timeout
     ↓
External API / MCP tool timeout
```

For example:

```python
TIMEOUT_CONFIG = {
    "Coordinator": 60,
    "SalesDelegator": 45,
    "CustomerProfileWorker": 10,
    "SupportHistoryWorker": 15,
    "ContractWorker": 10,
    "SalesforceTool": 8,
    "ServiceNowTool": 10
}
```

The exact values depend on the SLA and downstream system.

---

### 2. Worker calls use bounded timeouts

Suppose:

```text
SupportHistoryWorker
        ↓
ServiceNow
        ↓
No response
```

After the configured timeout:

```text
10 sec
 ↓
TIMEOUT
 ↓
Classify failure
 ↓
Retry if transient
```

We **don't allow the Worker to wait indefinitely**.

---

### 3. Timeout is treated as a failure

For example:

```python
try:
    result = await asyncio.wait_for(
        call_servicenow(customer_id),
        timeout=10
    )
except asyncio.TimeoutError:
    return {
        "status": "FAILED",
        "error_type": "TIMEOUT",
        "retryable": True
    }
```

The Delegator receives a structured failure rather than hanging.

---

### 4. Combine timeout with retries

Timeouts and retries work together.

Example:

```text
Attempt 1
   ↓
ServiceNow timeout after 10 sec
   ↓
Wait using exponential backoff
   ↓
Attempt 2
   ↓
ServiceNow timeout
   ↓
Attempt 3
   ↓
Success
```

But we have to be careful about the **overall workflow timeout**.

For example:

```text
Worker timeout = 10 sec
Max retries = 3
Backoff = 1s, 2s

Overall Worker budget ≈ 33 sec
```

So we cannot accidentally configure retries that exceed the parent Delegator/Coordinator deadline.

---

### 5. Use deadlines, not just individual timeouts

This is an important production concept.

Suppose the Coordinator has:

```text
60-second deadline
```

The Delegator has already consumed 50 seconds.

It should **not start a new 30-second Worker call**.

Instead:

```text
Coordinator deadline
       ↓
Remaining budget = 10 sec
       ↓
Worker timeout = min(configured timeout, remaining budget)
```

This prevents timeout cascading.

---

### 6. Handle parallel Workers differently

In our Customer Briefing example:

```text
SalesDelegator
 ├── CustomerProfileWorker → Salesforce
 ├── SupportHistoryWorker  → ServiceNow
 └── ContractWorker        → Contract DB
```

These independent Workers can execute in parallel.

Suppose:

```text
CustomerProfile → 3 sec → SUCCESS
Contract        → 5 sec → SUCCESS
SupportHistory  → 15 sec → TIMEOUT
```

We don't wait forever for SupportHistory.

If it's optional:

```text
2 Workers successful
1 Worker timeout
        ↓
Partial result
        ↓
Coordinator validates
        ↓
Customer briefing + warning
```

If it's mandatory:

```text
Mandatory Worker timeout
        ↓
Retry/recovery
        ↓
If exhausted → workflow incomplete
```

---

### 7. Use circuit breakers for repeated timeouts

If ServiceNow is continuously timing out:

```text
Request 1 → timeout
Request 2 → timeout
Request 3 → timeout
Request 4 → timeout
```

We shouldn't keep sending requests.

A **circuit breaker** can move to:

```text
CLOSED
   ↓
Repeated failures
   ↓
OPEN
   ↓
Stop calls temporarily
   ↓
Wait
   ↓
HALF-OPEN
   ↓
Test request
   ↓
Healthy → CLOSED
```

This protects CWD and the downstream service from cascading failures.

---

### 8. Persist state before/after important steps

Suppose:

```text
CustomerProfileWorker → SUCCESS
ContractWorker → SUCCESS
SupportHistoryWorker → TIMEOUT
```

LangGraph checkpoint/state records:

```python
{
    "customer_profile": "SUCCESS",
    "contract": "SUCCESS",
    "support_history": "FAILED",
    "error_type": "TIMEOUT",
    "retry_count": 1
}
```

If the process crashes afterward, CWD can resume from the persisted state instead of executing everything again.

---

### 9. Async workflows for long-running operations

Some operations may legitimately take longer than a synchronous API request.

Instead of:

```text
HTTP request
   ↓
Wait 5 minutes
   ↓
Response
```

we can use:

```text
API request
   ↓
Create workflow/run ID
   ↓
Queue
   ↓
Async execution
   ↓
Persist state
   ↓
Client checks status / receives notification
```

For Azure, **Service Bus** can be used for asynchronous processing.

For AWS, **SQS + Step Functions** are common choices.

---

## Timeout vs Retry vs Circuit Breaker

| Mechanism           | Purpose                               |
| ------------------- | ------------------------------------- |
| **Timeout**         | Stop waiting too long                 |
| **Retry**           | Try a transient failure again         |
| **Backoff**         | Wait before retrying                  |
| **Circuit breaker** | Stop calling an unhealthy dependency  |
| **Checkpoint**      | Remember what already completed       |
| **DLQ**             | Isolate messages that repeatedly fail |

### Interview-ready answer

> **“In CWD, we use bounded timeouts at the Coordinator, Delegator, Worker, and external tool/API levels. When a Worker exceeds its timeout, we cancel the call and return a structured timeout failure to the Delegator. If the timeout is transient, we apply limited retries with exponential backoff and jitter, while respecting the overall workflow deadline. For repeated downstream timeouts, we use circuit breakers to prevent cascading failures. LangGraph checkpoints the workflow state, so successful Workers aren't rerun. Optional Workers can produce a partial result, while mandatory Workers can cause the workflow to remain incomplete after retry exhaustion.”**

**One line to memorize:**

> **“Timeouts bound execution time, retries handle transient failures, circuit breakers protect unhealthy dependencies, and LangGraph checkpoints allow safe recovery.”**
