Yes. In CWD, the **Task ID is the execution-level identity of a logical objective**. It follows that objective as it moves through Coordinator → Delegator → Worker, and it lets the platform answer:

> **“What specific piece of work are we trying to accomplish, and what happened to it?”**

# Task ID in CWD

## 1. What is a Task ID?

A **Task ID** uniquely identifies a logical business or technical objective within a CWD workflow.

Example:

```text
Task ID = WT-1001
```

The task might mean:

> “Retrieve the tracking events for shipment SHIP123.”

The Task ID stays associated with that objective even when the work passes through different agents or Worker instances.

```text
Coordinator
    │
    │ Task WT-1001
    ▼
Delegator
    │
    │ Task WT-1001
    ▼
Worker
    │
    │ Task WT-1001
    ▼
MCP → Enterprise API
```

The important point is:

> **The Task ID identifies the logical work, not the physical service instance executing it.**

---

# 2. Task ID vs other CWD IDs

The CWD identity hierarchy becomes:

```text
Session
   │
   └── Conversation
          │
          └── Turn
                │
                └── Correlation ID
                       │
                       └── Workflow
                              │
                              ├── Task A
                              │     └── Run
                              │           └── Step
                              │
                              └── Task B
                                    └── Run
                                          └── Step
```

The easiest distinction:

| ID                | Meaning                         |
| ----------------- | ------------------------------- |
| `session_id`      | Broader user interaction        |
| `conversation_id` | Conversation                    |
| `turn_id`         | One conversational turn         |
| `correlation_id`  | One end-to-end business request |
| `workflow_id`     | Overall workflow execution      |
| **`task_id`**     | **One logical objective**       |
| `run_id`          | One attempt to execute the task |
| `step_id`         | One action within that run      |
| `message_id`      | One communication message       |
| `tool_call_id`    | One tool invocation             |

So:

```text
Correlation = request
Task        = objective
Run         = attempt
Step        = action
```

---

# 3. Why Task ID is needed

Consider this user request:

> “Why is shipment SHIP123 delayed?”

The Coordinator may create a workflow:

```text
WF-1001
```

The Delegator decomposes it:

```text
WF-1001
 │
 ├── WT-1001 → Get tracking events
 ├── WT-1002 → Check carrier status
 └── WT-1003 → Analyze possible route constraints
```

Each is a separate logical objective.

The Task ID allows CWD to track them independently.

```text
CORR-7890
     │
     └── WF-1001
           │
           ├── WT-1001 → completed
           ├── WT-1002 → completed
           └── WT-1003 → failed
```

The Coordinator can therefore determine exactly which part of the workflow succeeded or failed.

---

# 4. Task ID follows the logical objective

Suppose:

```text
WT-1001
```

is assigned to:

```text
tracking-worker-v2
```

The Worker fails.

The Delegator selects another Worker:

```text
tracking-worker-v3
```

The logical task is still:

```text
WT-1001
```

not:

```text
WT-1002
```

because the objective did not change.

```text
WT-1001
   │
   ├── Worker v2 → failed
   │
   └── Worker v3 → success
```

This is a critical distinction between **logical task identity** and **execution attempt identity**.

---

# 5. Task ID and Run ID

This is one of the most important concepts.

A task can have multiple runs:

```text
Task WT-1001
   │
   ├── RUN-001 → timeout
   ├── RUN-002 → MCP failure
   └── RUN-003 → success
```

Therefore:

```text
Task ID = WT-1001
```

means:

> What are we trying to accomplish?

While:

```text
Run ID = RUN-003
```

means:

> Which attempt successfully accomplished it?

This gives CWD a clean retry model:

```text
Task
  │
  ├── Run 1
  ├── Run 2
  └── Run 3
```

---

# 6. Coordinator's use of Task ID

The Coordinator works at the enterprise orchestration level.

It may create or receive:

```json id="l04r0u"
{
  "task_id": "DT-5001",
  "correlation_id": "CORR-7890",
  "workflow_id": "WF-1001",
  "source_agent": "coordinator",
  "target_agent": "shipping-delegator",
  "objective": "Investigate shipment delay",
  "required_capability": "shipment_delay_analysis"
}
```

The Coordinator uses the Task ID to:

* track delegated work
* monitor status
* associate results
* detect timeouts
* track failures
* correlate retries
* enforce deadlines
* aggregate Delegator results
* determine workflow progress.

---

# 7. Delegator's use of Task ID

The Delegator receives:

```text
DT-5001
```

and decomposes it.

```text
DT-5001
 │
 ├── WT-1001
 ├── WT-1002
 └── WT-1003
```

The parent-child relationship is important:

```json id="f5cs5x"
{
  "task_id": "WT-1001",
  "parent_task_id": "DT-5001",
  "correlation_id": "CORR-7890",
  "workflow_id": "WF-1001"
}
```

This creates a task tree.

```text
DT-5001
 │
 ├── WT-1001
 ├── WT-1002
 └── WT-1003
```

The Delegator can then determine:

```text
3 tasks
2 successful
1 failed
```

and return an aggregated domain result.

---

# 8. Worker use of Task ID

The Worker receives a specific task:

```json id="2w7n0y"
{
  "task_id": "WT-1001",
  "parent_task_id": "DT-5001",
  "correlation_id": "CORR-7890",
  "objective": "Retrieve shipment tracking events",
  "required_capability": "shipment_tracking",
  "input": {
    "shipment_id": "SHIP123"
  }
}
```

The Worker uses the Task ID to associate:

```text
Input
 ↓
Validation
 ↓
RAG/tool calls
 ↓
Business logic
 ↓
Validation
 ↓
Result
```

with:

```text
WT-1001
```

---

# 9. Task lifecycle

A production CWD Task ID should have a lifecycle.

For example:

```text
CREATED
   ↓
QUEUED
   ↓
ASSIGNED
   ↓
RUNNING
   ↓
WAITING
   ↓
RETRYING
   ↓
RUNNING
   ↓
COMPLETED
```

Failure paths:

```text
RUNNING
   │
   ├── retryable failure → RETRYING
   │                         ↓
   │                      RUNNING
   │
   ├── permanent failure → FAILED
   │
   ├── deadline exceeded → TIMED_OUT
   │
   ├── user/system cancel → CANCELLED
   │
   └── approval required → WAITING_FOR_APPROVAL
```

The exact states are contract-specific, but the principle is the same:

> **Task state describes where the logical objective is in its lifecycle.**

---

# 10. Example Task state

A CWD task record could look like:

```json id="bq1v6k"
{
  "task_id": "WT-1001",
  "parent_task_id": "DT-5001",

  "correlation_id": "CORR-7890",
  "workflow_id": "WF-1001",

  "source_agent": "shipping-delegator",
  "target_agent": "tracking-worker",

  "objective": "Retrieve shipment tracking events",

  "required_capability": "shipment_tracking",

  "input": {
    "shipment_id": "SHIP123"
  },

  "constraints": {
    "priority": "high",
    "timeout_ms": 5000
  },

  "assigned_agent": {
    "agent_id": "tracking-worker",
    "version": "2.4.1"
  },

  "dependencies": [],

  "status": "completed",

  "run_ids": [
    "RUN-001",
    "RUN-002"
  ],

  "result_reference": "RESULT-1001",

  "errors": [],

  "completion": {
    "completed_at": "2026-09-06T20:10:00Z"
  }
}
```

This record is enough to understand the task without storing every low-level telemetry event inside the task document.

---

# 11. Task dependencies

Tasks often depend on other tasks.

For example:

```text
WT-1001
Get tracking events
       │
       ▼
WT-1002
Analyze delay
       │
       ▼
WT-1003
Recommend action
```

CWD can represent:

```text
WT-1001 → WT-1002 → WT-1003
```

Or parallel tasks:

```text
              ┌── WT-1001 ──┐
              │              │
Start ────────┼── WT-1002 ──┼──> WT-1004
              │              │
              └── WT-1003 ──┘
```

The Delegator/LangGraph can determine:

> Which tasks can run now?

and:

> Which tasks must wait?

---

# 12. Task ID and LangGraph

LangGraph can maintain task information inside workflow state:

```python id="l4j9b6"
state = {
    "correlation_id": "CORR-7890",
    "workflow_id": "WF-1001",

    "task_id": "WT-1001",

    "status": "running",
    "attempt": 2
}
```

A graph can then route based on task state:

```text
Task Started
     │
     ▼
Execute
     │
     ├── success ──────→ Complete
     │
     ├── retryable ────→ Retry
     │
     ├── approval ─────→ Human Review
     │
     └── permanent ────→ Recovery/Failure
```

So:

**Task ID identifies the work; LangGraph determines what happens next.**

---

# 13. Task ID and Service Bus

When a task is delivered asynchronously:

```text
Delegator
    │
    │ Task WT-1001
    ▼
Azure Service Bus
    │
    ▼
Worker
```

The message should carry:

```json id="v7gspk"
{
  "message_id": "MSG-10001",
  "correlation_id": "CORR-7890",
  "workflow_id": "WF-1001",
  "task_id": "WT-1001",
  "parent_task_id": "DT-5001",
  "source_agent": "shipping-delegator",
  "target_agent": "tracking-worker"
}
```

This allows asynchronous delivery to remain connected to the logical task.

---

# 14. Task ID and A2A

At the Coordinator → Delegator boundary:

```text
Coordinator
     │
     │ A2A
     │ task_id = DT-5001
     ▼
Shipping Delegator
```

The Delegator might return:

```json id="y8x3e7"
{
  "task_id": "DT-5001",
  "correlation_id": "CORR-7890",
  "status": "completed",

  "result": {
    "shipment_status": "delayed",
    "root_cause": "carrier_capacity"
  }
}
```

The Coordinator knows exactly which delegated objective produced that result.

---

# 15. Task ID and MCP

The Worker may call several tools while executing one task:

```text
WT-1001
   │
   ├── get_tracking_events
   ├── get_carrier_status
   └── get_route_constraints
```

Each tool call has its own identifier:

```text
TOOL-001
TOOL-002
TOOL-003
```

but all belong to:

```text
WT-1001
```

So:

```text
Task
 │
 ├── Tool Call 1
 ├── Tool Call 2
 └── Tool Call 3
```

This lets you answer:

> Which tools contributed to this task?

---

# 16. Task ID and RAG

Similarly, one RAG operation can belong to a task:

```text
WT-1002
   │
   ├── Query rewrite
   ├── Embedding
   ├── Azure AI Search
   ├── Security filtering
   ├── Reranking
   └── Context construction
```

All of these can be associated with:

```text
task_id = WT-1002
```

This enables task-level analysis such as:

```text
Task WT-1002
──────────────────────
Retrieved candidates: 30
Authorized:            12
Selected:               5
Reranking:               4
LLM context:             4
Latency:              2.4 sec
```

---

# 17. Task-level monitoring

Task ID becomes a powerful monitoring dimension.

For example:

```text
Task Metrics

WT-1001
Status: COMPLETED
Duration: 1.2 sec
Attempts: 1
Worker: tracking-worker
Tools: 1

WT-1002
Status: COMPLETED
Duration: 3.8 sec
Attempts: 1
Worker: rag-worker
Tools: 0

WT-1003
Status: FAILED
Duration: 5.0 sec
Attempts: 3
Worker: route-worker
Error: dependency_timeout
```

Now operations teams can determine:

* task success rate
* task failure rate
* task latency
* retry rate
* timeout rate
* Worker utilization
* tool usage
* cost
* task-level quality.

---

# 18. Task-level debugging

Suppose the final workflow failed.

Instead of searching thousands of logs, start with:

```text
task_id = WT-1003
```

Then reconstruct:

```text
WT-1003
 │
 ├── RUN-001
 │     └── STEP-001 → API timeout
 │
 ├── RUN-002
 │     └── STEP-001 → API timeout
 │
 └── RUN-003
       └── STEP-001 → authorization failure
```

Now you know:

```text
Logical problem = WT-1003
```

and:

```text
Execution problems =
timeout + timeout + authorization failure
```

This is much more useful than simply seeing:

```text
Workflow FAILED
```

---

# 19. Task ID enables lifecycle analysis

You can analyze the complete lifecycle:

```text
Task Created
     ↓
Queue Wait
     ↓
Agent Selected
     ↓
Worker Started
     ↓
Tool/RAG/LLM Execution
     ↓
Validation
     ↓
Completed
```

Measure:

```text
Task lifecycle latency
=
Queue Wait
+
Execution
+
Retries
+
Validation
```

You can then identify whether a task is slow because of:

* queueing
* Worker selection
* LLM
* RAG
* MCP
* downstream API
* retry
* validation.

---

# 20. Task ID and business outcome

A task should ultimately connect technical execution to a business objective.

For example:

```text
Task:
WT-1001

Objective:
Retrieve shipment tracking events

Business object:
SHIP123

Result:
Shipment delayed

Business outcome:
Provide delay evidence to Coordinator
```

This is important because:

> **Technical success is not always business success.**

For example:

```text
HTTP 200
   ↓
Tool technically succeeded
   ↓
Wrong shipment data
   ↓
Business task failed
```

Therefore CWD should evaluate:

```text
Task Execution Success
+
Result Validity
+
Business Objective Achievement
```

---

# 21. Task ID and partial failure

Multi-agent workflows often produce partial results.

```text
DT-5001
 │
 ├── WT-1001 → SUCCESS
 ├── WT-1002 → SUCCESS
 └── WT-1003 → FAILED
```

The Delegator might return:

```json id="13r6vn"
{
  "task_id": "DT-5001",
  "status": "partial",

  "worker_summary": {
    "total": 3,
    "successful": 2,
    "failed": 1
  }
}
```

The Coordinator can then decide:

```text
Partial result
     │
     ├── Continue
     ├── Retry failed task
     ├── Select alternate Worker
     ├── Ask user
     └── Escalate
```

Task IDs make this selective recovery possible.

---

# 22. Task ID and observability

A typical telemetry event might contain:

```json id="lh2e9v"
{
  "timestamp": "2026-09-06T20:10:00Z",

  "correlation_id": "CORR-7890",
  "workflow_id": "WF-1001",

  "task_id": "WT-1001",
  "parent_task_id": "DT-5001",

  "run_id": "RUN-003",
  "step_id": "STEP-007",

  "agent_id": "tracking-worker",
  "agent_version": "2.4.1",

  "event": "TASK_COMPLETED",

  "status": "success",
  "duration_ms": 1240
}
```

Searching:

```text
task_id = WT-1001
```

can reconstruct the complete task execution.

Searching:

```text
correlation_id = CORR-7890
```

can reconstruct the entire business request.

---

# 23. Task ID and auditability

Task-level audit records can answer:

```text
WHO?
Which agent/identity executed it?

WHAT?
What objective was executed?

WHEN?
When did it start/end?

WHICH?
Which Worker/version/tool?

WHY?
Which workflow/request caused it?

AUTHORIZED?
Which policy allowed/denied it?

RESULT?
What was the outcome?
```

For example:

```json id="bqng5q"
{
  "event_type": "TASK_COMPLETED",

  "correlation_id": "CORR-7890",
  "workflow_id": "WF-1001",
  "task_id": "WT-1001",
  "run_id": "RUN-003",

  "agent_id": "tracking-worker",
  "agent_version": "2.4.1",

  "authorization": {
    "decision": "ALLOW",
    "policy_id": "SHIP-READ-001"
  },

  "status": "SUCCESS"
}
```

---

# 24. Task ID and cost

Task IDs also enable cost attribution.

Suppose:

```text
WT-1001
 │
 ├── LLM → $0.02
 ├── RAG → $0.005
 ├── MCP → $0.003
 └── Compute → $0.01
```

Then:

```text
Task Cost
=
LLM
+
RAG
+
Tool
+
Compute
+
Messaging
+
Other attributed costs
```

This enables:

```text
Cost per Task
Cost per Workflow
Cost per Agent
Cost per Business Outcome
```

---

# 25. Task ID and dynamic Worker selection

The logical task remains stable even if Worker assignment changes.

```text
WT-1001
    │
    ├── Worker A → unavailable
    │
    ├── Worker B → overloaded
    │
    └── Worker C → selected
```

Agent Registry determines eligible Workers.

The Router selects one.

The Task ID remains:

```text
WT-1001
```

This separates:

```text
Logical Objective
       ≠
Physical Execution Instance
```

That's essential for scalable Worker pools.

---

# 26. Task ID and security

Task ID should also be associated with the security context:

```text
Task
 │
 ├── User identity
 ├── Tenant
 ├── Agent identity
 ├── Scope
 ├── Required capability
 ├── Resource
 └── Authorization decision
```

But again:

> **Task ID itself does not grant permission.**

Knowing:

```text
WT-1001
```

must not allow another agent or user to retrieve the task.

CWD still checks:

```text
Identity
+
Tenant
+
Role
+
Permission
+
Scope
+
Resource ACL
+
Policy
```

---

# 27. Task state vs Run state vs Step state

This distinction is very important for an architect.

```text
TASK
"What objective are we executing?"

       ↓

RUN
"Which attempt are we executing?"

       ↓

STEP
"What action are we executing?"
```

Example:

```text
WT-1001
Retrieve shipment events
       │
       ├── RUN-001
       │     ├── STEP-001 Validate
       │     └── STEP-002 MCP
       │
       └── RUN-002
             ├── STEP-003 Validate
             └── STEP-004 MCP
```

Task state persists the objective.

Run state records the attempt.

Step state records individual actions.

---

# 28. Complete CWD task architecture

```text
                         USER
                           │
                           ▼
                     Coordinator
                           │
                     CORR-7890
                           │
                      WF-1001
                           │
                           ▼
                      Delegator
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
           WT-1001      WT-1002      WT-1003
              │            │            │
              ▼            ▼            ▼
          Tracking       RAG        Analysis
           Worker        Worker       Worker
              │            │            │
             MCP       AI Search       LLM
              │            │            │
              └────────────┼────────────┘
                           │
                        Results
                           │
                           ▼
                      Delegator
                           │
                      DT-5001
                           │
                           ▼
                     Coordinator
                           │
                           ▼
                     Final Answer
```

The important lineage is:

```text
CORR-7890
    │
    └── WF-1001
          │
          └── DT-5001
                │
                ├── WT-1001
                │     ├── RUN-001
                │     └── RUN-002
                │
                ├── WT-1002
                │
                └── WT-1003
```

---

# 29. The four most important properties of Task ID

### 1. Identity

```text
What logical work is this?
```

### 2. Lineage

```text
Which parent task/request created it?
```

### 3. Lifecycle

```text
What is its current state?
```

### 4. Execution history

```text
Which runs, steps, Workers, tools, and results belong to it?
```

Together:

```text
Task ID
   ↓
Identity + Lineage + Lifecycle + Execution History
```

---

# 30. Core formula

```text
Task State
=
Task Identity
+
Objective
+
Parent Task
+
Correlation
+
Workflow
+
Input
+
Required Capability
+
Constraints
+
Assignment
+
Dependencies
+
Status
+
Runs
+
Intermediate Results
+
Errors
+
Completion
```

And the execution hierarchy is:

```text
Session
   ↓
Conversation
   ↓
Turn
   ↓
Correlation
   ↓
Workflow
   ↓
Task
   ↓
Run
   ↓
Step
   ↓
Tool / LLM / RAG / API
```

---

## Interview-ready answer

> **“In CWD, the Task ID represents a logical business or technical objective that must be completed. It remains stable as the task moves from Coordinator to Delegator to Worker and even if the task is retried or reassigned to another Worker. The Coordinator uses task IDs to monitor delegated objectives and workflow progress; the Delegator uses parent and child task IDs to decompose and aggregate domain work; and Workers use the task ID to associate validation, tool calls, RAG, LLM processing, and results with the correct objective. Each task can have multiple Run IDs representing different execution attempts and Step IDs representing individual actions. This hierarchy enables task-level monitoring, dependency management, targeted retries, failover, debugging, latency and cost analysis, auditability, and business-outcome evaluation. The Task ID identifies the logical work—it does not provide authorization.”**

### Core definition

**A Task ID in CWD is the unique identifier for a logical business or technical objective, maintained across Coordinator, Delegator, and Worker execution and linked to its parent request/workflow, execution attempts, steps, tools, results, errors, and lifecycle state. It provides the execution boundary required to monitor, debug, retry, reassign, aggregate, audit, and evaluate an individual piece of work independently of the physical agent instance executing it.**

### Mental model

```text
CORRELATION
   ↓
"What business request?"

WORKFLOW
   ↓
"What overall process?"

TASK
   ↓
"What specific objective?"

RUN
   ↓
"Which execution attempt?"

STEP
   ↓
"What specific action?"

RESULT
   ↓
"What happened?"
```
