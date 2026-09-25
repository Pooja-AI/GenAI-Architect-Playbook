# Step Functions: Standard vs Express

The easiest way to remember:

> **Standard = long-running + durable + auditable**
> **Express = short-running + high-volume + fast**

|                              | **Standard**                              | **Express**                                            |
| ---------------------------- | ----------------------------------------- | ------------------------------------------------------ |
| Best for                     | Long-running workflows                    | High-volume short workflows                            |
| Maximum duration             | Up to **1 year**                          | Up to **5 minutes**                                    |
| Execution model              | Exactly-once workflow execution semantics | At-least-once or best-effort depending on Express type |
| Execution history            | Detailed execution history                | Limited execution history                              |
| Pricing                      | Per state transition                      | Based mainly on executions + duration + memory         |
| Scale                        | High                                      | Very high                                              |
| Human approval               | ✅ Good fit                                | ❌ Generally not suitable                               |
| Long-running CWD workflow    | ✅                                         | ❌                                                      |
| High-volume short processing | Possible                                  | ✅                                                      |

### CWD example — Standard

Suppose CWD needs a long-running enterprise workflow:

```text
Customer Request
      ↓
Coordinator
      ↓
Step Functions Standard
      ↓
Salesforce
      ↓
Human Approval
      ↓
ServiceNow
      ↓
Generate Report
      ↓
Completed
```

This is a good **Standard** use case because the workflow may run for minutes/hours and needs durable execution and recovery.

---

### CWD example — Express

Suppose CWD receives thousands of small document-processing events:

```text
S3 Event
   ↓
Express Workflow
   ↓
Extract Metadata
   ↓
Transform
   ↓
Store Result
   ↓
Done
```

This is a good **Express** use case because executions are short and high-volume.

---

## Important interview point

Don't choose based only on traffic.

Ask:

```text
Long-running?
Need durable execution?
Need detailed execution history?
Human approval?
Critical business workflow?
        ↓
      Standard
```

Versus:

```text
Short execution?
Very high volume?
Event-driven?
Simple processing?
        ↓
      Express
```

### 🎯 Strong interview answer

> **“I choose Step Functions Standard for long-running, business-critical CWD workflows where I need durable execution, detailed execution history, retries, recovery, and potentially human approval. I choose Express for short-duration, high-volume, event-driven workflows where throughput and cost efficiency are more important than long-lived execution history. For example, a long-running Customer Briefing workflow would fit Standard, while high-volume document preprocessing could fit Express.”**

**Memory trick:**
**Standard = Long + Durable**
**Express = Short + High Volume**
