# How would you recover from a failed workflow using DynamoDB?

For CWD, I would use DynamoDB as the **durable checkpoint/state store** so that after a failure, I can identify what already succeeded and resume from the failed step instead of restarting everything.

### CWD flow

```text id="c4v8qp"
CWD Workflow
     ↓
DynamoDB
     │
     ├── CustomerWorker = COMPLETED
     ├── SalesWorker    = COMPLETED
     ├── IncidentWorker = FAILED
     └── current_step   = IncidentWorker
              ↓
        Worker retries
              ↓
        IncidentWorker
              ↓
          COMPLETED
              ↓
        Continue workflow
```

## 1. Save state after each important step

For example:

```text id="5w6h2a"
RUN123

CustomerWorker → COMPLETED
SalesWorker    → COMPLETED
IncidentWorker → FAILED
```

I would store:

```text id="x2q9bc"
run_id
status
current_step
completed_steps
failed_step
retry_count
error_code
updated_at
```

---

## 2. Detect the failure

Suppose the Incident Worker fails because ServiceNow times out.

```text id="m7k3fp"
IncidentWorker
     ↓
Timeout
     ↓
Retry
     ↓
Still fails
     ↓
DynamoDB = FAILED
```

The workflow state remains durable even if the ECS container is replaced.

---

## 3. Read the checkpoint

A new Worker/container can query:

```text id="7w0n6b"
run_id = RUN123
```

and discover:

```text id="0z2q5c"
CustomerWorker = COMPLETED
SalesWorker    = COMPLETED
IncidentWorker = FAILED
```

So it doesn't unnecessarily execute Customer or Sales again.

---

## 4. Retry only the failed step

```text id="8s5w1d"
DynamoDB
    ↓
failed_step = IncidentWorker
    ↓
Retry IncidentWorker
    ↓
Success
```

For transient failures, use bounded retries with exponential backoff and jitter.

---

## 5. Use idempotency

This is critical.

Suppose the Worker actually completed a Salesforce operation but crashed before updating DynamoDB.

A retry could otherwise perform the operation twice.

So:

```text id="1zq6vf"
Retry
  ↓
Idempotency key
  ↓
DynamoDB conditional check
  ↓
Already completed?
  ↓
Return existing result
```

This protects against duplicate side effects.

---

## 6. Handle permanently failed workflows

If retries are exhausted:

```text id="n2p7mx"
FAILED
  ↓
DLQ / failed-job queue
  ↓
Investigate
  ↓
Fix problem
  ↓
Controlled replay
  ↓
Resume from checkpoint
```

---

## 🎯 Strong interview answer

> **“I use DynamoDB as a durable checkpoint store for CWD. After each important Worker step, I persist the run status, completed steps, current step, retry count, and failure information. If a Worker or container fails, a new execution reads the run state from DynamoDB, identifies the last successful checkpoint and failed step, and resumes from there instead of restarting the entire workflow. I also use idempotency keys and conditional writes to prevent duplicate business operations during recovery. If retries are exhausted, I move the failed request to a DLQ and perform controlled replay after fixing the root cause.”**

### Easy memory trick

**Persist → Detect → Checkpoint → Retry → Idempotency → Resume**

### Key distinction

**DynamoDB tells CWD *where the workflow stopped*.**

**Idempotency tells CWD *whether it is safe to execute the operation again*.**
