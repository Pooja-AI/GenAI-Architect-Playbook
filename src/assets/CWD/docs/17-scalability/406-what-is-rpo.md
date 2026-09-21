## What is RPO?

**RPO = Recovery Point Objective.**

It defines **how much data/work you can afford to lose after a disaster**, measured in time.

### Simple example in CWD

Suppose your CWD workflow state is continuously checkpointed.

If you define:

> **RPO = 5 minutes**

and the primary region fails at **10:00 AM**, you should be able to recover data from at least around **9:55 AM**.

So, you may lose **up to 5 minutes of workflow state**, depending on when the last successful replication/checkpoint occurred.

### RPO in CWD

For critical workflow state:

```text
Coordinator
     ↓
LangGraph Checkpoint
     ↓
Durable DB
     ↓
Replicated to DR Region
```

You would persist things such as:

* `workflow_id`
* completed Workers
* pending Workers
* task status
* checkpoint/state
* idempotency records

During disaster recovery:

```text
Region 1 fails
     ↓
Traffic → Region 2
     ↓
Load latest checkpoint
     ↓
Identify completed/pending tasks
     ↓
Resume from checkpoint
```

### RTO vs RPO

| Concept | Meaning                            | Example    |
| ------- | ---------------------------------- | ---------- |
| **RTO** | How quickly I must recover         | 15 minutes |
| **RPO** | How much data I can afford to lose | 5 minutes  |

**Easy memory:**

> **RTO = Time to recover**
> **RPO = Data/time I can afford to lose**

### 🎯 Interview answer

> **“RPO stands for Recovery Point Objective. It defines the maximum amount of data or workflow progress that we can afford to lose after a disaster. In CWD, I achieve the required RPO by frequently persisting LangGraph checkpoints and replicating critical workflow state to the DR region. During failover, the new Coordinator loads the latest checkpoint and resumes the pending work instead of restarting the entire workflow.”**
