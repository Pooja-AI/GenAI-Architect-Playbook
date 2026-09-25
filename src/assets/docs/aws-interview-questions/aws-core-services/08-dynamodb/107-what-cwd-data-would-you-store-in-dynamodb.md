# What CWD data would you store in DynamoDB?

In CWD, I would store **operational metadata and workflow state**, not large documents or vector embeddings.

### 1. Session state

```text
session_id
user_id
tenant_id
created_at
last_activity
```

Example:

```text
S123 → User conversation/session information
```

### 2. Task / Run state

```text
task_id
run_id
status
intent
customer_id
created_at
completed_at
```

Example:

```text
RUN123
status = RUNNING
intent = CustomerBriefing
customer_id = C123
```

### 3. Worker execution state

This is very important for CWD:

```text
worker_id
worker_name
status
start_time
end_time
retry_count
error_code
```

Example:

```text
CustomerWorker → COMPLETED
SalesWorker    → COMPLETED
IncidentWorker → FAILED
```

### 4. Workflow/checkpoint information

```text
current_step
completed_steps
failed_step
next_step
```

This allows us to resume instead of restarting the entire workflow.

```text
CustomerWorker ✅
SalesWorker    ✅
IncidentWorker ❌
       ↓
Retry IncidentWorker
```

### 5. Idempotency information

To prevent duplicate processing:

```text
idempotency_key
status
result_reference
created_at
expires_at
```

Example:

```text
IDEMP-123 → COMPLETED
```

If the same request arrives again, CWD can detect it and avoid executing the business operation twice.

### 6. Agent/Worker metadata

If needed, DynamoDB can store lightweight registry information:

```text
agent_id
agent_type
domain
capabilities
endpoint
version
status
```

For example:

```text
SalesDelegator
   ↓
CustomerWorker
   ↓
capabilities = customer_lookup
version = v2
status = ACTIVE
```

### 7. Result references

I would **not store large results directly**.

Instead:

```text
DynamoDB
   ↓
result_s3_key = s3://cwd-results/RUN123.json
```

Large documents/results → **S3**
Metadata/reference → **DynamoDB**

---

## What I would NOT store in DynamoDB

| Data                                | Store in            |
| ----------------------------------- | ------------------- |
| Session/task/run metadata           | **DynamoDB**        |
| Worker status                       | **DynamoDB**        |
| Idempotency keys                    | **DynamoDB**        |
| Workflow checkpoints                | **DynamoDB**        |
| Large PDFs/documents                | **S3**              |
| Large generated reports             | **S3**              |
| Vector embeddings                   | **OpenSearch**      |
| RAG documents/index                 | **OpenSearch/S3**   |
| Frequently accessed temporary cache | **Redis**           |
| Secrets                             | **Secrets Manager** |

### 🎯 Strong interview answer

> **“In CWD, I use DynamoDB mainly for operational state: session, task and run metadata, Worker execution status, checkpoints, retry information, idempotency keys, and lightweight agent or Worker metadata. I don't use it for large documents or vector data. Large artifacts go to S3, vector/search data goes to OpenSearch, and temporary high-speed cache goes to Redis. The key reason is that DynamoDB allows CWD to remain stateless at the container level while preserving durable workflow state.”**

### Easy memory trick

**Session → Run → Worker → Checkpoint → Idempotency**

### Key distinction

**DynamoDB stores “what is happening with the workflow.”**
**S3/OpenSearch store the actual large knowledge/data used by the workflow.**
