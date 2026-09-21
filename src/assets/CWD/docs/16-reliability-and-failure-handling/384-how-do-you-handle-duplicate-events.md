## How do you handle duplicate events?

In CWD, I assume that **duplicate events can happen**, especially with asynchronous queues, retries, network timeouts, and DLQ replay.

The key is **deduplication + idempotency**.

### CWD example

Suppose the Coordinator sends an Incident Worker task:

```text id="p8f3wq"
Coordinator
    ↓
Service Bus
    ↓
Incident Worker
```

Due to a retry, the same event arrives twice:

```text id="x9t4kc"
Event A: TASK-1001
Event A: TASK-1001   ← duplicate
```

I don't want the Worker to create two ServiceNow tickets.

---

### 1. Give every event a unique Event ID

Example:

```json id="1j3p0m"
{
  "event_id": "EVT-90001",
  "task_id": "TASK-1001",
  "workflow_id": "CWD-5001",
  "worker": "IncidentWorker",
  "operation": "create_incident"
}
```

The `event_id` becomes the deduplication key.

---

### 2. Check a durable deduplication store

Before processing:

```text id="x3r8fv"
Receive EVT-90001
       ↓
Check dedup store
       ↓
Already processed?
   ↙          ↘
 YES          NO
  ↓            ↓
Ignore       Process
               ↓
        Mark processed
```

For example, Cosmos DB/DynamoDB can maintain:

```text id="1ekj6r"
event_id: EVT-90001
status: COMPLETED
processed_at: ...
result_ref: SNOW-INC-78291
```

---

### 3. Make the check atomic

This is important.

Don't do:

```text id="q1e5d7"
Check → not found
       ↓
Process
       ↓
Save
```

Two Workers could both check at the same time.

Instead, use an **atomic insert/conditional write**:

```text id="3w0h4b"
EVT-90001
    ↓
Atomic "create-if-not-exists"
    ↓
┌───────────────┐
│ First Worker  │ → allowed
│ Second Worker │ → duplicate
└───────────────┘
```

Only the Worker that successfully claims the event processes it.

---

### 4. Combine event deduplication with idempotency

This is the most important distinction:

**Event ID** prevents processing the same event multiple times.

**Idempotency key** prevents duplicate business transactions.

```text id="l0bq8r"
Duplicate Event
      ↓
Event ID check
      ↓
Already processed? → Ignore
      ↓
New event
      ↓
Idempotency key
      ↓
MCP → ServiceNow
      ↓
Create ticket once
```

For example:

```text id="h9z0i1"
event_id:
EVT-90001

idempotency_key:
CWD-5001:TASK-1001:create_incident
```

---

### 5. What if the Worker crashes?

Suppose:

```text id="h0h8q3"
Worker receives event
      ↓
ServiceNow ticket created ✅
      ↓
Worker crashes ❌
      ↓
Event delivered again
```

The second attempt sees the existing idempotency record/transaction reference and **doesn't create another ticket**.

This is why idempotency is critical with **at-least-once delivery**.

---

## CWD example with Service Bus + DLQ

```text id="a8u3bf"
Coordinator
    ↓
Service Bus
    ↓
Incident Worker
    ↓
Deduplication Check
    │
    ├── Duplicate → Ignore/Acknowledge
    │
    └── New
          ↓
       MCP Client
          ↓
       MCP Server
          ↓
       ServiceNow
          ↓
       Save result
```

If it repeatedly fails:

```text id="0f7s8g"
Worker
  ↓
Retry + Backoff + Jitter
  ↓
Retry limit reached
  ↓
DLQ
  ↓
Replay
  ↓
Same event/idempotency key
  ↓
Safe processing
```

### Interview-ready answer

> **“I handle duplicate events using durable event IDs, atomic deduplication, and idempotent business operations. When an event arrives, I atomically check whether its event ID has already been processed. If it has, I don't process it again. For business writes such as ServiceNow ticket creation, I also use an idempotency key so that retries or DLQ replays cannot create duplicate transactions. This is important because asynchronous systems commonly use at-least-once delivery.”**

### Strong interview line

> **“I don't try to guarantee that an event will never be delivered twice; I design CWD so duplicate delivery is safe.”**

### Easy memory

**Duplicate event → Event ID → Atomic dedup → Idempotency key → Process once.**
