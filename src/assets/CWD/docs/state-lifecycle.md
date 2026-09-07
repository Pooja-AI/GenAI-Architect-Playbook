# Complete CWD Execution-State Lifecycle

**Core principle:**

> **CWD execution state is the durable, correlated record of what the distributed workflow is doing, what has already happened, what should happen next, and how execution can safely recover, complete, or expire.**

For CWD, execution state should be treated as a **first-class production asset**, not merely an in-memory object inside LangGraph.

---

## 1. What Is CWD Execution State?

CWD execution state represents the lifecycle of an execution from the moment a request is accepted until its state is completed, retained, archived, and eventually expired.

At a high level:

```text
CREATE
  ↓
INITIALIZE
  ↓
EXECUTE
  ↓
UPDATE
  ↓
PERSIST
  ↓
PROPAGATE
  ↓
RETRY / RECOVER
  ↓
COMPLETE / FAIL / CANCEL
  ↓
CLEANUP
  ↓
ARCHIVE
  ↓
EXPIRE / DELETE
```

The complete lifecycle can be viewed as:

```text
User Request
     │
     ▼
Session / Turn
     │
     ▼
Workflow Created
     │
     ▼
Tasks Created
     │
     ▼
Runs Created
     │
     ▼
Steps Executed
     │
     ├──────────────┐
     ▼              ▼
 Success          Failure
     │              │
     │          Retry / Recover
     │              │
     │              └───────┐
     │                      │
     ▼                      ▼
Aggregate Results       Re-execute
     │
     ▼
Workflow Completed
     │
     ▼
Cleanup
     │
     ▼
Retention
     │
     ▼
Archive
     │
     ▼
Expiration
```

---

# 2. State Hierarchy

CWD execution state is hierarchical.

```text
Session
   │
   └── Conversation
          │
          └── Turn
                 │
                 └── Workflow
                        │
                        ├── Task
                        │     ├── Run
                        │     │    ├── Step
                        │     │    └── Step
                        │     │
                        │     └── Run
                        │
                        └── Task
                              └── Run
                                   └── Step
```

Each level has a different responsibility.

| Level    | Represents                   |
| -------- | ---------------------------- |
| Session  | Overall interaction          |
| Turn     | One user request/response    |
| Workflow | End-to-end business process  |
| Task     | Objective to execute         |
| Run      | Specific execution attempt   |
| Step     | Individual execution action  |
| Event    | Individual occurrence/change |

For example:

```text
Session S1
 └── Turn T1
      └── Workflow W1
           ├── Task TSK1
           │    ├── Run R1 → failed
           │    └── Run R2 → completed
           │
           └── Task TSK2
                └── Run R1 → completed
```

---

# 3. State Creation

Execution state begins when the Gateway accepts a valid request.

```text
User
 ↓
Gateway
 ↓
Authentication
 ↓
Authorization
 ↓
Coordinator
 ↓
Create Execution State
```

The Coordinator establishes:

```json
{
  "correlation_id": "CORR-7890",
  "session_id": "S-1001",
  "turn_id": "TURN-002",
  "workflow_id": "WF-1001",
  "status": "CREATED"
}
```

The correlation ID becomes the primary thread connecting all downstream execution.

---

# 4. Initialization

After creation, CWD initializes the workflow.

Initialization may include:

```text
Identity
Intent
Domain
Business object
Workflow definition
Execution policy
Required capabilities
Agent discovery
Constraints
Timeout/deadline
Security scope
Prompt version
Model configuration
Initial context
```

Example:

```json
{
  "workflow_id": "WF-1001",
  "correlation_id": "CORR-7890",

  "status": "INITIALIZING",

  "intent": "root_cause_analysis",
  "domain": "logistics",

  "business_object": {
    "type": "shipment",
    "id": "SHIP123"
  },

  "constraints": {
    "priority": "high",
    "deadline_ms": 10000
  }
}
```

Initialization should establish enough state for the workflow to resume safely if the runtime fails immediately afterward.

---

# 5. Persistence

Once initialized, important state is persisted.

A typical architecture is:

```text
              CWD
               │
       ┌───────┴────────┐
       │                │
    LangGraph         Context
       │                │
       ▼                ▼
 Workflow State      Redis
       │
       ▼
   Cosmos DB
       │
       ▼
 Durable State
```

### Redis

Useful for:

* active session context
* short-lived state
* caches
* coordination
* locks

### Cosmos DB

Useful for:

* durable workflow state
* task state
* run state
* step snapshots
* session metadata
* conversation/turn state
* execution references

### Observability platform

Useful for:

* traces
* metrics
* logs
* detailed execution telemetry

### Object storage

Useful for:

* large artifacts
* files
* reports
* large tool outputs

The key principle is:

> **No single system should be responsible for every type of state.**

---

# 6. State Initialization in LangGraph

LangGraph can represent the active workflow state:

```python
state = {
    "correlation_id": "CORR-7890",
    "workflow_id": "WF-1001",

    "status": "initialized",

    "intent": "root_cause_analysis",
    "domain": "logistics",

    "tasks": [],
    "results": [],

    "current_node": "planning"
}
```

But this state is not necessarily the complete persistent execution record.

A better architecture is:

```text
LangGraph State
       │
       ├── Active workflow execution
       │
       ▼
Persistence Adapter
       │
       ▼
Cosmos DB
       │
       ▼
Durable Workflow State
```

---

# 7. Workflow State Updates

As the workflow progresses, state changes.

Example:

```text
INITIALIZING
      ↓
PLANNING
      ↓
DELEGATING
      ↓
EXECUTING
      ↓
AGGREGATING
      ↓
COMPLETING
      ↓
COMPLETED
```

Each meaningful transition should be persisted.

For example:

```json
{
  "workflow_id": "WF-1001",
  "status": "EXECUTING",
  "current_step": "delegation",
  "updated_at": "2026-09-06T16:10:00Z"
}
```

---

# 8. State Should Be Updated Atomically

Distributed services may update the same workflow concurrently.

For example:

```text
Coordinator
     │
     ├── Task A
     │
     └── Task B
```

Both may attempt to update workflow state.

Therefore, the persistence layer needs concurrency control.

A common pattern with Cosmos DB is optimistic concurrency:

```text
Read State
   ↓
version = 10
   ↓
Modify
   ↓
Write only if version = 10
   ↓
Success → version 11
```

If another process changed it:

```text
Expected version = 10
Actual version   = 11
        ↓
Conflict
        ↓
Reload
        ↓
Reconcile
```

This prevents one agent from accidentally overwriting another agent's update.

---

# 9. State Propagation

State and context must be propagated downstream selectively.

```text
Coordinator State
       │
       ▼
Context Projection
       │
       ▼
Delegator State
       │
       ▼
Task Projection
       │
       ▼
Worker State
```

The Coordinator does not send its entire state.

For example:

```json
{
  "correlation_id": "CORR-7890",
  "workflow_id": "WF-1001",
  "task_id": "WT-1001",

  "objective": "Retrieve shipment tracking events",

  "input": {
    "shipment_id": "SHIP123"
  },

  "constraints": {
    "timeout_ms": 5000
  }
}
```

This preserves execution lineage without creating context explosion.

---

# 10. Execution State vs Propagated Context

This distinction is critical.

```text
Execution State
     │
     │ larger
     ▼
Context Selection
     │
     │ smaller
     ▼
Propagated Context
```

For example:

```text
Workflow State
 ├── conversation
 ├── tasks
 ├── runs
 ├── previous results
 ├── decisions
 ├── security metadata
 ├── prompt metadata
 └── execution metadata

        ↓ Context Projection

Worker Context
 ├── task_id
 ├── correlation_id
 ├── objective
 ├── shipment_id
 └── authorized scope
```

**State is what CWD knows.
Context is what the next component needs.**

---

# 11. Task Creation

The Coordinator or Delegator creates tasks.

Example:

```json
{
  "task_id": "WT-1001",
  "parent_task_id": "DT-5001",
  "workflow_id": "WF-1001",
  "correlation_id": "CORR-7890",

  "objective": "Retrieve shipment tracking events",

  "required_capability": "shipment_tracking",

  "status": "CREATED"
}
```

The task then progresses:

```text
CREATED
   ↓
QUEUED
   ↓
ASSIGNED
   ↓
RUNNING
```

---

# 12. Agent Assignment

The Delegator consults the Agent Registry.

```text
Task
 │
 ▼
Required Capability
 │
 ▼
Agent Registry
 │
 ├── Agent A → unhealthy
 ├── Agent B → ready
 └── Agent C → draining
             │
             ▼
          Agent B
```

The selected agent is recorded in state:

```json
{
  "assigned_agent": {
    "agent_id": "tracking-worker",
    "version": "2.4.1"
  }
}
```

This is important for reproducibility and troubleshooting.

---

# 13. Run Creation

When execution begins, a run is created.

Remember:

```text
Task ≠ Run
```

A task represents the objective.

A run represents one attempt.

```text
Task WT-1001
     │
     ├── Run RUN-001 → failed
     │
     ├── Run RUN-002 → timeout
     │
     └── Run RUN-003 → completed
```

Run state:

```json
{
  "run_id": "RUN-003",
  "task_id": "WT-1001",
  "attempt": 3,
  "status": "RUNNING",

  "started_at": "2026-09-06T16:12:00Z",

  "agent": {
    "id": "tracking-worker",
    "version": "2.4.1"
  }
}
```

---

# 14. Step Execution

The run is broken into meaningful steps.

```text
RUN-003
   │
   ├── STEP-001 Validate Input
   ├── STEP-002 Authorize
   ├── STEP-003 Retrieve Data
   ├── STEP-004 Validate Result
   └── STEP-005 Return Result
```

Each step has its own state:

```json
{
  "step_id": "STEP-003",
  "run_id": "RUN-003",

  "step_type": "tool_execution",

  "status": "RUNNING",

  "started_at": "2026-09-06T16:12:02Z"
}
```

---

# 15. State During Tool Execution

Suppose the Worker invokes an MCP tool.

```text
Worker
  │
  ▼
MCP Client
  │
  ▼
MCP Server
  │
  ▼
Enterprise API
```

Execution state records the important facts:

```json
{
  "step_id": "STEP-003",
  "step_type": "tool_execution",
  "tool": "get_tracking_events",
  "status": "COMPLETED",
  "duration_ms": 1240,
  "result_reference": "RESULT-001"
}
```

Large raw tool output should generally be stored elsewhere and referenced.

---

# 16. Intermediate State

Execution state changes throughout the workflow.

For example:

```text
Step 1
  ↓
validated = true

Step 2
  ↓
agent = tracking-worker

Step 3
  ↓
tracking_result = RESULT-001

Step 4
  ↓
carrier_result = RESULT-002
```

The system should persist meaningful intermediate state rather than every internal variable.

This is important:

> **Persist recovery-relevant state, not every line of execution.**

---

# 17. Successful State Transition

A successful step might transition:

```text
READY
  ↓
RUNNING
  ↓
VALIDATING
  ↓
COMPLETED
```

Then LangGraph determines the next node:

```text
Step Completed
      │
      ▼
Conditional Edge
      │
      ├── More work → Next Step
      ├── Aggregate → Aggregation
      ├── Approval → HITL
      └── Complete → Finalization
```

This is where LangGraph provides workflow control.

---

# 18. Failure Detection

Failures can occur at any layer.

### Infrastructure failure

```text
Worker unavailable
Container crash
Network failure
Database unavailable
```

### Integration failure

```text
MCP timeout
API failure
Authentication failure
```

### Business failure

```text
Shipment not found
Invalid business state
Business rule violation
```

### Agent failure

```text
Invalid output
Schema violation
Reasoning failure
Tool misuse
```

### Policy failure

```text
Unauthorized operation
Restricted data
Approval required
```

The state should classify the failure.

```json
{
  "status": "FAILED",

  "error": {
    "code": "MCP_TIMEOUT",
    "type": "TRANSIENT",
    "retryable": true,
    "step_id": "STEP-003"
  }
}
```

---

# 19. Retry Lifecycle

A retry should never simply mean:

```text
FAILED → TRY AGAIN
```

Instead:

```text
Failure
  ↓
Classify Error
  ↓
Retryable?
  │
  ├── No → Recovery / Fail
  │
  └── Yes
       ↓
Check Deadline
       ↓
Check Idempotency
       ↓
Check Agent Health
       ↓
Backoff + Jitter
       ↓
Retry / Reassign
```

---

# 20. Retry State

Example:

```json
{
  "task_id": "WT-1001",

  "status": "RETRYING",

  "retry": {
    "attempt": 2,
    "max_attempts": 3,
    "reason": "MCP_TIMEOUT",
    "next_retry_at": "2026-09-06T16:15:00Z"
  }
}
```

If the retry uses a new run:

```text
Task
 │
 ├── RUN-001 → FAILED
 │
 └── RUN-002 → RUNNING
```

This preserves history rather than overwriting the failed attempt.

---

# 21. Agent Failover

Suppose:

```text
Worker A → FAILED
```

The Delegator can rediscover:

```text
Agent Registry
      │
      ├── Worker A → failed
      ├── Worker B → ready
      └── Worker C → ready
```

Then:

```text
Task
 ↓
Rediscovery
 ↓
Worker B
 ↓
New Run
```

State records the reassignment.

```json
{
  "attempt": 2,
  "previous_agent": "worker-A",
  "assigned_agent": "worker-B",
  "reason": "worker-A unavailable"
}
```

---

# 22. Partial Failure

Distributed CWD workflows frequently have partial failures.

For example:

```text
Task A → completed
Task B → completed
Task C → failed
Task D → completed
```

The Delegator can decide:

```text
Can continue?
Can retry Task C?
Can use alternate Worker?
Need human approval?
Must terminate?
```

Therefore workflow state needs to represent partial completion.

```json
{
  "status": "PARTIAL",

  "tasks": {
    "total": 4,
    "completed": 3,
    "failed": 1
  }
}
```

---

# 23. Human Approval State

High-risk operations can enter:

```text
WAITING_FOR_APPROVAL
```

Example:

```json
{
  "workflow_id": "WF-1001",

  "status": "WAITING_FOR_APPROVAL",

  "approval": {
    "approval_id": "APR-001",
    "required": true,
    "reason": "High-risk rerouting operation",
    "requested_at": "..."
  }
}
```

LangGraph can pause the workflow.

Later:

```text
Human Approval
      ↓
Persist Decision
      ↓
Reauthorize
      ↓
Resume Workflow
```

The state must survive the waiting period.

---

# 24. Async Long-Running Execution

For long-running tasks:

```text
SUBMITTED
   ↓
ACCEPTED
   ↓
WORKING
   ↓
PROGRESS
   ↓
WAITING
   ↓
WORKING
   ↓
COMPLETED
```

Service Bus can carry asynchronous messages:

```text
Coordinator
     │
     ▼
Service Bus
     │
     ▼
Delegator
     │
     ▼
Worker
```

While Cosmos DB maintains durable execution state.

This separation is important:

```text
Service Bus = Message Delivery
Cosmos DB   = Durable State
LangGraph   = Workflow Control
```

---

# 25. Completion

When all required work is complete:

```text
Worker Results
      ↓
Delegator Aggregation
      ↓
Coordinator Aggregation
      ↓
Response Validation
      ↓
Workflow COMPLETED
```

Example:

```json
{
  "workflow_id": "WF-1001",
  "status": "COMPLETED",

  "completed_at": "2026-09-06T16:20:00Z",

  "result_reference": "RESULT-WF-1001",

  "execution_summary": {
    "tasks": 3,
    "successful": 3,
    "failed": 0
  }
}
```

---

# 26. Completion Is More Than "Done"

A production workflow should capture:

```text
Final status
Completion time
Duration
Final result
Participating agents
Prompt/model versions
Important tool calls
Warnings
Failures/retries
Approval decisions
Evidence references
```

This enables:

* audit
* debugging
* reproducibility
* compliance
* operational analytics

---

# 27. Failure Completion

Not every workflow ends successfully.

Possible terminal states:

```text
COMPLETED
FAILED
CANCELLED
REJECTED
TIMED_OUT
ABORTED
```

For example:

```json
{
  "workflow_id": "WF-1001",
  "status": "FAILED",

  "failure": {
    "code": "NO_ELIGIBLE_AGENT",
    "retryable": false,
    "message": "No authorized healthy agent supports shipment analysis."
  },

  "completed_at": "2026-09-06T16:21:00Z"
}
```

---

# 28. Cancellation

Cancellation is different from failure.

```text
Failure
   → system could not complete

Cancellation
   → execution was intentionally stopped
```

For example:

```text
User
 ↓
Cancel
 ↓
Coordinator
 ↓
Cancel Workflow
 ↓
Delegator
 ↓
Cancel Tasks
 ↓
Workers stop accepting new work
```

The state becomes:

```text
CANCELLING
    ↓
CANCELLED
```

Running Workers should support graceful termination where possible.

---

# 29. Cleanup

Once execution reaches a terminal state, temporary state can be cleaned.

Potential cleanup:

```text
Temporary Redis context
Temporary locks
Temporary queues
Temporary files
Ephemeral Worker state
Temporary checkpoints
Transient cache entries
```

But don't delete everything immediately.

For example:

```text
Workflow State
     │
     ├── Required for recovery? → Retain
     ├── Audit-required?        → Retain
     ├── Temporary?             → Cleanup
     └── Large artifact?        → Archive/reference
```

---

# 30. Cleanup Must Be Idempotent

A cleanup operation may itself fail.

Therefore:

```text
cleanup()
cleanup()
cleanup()
```

should produce the same final state.

For example:

```python
def cleanup_workflow(workflow_id):
    delete_temp_redis_state(workflow_id)
    release_locks(workflow_id)
    remove_ephemeral_artifacts(workflow_id)
```

Each operation should tolerate an already-cleaned resource.

---

# 31. Retention

After completion, the state enters a retention period.

For example:

```text
COMPLETED
   ↓
ACTIVE RETENTION
   ↓
LONG-TERM RETENTION
   ↓
ARCHIVE
   ↓
EXPIRATION
```

Retention depends on:

* business requirements
* compliance
* data classification
* audit requirements
* privacy requirements
* legal requirements
* operational value

Do not use one universal TTL for all execution data.

---

# 32. Archival

Older execution data can be moved to lower-cost storage.

Example:

```text
Cosmos DB
   │
   │ active operational state
   ▼
Archive Pipeline
   │
   ▼
Azure Blob Storage / Data Lake
```

The archived record might contain:

```json
{
  "workflow_id": "WF-1001",
  "correlation_id": "CORR-7890",

  "status": "COMPLETED",

  "created_at": "...",
  "completed_at": "...",

  "execution_summary": {
    "tasks": 3,
    "runs": 4,
    "retries": 1
  },

  "result_reference": "ARCHIVE-RESULT-1001"
}
```

Large raw execution data should not necessarily remain in the hot operational database.

---

# 33. Archival vs Observability

These are different.

```text
Execution State
    ↓
"What is the current/authoritative execution record?"

Observability
    ↓
"What happened operationally?"

Archive
    ↓
"What historical record must we retain?"
```

For example:

```text
Cosmos DB
 → workflow state

Application Insights / OpenTelemetry
 → traces and telemetry

Blob/Data Lake
 → historical artifacts
```

---

# 34. Expiration

Eventually, execution data reaches the end of its retention period.

```text
Retention Expired
       ↓
Policy Check
       ↓
Legal Hold?
   ├── Yes → Retain
   └── No
       ↓
Delete / Anonymize
       ↓
Record Deletion Event
```

This is important for data governance.

Expiration should not simply mean:

```text
TTL = delete everything blindly
```

Instead:

```text
Expiration =
Retention Policy
+ Data Classification
+ Legal/Compliance Rules
+ Business Requirements
+ Deletion Verification
```

---

# 35. Complete State Machine

A useful CWD workflow state machine is:

```text
                     ┌──────────────┐
                     │    CREATED   │
                     └──────┬───────┘
                            ▼
                     ┌──────────────┐
                     │ INITIALIZING │
                     └──────┬───────┘
                            ▼
                     ┌──────────────┐
                     │   PLANNING   │
                     └──────┬───────┘
                            ▼
                     ┌──────────────┐
                     │  DELEGATING  │
                     └──────┬───────┘
                            ▼
                     ┌──────────────┐
                     │   EXECUTING  │
                     └──────┬───────┘
                            │
                 ┌──────────┼──────────┐
                 │          │          │
                 ▼          ▼          ▼
             WAITING     RETRYING    FAILED
                 │          │
                 │          └──────┐
                 │                 │
                 ▼                 ▼
              APPROVED          EXECUTING
                 │
                 ▼
              EXECUTING
                 │
                 ▼
             AGGREGATING
                 │
                 ▼
             VALIDATING
                 │
                 ▼
             COMPLETED
                 │
                 ▼
              CLEANUP
                 │
                 ▼
              RETAINED
                 │
                 ▼
              ARCHIVED
                 │
                 ▼
              EXPIRED
```

---

# 36. Event-Driven State Updates

A useful architecture is to generate execution events:

```text
WorkflowCreated
WorkflowInitialized
TaskCreated
TaskAssigned
RunStarted
StepStarted
ToolCalled
ToolCompleted
StepCompleted
TaskCompleted
TaskFailed
RetryRequested
AgentReassigned
ApprovalRequested
ApprovalGranted
WorkflowCompleted
WorkflowFailed
WorkflowCancelled
WorkflowArchived
WorkflowExpired
```

For example:

```json
{
  "event_id": "EVT-1001",
  "event_type": "STEP_COMPLETED",

  "correlation_id": "CORR-7890",
  "workflow_id": "WF-1001",
  "task_id": "WT-1001",
  "run_id": "RUN-003",
  "step_id": "STEP-003",

  "timestamp": "2026-09-06T16:14:02Z"
}
```

This gives CWD a complete execution lineage.

---

# 37. Snapshot + Event Model

A strong production pattern is:

```text
Events
  │
  ▼
State Processor
  │
  ├───────────────┐
  ▼               ▼
Current Snapshot  Event History
```

For example:

```text
Cosmos DB
 ├── Workflow Snapshot
 ├── Task Snapshot
 ├── Run Snapshot
 └── Step Snapshot

Observability/Event Store
 └── Execution Events
```

The snapshot answers:

> What is the current state?

The event history answers:

> How did it get there?

---

# 38. Recovery After a Crash

Suppose:

```text
Worker
  ↓
STEP-004 RUNNING
  ↓
Container crashes
```

Because state was persisted:

```text
Cosmos DB
   │
   └── STEP-004 = RUNNING
```

The recovery manager can determine:

```text
Was the Worker actually executing?
Did the operation complete?
Can it safely retry?
Is it idempotent?
Has the deadline expired?
```

Then:

```text
Recover
  ↓
Reconcile
  ↓
Retry / Resume / Fail
```

This is why durable execution state is essential.

---

# 39. Exactly-Once Is Usually Not Assumed

Distributed systems can produce duplicate messages or retries.

Therefore CWD should design for:

```text
At-least-once delivery
+
Idempotent operations
+
Duplicate detection
```

For example:

```text
message_id
task_id
run_id
idempotency_key
```

can prevent duplicate business operations.

Especially important for:

```text
Create order
Submit payment
Update shipment
Send notification
Change production configuration
```

---

# 40. State Consistency Across CWD

Consider:

```text
Coordinator
     │
     ▼
Delegator
     │
     ▼
Worker
```

Each component has local state.

But the system needs shared identifiers:

```text
correlation_id
workflow_id
task_id
run_id
step_id
```

Therefore:

```text
Local State
   +
Shared Execution Identity
   +
Durable Persistence
   =
Distributed Execution Consistency
```

Not every field needs to be globally shared.

---

# 41. State Security

Execution state can contain highly sensitive information.

It may include:

* user identity references
* business data
* tool outputs
* RAG references
* workflow decisions
* agent information
* security metadata

Therefore:

```text
Execution State Security
=
Authentication
+ Authorization
+ Encryption
+ Tenant Isolation
+ Data Classification
+ Retention
+ Access Logging
+ Least Privilege
```

Never assume:

> "It is only execution state, so it doesn't need protection."

---

# 42. State Cleanup by Data Type

A useful policy might look like:

| Data                    | Typical Treatment   |
| ----------------------- | ------------------- |
| Active workflow state   | Hot storage         |
| Active task state       | Hot storage         |
| Run state               | Hot + retention     |
| Step snapshot           | Retention-dependent |
| Redis session state     | TTL                 |
| Large artifacts         | Object storage      |
| Audit records           | Long retention      |
| Raw tool payloads       | Minimize/TTL        |
| Temporary locks         | Short TTL           |
| Cache                   | TTL                 |
| Historical summaries    | Archive             |
| Expired transient state | Delete              |

Exact retention periods should come from enterprise policy rather than being hardcoded into the architecture.

---

# 43. Cosmos DB's Role

In this lifecycle, Cosmos DB can act as the durable operational state layer:

```text
                 Cosmos DB
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
     Sessions     Workflows      Tasks
                                   │
                         ┌─────────┴─────────┐
                         ▼                   ▼
                       Runs                Steps
```

It can maintain the durable state needed by independently deployed CWD services.

For temporary state:

```text
Redis
```

For message delivery:

```text
Azure Service Bus
```

For workflow control:

```text
LangGraph
```

For knowledge:

```text
RAG / Azure AI Search
```

For telemetry:

```text
OpenTelemetry / Azure Monitor
```

---

# 44. Full End-to-End Example

Consider:

> "Why is shipment SHIP123 delayed?"

### Step 1 — Request

```text
User
 ↓
Gateway
```

Creates:

```text
Session
Turn
Correlation ID
```

---

### Step 2 — Workflow Creation

```text
Coordinator
 ↓
WF-1001 CREATED
```

---

### Step 3 — Initialization

```text
Intent = root_cause_analysis
Domain = logistics
```

---

### Step 4 — Delegation

```text
Coordinator
 ↓
Shipping Delegator
```

Creates:

```text
WT-1001
WT-1002
WT-1003
```

---

### Step 5 — Worker Assignment

```text
Agent Registry
 ↓
tracking-worker
carrier-worker
delay-analysis-worker
```

---

### Step 6 — Execution

```text
Tracking Worker
 ↓
MCP
 ↓
Carrier API
 ↓
Result
```

---

### Step 7 — Failure

Suppose carrier API times out:

```text
WT-1002
 ↓
RUN-001
 ↓
STEP-003
 ↓
TIMEOUT
```

---

### Step 8 — Retry

```text
Classify timeout
 ↓
Retryable = true
 ↓
RUN-002
 ↓
Alternate Worker
```

---

### Step 9 — Aggregation

```text
Tracking Result
+
Carrier Result
+
Delay Analysis
      ↓
Delegator
      ↓
Domain Result
```

---

### Step 10 — Coordinator

```text
Delegator Result
       ↓
Coordinator
       ↓
Final Validation
```

---

### Step 11 — Completion

```text
WF-1001
   ↓
COMPLETED
```

---

### Step 12 — Cleanup

```text
Redis temporary context → expire
Locks → release
Temporary artifacts → delete
```

---

### Step 13 — Retention

```text
Cosmos operational state
       ↓
Retention period
```

---

### Step 14 — Archive

```text
Historical workflow
       ↓
Blob/Data Lake
```

---

### Step 15 — Expiration

```text
Retention expired
       ↓
Policy validation
       ↓
Delete/anonymize
       ↓
Deletion audit
```

---

# 45. Complete CWD Execution-State Architecture

```text
                         USER
                           │
                           ▼
                       GATEWAY
                           │
                    Identity/Session
                           │
                           ▼
                     COORDINATOR
                           │
                    Create Workflow
                           │
                           ▼
                    ┌───────────────┐
                    │   LangGraph   │
                    │ Workflow State│
                    └───────┬───────┘
                            │
                  Context Projection
                            │
                            ▼
                       DELEGATOR
                            │
                      Create Tasks
                            │
                            ▼
                        WORKERS
                            │
                   ┌────────┴────────┐
                   ▼                 ▼
                  RAG               MCP
                   │                 │
                   ▼                 ▼
              Knowledge        Enterprise APIs
                   │                 │
                   └────────┬────────┘
                            ▼
                         RESULTS
                            │
                            ▼
                      AGGREGATION
                            │
                            ▼
                       COORDINATOR
                            │
                            ▼
                        COMPLETION
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
             CLEANUP                 RETENTION
                │                       │
                ▼                       ▼
             Redis TTL                Cosmos DB
                                        │
                                        ▼
                                     ARCHIVE
                                        │
                                        ▼
                                     EXPIRE
```

Supporting services:

```text
              ┌──────────────────────────────┐
              │        EXECUTION STATE       │
              └──────────────────────────────┘

     Redis          → Working / temporary state
     Cosmos DB      → Durable operational state
     Service Bus    → Durable asynchronous messages
     LangGraph      → Workflow transitions/checkpoints
     Agent Registry → Agent discovery/routing
     Policy/IAM     → Authorization
     MCP            → Tool/system execution
     RAG            → Enterprise knowledge
     Blob/Data Lake → Large artifacts/archive
     Observability  → Events/traces/metrics/logs
```

---

# 46. Responsibilities by Component

| Component      | State Responsibility                |
| -------------- | ----------------------------------- |
| Gateway        | Request/session/identity            |
| Coordinator    | Enterprise workflow state           |
| Delegator      | Domain/task orchestration state     |
| Worker         | Specialized execution state         |
| LangGraph      | Workflow state and transitions      |
| Redis          | Temporary working state             |
| Cosmos DB      | Durable application/execution state |
| Service Bus    | Message delivery state              |
| Agent Registry | Agent operational metadata          |
| Policy/IAM     | Authorization decisions             |
| RAG            | Retrieval context/evidence          |
| MCP            | Tool execution boundary             |
| Observability  | Telemetry/event history             |
| Archive        | Historical retention                |
| Governance     | Retention/expiration rules          |

---

# 47. State Lifecycle Formula

A useful architecture formula is:

```text
CWD Execution State Lifecycle
=
Creation
+ Initialization
+ State Updates
+ Durable Persistence
+ Context Propagation
+ Task/Run/Step Tracking
+ Checkpointing
+ Retry
+ Recovery
+ Completion
+ Failure Handling
+ Cleanup
+ Retention
+ Archival
+ Expiration
+ Auditability
```

A more operational formulation:

```text
Execution State
=
Current Snapshot
+
Execution Lineage
+
Recovery Information
+
Correlation Metadata
+
Security Context
+
Lifecycle Metadata
```

---

# 48. The Most Important Design Principle

Think of CWD execution state as having **three layers**:

```text
┌───────────────────────────────────────┐
│  1. ACTIVE EXECUTION STATE            │
│  LangGraph + Redis + Cosmos           │
│                                       │
│  "What is happening now?"             │
└───────────────────┬───────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│  2. EXECUTION HISTORY                 │
│  Events + Observability + Audit        │
│                                       │
│  "What happened?"                     │
└───────────────────┬───────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│  3. HISTORICAL RECORD                 │
│  Archive / Data Lake                  │
│                                       │
│  "What must we retain?"              │
└───────────────────────────────────────┘
```

This separation prevents operational databases from becoming permanent telemetry stores and prevents workflow engines from becoming long-term data warehouses.

---

# 49. Interview-Ready Answer

> **The CWD execution-state lifecycle starts when the Gateway accepts an authenticated and authorized request and the Coordinator creates a correlated session, turn, and workflow state. The workflow is initialized with intent, domain, constraints, security context, required capabilities, and execution metadata. LangGraph manages active workflow transitions and checkpoints, while durable storage such as Cosmos DB persists workflow, task, run, and step state so execution can recover across service or Worker failures. Context is selectively projected from Coordinator to Delegator and Worker rather than sharing the entire state. As execution progresses, task, run, and step states are updated and correlated through identifiers such as correlation ID, workflow ID, task ID, run ID, and step ID. Failures are classified as transient, permanent, policy, timeout, or business failures, and retryable operations can create new runs or be reassigned to healthy agents while preserving previous execution history. Human approval and asynchronous execution are represented as durable waiting states. When all required work succeeds, CWD aggregates and validates results and marks the workflow completed; otherwise it records failed, cancelled, rejected, or timed-out terminal state. Temporary Redis state, locks, and artifacts are then cleaned up according to policy. Durable execution records remain under retention policies, older records can be archived to lower-cost storage, and eventually data is expired or deleted according to security, compliance, and governance requirements.**

---

# 50. Final Definition

> **CWD execution-state lifecycle is the governed end-to-end management of distributed workflow state from creation and initialization through execution, state updates, durable persistence, context propagation, task/run/step tracking, checkpointing, retries, recovery, asynchronous waiting, completion or failure, cleanup, retention, archival, and eventual expiration. It enables independently deployed Coordinator, Delegator, and Worker services to maintain correlated, recoverable, secure, and auditable execution without relying on transient in-memory state.**

### Final Mental Model

```text
CREATE
  ↓
INITIALIZE
  ↓
PERSIST
  ↓
PROPAGATE
  ↓
EXECUTE
  ↓
UPDATE
  ↓
CHECKPOINT
  ↓
 ┌───────────────┐
 │ Success?      │
 └───────┬───────┘
     No  │  Yes
     │   │
     ▼   ▼
  RETRY  COMPLETE
     │     │
     ▼     ▼
 RECOVER  CLEANUP
     │     │
     └──┐  ▼
        │ RETAIN
        │  ↓
        │ ARCHIVE
        │  ↓
        └→ EXPIRE
```

**In one sentence:**

> **CWD execution state is the durable control record that lets the platform know where execution is, what has happened, what should happen next, how to recover from failure, and when the execution record can safely be cleaned up, archived, or expired.**
