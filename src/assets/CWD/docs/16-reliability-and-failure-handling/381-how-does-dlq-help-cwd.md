## How does DLQ help CWD?

In CWD, a **Dead-Letter Queue (DLQ)** helps isolate tasks that repeatedly fail so they **don't block the rest of the workflow**.

### CWD example

Suppose the Coordinator creates a Customer Briefing:

```text
Coordinator
    ↓
Sales Delegator ──────────────┐
    ↓                         │
Customer Worker               │
    ↓                         │
MCP → Salesforce              │
                              │
IT Delegator ────────────────┐ │
    ↓                        │ │
Incident Worker              │ │
    ↓                        │ │
MCP → ServiceNow ❌           │ │
                             ↓ ↓
                        Coordinator
```

If the Incident Worker cannot reach ServiceNow:

```text
Incident Worker
      ↓
ServiceNow ❌
      ↓
Retry 1 ❌
      ↓
Retry 2 ❌
      ↓
Retry 3 ❌
      ↓
     DLQ
```

Meanwhile, the **Customer Worker result can remain successful**.

### What DLQ gives CWD

**1. Prevents infinite retries**

```text
Failure → Retry → Retry → Retry → DLQ
```

The failed task stops consuming resources.

**2. Protects the main queue**

A permanently failing message—sometimes called a **poison message**—doesn't continuously interfere with normal tasks.

**3. Preserves failed work**

The task isn't simply discarded. We retain enough metadata to investigate and recover it.

**4. Enables troubleshooting**

We can inspect:

```text
task_id
correlation_id
worker
error_type
retry_count
timestamp
dependency
```

**5. Supports replay**

After fixing ServiceNow or the Worker:

```text
DLQ
 ↓
Fix issue
 ↓
Replay task
 ↓
Incident Worker
 ↓
MCP → ServiceNow ✅
 ↓
Coordinator
 ↓
Aggregate result
```

Because CWD has **persisted workflow state/checkpoints**, we can avoid unnecessarily rerunning already successful Workers.

### Very important: DLQ is not the same as failure of the whole CWD workflow

For example:

```text
Customer Worker   → ✅ Success
Opportunity Worker → ✅ Success
Incident Worker    → ❌ → DLQ
```

The Coordinator can determine whether the Incident result is **critical or optional**.

* If optional → return a controlled partial result.
* If critical → pause/fail safely or request **HITL**.
* Never fabricate the missing ServiceNow information.

### Interview-ready answer

> **“DLQ helps CWD by isolating repeatedly failed asynchronous tasks after their retry limit is exhausted. It prevents poison messages and infinite retries from affecting the main workflow, preserves failure information for troubleshooting, and allows us to replay the failed task after the underlying issue is fixed. Because CWD persists checkpoints, we can resume the affected task without unnecessarily rerunning successful Workers.”**

### Easy memory

**DLQ = Isolate → Preserve → Investigate → Fix → Replay → Resume**

**Strong interview line:**

> **“DLQ gives CWD controlled failure handling instead of endless retries or silently losing failed work.”**
