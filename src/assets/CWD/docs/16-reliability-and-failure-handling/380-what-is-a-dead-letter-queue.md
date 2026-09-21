## What is a Dead-Letter Queue (DLQ)?

A **Dead-Letter Queue** is a separate queue where messages are moved when they **cannot be successfully processed after the allowed retries**.

Think of it as a **holding area for failed messages** so they don't block or repeatedly fail in the main queue.

### In CWD

Suppose the Coordinator sends a task to an Incident Worker:

```text id="5w8m3q"
Coordinator
    ↓
Service Bus Queue
    ↓
Incident Worker
    ↓
MCP
    ↓
ServiceNow ❌
```

The Worker retries:

```text id="q1x7nz"
Attempt 1 → ❌
Attempt 2 → ❌
Attempt 3 → ❌
Retry limit reached
       ↓
    DLQ
```

The failed message is moved to the **Dead-Letter Queue**.

### Why use DLQ?

Without a DLQ:

```text id="h4r9yp"
Failed message
     ↓
Retry
     ↓
Retry
     ↓
Retry
     ↓
Retry forever ❌
```

This can create an infinite retry loop.

With a DLQ:

```text id="2d7v1c"
Main Queue
    ↓
Worker
    ↓
Failure
    ↓
Retry 1
    ↓
Retry 2
    ↓
Retry 3
    ↓
DLQ
```

The main queue remains available for other messages.

### What would you store in the DLQ message?

For CWD, I would include metadata such as:

```text id="k3m8vz"
{
  task_id: "TASK-1001",
  correlation_id: "CWD-5001",
  worker: "IncidentWorker",
  operation: "get_incidents",
  retry_count: 3,
  error_type: "SERVICENOW_TIMEOUT",
  timestamp: "...",
  payload_reference: "...",
  workflow_state_reference: "..."
}
```

I would avoid putting secrets or unnecessary sensitive enterprise data directly into the DLQ.

### What happens after it reaches DLQ?

An operations/recovery process can:

1. Inspect the failure.
2. Identify the root cause.
3. Fix the dependency or application issue.
4. **Replay** the message.
5. Resume the workflow from the persisted checkpoint.

For example:

```text id="a9k2fd"
DLQ
 ↓
Fix ServiceNow issue
 ↓
Replay message
 ↓
Incident Worker
 ↓
MCP → ServiceNow ✅
 ↓
Continue CWD workflow
```

### Important distinction

**Retry** handles temporary failures.

**DLQ** handles messages that remain unsuccessful after the retry policy is exhausted.

```text id="e3n7qs"
Transient failure
      ↓
Retry + Backoff + Jitter
      ↓
Still failing
      ↓
DLQ
      ↓
Investigate / Fix / Replay
```

### Interview-ready answer

> **“A dead-letter queue is a holding queue for messages that could not be processed successfully after the configured retry attempts. In CWD, I can use Azure Service Bus DLQ for failed asynchronous Worker tasks. For example, if an Incident Worker cannot reach ServiceNow after three retries, the task is moved to the DLQ with its task ID, correlation ID, retry count, and error information. After the issue is fixed, the message can be replayed and the workflow can resume from its persisted checkpoint.”**

### Easy memory

**Retry → Retry limit reached → DLQ → Fix → Replay → Resume.**

**Strong interview line:**

> **“DLQ prevents poison messages from repeatedly blocking the main processing pipeline.”**
