# How would you store session/task/run information?

For CWD, I would use **one DynamoDB table with different item types**, using the partition key and sort key to group related session/task/run data.

### Recommended structure

```text
PK = TENANT#<tenant_id>#SESSION#<session_id>
SK = TASK#<task_id>#RUN#<run_id>
```

But for easier querying, I would usually model them as separate items:

```text
PK = TENANT#ON#SESSION#S123
SK = METADATA

PK = TENANT#ON#SESSION#S123
SK = TASK#T456

PK = TENANT#ON#SESSION#S123
SK = TASK#T456#RUN#R789
```

### Example

```text
┌─────────────────────────────────────────────┐
│ Session                                     │
│ PK = TENANT#ON#SESSION#S123                 │
│ SK = METADATA                               │
│ user_id = U100                              │
│ created_at = ...                            │
└─────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│ Task                                        │
│ PK = TENANT#ON#SESSION#S123                 │
│ SK = TASK#T456                              │
│ intent = CustomerBriefing                   │
│ customer_id = C123                          │
│ status = RUNNING                             │
└─────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│ Run                                         │
│ PK = TENANT#ON#SESSION#S123                 │
│ SK = TASK#T456#RUN#R789                     │
│ status = RUNNING                             │
│ current_step = IncidentWorker               │
│ retry_count = 1                              │
└─────────────────────────────────────────────┘
```

## What I store at each level

### Session

Represents the user's conversation/session.

```text
session_id
user_id
tenant_id
created_at
last_activity
```

### Task

Represents a business request.

```text
task_id
session_id
intent
customer_id
created_at
status
```

Example:

```text
T456
intent = CustomerBriefing
customer_id = C123
```

### Run

Represents one execution attempt of that task.

```text
run_id
task_id
status
current_step
completed_steps
retry_count
started_at
completed_at
error
```

For example:

```text
R789
status = RUNNING
current_step = IncidentWorker
completed_steps = [CustomerWorker, SalesWorker]
```

This distinction is important:

```text
Session
   ↓
Task
   ↓
Run
   ↓
Steps / Workers
```

A **Task** is the business request.
A **Run** is a particular execution of that request.

If the run fails and is retried, I can create another run while keeping the original task.

---

## Why this design?

It gives me:

* Efficient retrieval of a session's tasks and runs
* Durable workflow state
* Resume/recovery after container failure
* Idempotency tracking
* Clear execution history
* Multi-tenant isolation
* Easy status queries

Large results should not be stored directly in DynamoDB.

```text
Large result/document → S3
Vector/search data     → OpenSearch
Temporary cache        → Redis
Workflow metadata      → DynamoDB
```

### 🎯 Strong interview answer

> **“I would model CWD state hierarchically as Session → Task → Run → Step/Worker. In DynamoDB, I would use composite keys to group related records, for example `TENANT#tenantId#SESSION#sessionId` as the partition key and `METADATA`, `TASK#taskId`, and `TASK#taskId#RUN#runId` as sort keys. The Session represents the conversation, the Task represents the business request, and the Run represents a specific execution. I would store status, current step, Worker status, retries, timestamps, and idempotency metadata. Large results would go to S3 rather than DynamoDB.”**

### Easy memory trick

**Session = Conversation**
**Task = Business Request**
**Run = Execution**
**Step = Progress**
