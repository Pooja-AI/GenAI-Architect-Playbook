In **CWD**, we handle asynchronous agent communication when a task may take longer than a normal synchronous API call—for example, a Delegator may need multiple Workers to query Salesforce, ServiceNow, and SharePoint.

### CWD asynchronous flow

```text
User
  ↓
Coordinator
  ↓ A2A
Sales Delegator
  ↓
Queue / async task
  ↓
Workers
  ├── Customer Worker → Salesforce
  ├── Opportunity Worker → Salesforce
  └── Incident Worker → ServiceNow
          ↓
     Results / events
          ↓
Sales Delegator
  ↓ A2A
Coordinator
  ↓
Final response
```

### 1. Coordinator creates a task

Instead of waiting for the Delegator to finish:

```json
{
  "task_id": "T1001",
  "correlation_id": "C789",
  "intent": "customer_briefing",
  "customer_id": "C12345",
  "mode": "async"
}
```

The Coordinator can receive an acknowledgement such as:

```json
{
  "task_id": "T1001",
  "status": "accepted"
}
```

---

### 2. Use a queue for asynchronous execution

In our Azure implementation, we can use **Azure Service Bus**.

```text
Coordinator
    ↓
A2A
    ↓
Sales Delegator
    ↓
Service Bus
    ↓
Workers
```

The queue decouples the sender from the receiver.

If the Worker is temporarily unavailable, the message can remain in the queue instead of losing the task.

---

### 3. Workers process independently

For example:

```text
Customer Briefing T1001
       |
       +-- Customer Worker
       |      ↓
       |   Salesforce
       |
       +-- Incident Worker
       |      ↓
       |   ServiceNow
       |
       +-- Document Worker
              ↓
           SharePoint
```

These can execute **in parallel** when there are no dependencies.

---

### 4. Track task state

We maintain durable state such as:

```json
{
  "task_id": "T1001",
  "status": "working",
  "workers": {
    "customer": "completed",
    "incident": "completed",
    "document": "working"
  }
}
```

This can be stored in **Cosmos DB / DynamoDB** depending on the cloud implementation.

LangGraph can also maintain the workflow state and checkpoint progress.

---

### 5. Results are sent back asynchronously

When a Worker completes:

```text
Worker
  ↓
Result Event
  ↓
Delegator
  ↓ A2A
Coordinator
```

Example:

```json
{
  "task_id": "T1001",
  "worker_id": "incident-worker",
  "status": "completed",
  "result": {
    "open_incidents": 3
  }
}
```

The Coordinator correlates the result using `task_id` and `correlation_id`.

---

### 6. Handle failures without losing the whole workflow

Suppose:

```text
Customer Worker   → SUCCESS
Incident Worker   → SUCCESS
Document Worker   → FAILED
```

We don't necessarily restart everything.

The persisted workflow state allows us to:

```text
T1001
 ├── Customer ✓
 ├── Incident ✓
 └── Document ✗
          ↓
       Retry
          ↓
       Resume
```

If retry limits are exceeded, we can send the failed message to a **DLQ** and return a partial result or request human intervention depending on the business requirement.

---

### Synchronous vs asynchronous

| Synchronous               | Asynchronous                    |
| ------------------------- | ------------------------------- |
| Caller waits              | Caller doesn't wait             |
| Good for quick operations | Good for long-running tasks     |
| Direct request/response   | Queue/event-based               |
| Timeout is important      | Durable task state is important |
| Simple                    | More resilient/scalable         |

### Interview-ready answer

> **“In CWD, we use asynchronous communication for long-running or independent agent tasks. The Coordinator creates an A2A task with a task ID and correlation ID and sends it to the appropriate Delegator. The Delegator can place work on a durable queue such as Azure Service Bus, and Workers process the tasks independently, often in parallel. We persist task and worker state so we can track progress and resume from the last successful step. Workers return results asynchronously, and the Delegator sends the aggregated result back to the Coordinator through A2A. For failures, we use retries, timeouts, DLQ, and checkpoint-based resume rather than restarting the entire workflow.”**

**Easy interview line:**

> **“A2A handles the agent-to-agent task communication; Service Bus provides durable asynchronous delivery; LangGraph manages workflow state and resume.”**
