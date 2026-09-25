I would visualize CWD workflow execution as a **state-and-timeline view**, showing each Worker, status, duration, dependencies, retries, and failures.

```text
User Request
     │
     ▼
Coordinator ──────────────── 120 ms ✅
     │
     ▼
Sales Delegator
     │
     ▼
┌────────────── Parallel ──────────────┐
│                                      │
▼                                      ▼
Customer Worker                    Incident Worker
  1.2 sec ✅                         8.4 sec ⚠️
     │                                  │
     │                              Retry ×2
     │                                  │
     │                              12.1 sec ❌
     └──────────────┬───────────────────┘
                    ▼
             Aggregation
                    │
                    ▼
            Briefing Worker
                    │
                    ▼
                 COMPLETED
```

## What I would show

For each execution:

| Field        | Example           |
| ------------ | ----------------- |
| Workflow ID  | `CWD-12345`       |
| Status       | `RUNNING`         |
| Current step | `Incident Worker` |
| Start time   | 10:20:15          |
| Duration     | 18.4 sec          |
| Workers      | 3                 |
| Retries      | 2                 |
| Errors       | 1                 |
| Tokens       | 8,500             |
| Cost         | `$0.XX`           |

### Timeline view

```text
10:20:15  Coordinator       ✅
10:20:15  Sales Delegator   ✅
10:20:16  Customer Worker   ✅
10:20:16  Incident Worker   ⚠️
10:20:20  Incident Retry    🔄
10:20:28  Incident Worker   ❌
10:20:28  Aggregate         ✅
10:20:29  Final Response    ✅
```

### In AWS

For **Step Functions**, I would use the execution/state-machine view to see state transitions, failures, retries, and duration.

For the broader CWD platform, I would correlate everything using:

```text
session_id
   ↓
task_id
   ↓
run_id
   ↓
turn_id
   ↓
step_id
   ↓
worker_id
   ↓
MCP/tool call
```

Then use **CloudWatch + X-Ray/OpenTelemetry + Langfuse** to trace the execution across Coordinator → Delegator → Worker → MCP → enterprise system.

### 🎯 Strong interview answer

> **“I visualize workflow execution as both a state graph and a timeline. For each CWD execution, I show the workflow ID, current state, Worker status, duration, retries, failures, and dependencies. Step Functions gives me the workflow execution and state-transition view, while CloudWatch and distributed tracing provide cross-service details. I correlate the entire execution using session, task, run, turn, and step IDs so I can trace a request from the Coordinator through Delegators, Workers, MCP calls, and downstream systems.”**

**Memory trick:**
**State → Timeline → Status → Duration → Retry → Trace**

**Key distinction:**
**Step Functions shows workflow execution; distributed tracing shows what happened inside each step.**
