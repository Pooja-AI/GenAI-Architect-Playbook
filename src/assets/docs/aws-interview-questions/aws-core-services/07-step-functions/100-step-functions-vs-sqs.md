# Step Functions vs SQS

The easiest way to remember:

> **Step Functions = orchestrate a workflow**
> **SQS = queue and buffer work**

|                       | **Step Functions**                    | **SQS**                                                     |
| --------------------- | ------------------------------------- | ----------------------------------------------------------- |
| Main purpose          | Workflow orchestration                | Message queuing                                             |
| Manages               | Multiple workflow steps               | Messages/jobs                                               |
| Sequence              | ✅                                     | ❌                                                           |
| Parallel branches     | ✅                                     | ❌                                                           |
| Conditional branching | ✅                                     | ❌                                                           |
| Retry / Catch         | ✅                                     | Basic retry through redelivery                              |
| Long-running workflow | ✅ Standard                            | Queue can retain messages, but doesn't model workflow state |
| Human approval        | ✅                                     | ❌                                                           |
| Buffer traffic spikes | Not its main purpose                  | ✅ Excellent                                                 |
| Backpressure          | Limited                               | ✅ Excellent                                                 |
| DLQ                   | Can use SQS DLQ patterns around tasks | ✅ Native DLQ support                                        |
| Worker scaling        | Indirectly                            | Excellent trigger/signal for scaling                        |
| Workflow state        | ✅                                     | ❌                                                           |

## CWD example

### Step Functions

Use it when you need to coordinate:

```text id="c8v5kx"
Customer Worker
      ↓
Parallel
 ↙         ↘
Sales     Incident
 ↘         ↙
   Aggregate
       ↓
Briefing Worker
```

It understands:

**"What step comes next?"**

---

### SQS

Use it when you need to buffer:

```text id="e7w3qs"
1000 requests
     ↓
    SQS
     ↓
Worker Pool
 ↙   ↓   ↘
W1   W2   W3
```

It answers:

**"What work is waiting to be processed?"**

---

## They can work together

In CWD, I would often use both:

```text id="d9j4mx"
             Coordinator
                  ↓
          Step Functions
                  ↓
             SQS Queue
                  ↓
        ┌─────────┼─────────┐
        ↓         ↓         ↓
    Worker 1   Worker 2   Worker 3
        ↓         ↓         ↓
      MCP / Enterprise Systems
```

**Step Functions** controls the workflow.

**SQS** buffers and distributes asynchronous Worker jobs.

---

### 🎯 Strong interview answer

> **“Step Functions and SQS solve different problems. I use Step Functions when I need to orchestrate a multi-step workflow with sequencing, parallel branches, conditions, retries, timeouts, and durable execution. I use SQS when I need to decouple producers and consumers, buffer traffic spikes, control concurrency, and provide retry and DLQ capabilities. In CWD, I can use Step Functions to orchestrate the overall durable workflow and SQS to distribute asynchronous Worker jobs.”**

### Memory trick

**Step Functions → What happens next?**

**SQS → What work is waiting?**
