## How do you replay failed requests?

In CWD, I replay a failed request by **taking the failed task from the DLQ, validating the failure is recoverable, and resubmitting it using its original task/workflow context**.

### CWD flow

```text
Worker
  ↓
MCP → ServiceNow ❌
  ↓
Retry 1 → ❌
Retry 2 → ❌
Retry 3 → ❌
  ↓
DLQ
  ↓
Fix underlying issue
  ↓
Replay
  ↓
Worker resumes
  ↓
MCP → ServiceNow ✅
  ↓
Coordinator
  ↓
Aggregate result
```

### Step-by-step

**1. Capture the failed request**

When the message goes to DLQ, preserve identifiers:

```text
task_id        = TASK-1001
workflow_id    = CWD-5001
correlation_id = CWD-5001
worker         = IncidentWorker
operation      = get_incidents
retry_count    = 3
error_type     = SERVICENOW_TIMEOUT
```

**2. Investigate the failure**

Before replaying, determine whether the problem is fixed.

For example:

```text
ServiceNow unavailable → fixed ✅
```

If it was an invalid request or authorization failure, **don't blindly replay it**.

**3. Read the persisted workflow state**

CWD uses the `workflow_id/thread_id` to retrieve the checkpoint:

```text
Workflow CWD-5001
 ├─ Customer Worker   → ✅ completed
 ├─ Opportunity Worker → ✅ completed
 └─ Incident Worker    → ❌ failed
```

So we know exactly where to resume.

**4. Replay only the failed task**

```text
DLQ
 ↓
Incident Worker
 ↓
MCP
 ↓
ServiceNow
```

We don't restart the entire Customer Briefing workflow unnecessarily.

**5. Use idempotency**

This is especially important for **write operations**.

For example:

```text
idempotency_key = CWD-5001-IncidentWorker-TASK-1001
```

If the original request actually succeeded but the response was lost, replaying it shouldn't create a duplicate ticket or transaction.

**6. Update the workflow state**

After successful replay:

```text
Incident Worker → SUCCESS
        ↓
Checkpoint updated
        ↓
Coordinator resumes
        ↓
Aggregate all Worker results
```

### Example

```text
Customer Worker      → ✅ Salesforce data
Opportunity Worker   → ✅ Salesforce data
Incident Worker      → ❌ ServiceNow timeout
                         ↓
                        DLQ
                         ↓
                    ServiceNow fixed
                         ↓
                  Replay Incident Worker
                         ↓
                        ✅
                         ↓
                    Coordinator
                         ↓
                 Customer Briefing
```

### Interview-ready answer

> **“For replay, I take the failed message from the DLQ, validate that the failure is recoverable, retrieve the persisted CWD workflow state using the workflow or task ID, and replay only the failed task. I use correlation IDs and idempotency keys to maintain traceability and prevent duplicate transactions. After successful execution, I update the checkpoint and let the Coordinator continue aggregation without rerunning already completed Workers.”**

### Strong interview line

> **“Replay means resume from the last durable checkpoint, not restart the entire workflow.”**

### Easy memory

**DLQ → Investigate → Fix → Retrieve checkpoint → Replay failed task → Idempotency → Resume.**
