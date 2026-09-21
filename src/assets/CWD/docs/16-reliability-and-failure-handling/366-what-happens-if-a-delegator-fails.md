## What happens if a Delegator fails?

In **CWD**, a Delegator is responsible for coordinating its own Workers. If a Delegator fails, I **do not restart the entire CWD workflow**. I isolate the failure to that Delegator and recover its unfinished tasks.

### Example

Suppose the Coordinator sends a Customer Briefing request:

```text
                    Coordinator
                   /            \
          A2A → Sales         A2A → IT
                Delegator       Delegator
                  ↓                ↓
             ┌────┴────┐       Incident Worker
             ↓         ↓
        Customer    Opportunity
         Worker       Worker
```

Assume:

```text
Customer Worker       ✅
Opportunity Worker    ✅
IT Delegator          ❌
Incident Worker       not completed
```

### What happens?

```text
IT Delegator fails
       ↓
Failure detected
       ↓
Persist Delegator checkpoint
       ↓
Retry / failover Delegator
       ↓
Restore its state
       ↓
Resume unfinished Workers
       ↓
Return result to Coordinator
       ↓
Coordinator validates + aggregates
```

### 1. Detect the failure

The Coordinator monitors the A2A task.

For example:

```text
task_id = TASK-IT-001
status = timeout
```

Application Insights/OpenTelemetry would show:

```text
Coordinator
   ↓ A2A
IT Delegator
   ❌ timeout
```

### 2. Retry the Delegator

For a **transient failure**, such as timeout or temporary network issue:

```text
Retry 1 → failed
Retry 2 → failed
Retry 3 → failed
```

I would use **exponential backoff** rather than immediately retrying repeatedly.

### 3. Resume from checkpoint

The Delegator's state is persisted.

For example:

```json id="j1p1cq"
{
  "task_id": "TASK-IT-001",
  "delegator": "ITDelegator",
  "completed_workers": [],
  "pending_workers": ["IncidentWorker"],
  "status": "failed"
}
```

A replacement Delegator instance can restore this state.

### 4. Don't rerun completed Workers unnecessarily

Suppose:

```text
IT Delegator
 ├── Incident Worker      ✅
 ├── Asset Worker         ❌
 └── Access Worker        ⏳
```

If the Delegator crashes after Incident Worker completes, after recovery:

```text
Incident Worker   → SKIP
Asset Worker      → RESUME
Access Worker     → EXECUTE
```

This avoids unnecessary calls and potential duplicate operations.

### 5. What if the Delegator cannot recover?

After retry limits are exhausted:

```text
Delegator
   ↓
Retries exhausted
   ↓
Mark Delegator task = FAILED
   ↓
Return structured failure to Coordinator
```

The Coordinator then decides based on the workflow policy:

```text
Critical Worker?
     ↓
   YES → workflow may fail / HITL
     ↓
    NO
     ↓
Continue with partial result
```

For example, if Sales information succeeded but IT information is unavailable:

```text
Sales Information     ✅
IT Incident Information ❌
```

The Coordinator can return a **partial result with an explicit failure**, rather than inventing the missing IT information.

### 6. Prevent duplicate operations

I use:

```text
workflow_id
task_id
worker_id
idempotency_key
```

For MCP operations, the downstream operation should also support idempotency where the operation changes data.

For example:

```text
task_id = TASK-IT-001
idempotency_key = CWD-5001-IT-001
```

If the Delegator retries, the system can recognize that the operation was already completed.

---

## Interview-ready answer

> **“If a Delegator fails, I isolate the failure to that Delegator instead of restarting the entire CWD workflow. The Coordinator detects the A2A timeout or failure, and for transient errors I retry with exponential backoff. The Delegator's state and Worker task status are persisted, so a replacement Delegator instance can restore the checkpoint and resume only the unfinished Workers. I use task IDs and idempotency keys to prevent duplicate execution. If retries are exhausted, the Delegator returns a structured failure to the Coordinator. The Coordinator then decides whether the workflow can continue with a partial result or needs to fail or go to HITL, depending on whether that Delegator's result is critical.”**

### Strong interview line

> **“Delegator failure should be isolated and recoverable; I don't restart the entire multi-agent workflow just because one domain orchestrator failed.”**

**Easy memory:**

**Detect → Retry → Checkpoint → Failover → Resume unfinished Workers → Aggregate/partial result.**
