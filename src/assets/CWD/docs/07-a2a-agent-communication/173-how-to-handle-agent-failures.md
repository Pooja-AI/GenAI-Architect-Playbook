In **CWD**, we handle agent failures using **timeout, retry, checkpointing, circuit breaker, fallback, DLQ, and observability**. The key idea is: **one agent failure should not unnecessarily restart the entire workflow.**

### CWD failure flow

```text
Coordinator
    ↓ A2A
Sales Delegator
    ↓
Workers
 ├── Customer Worker  ✓
 ├── Opportunity Worker ✓
 └── Incident Worker   ✗
          ↓
       Retry
          ↓
      Still failed?
          ↓
        DLQ / Fallback
          ↓
Coordinator
```

### 1. Detect the failure

We detect failures through:

* Request timeout
* HTTP/API errors
* MCP tool failure
* Invalid response
* Agent unavailable
* LLM failure
* Queue/message failure

For example:

```text
Incident Worker
      ↓
ServiceNow MCP call
      ↓
Timeout after 5 seconds
```

---

### 2. Retry transient failures

For temporary failures, we use **exponential backoff**:

```text
Attempt 1 → immediately
Attempt 2 → 1 sec
Attempt 3 → 2 sec
Attempt 4 → 4 sec
```

But we don't retry everything.

```text
Timeout / 503      → retry
Rate limit         → retry with backoff
Invalid parameters → don't retry
Unauthorized       → don't retry
```

---

### 3. Use timeout and circuit breaker

If an agent continuously fails:

```text
Sales Delegator
      ↓
Incident Worker
      ↓
ServiceNow
      ↓
Repeated failures
      ↓
Circuit OPEN
```

The circuit breaker temporarily stops sending more requests to the unhealthy dependency.

This prevents **cascading failures**.

---

### 4. Persist workflow state

This is very important in CWD.

Suppose:

```text
Customer Worker    ✓
Incident Worker    ✓
Document Worker    ✗
```

We persist:

```json
{
  "task_id": "T1001",
  "workers": {
    "customer": "completed",
    "incident": "completed",
    "document": "failed"
  }
}
```

After fixing the Document Worker, we resume from that failed step instead of executing Customer and Incident Workers again.

This is where **LangGraph checkpointing + durable storage** is useful.

---

### 5. Use DLQ for persistent failures

If retries are exhausted:

```text
Worker
  ↓
Retry 1
  ↓
Retry 2
  ↓
Retry 3
  ↓
Failed
  ↓
Service Bus DLQ
```

The DLQ allows us to investigate and replay the failed task later.

---

### 6. Return partial results when appropriate

Suppose the customer briefing requires three Workers:

```text
Customer Worker   ✓
Sales Worker      ✓
Incident Worker   ✗
```

If the business allows partial results, Coordinator can return:

```text
Customer information: available
Sales information: available
Incident information: temporarily unavailable
```

We **don't fabricate the missing incident information**.

---

### 7. A2A task status

The Delegator communicates the task state back to the Coordinator:

```json
{
  "task_id": "T1001",
  "status": "failed",
  "agent_id": "incident-worker",
  "error": {
    "type": "TIMEOUT",
    "retryable": true
  }
}
```

The Coordinator can then decide whether to:

```text
retry → fallback → partial result → human intervention
```

---

### Interview-ready answer

> **“In CWD, I handle agent failures using multiple layers. First, I detect failures through timeout, errors, invalid responses, or dependency failures. For transient failures, I use limited retries with exponential backoff. I use circuit breakers to prevent repeated calls to an unhealthy agent or service. The workflow state is checkpointed, so if one Worker fails while others succeed, we don't restart the entire workflow—we retry or resume only the failed step. After retry limits are exceeded, we move the task to a DLQ for investigation or replay. Depending on the business requirement, the Coordinator can return a clearly marked partial result or escalate to human intervention. All failures are tracked using task ID, correlation ID, agent ID, and error details for observability.”**

### Easy way to remember

**Detect → Timeout → Retry → Circuit Breaker → Checkpoint → DLQ → Resume/Fallback**

And the key CWD principle:

> **“Failure of one Worker should not automatically mean failure of the entire workflow.”**
