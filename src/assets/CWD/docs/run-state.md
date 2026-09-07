# Run-Level State in CWD

**Run-level state represents one specific execution attempt of a task.** It records what happened during that particular run—from start, agent assignment, execution and retries through intermediate outputs, failures, and final completion.

> **Task state answers: “What work needs to be done?”**
> **Run state answers: “What happened during this particular attempt to do that work?”**

This distinction is critical in production CWD because a single task can have multiple runs.

---

## 1. Task → Run relationship

Consider:

```text
Workflow WF-1001
    │
    └── Task WT-1001
          │
          ├── Run EXEC-001
          │     └── Failed: timeout
          │
          ├── Run EXEC-002
          │     └── Failed: Worker unavailable
          │
          └── Run EXEC-003
                └── Completed successfully
```

The **task remains the same**:

```text
"Retrieve shipment tracking information"
```

But each execution attempt is a separate **run**.

This gives CWD a clean separation:

```text
Session
   ↓
Workflow
   ↓
Task
   ↓
Run
   ↓
Tool calls / API calls / intermediate outputs
```

---

# 2. Task state vs run state

| Aspect     | Task-level state               | Run-level state                       |
| ---------- | ------------------------------ | ------------------------------------- |
| Represents | Objective                      | One execution attempt                 |
| Example    | Shipment tracking task         | Attempt #2                            |
| Lifetime   | Task lifecycle                 | One execution                         |
| Retries    | Tracks retry policy/count      | Represents individual attempt         |
| Worker     | Logical assignment             | Actual participating Worker/agent     |
| Status     | Overall task status            | Current run status                    |
| Results    | Final task result              | Intermediate + final outputs          |
| Failure    | Task-level outcome             | Specific failure in this run          |
| Timestamps | Task lifecycle                 | Exact execution timestamps            |
| Recovery   | Decides whether task continues | Records what happened in this attempt |

### Important relationship

```text
Task
 ├── Run 1
 ├── Run 2
 └── Run 3
```

The task represents **the objective**.

The run represents **the execution history of an attempt**.

---

# 3. Why run-level state is required

Without run-level state, CWD might only know:

```text
Task WT-1001 = completed
```

But production systems need to know:

```text
Run 1 → timeout
Run 2 → Worker unavailable
Run 3 → completed
```

Run-level state provides:

* Retry visibility.
* Failure diagnosis.
* Performance measurement.
* Worker-level accountability.
* Execution timing.
* Tool execution tracking.
* Partial-result tracking.
* Reproducibility.
* Recovery.
* Operational analytics.
* Audit evidence.

It answers:

> **Which attempt produced this result, using which agent, version, prompt, tools, and execution path?**

---

# 4. Run identity

A run needs its own unique identity.

```json
{
  "runId": "RUN-003",
  "taskId": "WT-1001",
  "workflowId": "WF-1001",
  "sessionId": "S-1001",
  "correlationId": "CORR-7890"
}
```

Important identifiers:

| Identifier       | Purpose                          |
| ---------------- | -------------------------------- |
| `sessionId`      | User interaction                 |
| `workflowId`     | Workflow execution               |
| `taskId`         | Business/technical objective     |
| `runId`          | Specific execution attempt       |
| `messageId`      | Message that triggered execution |
| `parentTaskId`   | Parent task                      |
| `correlationId`  | End-to-end request               |
| `idempotencyKey` | Duplicate-execution protection   |

### Hierarchy

```text
CORR-7890
   │
   └── Session S-1001
          │
          └── Workflow WF-1001
                 │
                 └── Task WT-1001
                        │
                        ├── RUN-001
                        ├── RUN-002
                        └── RUN-003
```

---

# 5. Run lifecycle

A run should have an explicit lifecycle.

```text
CREATED
   ↓
STARTING
   ↓
RUNNING
   │
   ├───────────────┐
   │               │
   ▼               ▼
WAITING         RETRYING
   │               │
   ▼               │
RUNNING ◄──────────┘
   │
   ├── COMPLETED
   ├── FAILED
   ├── TIMED_OUT
   ├── CANCELLED
   └── ABANDONED
```

Typical states:

| State                  | Meaning                                           |
| ---------------------- | ------------------------------------------------- |
| `created`              | Run record created                                |
| `starting`             | Runtime initialization                            |
| `running`              | Execution active                                  |
| `waiting`              | Waiting for dependency/external event             |
| `waiting_for_approval` | Human approval required                           |
| `retrying`             | Run failure triggered retry logic                 |
| `completed`            | Execution succeeded                               |
| `failed`               | Execution failed                                  |
| `timed_out`            | Deadline exceeded                                 |
| `cancelled`            | Explicitly stopped                                |
| `abandoned`            | Runtime disappeared without successful completion |

The exact state machine should be standardized across the CWD platform.

---

# 6. Run timestamps

Run-level state captures precise execution timing.

```json
{
  "timestamps": {
    "createdAt": "2026-09-06T15:00:10Z",
    "startedAt": "2026-09-06T15:00:12Z",
    "lastProgressAt": "2026-09-06T15:00:30Z",
    "completedAt": "2026-09-06T15:00:31Z"
  }
}
```

These timestamps allow CWD to calculate:

$$
\text{Execution Duration}
=
\text{completedAt} - \text{startedAt}
$$

And potentially:

```text
Queue Time
    ↓
Startup Time
    ↓
Execution Time
    ↓
Validation Time
    ↓
Total Run Time
```

This is important for SLA and performance analysis.

---

# 7. Participating agents

A run may involve multiple agents.

For example:

```text
Coordinator
     │
     ▼
Shipping Delegator
     │
     ▼
Tracking Worker
     │
     ├── MCP Client
     │      ↓
     │   Shipping MCP
     │      ↓
     │   Carrier API
     │
     └── RAG Worker
```

Run state can record participating components:

```json
{
  "participants": [
    {
      "agentId": "shipping-delegator",
      "role": "delegator",
      "version": "3.1.0"
    },
    {
      "agentId": "tracking-worker",
      "role": "worker",
      "version": "2.4.1"
    }
  ]
}
```

This is particularly useful when different Worker implementations participate in different attempts.

---

# 8. Retry information

Retries are one of the most important reasons to distinguish task state from run state.

Suppose:

```text
Task WT-1001
    │
    ├── Run 1 → timeout
    ├── Run 2 → API rate limit
    └── Run 3 → success
```

The task may contain:

```json
{
  "status": "completed",
  "runCount": 3,
  "successfulRunId": "RUN-003"
}
```

While each run contains its own details:

```json
{
  "runId": "RUN-001",
  "attempt": 1,
  "status": "timed_out"
}
```

and:

```json
{
  "runId": "RUN-002",
  "attempt": 2,
  "status": "failed",
  "failureCode": "RATE_LIMIT"
}
```

and:

```json
{
  "runId": "RUN-003",
  "attempt": 3,
  "status": "completed"
}
```

### Why this matters

CWD can determine:

* Which attempt failed.
* Why it failed.
* Which Worker was used.
* How long it ran.
* Whether retry was appropriate.
* Whether the failure is transient.
* Whether another Worker should be selected.

---

# 9. Intermediate outputs

A run may generate several intermediate outputs.

```text
Run RUN-003
    │
    ├── Query transformed
    ├── Tracking API called
    ├── 14 events retrieved
    ├── RAG retrieved 7 chunks
    ├── Delay cause identified
    └── Final result generated
```

Represent these using bounded references:

```json
{
  "intermediateOutputs": [
    {
      "step": "query_transformation",
      "status": "completed",
      "outputReference": "output-001"
    },
    {
      "step": "tracking_lookup",
      "status": "completed",
      "outputReference": "output-002"
    },
    {
      "step": "knowledge_retrieval",
      "status": "completed",
      "outputReference": "output-003"
    }
  ]
}
```

Large results should generally be stored outside the run document:

```text
Cosmos DB
    └── Run metadata + references

Blob Storage
    └── Large artifacts

Azure AI Search
    └── Retrieved knowledge references

Execution telemetry
    └── Detailed traces/logs
```

---

# 10. Failure information

A run should preserve structured failure information.

```json
{
  "failure": {
    "code": "MCP_TIMEOUT",
    "type": "dependency_timeout",
    "component": "shipping-mcp",
    "message": "Tracking service did not respond within the configured timeout.",
    "retryable": true,
    "severity": "medium",
    "occurredAt": "2026-09-06T15:02:00Z"
  }
}
```

The failure can then drive LangGraph routing:

```text
Run failed
     ↓
Classify failure
     ↓
Retryable?
 ┌───┴────┐
Yes       No
 │         │
 ▼         ▼
Retry    Recovery
 │         │
 ▼         ▼
New Run   Fail Task
```

### Critical distinction

**A failed run does not necessarily mean the task failed.**

```text
Run 1 → FAILED
Run 2 → FAILED
Run 3 → COMPLETED

Task → COMPLETED
```

---

# 11. Final completion state

The run should record the final execution outcome.

```json
{
  "completion": {
    "status": "completed",
    "success": true,
    "completedAt": "2026-09-06T15:03:00Z",
    "resultReference": "result-RUN-003",
    "validated": true,
    "validationStatus": "passed",
    "durationMs": 1240
  }
}
```

The result should identify the run that produced it:

```text
Task WT-1001
    │
    └── Successful Run RUN-003
            │
            └── Result RESULT-003
```

This makes the result reproducible and traceable.

---

# 12. Complete run-level document

A production-oriented conceptual document could look like this:

```json
{
  "id": "RUN-003",
  "documentType": "executionRun",

  "tenantId": "tenant-a",

  "identity": {
    "runId": "RUN-003",
    "taskId": "WT-1001",
    "parentTaskId": "DT-5001",
    "workflowId": "WF-1001",
    "sessionId": "S-1001",
    "correlationId": "CORR-7890",
    "executionAttempt": 3,
    "idempotencyKey": "WT-1001:attempt-3"
  },

  "objective": {
    "capability": "shipment_tracking",
    "action": "retrieve_tracking_events"
  },

  "assignment": {
    "agentId": "tracking-worker",
    "agentVersion": "2.4.1",
    "instanceId": "tracking-worker-03"
  },

  "status": "completed",

  "timestamps": {
    "createdAt": "2026-09-06T15:00:10Z",
    "startedAt": "2026-09-06T15:00:12Z",
    "lastProgressAt": "2026-09-06T15:02:50Z",
    "completedAt": "2026-09-06T15:03:00Z"
  },

  "participants": [
    {
      "agentId": "shipping-delegator",
      "role": "delegator"
    },
    {
      "agentId": "tracking-worker",
      "role": "worker"
    }
  ],

  "retry": {
    "attempt": 3,
    "previousRunIds": [
      "RUN-001",
      "RUN-002"
    ],
    "retryReason": "Previous runs experienced transient failures"
  },

  "intermediateOutputs": [
    {
      "step": "tracking_lookup",
      "reference": "output-003"
    },
    {
      "step": "result_validation",
      "reference": "validation-003"
    }
  ],

  "failure": null,

  "completion": {
    "success": true,
    "validated": true,
    "resultReference": "result-RUN-003"
  },

  "executionMetadata": {
    "durationMs": 1680,
    "toolsUsed": [
      "get_tracking_events"
    ],
    "promptId": "shipment-delay-analysis",
    "promptVersion": "2.2.0",
    "modelVersion": "approved-model-v4"
  }
}
```

This gives CWD a complete representation of **what happened during this particular attempt**.

---

# 13. Run state and LangGraph

LangGraph controls the execution path, while run-level state records the execution instance.

Example:

```text
START
  ↓
Load Task
  ↓
Initialize Run
  ↓
Select Worker
  ↓
Execute
  ↓
Validate
  ├── Success ──────────→ Complete Run
  │
  ├── Retryable Error ──→ Create New Run
  │
  ├── Approval ─────────→ Wait
  │
  └── Permanent Error ──→ Fail Run
```

A LangGraph state might contain:

```python
{
    "workflow_id": "WF-1001",
    "task_id": "WT-1001",
    "run_id": "RUN-003",

    "status": "running",

    "assigned_agent": "tracking-worker",
    "attempt": 3,

    "intermediate_output_refs": [
        "output-003"
    ],

    "failure": None,

    "next_node": "validate_result"
}
```

### Important distinction

```text
LangGraph
    → Determines the next execution transition

Run State
    → Records the current execution attempt

Cosmos DB
    → Durably stores the run record

Worker
    → Performs the execution
```

---

# 14. Run state and Service Bus

Service Bus delivers the task message, but the message itself should not become the entire run state.

```text
Task
 │
 ▼
Create Run RUN-003
 │
 ▼
Publish message
 │
 ▼
Worker
 │
 ├── Start
 ├── Execute
 ├── Update progress
 └── Complete
 │
 ▼
Persist Run RUN-003
 │
 ▼
Publish completion event
```

Example completion message:

```json
{
  "messageType": "task.execution.completed",
  "messageId": "MSG-9003",
  "correlationId": "CORR-7890",
  "workflowId": "WF-1001",
  "taskId": "WT-1001",
  "runId": "RUN-003",
  "status": "completed",
  "resultReference": "result-RUN-003"
}
```

The message tells the downstream service **what happened**.

The durable run record contains the detailed execution state.

---

# 15. Run-level state and Cosmos DB

A useful Cosmos DB design is:

```text
Cosmos DB
│
├── sessions
│      └── Session-level state
│
├── workflows
│      └── Workflow-level state
│
├── tasks
│      └── Task-level state
│
├── runs
│      └── Run-level execution state
│
├── agent-results
│      └── Validated results
│
└── execution-events
       └── Detailed event history
```

You could alternatively combine some of these into fewer containers if access patterns and partitioning make that more efficient.

The architectural distinction is more important than the physical container count.

---

# 16. Run-level state and retries

This is one of the most important concepts.

### Task state

```json
{
  "taskId": "WT-1001",
  "status": "completed",
  "successfulRunId": "RUN-003",
  "attemptCount": 3
}
```

### Run state

```text
RUN-001
    status = timed_out
    worker = tracking-worker-01

RUN-002
    status = failed
    worker = tracking-worker-02
    error = RATE_LIMIT

RUN-003
    status = completed
    worker = tracking-worker-03
```

Therefore:

$$
\text{Task State} = \text{Aggregate Outcome Across Runs}
$$

while:

$$
\text{Run State} = \text{Detailed State of One Attempt}
$$

---

# 17. Run-level state and observability

Run state provides the bridge between durable execution data and telemetry.

A trace can include:

```text
correlation_id = CORR-7890
workflow_id    = WF-1001
task_id        = WT-1001
run_id         = RUN-003
agent_id       = tracking-worker
```

This allows an operator to move from:

```text
User request
     ↓
Workflow
     ↓
Task
     ↓
Run
     ↓
Trace
     ↓
Tool call
     ↓
Enterprise API
```

Useful run metrics include:

* Execution duration.
* Queue wait time.
* Number of tool calls.
* Retry count.
* Error rate.
* Worker utilization.
* Token usage.
* Model latency.
* RAG latency.
* MCP latency.
* Final outcome.

---

# 18. Run-level state and reproducibility

For enterprise AI systems, simply recording:

```text
Run = completed
```

is insufficient.

A useful run record should capture references to:

```text
Agent
Agent version
Worker version
Prompt ID
Prompt version
Model/version
Tool versions
RAG index
Embedding model
Retrieved evidence
Input reference
Output reference
Configuration
Policy context
Timestamp
```

For example:

```json
{
  "reproducibility": {
    "agentVersion": "2.4.1",
    "promptId": "shipment-delay-analysis",
    "promptVersion": "2.2.0",
    "modelVersion": "approved-model-v4",
    "retrievalIndex": "enterprise-knowledge-v12",
    "embeddingModel": "embedding-v3"
  }
}
```

This is extremely valuable when investigating:

> “Why did the agent produce this answer yesterday but a different answer today?”

---

# 19. Run-level state and security

Run data may contain:

* User context.
* Business inputs.
* Retrieved enterprise data.
* Tool outputs.
* Agent decisions.
* Error details.
* Sensitive operational information.

Therefore:

```text
Run State
   ↓
Classification
   ↓
Authorization
   ↓
Retention
   ↓
Encryption
   ↓
Audit
```

Avoid putting:

* Passwords.
* Access tokens.
* API secrets.
* Unnecessary PII.
* Full sensitive documents.
* Unfiltered tool payloads.

into run state.

Instead:

```text
Run document
    → Reference to sensitive artifact

Secure storage
    → Actual artifact

Policy/IAM
    → Controls access
```

---

# 20. Failure recovery using run state

Suppose:

```text
Task WT-1001

RUN-001
   ↓
MCP timeout
   ↓
FAILED
```

LangGraph can inspect:

```json
{
  "retryable": true,
  "attempt": 1,
  "deadlineRemainingMs": 3000
}
```

and decide:

```text
Create RUN-002
     ↓
Rediscover Worker
     ↓
Select tracking-worker-03
     ↓
Execute
```

If RUN-002 also fails:

```text
RUN-002 → FAILED
     ↓
Retry budget exhausted
     ↓
Task → FAILED
     ↓
Delegator → Recovery
     ↓
Coordinator → User response / escalation
```

Thus:

> **Run state provides the evidence required for intelligent retry and recovery.**

---

# 21. Run state and idempotency

Consider a Worker receiving the same message twice:

```text
Service Bus
   │
   ├── Delivery #1 → RUN-003
   │
   └── Delivery #2 → duplicate
```

The Worker can check:

```text
Task + execution/idempotency key
        ↓
Existing successful run?
   ├── Yes → return existing result
   └── No  → execute
```

This is especially important for tasks that perform writes.

```text
Without idempotency:

Retry → create ticket
Retry → create another ticket
Retry → create another ticket
```

With idempotency:

```text
Retry
  ↓
Existing successful execution found
  ↓
Return existing result
```

---

# 22. Run state versus execution history

These concepts are related but different.

### Run state

Current representation of one execution:

```json
{
  "runId": "RUN-003",
  "status": "completed",
  "attempt": 3
}
```

### Execution history

Chronological events:

```text
15:00:12 RUN_CREATED
15:00:13 WORKER_ASSIGNED
15:00:14 EXECUTION_STARTED
15:00:20 TOOL_INVOKED
15:00:25 TOOL_COMPLETED
15:00:29 VALIDATION_STARTED
15:00:30 EXECUTION_COMPLETED
```

Think:

```text
Run State
    = Current snapshot of an execution

Execution History
    = Timeline of everything that happened
```

You often want both.

---

# 23. Anti-patterns

### ❌ Treating task and run as the same entity

This destroys retry-level visibility.

### ❌ Overwriting failed runs

You lose valuable operational and audit information.

### ❌ Creating a new task for every retry

Usually incorrect.

```text
Task WT-1001
   ├── Run 1
   ├── Run 2
   └── Run 3
```

is preferable to:

```text
Task WT-1001
Task WT-1002
Task WT-1003
```

unless the business semantics actually define them as separate tasks.

### ❌ No run ID

Task ID alone cannot distinguish execution attempts.

### ❌ Treating failure as only text

Structured failure classification is required for automated recovery.

### ❌ Storing unlimited intermediate outputs

Use references and retention policies.

### ❌ Letting a retry reuse stale results blindly

Intermediate outputs must be validated for applicability to the new attempt.

### ❌ No version information

Without agent/model/prompt/tool versions, reproducing behavior becomes difficult.

---

# 24. Complete CWD state hierarchy

At this point the hierarchy becomes:

```text
SESSION
│
├── Identity
├── Conversation
├── Session metadata
│
└── WORKFLOW
    │
    ├── Workflow objective
    ├── Plan
    ├── Dependencies
    │
    └── TASK
        │
        ├── Objective
        ├── Inputs
        ├── Required capability
        ├── Assignment
        ├── Dependencies
        │
        └── RUN
            │
            ├── Execution attempt
            ├── Participating agents
            ├── Timestamps
            ├── Intermediate outputs
            ├── Tool calls
            ├── Failures
            ├── Retry information
            └── Final result
```

This is a very useful mental model for CWD.

---

# 25. Four levels of state

| Level        | Question answered                                            |
| ------------ | ------------------------------------------------------------ |
| **Session**  | Who is interacting and what interaction are we maintaining?  |
| **Workflow** | What overall process are we executing and what happens next? |
| **Task**     | What specific objective needs to be completed?               |
| **Run**      | What happened during this particular attempt?                |

### Compact mental model

```text
Session  → WHO / CONTEXT
Workflow → WHAT OVERALL PROCESS
Task     → WHAT SPECIFIC WORK
Run      → WHAT HAPPENED THIS TIME
```

---

# 26. Architect-level formula

$$
\boxed{
\text{Run-Level State}
=
\text{Run Identity}
+
\text{Execution Attempt}
+
\text{Status}
+
\text{Timestamps}
+
\text{Participants}
+
\text{Assignment}
+
\text{Intermediate Outputs}
+
\text{Retries}
+
\text{Failures}
+
\text{Completion}
+
\text{Result References}
+
\text{Execution Metadata}
+
\text{Correlation}
}
$$

And the relationship is:

$$
\boxed{
\text{Task}
=
\text{Objective}
+
\{\text{Run}_1,\text{Run}_2,\ldots,\text{Run}_n\}
}
$$

---

# Interview-ready answer

> **In CWD, run-level state represents one specific execution attempt of a task.** A task defines the objective, while each run records how that objective was actually executed. The run contains its own run ID, task and workflow references, execution status, start and completion timestamps, assigned Worker and participating agents, attempt number, intermediate outputs, tool or dependency references, structured failure information, retry metadata, and final result reference. This separation is important because a single task may have multiple runs due to timeouts, Worker failures, retries, or reassignment. Cosmos DB can durably store the run state, while LangGraph controls execution transitions and recovery, Service Bus transports asynchronous task messages, and observability systems capture detailed traces. When a run fails, CWD can classify the failure and create another run without losing the history of the previous attempt. Therefore, run-level state provides the execution-level granularity required for reliability, retry, recovery, debugging, auditability, and reproducibility.

## Final definition

**Run-level state in CWD is the durable representation of one specific execution attempt for a task. It records the run identity, execution status, timestamps, participating agents and Worker versions, retry attempt, intermediate outputs, failures, tool/dependency activity, execution metadata, and final completion or failure state. Multiple runs can belong to one task, allowing CWD to preserve failed attempts while retrying or reassigning the same objective, thereby providing the execution-level traceability, recovery, reliability, and reproducibility required for distributed enterprise agent execution.**

### Final mental model

**Session = interaction → Workflow = process → Task = objective → Run = execution attempt → Events/Tools = what happened inside the run.**
