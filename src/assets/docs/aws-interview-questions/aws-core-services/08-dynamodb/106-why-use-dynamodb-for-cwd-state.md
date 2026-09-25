# Why use DynamoDB for CWD state?

For CWD, I use **DynamoDB to store durable application/workflow state outside the containers**.

```text
User Request
     ↓
Coordinator
     ↓
Delegator
     ↓
Workers
     ↓
DynamoDB
 ┌─────────────────────────┐
 │ session_id              │
 │ task_id                 │
 │ run_id                  │
 │ current_step            │
 │ worker_status           │
 │ results / metadata      │
 │ idempotency_key         │
 └─────────────────────────┘
```

### What state would I store?

For example:

```text
run_id: RUN123
status: RUNNING
current_step: IncidentWorker
CustomerWorker: COMPLETED
SalesWorker: COMPLETED
IncidentWorker: FAILED
retry_count: 2
```

This allows the workflow to **resume instead of starting from scratch**.

### Why DynamoDB?

1. **Low latency** – fast reads/writes for workflow state.
2. **Highly scalable** – handles large numbers of concurrent requests.
3. **Highly available** – managed AWS service.
4. **Durable** – state survives ECS/Fargate container replacement.
5. **Flexible schema** – useful for session/task/run/step metadata.
6. **Conditional writes** – useful for **idempotency and duplicate prevention**.
7. **TTL** – automatically expire temporary state when appropriate.
8. **Serverless** – no database servers to manage.

### Important CWD example

Suppose:

```text
Customer Worker  → SUCCESS
Sales Worker     → SUCCESS
Incident Worker  → FAILED
```

DynamoDB stores this state.

If the Incident Worker is retried or the container crashes:

```text
DynamoDB
    ↓
Read RUN123
    ↓
Customer = SUCCESS
Sales = SUCCESS
Incident = FAILED
    ↓
Retry Incident only
    ↓
Continue workflow
```

So we don't unnecessarily repeat successful work.

### Why not store state inside ECS?

Containers are **ephemeral**.

```text
ECS Container
    ↓
Crash / replacement
    ↓
Local memory/state lost ❌
```

With DynamoDB:

```text
ECS Container
    ↓
Crash
    ↓
New Container
    ↓
Read DynamoDB
    ↓
Resume state ✅
```

### 🎯 Strong interview answer

> **“I use DynamoDB for CWD application and workflow state because it provides low-latency, highly scalable and durable state storage. I store session, task, run, step, Worker status, retry information and idempotency keys. Since ECS containers are stateless and can be replaced at any time, keeping state in DynamoDB allows another container or Worker to resume processing without losing progress. I also use DynamoDB conditional writes for idempotency and TTL for temporary state.”**

### Easy memory trick

**DynamoDB = Durable + Fast + Scalable + State**

### Key distinction

* **DynamoDB** → durable application/workflow state
* **Redis** → fast temporary cache/session data
* **S3** → large objects/documents
* **OpenSearch** → search/vector/RAG data
* **Step Functions** → durable workflow orchestration state
