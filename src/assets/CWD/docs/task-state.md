# Task-Level State in CWD

Task-level state represents one specific objective being executed by CWD. It records what must be done, what information is required, which agent or Worker is responsible, what dependencies exist, what has happened so far, and whether the task completed successfully.

> Task state answers: “What work is being executed, who is responsible, what is its current status, and what remains to be done?”

A task is narrower than a session and usually narrower than a workflow.

```
Session
   └── Workflow
         └── Task
               └── Execution attempt
                     └── Tool calls / intermediate results
```

## 1. Where task-level state fits

```
User Request
     │
     ▼
Coordinator
     │
     ▼
Workflow
     │
     ▼
Delegator
     │
     ├── Creates Task A
     ├── Creates Task B
     └── Creates Task C
             │
             ▼
       Task-Level State
             │
       ┌─────┼──────────────────────────┐
       ▼     ▼                          ▼
    Inputs  Assignment              Dependencies
       │     │                          │
       └─────┼──────────────────────────┘
             ▼
       Worker Execution
             │
       ┌─────┼──────────────────────┐
       ▼     ▼                      ▼
   Progress Results                Errors
             │
             ▼
       Task Validation
             │
             ▼
       Completed Task
             │
             ▼
       Parent Workflow
```

The task record is the durable coordination contract between the Delegator, Worker, workflow engine, and result-processing logic.

## 2. Task state versus related state

|
State type

|

Represents

|

Example

|
| --- | --- | --- |
|

Session state

|

Overall user interaction

|

User investigating shipment delays

|
|

Workflow state

|

Overall execution plan and next transition

|

Waiting for all investigation branches

|
|

Task state

|

One objective

|

Retrieve tracking events

|
|

Execution-attempt state

|

One attempt to execute a task

|

Attempt 2 after timeout

|
|

Short-term memory

|

Temporary information useful during execution

|

Recent tool output

|
|

Persistent memory

|

Information retained for future interactions

|

Approved user preference

|
|

Execution history

|

Historical record of events

|

Task started, retried, completed

|

### Example

```
Workflow: Investigate shipment delay
    │
    ├── Task 1: Retrieve tracking events
    ├── Task 2: Retrieve carrier status
    └── Task 3: Retrieve historical incidents
```

Each task has its own objective, inputs, assigned Worker, status, errors, and result.

## 3. Core components of task-level state

### 3.1 Task identity

Task identity connects the task to its parent execution.

JSON

```
{
  "taskId": "WT-1001",
  "parentTaskId": "DT-5001",
  "workflowId": "WF-1001",
  "sessionId": "S-1001",
  "correlationId": "CORR-7890"
}
```

|
Identifier

|

Purpose

|
| --- | --- |
|

`taskId`

|

Unique task identity

|
|

`parentTaskId`

|

Parent Delegator or composite task

|
|

`workflowId`

|

Workflow containing the task

|
|

`sessionId`

|

User interaction containing the workflow

|
|

`correlationId`

|

End-to-end business request

|
|

`executionId`

|

Specific execution run or attempt

|
|

`idempotencyKey`

|

Prevents duplicate processing

|

A task should never depend only on a human-readable name such as `tracking_lookup`. The unique task ID is required for correlation, retries, and recovery.

### 3.2 Task objective

The objective defines the expected business or technical outcome.

JSON

```
{
  "objective": {
    "capability": "shipment_tracking",
    "action": "retrieve_tracking_events",
    "description": "Retrieve the latest tracking events for shipment SHIP123",
    "successCriteria": [
      "Shipment is identified",
      "Latest tracking event is available",
      "Event timestamp is valid"
    ]
  }
}
```

A good task objective should be:

* Specific.

* Bounded.

* Measurable.

* Authorized.

* Independent of unnecessary implementation details.

* Clear about the expected output.

### Poor objective

```
Investigate everything about the shipment.
```

### Better objective

```
Retrieve the latest authorized tracking events for shipment SHIP123
and return the current status, location, timestamp, and source reference.
```

### 3.3 Task inputs

Inputs are the data required to execute the objective.

JSON

```
{
  "input": {
    "shipmentId": "SHIP123",
    "carrierCode": "CARRIER-A",
    "requestedTimeRange": {
      "from": "2026-09-01T00:00:00Z",
      "to": "2026-09-06T23:59:59Z"
    }
  }
}
```

Inputs may include:

* Business identifiers.

* User-provided parameters.

* Validated upstream results.

* Task constraints.

* Time ranges.

* Domain context.

* References to documents or artifacts.

* Authorization scope.

* Required output format.

### Input rule

> The Worker should receive validated, task-scoped inputs rather than the entire conversation or unrestricted workflow state.

### 3.4 Required capabilities

The task specifies what capability is needed, not necessarily which physical Worker instance should execute it.

JSON

```
{
  "requiredCapabilities": [
    "shipment_tracking",
    "carrier_api_access"
  ],
  "requiredTools": [
    "get_tracking_events"
  ],
  "constraints": {
    "environment": "production",
    "maxLatencyMs": 5000,
    "requiredVersion": ">=2.0.0"
  }
}
```

This allows the Agent Registry and routing layer to discover eligible agents dynamically.

```
Task requires capability
        ↓
Agent Registry
        ↓
Eligible agents
        ↓
Policy + health + readiness + version checks
        ↓
Selected agent / Worker
```

The task should not normally hardcode a specific physical container, IP address, or instance.

### 3.5 Assigned agents and Workers

Assignment records who is responsible for execution.

JSON

```
{
  "assignment": {
    "assignedAgent": "shipping-delegator",
    "assignedWorker": "tracking-worker",
    "workerInstance": "tracking-worker-instance-03",
    "assignmentReason": "Capability match and available capacity",
    "assignedAt": "2026-09-06T15:00:10Z"
  }
}
```

A useful distinction is:

|
Assignment level

|

Meaning

|
| --- | --- |
|

Target agent

|

Logical agent responsible for the task

|
|

Worker capability

|

Type of specialized execution required

|
|

Worker instance

|

Physical runtime instance selected for execution

|
|

Attempt

|

Specific execution try

|

The task remains logically associated with the capability even if execution is moved to another healthy Worker.

### 3.6 Dependencies

Dependencies define what must happen before a task can execute.

```
Task A: Retrieve tracking events
             │
             ▼
Task B: Analyze delay cause
             │
             ▼
Task C: Recommend action
```

Example:

JSON

```
{
  "dependencies": [
    {
      "taskId": "WT-1001",
      "dependencyType": "required",
      "condition": "completed"
    },
    {
      "taskId": "WT-1002",
      "dependencyType": "optional",
      "condition": "completed_or_failed"
    }
  ]
}
```

Common dependency types:

* Required: task cannot start until the dependency succeeds.

* Optional: task can continue even if the dependency fails.

* Data dependency: task needs the dependency’s result.

* Ordering dependency: task must execute after another task.

* Approval dependency: task requires human approval.

* Resource dependency: task requires a service, lock, or capacity.

### Dependency example

```
                    ┌── Tracking lookup ──┐
                    │                     │
Start ──────────────┤                     ├── Delay analysis
                    │                     │
                    └── Carrier status ───┘
                                              │
                                              ▼
                                      Action recommendation
```

LangGraph or another workflow engine controls dependency transitions. The task record stores the dependency information and current readiness.

## 4. Task status lifecycle

A task should have an explicit state machine.

```
CREATED
   ↓
SUBMITTED
   ↓
ACCEPTED
   ↓
QUEUED
   ↓
ASSIGNED
   ↓
RUNNING
   ├───────────────┐
   │               │
   ▼               ▼
WAITING        RETRYING
   │               │
   ▼               │
APPROVAL           │
   │               │
   └───────┬───────┘
           ▼
       COMPLETED
```

Failure paths:

```
RUNNING
   ├── Retryable failure → RETRYING → RUNNING
   ├── Permanent failure → FAILED
   ├── Timeout            → TIMED_OUT
   ├── Cancellation       → CANCELLED
   ├── Invalid input      → REJECTED
   └── Approval denied    → REJECTED / CANCELLED
```

Possible statuses:

|
Status

|

Meaning

|
| --- | --- |
|

`created`

|

Task record exists

|
|

`submitted`

|

Sent for execution

|
|

`accepted`

|

Target agent accepted it

|
|

`queued`

|

Waiting for capacity

|
|

`assigned`

|

Worker selected

|
|

`running`

|

Execution in progress

|
|

`waiting_for_dependency`

|

Required task not complete

|
|

`waiting_for_approval`

|

Human decision required

|
|

`retrying`

|

Retry scheduled

|
|

`completed`

|

Success criteria satisfied

|
|

`partial`

|

Some expected output available

|
|

`failed`

|

Execution failed

|
|

`timed_out`

|

Deadline exceeded

|
|

`cancelled`

|

Explicitly cancelled

|
|

`rejected`

|

Invalid or unauthorized

|
|

`expired`

|

No longer valid

|

The exact status vocabulary should be standardized across CWD services.

## 5. Intermediate results

Intermediate results are outputs produced before the task is complete.

Examples:

* Retrieved tracking events.

* API response references.

* Parsed document identifiers.

* Preliminary calculations.

* Validation results.

* Tool execution outputs.

* Partial analysis.

* Selected evidence.

* Temporary decisions.

Example:

JSON

```
{
  "intermediateResults": [
    {
      "step": "tracking_lookup",
      "status": "completed",
      "resultReference": "result-tracking-001",
      "summary": {
        "latestStatus": "delayed",
        "location": "Dallas"
      }
    },
    {
      "step": "carrier_status",
      "status": "completed",
      "resultReference": "result-carrier-001",
      "summary": {
        "carrierStatus": "capacity_constraint"
      }
    }
  ]
}
```

### Why persist intermediate results?

They allow CWD to:

* Resume after a Worker restart.

* Avoid repeating expensive operations.

* Support partial completion.

* Debug incorrect decisions.

* Aggregate parallel branches.

* Continue after human approval.

* Reconcile late results.

### Important design rule

Intermediate results should be:

* Bounded.

* Validated.

* Classified.

* Associated with the correct task and attempt.

* Stored as references when large.

* Expired when no longer needed.

Do not automatically treat every intermediate result as authoritative enterprise data or persistent memory.

## 6. Errors and failure information

A task error should be structured rather than stored as an unbounded text message.

JSON

```
{
  "error": {
    "code": "CARRIER_API_TIMEOUT",
    "type": "dependency_timeout",
    "message": "Carrier API did not respond within the configured deadline.",
    "retryable": true,
    "severity": "medium",
    "failedStep": "carrier_status_lookup",
    "attempt": 1,
    "occurredAt": "2026-09-06T15:02:00Z"
  }
}
```

Useful error categories:

|
Error type

|

Typical response

|
| --- | --- |
|

Invalid input

|

Reject or request correction

|
|

Authentication failure

|

Stop and reauthenticate

|
|

Authorization failure

|

Stop; do not retry blindly

|
|

Dependency timeout

|

Retry or use fallback

|
|

Rate limit

|

Backoff and retry

|
|

Worker unavailable

|

Rediscover or reassign

|
|

Schema validation failure

|

Reject result or repair

|
|

Business rule violation

|

Return controlled failure

|
|

Permanent backend failure

|

Escalate or terminate

|
|

Unknown error

|

Controlled retry and investigation

|

### Retry policy

```
Error occurs
    ↓
Classify error
    ↓
Is it retryable?
    ├── No → Fail / escalate
    └── Yes
          ↓
     Attempts remaining?
          ├── No → Fail / alternate path
          └── Yes
                ↓
       Check deadline and idempotency
                ↓
       Backoff + retry or reassign
```

A retry should not blindly repeat an irreversible write operation.

## 7. Completion information

Completion information explains whether the task achieved its objective.

JSON

```
{
  "completion": {
    "status": "completed",
    "completedAt": "2026-09-06T15:03:00Z",
    "successCriteriaMet": true,
    "resultReference": "result-WT-1001",
    "validated": true,
    "validationStatus": "passed",
    "durationMs": 1240,
    "attempts": 1
  }
}
```

Completion should distinguish:

* Execution completion: the Worker stopped executing.

* Business completion: the expected objective was achieved.

* Validation completion: the result passed required checks.

* Workflow completion: the parent workflow has enough results to proceed.

For example:

```
Worker finished execution
        ≠
Task achieved its objective
        ≠
Parent workflow completed
```

A task may finish with `partial`, `failed`, or `needs_approval` rather than `completed`.

## 8. Complete task document

JSON

```
{
  "id": "task-WT-1001",
  "documentType": "task",
  "tenantId": "tenant-a",

  "identity": {
    "taskId": "WT-1001",
    "parentTaskId": "DT-5001",
    "workflowId": "WF-1001",
    "sessionId": "S-1001",
    "correlationId": "CORR-7890",
    "executionId": "EXEC-1001",
    "idempotencyKey": "CORR-7890:WT-1001"
  },

  "objective": {
    "capability": "shipment_tracking",
    "action": "retrieve_tracking_events",
    "description": "Retrieve the latest tracking events for SHIP123",
    "successCriteria": [
      "Latest status is available",
      "Event timestamp is valid"
    ]
  },

  "input": {
    "shipmentId": "SHIP123"
  },

  "requiredCapabilities": [
    "shipment_tracking"
  ],

  "assignment": {
    "assignedAgent": "shipping-delegator",
    "assignedWorker": "tracking-worker",
    "workerVersion": "2.4.1",
    "assignedAt": "2026-09-06T15:00:10Z"
  },

  "dependencies": [],

  "status": "completed",

  "intermediateResults": [
    {
      "step": "tracking_lookup",
      "resultReference": "result-tracking-001"
    }
  ],

  "resultReference": "result-WT-1001",

  "error": null,

  "completion": {
    "successCriteriaMet": true,
    "validated": true,
    "completedAt": "2026-09-06T15:03:00Z",
    "durationMs": 1240,
    "attempts": 1
  },

  "metadata": {
    "priority": "high",
    "deadline": "2026-09-06T15:05:00Z",
    "environment": "production",
    "createdAt": "2026-09-06T15:00:00Z",
    "updatedAt": "2026-09-06T15:03:00Z",
    "stateVersion": 5
  }
}
```

For large intermediate results or artifacts, store only references:

```
Cosmos DB
    └── Task metadata + result references

Blob Storage
    └── Large files and artifacts

Azure AI Search
    └── Searchable knowledge

Execution history
    └── Individual task events
```

## 9. Task state in the CWD execution lifecycle

```
1. Coordinator creates workflow
          ↓
2. Delegator decomposes objective
          ↓
3. Task record is created
          ↓
4. Task input and capability are validated
          ↓
5. Agent Registry finds eligible Worker
          ↓
6. Policy authorizes execution
          ↓
7. Task is assigned and dispatched
          ↓
8. Worker updates status to running
          ↓
9. Worker executes tools, RAG, or business logic
          ↓
10. Intermediate results are persisted
          ↓
11. Worker validates final result
          ↓
12. Task becomes completed / partial / failed
          ↓
13. Delegator aggregates task result
          ↓
14. Parent workflow advances
```

## 10. Task state and LangGraph

LangGraph manages the workflow around the task.

A simplified graph might be:

```
START
  ↓
Create Task
  ↓
Validate Input
  ↓
Select Worker
  ↓
Dispatch Task
  ↓
Wait for Result
  ↓
Validate Result
  ├── Success → Mark Completed
  ├── Retryable Failure → Retry
  ├── Approval Required → Human Review
  └── Permanent Failure → Recovery
```

LangGraph state may contain:

Python

Run

```
{
    "task_id": "WT-1001",
    "workflow_id": "WF-1001",
    "task_status": "running",
    "assigned_worker": "tracking-worker",
    "attempt": 1,
    "intermediate_result_refs": [
        "result-tracking-001"
    ],
    "error": None,
    "next_action": "wait_for_result"
}
```

Cosmos DB can persist this information so the workflow can resume after a process restart.

### Separation

```
Task document
    → Durable representation of the task

LangGraph
    → Controls task-related transitions and recovery

Worker
    → Performs the task

Service Bus
    → Transports task messages

Agent Registry
    → Finds eligible execution agents

Policy/IAM
    → Authorizes execution

Execution history
    → Records task events
```

## 11. Task state and distributed messaging

A task message should carry enough information for the receiving agent to identify and execute the task.

JSON

```
{
  "messageId": "MSG-1001",
  "messageType": "task.submitted",
  "correlationId": "CORR-7890",
  "workflowId": "WF-1001",
  "taskId": "WT-1001",
  "parentTaskId": "DT-5001",
  "sourceAgent": "shipping-delegator",
  "targetAgent": "tracking-worker",
  "capability": "shipment_tracking",
  "inputReference": "task-WT-1001",
  "attempt": 1,
  "deadline": "2026-09-06T15:05:00Z"
}
```

The message is not the entire durable task record.

```
Cosmos DB
    → Authoritative task state

Service Bus
    → Task delivery message

Worker
    → Executes and updates task state

Delegator
    → Reads result and advances workflow
```

## 12. Task state and concurrency

Parallel Workers may update the same task or related workflow state.

Example:

```
Worker A → completes task
Worker B → sends duplicate completion
Delegator → updates aggregate
Coordinator → resumes workflow
```

Use:

* ETags or optimistic concurrency.

* State version numbers.

* Idempotency keys.

* Explicit status-transition rules.

* Atomic updates where appropriate.

* Reconciliation for late or duplicate results.

### Valid transition example

```
running → completed
running → retrying
running → failed
running → cancelled
```

### Invalid transition example

```
completed → running
```

unless the system explicitly creates a new execution attempt or a new task version.

## 13. Task state and security

Task inputs and results may contain sensitive enterprise information.

Required controls:

* Authenticate the calling agent.

* Authorize the task and capability.

* Validate input schema and business constraints.

* Propagate tenant and user context.

* Restrict task visibility by tenant, domain, and role.

* Avoid storing secrets in task documents.

* Classify inputs, intermediate results, and outputs.

* Redact sensitive values from logs.

* Validate tool outputs before persistence.

* Apply retention policies.

* Audit task creation, assignment, execution, and completion.

### Critical rule

> A task’s existence does not authorize a Worker to access every resource mentioned in its input.

The Worker must independently enforce authorization for the requested operation and underlying enterprise data.

## 14. Task state and recovery

### Worker failure

```
Task WT-1001 = running
        ↓
Worker becomes unavailable
        ↓
Heartbeat / timeout detected
        ↓
Task marked retryable
        ↓
Agent Registry selects another eligible Worker
        ↓
New execution attempt
        ↓
Task completed or failed
```

### Human approval

```
Task = waiting_for_approval
        ↓
Checkpoint persisted
        ↓
Human decision received
        ↓
Task state updated
        ↓
LangGraph resumes
        ↓
Worker continues or task is rejected
```

### Partial execution

```
Task has three subtasks
    ├── Subtask A completed
    ├── Subtask B completed
    └── Subtask C failed
```

The task can be marked `partial`, with completed results preserved and the failed branch available for retry or escalation.

## 15. Example task repository

Python

Run

```
from datetime import datetime, timezone
from typing import Any


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


class TaskRepository:
    def __init__(self, cosmos_container):
        self.container = cosmos_container

    def create_task(
        self,
        task_id: str,
        tenant_id: str,
        workflow_id: str,
        correlation_id: str,
        objective: dict[str, Any],
        input_data: dict[str, Any],
        capabilities: list[str],
    ) -> dict[str, Any]:
        task = {
            "id": task_id,
            "documentType": "task",
            "tenantId": tenant_id,
            "taskId": task_id,
            "workflowId": workflow_id,
            "correlationId": correlation_id,
            "objective": objective,
            "input": input_data,
            "requiredCapabilities": capabilities,
            "status": "created",
            "attempt": 0,
            "intermediateResults": [],
            "error": None,
            "createdAt": utc_now(),
            "updatedAt": utc_now(),
            "stateVersion": 1
        }

        return self.container.create_item(body=task)

    def update_status(
        self,
        task: dict[str, Any],
        new_status: str,
    ) -> dict[str, Any]:
        task["status"] = new_status
        task["stateVersion"] += 1
        task["updatedAt"] = utc_now()

        return self.container.replace_item(
            item=task["id"],
            body=task
        )

    def add_intermediate_result(
        self,
        task: dict[str, Any],
        step: str,
        result_reference: str,
    ) -> dict[str, Any]:
        task["intermediateResults"].append({
            "step": step,
            "resultReference": result_reference,
            "recordedAt": utc_now()
        })

        task["stateVersion"] += 1
        task["updatedAt"] = utc_now()

        return self.container.replace_item(
            item=task["id"],
            body=task
        )

    def complete_task(
        self,
        task: dict[str, Any],
        result_reference: str,
        duration_ms: int,
    ) -> dict[str, Any]:
        task["status"] = "completed"
        task["resultReference"] = result_reference
        task["completion"] = {
            "successCriteriaMet": True,
            "validated": True,
            "completedAt": utc_now(),
            "durationMs": duration_ms,
            "attempts": task["attempt"]
        }

        task["stateVersion"] += 1
        task["updatedAt"] = utc_now()

        return self.container.replace_item(
            item=task["id"],
            body=task
        )
```

This is a conceptual repository. Production code should add explicit status-transition validation, ETag concurrency, authorization, idempotency, exception handling, schema validation, and audit events.

## 16. Task state quality checklist

A production task record should answer all of these questions:

* What objective is being executed?

* Why was the task created?

* Who created it?

* Who is responsible?

* Which capabilities are required?

* Which Worker was assigned?

* What inputs were supplied?

* What dependencies exist?

* What is the current status?

* What attempt is running?

* What has already completed?

* What intermediate results are available?

* What errors occurred?

* What retry or recovery action is allowed?

* When is the deadline?

* What result was produced?

* Was the result validated?

* How does it relate to the parent workflow?

* Can the task be safely resumed or retried?

## 17. Common anti-patterns

### 1. Task state contains the entire conversation

This creates excessive coupling and unnecessary data exposure.

Better: store task-relevant context and references.

### 2. Task status is only a Boolean

JSON

```
{
  "completed": false
}
```

This cannot represent waiting, retrying, timeout, partial completion, or cancellation.

### 3. No parent relationship

Without `workflowId`, `parentTaskId`, and `correlationId`, aggregation and recovery become difficult.

### 4. Hardcoded Worker instance

The task should require a capability, not a fixed container instance.

### 5. Unstructured errors

A free-text error makes retry and operational analysis unreliable.

### 6. Intermediate results are never persisted

A restart may force the system to repeat expensive or irreversible work.

### 7. Completed tasks are overwritten

This destroys execution history and makes debugging difficult.

### 8. No idempotency

Duplicate messages may create duplicate business actions.

### 9. No concurrency control

Parallel updates can overwrite each other.

### 10. Task state is treated as authorization

Task inputs must still be checked against current policy and entitlements.

## 18. Architect-level separation

```
Session State
    → Overall user interaction

Workflow State
    → Overall execution plan and next transition

Task State
    → One objective, its inputs, assignment, dependencies,
      status, intermediate results, errors, and completion

Execution History
    → What happened during the task

Agent Result
    → Validated output produced by the task

LangGraph
    → Controls transitions and recovery

Cosmos DB
    → Persists durable task documents

Service Bus
    → Delivers task messages

Agent Registry
    → Discovers eligible agents and Workers

Policy / IAM
    → Authorizes execution and data access
```

## Core formula

Task-Level State=Task Identity+Objective+Inputs+Required Capabilities+Assignment+Dependencies+Status+Intermediate Results+Errors+Completion Information+Correlation+Retry/Recovery\text{Task-Level State} = \text{Task Identity} + \text{Objective} + \text{Inputs} + \text{Required Capabilities} + \text{Assignment} + \text{Dependencies} + \text{Status} + \text{Intermediate Results} + \text{Errors} + \text{Completion Information} + \text{Correlation} + \text{Retry/Recovery}Task-Level State=Task Identity+Objective+Inputs+Required Capabilities+Assignment+Dependencies+Status+Intermediate Results+Errors+Completion Information+Correlation+Retry/Recovery

## Interview-ready answer

> In CWD, task-level state represents one specific objective being executed by a Delegator or Worker. It includes the task identity, parent workflow, objective, validated inputs, required capabilities, assigned agent or Worker, dependencies, status, execution attempt, intermediate results, errors, deadlines, and completion information. The Delegator creates and tracks the task, the Agent Registry helps select an eligible Worker, Policy/IAM authorizes execution, Service Bus transports the task, and the Worker updates the task with progress and validated results. Cosmos DB provides durable task state so execution can survive restarts, retries, asynchronous processing, and scaling. LangGraph controls transitions such as waiting, retrying, approval, completion, and recovery. Correlation IDs, idempotency, optimistic concurrency, and structured errors make task execution traceable and reliable.

## Final definition

Task-level state in CWD is the durable, correlated representation of one executable objective, including its inputs, required capabilities, assignment, dependencies, lifecycle status, intermediate results, errors, retry information, and validated completion details. It enables Delegators and Workers to coordinate execution, supports asynchronous processing and recovery, preserves task history, and allows the parent workflow to determine what has completed, what remains pending, and what action should occur next.


### Final mental model

Task state = Objective + Inputs + Assignment + Dependencies + Progress + Result + Recovery.
