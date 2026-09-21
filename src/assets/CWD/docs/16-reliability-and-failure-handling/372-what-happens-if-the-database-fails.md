## What happens if the database fails?

In **CWD**, the database can store **workflow state, checkpoints, task status, results, and metadata**. So database failure is more serious than a normal Worker failure because it can affect **durability and recovery**.

I design CWD so a database outage **does not cause silent data loss**.

### CWD flow

```text id="p5r8v2"
Coordinator / Delegator / Worker
              ↓
        State / DB Layer
              ↓
        Database ❌
              ↓
     Retry / Failover
              ↓
       Recover or Pause
```

### 1. Detect the database failure

Examples:

```text id="5s7k1q"
Connection timeout
Connection refused
5xx
Throttling
Read failure
Write failure
```

I capture:

```text id="g4n2x8"
trace_id
correlation_id
workflow_id
operation
database
latency
error_type
retry_count
```

---

### 2. Retry transient failures

For temporary failures:

```text id="q3w9m1"
DB write
  ↓
Timeout
  ↓
Retry 1
  ↓
Retry 2
  ↓
Success
```

I use:

**exponential backoff + jitter + bounded retries**

I don't retry indefinitely.

For example, with Azure Cosmos DB, throttling such as `429` should be handled differently from a permanent authorization/schema error.

---

### 3. What if the database is completely unavailable?

This is where I **do not continue blindly**.

Suppose:

```text id="9m6c2d"
Worker completes
       ↓
Need to checkpoint result
       ↓
Database unavailable ❌
```

The system cannot safely claim:

> "The workflow state is persisted."

So depending on the operation, I can:

```text id="w5y7r0"
Pause workflow
      OR
Queue durable event
      OR
Fail safely
      OR
Use approved temporary buffer
```

The key is **don't acknowledge durable completion until the state is safely persisted**.

---

### 4. What about completed Worker results?

Suppose:

```text id="4c8j1z"
Worker 1 → SUCCESS
Worker 2 → SUCCESS
Worker 3 → running

Database fails
```

If Worker 1/2 results were already checkpointed, they remain recoverable.

If Worker 3 completed but its result could not be persisted:

```text id="q0n2vf"
Worker 3 completed
      ↓
Checkpoint failed
      ↓
Do NOT assume durable success
      ↓
Recover/reconcile after DB recovery
```

For operations that can have side effects, I use **idempotency keys** to make reconciliation/retry safe.

---

### 5. Database redundancy

For production, I avoid a single database instance.

For example:

```text id="0z5w8x"
                CWD
                 ↓
          Database Service
             /       \
            ↓         ↓
       Replica 1   Replica 2
```

Depending on the database, I use the platform's **high availability, replication, backups and failover** capabilities.

For Azure CWD, for example:

```text id="6p4k2v"
Cosmos DB
  ├── HA
  ├── Replication
  ├── Automatic failover
  └── Backups
```

The exact configuration depends on the consistency, RPO/RTO and business requirements.

---

### 6. Separate critical state from cache

This is very important.

```text id="0x3m6k"
Critical workflow state
→ Durable database

Temporary/cache data
→ Redis
```

I would **not treat Redis cache as the authoritative source** for critical workflow state unless it is explicitly configured and designed for that durability requirement.

---

### 7. Database recovery

When the database becomes healthy:

```text id="5u8z4p"
Database recovers
       ↓
Health check
       ↓
Replay queued events / reconcile state
       ↓
Restore checkpoints
       ↓
Resume workflow
```

For durable messaging, I can use **Azure Service Bus** to hold events that must survive a temporary database outage, depending on the workflow design.

---

### 8. Monitor database health

I would configure alerts for:

```text id="j7m2qx"
DB availability
DB latency P95/P99
Connection failures
Throttling
Read/write failures
Capacity
Replication/failover events
Queue/DLQ growth
```

Application Insights gives me application/dependency telemetry, while Azure Monitor provides broader platform monitoring.

---

## Important distinction

### If the database is used only for application metadata:

The workflow may potentially continue temporarily.

### If the database contains workflow checkpoints:

I should **not continue as if everything is durable**.

```text id="n6q4xs"
Database unavailable
       ↓
Can I safely persist state?
       ↓
   NO
       ↓
Pause / queue / fail safely
```

This prevents a Coordinator restart from losing the workflow state.

---

## Interview-ready answer

> **“If the database fails in CWD, I treat it as a critical infrastructure dependency, especially because we use the database for durable workflow state and checkpoints. I first detect the failure and retry transient errors with exponential backoff and jitter. If the database remains unavailable, I don't continue blindly and claim that workflow state has been persisted. Depending on the operation, I pause the workflow, use a durable queue for recoverable events, or fail safely. I use database high availability, replication and backups for recovery, and idempotency keys to safely reconcile or retry operations after recovery. Once the database is healthy, I replay queued events or restore the checkpoint and resume the workflow.”**

### Strong interview line

> **“For a stateful Agentic AI system, database failure is a durability problem, not just a connectivity problem. I make sure we never acknowledge successful workflow progress unless the required state is durably persisted.”**

**Easy memory:**
**DB fails → Retry → Don't lose state → Queue/Pause → Failover/Recover → Reconcile → Resume.**
