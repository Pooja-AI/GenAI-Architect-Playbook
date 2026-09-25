# How would you resume a workflow?

In CWD, I would use **durable workflow state** so that if a Worker or service fails, I can continue from the **last successful step** instead of starting the entire workflow again.

With **Step Functions**, the workflow execution state is persisted by the service.

### Example

Suppose:

```text
Customer Worker
      ↓
Sales Worker       ✅
      ↓
Incident Worker    ❌
      ↓
Final Briefing
```

If Incident Worker fails, I don't want to redo Customer and Sales unnecessarily.

```text
Saved execution state
        ↓
Customer Worker ✅
Sales Worker    ✅
Incident Worker ❌
        ↓
Resume / retry Incident Worker
        ↓
Final Briefing
```

## How I implement it

### 1. Persist workflow state

Keep important state such as:

```text
workflow_id
job_id
correlation_id
current_step
completed_steps
worker_results
status
```

Step Functions maintains the execution state, while application-specific state/results can be stored in DynamoDB or S3 when appropriate.

### 2. Identify the failed step

For example:

```text
Workflow: CWD-123

Customer Worker → COMPLETED
Sales Worker    → COMPLETED
Incident Worker → FAILED
```

So recovery starts from the Incident Worker rather than repeating successful work.

### 3. Retry transient failure

```text
Incident Worker
      ↓
Timeout
      ↓
Retry
      ↓
Success
      ↓
Final Briefing
```

### 4. Resume after a longer interruption

For workflows that need explicit recovery, I preserve the workflow/job ID and external state, then start/re-drive the workflow from the appropriate recovery point according to the workflow design.

**Idempotency is critical** because a previous side effect may have succeeded even if the workflow recorded a failure.

For example:

```text
ServiceNow update
      ↓
Update succeeds
      ↓
Worker crashes before acknowledging
      ↓
Workflow retries
      ↓
Idempotency check
      ↓
Don't perform duplicate update
```

---

## CWD example

```text
             Step Functions
                    ↓
             Customer Worker
                    ↓
              Sales Worker ✅
                    ↓
            Incident Worker ❌
                    ↓
              Retry/Recover
                    ↓
            Incident Worker ✅
                    ↓
            Briefing Worker
                    ↓
                   Done
```

### 🎯 Strong interview answer

> **“I use durable workflow state to support recovery. In CWD, Step Functions maintains the execution state, so when a Worker fails, I can retry or recover the failed portion rather than unnecessarily reprocessing successful steps. I also persist application state and results where needed in DynamoDB or S3, and every business operation uses an idempotency key so that resuming a workflow cannot create duplicate Salesforce or ServiceNow transactions.”**

### Easy memory trick

**Persist → Identify failed step → Retry/Resume → Idempotency → Continue**

### Key distinction

**Checkpoint/state tells us where we were.**

**Idempotency makes it safe to resume.**
