## What happens if Azure OpenAI is unavailable?

In CWD, I treat Azure OpenAI unavailability as a **transient dependency failure**. I don't immediately fail the entire workflow.

### CWD flow

```text
Coordinator / Worker
        ↓
Azure OpenAI
        ↓
   Available?
    ↙       ↘
  YES        NO
   ↓          ↓
Continue   Timeout / Error
              ↓
       Bounded Retry
       + Exponential Backoff
              ↓
       Still unavailable?
              ↓
       Model Fallback
              ↓
      Continue Workflow
```

### 1. Detect the failure

We monitor:

* Timeout
* HTTP 429 — throttling
* HTTP 5xx — service/server errors
* Connection failures
* Model/deployment availability

We use timeouts so a Worker doesn't wait indefinitely.

---

### 2. Retry transient failures

For temporary failures:

```text
Attempt 1 → fail
    ↓
wait + jitter
    ↓
Attempt 2 → fail
    ↓
wait + jitter
    ↓
Attempt 3
```

I use **bounded retries**, not unlimited retries.

For example, I would not retry an authentication or invalid-request error repeatedly.

---

### 3. Use model fallback

If the primary Azure OpenAI deployment remains unavailable:

```text
Primary Azure OpenAI
        ↓
      Failure
        ↓
Fallback model/deployment
        ↓
Continue
```

The fallback must be validated for:

* Required context size
* Structured output
* Tool calling
* CWD prompt compatibility
* Required quality

---

### 4. Preserve workflow state

This is very important for CWD.

Suppose:

```text
Worker 1 → Success
Worker 2 → Success
Worker 3 → Waiting for LLM → Azure OpenAI unavailable
```

I don't restart the entire workflow.

LangGraph checkpointing persists the workflow state:

```text
W1 ✓
W2 ✓
W3 ✗
   ↓
Checkpoint
   ↓
Azure OpenAI recovers
   ↓
Resume W3
   ↓
Aggregate results
```

This avoids repeating successful work.

---

### 5. Circuit breaker

If Azure OpenAI continues failing:

```text
Closed
  ↓ repeated failures
Open
  ↓
Stop sending requests temporarily
  ↓
Half-open
  ↓
Test request
  ↓
Success → Closed
```

This prevents sending thousands of requests to an unhealthy dependency.

---

### 6. Graceful degradation

If the request can still provide useful information without LLM reasoning, CWD can return a **partial result**.

For example:

```text
Sales Worker       ✓
ServiceNow Worker  ✓
Azure OpenAI       ✗
```

We can preserve the retrieved factual data and indicate that final synthesis is temporarily unavailable, depending on the business requirement.

For critical workflows, we can also queue the task for later processing.

---

### 7. Monitor the outage

I would monitor:

* Azure OpenAI availability
* Error/timeout rate
* 429 rate
* P95/P99 latency
* Retry count
* Fallback rate
* Circuit-breaker state
* Requests by model/deployment
* Token usage and cost

With correlation IDs, we can trace:

```text
User
 → Coordinator
 → Worker
 → Azure OpenAI
 → Failure
 → Retry
 → Fallback
```

---

### 🎯 Strong interview answer

> **“If Azure OpenAI becomes unavailable, we treat it as a transient dependency failure. We detect timeouts, throttling, and service errors, apply bounded retries with exponential backoff and jitter, and then use a prevalidated fallback model or deployment if necessary. We use a circuit breaker to prevent continuous calls to an unhealthy service. Because CWD uses LangGraph checkpointing, successful Worker results and workflow state are persisted, so we can resume from the failed step rather than restarting the entire workflow. We also monitor availability, retries, fallback rate, latency, and errors.”**

### Easy memory trick

**Detect → Retry → Fallback → Checkpoint → Resume → Monitor**

Key interview line:

> **“Azure OpenAI failure should fail the affected step, not automatically fail the entire CWD workflow.”**
