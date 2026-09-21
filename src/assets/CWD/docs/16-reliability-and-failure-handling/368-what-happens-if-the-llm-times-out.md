## What happens if the LLM times out?

In **CWD**, an LLM timeout is treated as a **transient dependency failure**. I don't let the Worker hang indefinitely, and I don't immediately fail the entire workflow.

### CWD flow

```text id="p0y8hs"
Worker
  ↓
Azure OpenAI
  ↓
LLM timeout ❌
  ↓
Timeout handler
  ↓
Retry with exponential backoff
  ↓
 ┌───────────────┐
 │               │
Success        Still fails
 │               │
 ↓               ↓
Continue      Fallback / Fail
workflow      Worker
```

### 1. Set a timeout

I configure a maximum timeout for the LLM call.

For example:

```python
result = await asyncio.wait_for(
    llm.ainvoke(messages),
    timeout=30
)
```

If the model doesn't respond within 30 seconds, I treat it as a timeout.

### 2. Retry only when appropriate

For a transient timeout:

```text id="t9j3zv"
Attempt 1 → timeout
Attempt 2 → timeout
Attempt 3 → success
```

I use **exponential backoff with jitter**:

```text
1 sec → 2 sec → 4 sec + jitter
```

I also enforce a maximum retry count.

I would **not** retry indefinitely.

### 3. Checkpoint the workflow

Before/around the LLM operation, the Worker state is persisted:

```text id="k5zq8p"
workflow_id
task_id
worker_id
input/reference IDs
current_step
retry_count
```

So if the Worker or Coordinator subsequently fails, the workflow can resume from the appropriate checkpoint.

### 4. What if retries still fail?

Then the Worker returns a structured failure:

```json id="j5x8e1"
{
  "status": "failed",
  "error_type": "LLM_TIMEOUT",
  "retryable": true,
  "retry_count": 3
}
```

The **Delegator** receives the Worker failure, and the **Coordinator** decides whether that Worker is critical.

```text id="7s0f2n"
LLM timeout
    ↓
Retry
    ↓
Still failing
    ↓
Worker = FAILED
    ↓
Delegator
    ↓
Coordinator
    ↓
 ┌──────────────┴──────────────┐
 ↓                             ↓
Optional Worker            Critical Worker
 ↓                             ↓
Partial result              Fail / HITL
```

### 5. Don't blindly retry non-idempotent operations

For a pure LLM generation call, retrying is generally safer than retrying a business transaction.

For example:

```text id="g1w5py"
LLM generation → retry is usually okay

Create Salesforce record → retry requires idempotency
```

If an LLM call triggers a tool/action, I make sure the **tool execution itself has idempotency protection**.

### 6. Monitor the timeout

I would capture:

```text id="y5v6k3"
trace_id
correlation_id
worker_id
model
model_version
latency
timeout
retry_count
status
```

Application Insights can alert on increased timeout rates, while Langfuse can help analyze the LLM-specific behavior.

---

## Interview-ready answer

> **“If the LLM times out in CWD, I treat it as a transient dependency failure. I configure a strict timeout so the Worker doesn't hang indefinitely. For transient timeouts, I retry a limited number of times using exponential backoff and jitter. The workflow state is checkpointed so recovery doesn't lose previous work. If the retries still fail, the Worker returns a structured LLM timeout error to the Delegator, which passes it to the Coordinator. The Coordinator decides whether the Worker is critical or optional—if optional, we can return a partial result; if critical, we fail or route to HITL. I also monitor LLM timeout rate, latency and retries through Application Insights and Langfuse.”**

### Strong interview line

> **“Timeout is not the same as workflow failure. I isolate the LLM failure, retry transiently, preserve state, and let the Coordinator decide the business-level outcome.”**

**Easy memory:**
**Timeout → Retry → Checkpoint → Retry exhausted → Structured failure → Coordinator decides.**
