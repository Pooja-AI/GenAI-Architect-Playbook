## What happens if the Coordinator fails?

In **CWD**, the Coordinator is the main orchestration component, so I design it to be **stateless at runtime and recoverable through persisted state/checkpoints**.

### Failure flow

```text
User Request
     ↓
Coordinator
     ↓
Checkpoint / State Store
     ↓
A2A → Delegators
     ↓
Workers
```

If the Coordinator crashes:

```text
Coordinator
    ❌ Crash
      ↓
Workflow state already persisted
      ↓
New Coordinator instance
      ↓
Load checkpoint
      ↓
Resume from last successful step
      ↓
Continue Delegator/Worker execution
```

### Example

Suppose Customer Briefing is running:

```text
Coordinator
   ↓
Sales Delegator
   ├── Customer Worker ✅
   └── Opportunity Worker ✅
   ↓
IT Delegator
   └── Incident Worker 🔄
```

The Coordinator crashes before aggregation.

Because I persisted:

```text
thread_id
workflow_state
completed_workers
pending_workers
results
task_ids
correlation_id
```

the replacement Coordinator can load the checkpoint:

```text
Customer Worker      ✅
Opportunity Worker   ✅
Incident Worker      pending/running
```

It **doesn't blindly restart everything**.

It resumes the workflow and continues with the unfinished work, depending on the persisted task state.

### How do I prevent duplicate execution?

I use **idempotency and task IDs**.

For example:

```text
workflow_id = CWD-5001
task_id     = TASK-003
```

Before executing a task, the system checks whether that task has already completed.

For external operations, I also use an **idempotency key** so a retry doesn't accidentally create duplicate transactions.

### How do I avoid Coordinator being a single point of failure?

I deploy multiple Coordinator instances:

```text
                 Load Balancer
                      ↓
             ┌────────┴────────┐
             ↓                 ↓
       Coordinator-1     Coordinator-2
             ↓                 ↓
             └───────┬─────────┘
                     ↓
              Shared State Store
              Cosmos DB / Redis
```

If Coordinator-1 fails, traffic can go to Coordinator-2.

The workflow state is **not stored only in Coordinator memory**.

### Interview-ready answer

> **“If the Coordinator fails, I don't want the entire CWD workflow to start from scratch. I persist workflow state and checkpoints using durable storage, such as Cosmos DB or Redis depending on the state requirements. I deploy multiple Coordinator instances behind a load balancer so another instance can take over. When a failure occurs, the new Coordinator loads the checkpoint using the workflow or thread ID, identifies completed and pending tasks, and resumes from the last safe point. I also use task IDs and idempotency keys to prevent duplicate Worker or MCP operations.”**

### Strong interview line

> **“The Coordinator is replaceable; the workflow state is durable. So Coordinator failure should cause recovery, not loss of the workflow.”**

**Easy memory:**

**Coordinator fails → checkpoint → new instance → restore state → resume → idempotency prevents duplicates.**
