In your **CWD architecture**, I would introduce queues at the points where work can be **decoupled, retried, buffered, or processed asynchronously**.

### 1. Between CWD and long-running Workers

If a Worker may take a long time:

```text
Coordinator
    ↓
Delegator
    ↓
Service Bus Queue
    ↓
Worker
    ↓
Result Store
```

Instead of keeping the API request open, the Delegator submits a job to the queue.

**Why?**

* Prevent request timeouts
* Handle bursts of requests
* Scale Workers independently
* Retry failed messages

---

### 2. For failed Worker retries

This is particularly useful in your CWD failure-handling design:

```text
Worker
  ↓
Failure
  ↓
Retry Queue
  ↓
Worker
```

For example:

```text
W1 → Success
W2 → Success
W3 → Failure
             ↓
         Retry Queue
             ↓
            W3
```

You can configure:

```text
Max retries = 3
Backoff = exponential
Timeout = 5 seconds
```

If W3 continues failing, move the message to a **Dead-Letter Queue (DLQ)**.

---

### 3. Dead-letter queue

```text
Main Queue
    ↓
Worker
    ↓
Failure
    ↓
Retry
    ↓
Failure
    ↓
DLQ
```

The DLQ allows operations teams to investigate problematic messages instead of losing them.

You can then support:

* Inspect
* Fix root cause
* Replay
* Reprocess

This is especially important for enterprise workflows.

---

### 4. For asynchronous events

You can publish events from CWD:

```text
CWD
 ↓
Service Bus / Event Bus
 ├── Audit Consumer
 ├── Analytics Consumer
 ├── Notification Consumer
 └── Evaluation Consumer
```

The Coordinator doesn't need to wait for these consumers.

For example:

```text
Customer Briefing completed
          ↓
     Publish Event
          ↓
   "WorkflowCompleted"
          ↓
 ┌────────┼─────────┐
 ↓        ↓         ↓
Audit   Metrics   Evaluation
```

This is a good example of **one event being consumed by multiple downstream systems**.

---

### 5. For burst protection

Suppose 1,000 users send requests simultaneously:

```text
1000 Requests
      ↓
    Queue
      ↓
 ┌────┴────┐
Worker  Worker
Worker  Worker
Worker  Worker
```

The queue acts as a **buffer**.

Instead of immediately sending 1,000 requests to Salesforce, ServiceNow, or LLM APIs, you can control the processing rate.

This helps with:

* Rate limits
* Backpressure
* Traffic spikes
* Resource protection

---

## Where I would NOT necessarily put a queue

Don't automatically put queues between every CWD layer.

For a normal interactive request:

```text
FastAPI
  ↓
Coordinator
  ↓
Delegator
  ↓
Worker
  ↓
MCP
  ↓
Salesforce
```

If the user needs the result immediately, introducing a queue at every step would add **latency and complexity**.

Instead:

```text
Synchronous path:
FastAPI → Coordinator → Delegator → Workers → Result
```

and use queues for:

```text
Asynchronous path:
             ┌→ Retry
             ├→ Audit
             ├→ Evaluation
             ├→ Long-running jobs
             └→ Notifications
```

### Interview answer

> **“I would introduce queues primarily at asynchronous boundaries rather than between every CWD component. For example, I would use Azure Service Bus for long-running Worker jobs, retry processing, burst protection, and event-driven activities such as audit and evaluation. I would also use a Dead-Letter Queue for messages that exceed the retry policy. For the interactive Customer Briefing flow, I would keep the critical Coordinator–Delegator–Worker path synchronous so we don't introduce unnecessary latency.”**

**Simple rule:**

> **Queue = decouple + buffer + retry + scale independently.**
