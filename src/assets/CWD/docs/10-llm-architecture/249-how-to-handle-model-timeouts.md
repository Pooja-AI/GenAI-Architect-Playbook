## How do you handle model timeouts?

In CWD, I treat an LLM timeout as a **transient dependency failure**. I use **timeouts + bounded retries + backoff + fallback + checkpointing** so one slow model call doesn't hang the entire workflow.

### CWD flow

```text id="q4n8vz"
Worker / Coordinator
        ↓
Azure OpenAI
        ↓
   Response within timeout?
      ↙            ↘
    YES             NO
     ↓               ↓
 Continue       Bounded Retry
                       ↓
                Exponential Backoff
                       ↓
                Still timing out?
                  ↙          ↘
                NO            YES
                ↓              ↓
             Continue       Fallback
                                ↓
                         Resume Workflow
```

### 1. Set a timeout

I don't allow the Worker to wait indefinitely.

For example:

```python id="8m2r6x"
response = llm.invoke(
    request,
    timeout=30
)
```

The exact timeout depends on the operation and SLA.

---

### 2. Retry only transient failures

A timeout can be temporary, so I use a **small bounded number of retries**.

```text id="3z8v1k"
Attempt 1 → Timeout
     ↓
Wait + jitter
     ↓
Attempt 2 → Timeout
     ↓
Wait + jitter
     ↓
Attempt 3
```

I don't retry indefinitely.

---

### 3. Exponential backoff + jitter

Instead of immediately sending another request:

```text id="q7n5px"
Retry 1 → short wait
Retry 2 → longer wait
Retry 3 → longer wait
```

Jitter prevents many Workers from retrying simultaneously and creating a traffic spike.

---

### 4. Use fallback

If the primary model continues timing out:

```text id="m6k2rb"
Primary Model
     ↓
Timeout
     ↓
Retry
     ↓
Still timeout
     ↓
Fallback Model / Deployment
```

The fallback must be tested for the required:

* Context size
* Structured output
* Tool calling
* Quality

---

### 5. Don't retry the entire CWD workflow

This is very important.

Suppose:

```text id="w5c3pa"
Worker 1 → ✓
Worker 2 → ✓
Worker 3 → LLM timeout
```

I don't restart Workers 1 and 2.

With LangGraph checkpointing:

```text id="d9r7kx"
W1 ✓
W2 ✓
W3 ✗
 ↓
Checkpoint
 ↓
Retry / recover W3
 ↓
W3 ✓
 ↓
Aggregate
```

This avoids duplicated work and unnecessary cost.

---

### 6. Use circuit breaker for repeated failures

If the model continuously times out:

```text id="p6x4ws"
Closed
   ↓ repeated timeouts
Open
   ↓
Stop sending requests
   ↓
Fallback / controlled degradation
   ↓
Half-open test
   ↓
Recovery → Closed
```

This prevents the system from continuously hammering an unhealthy dependency.

---

### 7. Monitor timeout behavior

I track:

* Timeout rate
* P95/P99 model latency
* Retry count
* Fallback rate
* Model/deployment
* Token count
* Request duration
* Error type
* Correlation ID

This helps determine whether the problem is model latency, excessive prompt size, throttling, or downstream infrastructure.

---

### 🎯 Strong interview answer

> **“I handle model timeouts using a bounded timeout policy. If the LLM exceeds the timeout, we retry transient failures with exponential backoff and jitter. If the primary model continues to timeout, we route to a prevalidated fallback deployment or model. We use LangGraph checkpointing so we retry only the failed Worker or step rather than restarting the entire CWD workflow. For repeated failures, we use a circuit breaker and graceful degradation. We monitor timeout rate, P95/P99 latency, retries, fallback rate, and cost.”**

### Easy memory trick

**Timeout → Retry → Backoff → Fallback → Checkpoint → Resume → Monitor**

Key interview line:

> **“A model timeout should fail the current step, not cause the entire agent workflow to restart.”**
