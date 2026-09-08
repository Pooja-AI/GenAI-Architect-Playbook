Yes. In CWD, the Run ID identifies one specific execution attempt of a task. It tells us how that attempt started, which agents and steps participated, whether it succeeded or failed, and what happened during execution.

> Task ID = What objective are we trying to accomplish? Run ID = Which attempt are we making to accomplish it?

# Run ID in CWD

## 1. What is a Run ID?

A Run ID is a unique identifier assigned to one execution attempt of a task.

For example:

```
Task ID = WT-1001
Run ID  = RUN-003
```

The task may be:

> “Retrieve tracking events for shipment SHIP123.”

The run represents one attempt to execute that objective.

```
Task WT-1001
      │
      └── Run RUN-003
             │
             ├── Validate input
             ├── Select Worker
             ├── Execute MCP tool
             ├── Validate result
             └── Return outcome
```

The Run ID remains associated with that particular attempt, even if the task later requires another attempt.

## 2. Why Run ID is needed

A task can fail, retry, or be reassigned.

```
Task WT-1001
   │
   ├── RUN-001 → Timeout
   ├── RUN-002 → MCP failure
   └── RUN-003 → Success
```

Without Run IDs, these attempts might appear to be one continuous execution.

With Run IDs, CWD can distinguish:

* the original attempt

* the retry

* the Worker used in each attempt

* the failure reason

* the execution duration

* the final successful attempt.

This is essential for recovery, debugging, performance analysis, and auditability.

# 3. Task ID vs Run ID

|
Concept

|

Task ID

|

Run ID

|
| --- | --- | --- |
|

Represents

|

Logical objective

|

Specific execution attempt

|
|

Example

|

`WT-1001`

|

`RUN-003`

|
|

Changes during retry?

|

Usually no

|

Yes

|
|

Identifies

|

What must be done

|

Which attempt did it

|
|

Tracks

|

Objective lifecycle

|

Execution lifecycle

|
|

Supports

|

Task monitoring and aggregation

|

Retry analysis and reproducibility

|

### Mental model

```
TASK
"What needs to be done?"

   ↓

RUN
"Which attempt is executing it?"

   ↓

STEP
"What action is happening?"
```

# 4. Run ID hierarchy

The complete CWD execution hierarchy is:

```
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
                              └── Task
                                     │
                                     ├── Run 1
                                     │     ├── Step 1
                                     │     └── Step 2
                                     │
                                     └── Run 2
                                           ├── Step 1
                                           └── Step 2
```

For example:

```
CORR-7890
   │
   └── WF-1001
         │
         └── WT-1001
               │
               ├── RUN-001
               ├── RUN-002
               └── RUN-003
```

# 5. What information does a Run ID identify?

A production Run record typically contains:

```
Run ID
Task ID
Workflow ID
Correlation ID
Attempt Number
Execution Status
Start Time
End Time
Participating Agents
Step References
Intermediate Outputs
Failures
Retry Information
Final Result
Execution Metadata
```

The Run ID is therefore the execution boundary for one attempt.

# 6. Example Run record

JSON

```
{
  "run_id": "RUN-003",
  "task_id": "WT-1001",
  "workflow_id": "WF-1001",
  "correlation_id": "CORR-7890",

  "attempt": 3,

  "status": "completed",

  "started_at": "2026-09-06T20:00:00Z",
  "completed_at": "2026-09-06T20:00:01Z",

  "participating_agents": [
    {
      "agent_id": "shipping-delegator",
      "role": "delegator",
      "version": "1.8.0"
    },
    {
      "agent_id": "tracking-worker",
      "role": "worker",
      "version": "2.4.1"
    }
  ],

  "steps": [
    {
      "step_id": "STEP-001",
      "type": "validation",
      "status": "completed"
    },
    {
      "step_id": "STEP-002",
      "type": "tool_execution",
      "status": "completed"
    }
  ],

  "intermediate_outputs": [
    {
      "step_id": "STEP-002",
      "reference": "result-001"
    }
  ],

  "failures": [],

  "final_result_reference": "result-RUN-003"
}
```

This record describes one execution attempt, not the entire task history.

# 7. Run lifecycle

A Run can follow a lifecycle such as:

```
CREATED
   ↓
STARTING
   ↓
RUNNING
   ↓
WAITING
   ↓
RETRYING
   ↓
RUNNING
   ↓
COMPLETING
   ↓
COMPLETED
```

Failure paths:

```
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
   ├── user cancellation → CANCELLED
   │
   └── system termination → ABORTED
```

The exact states depend on the CWD execution contract.

# 8. Run ID and attempt number

A Run ID should identify one attempt.

For example:

```
RUN-001 → attempt 1
RUN-002 → attempt 2
RUN-003 → attempt 3
```

The `attempt` field makes retry analysis easier:

JSON

```
{
  "run_id": "RUN-003",
  "task_id": "WT-1001",
  "attempt": 3,
  "status": "completed"
}
```

This allows CWD to answer:

> How many attempts were required to complete this task?

# 9. Run ID and timestamps

A Run should record at least:

```
started_at
completed_at
```

From these:

```
Run Duration
=
completed_at - started_at
```

Example:

```
RUN-003
Started:   20:00:00
Completed: 20:00:01

Duration: 1 second
```

Additional timestamps may include:

* queued time

* assigned time

* first execution time

* waiting time

* retry time

* approval time

* completion time.

This helps separate queue latency from actual execution latency.

# 10. Run ID and participating agents

A single run may involve multiple CWD components.

```
RUN-003
   │
   ├── Coordinator
   ├── Shipping Delegator
   ├── Tracking Worker
   ├── MCP Server
   └── Enterprise API
```

The Run record can capture:

JSON

```
{
  "run_id": "RUN-003",
  "participating_agents": [
    {
      "agent_id": "shipping-delegator",
      "version": "1.8.0"
    },
    {
      "agent_id": "tracking-worker",
      "version": "2.4.1"
    }
  ]
}
```

This is useful for:

* identifying which agent executed the task

* comparing agent versions

* investigating failures

* reproducing behavior

* analyzing workload distribution.

# 11. Run ID and Step IDs

A Run contains multiple execution steps.

```
RUN-003
   │
   ├── STEP-001 → Validate input
   ├── STEP-002 → Check authorization
   ├── STEP-003 → Select tool
   ├── STEP-004 → Execute MCP
   ├── STEP-005 → Validate output
   └── STEP-006 → Complete task
```

Each step belongs to:

```
RUN-003
```

This lets CWD identify the exact action that failed.

For example:

```
RUN-003
   │
   └── STEP-004
          └── MCP timeout
```

The Run is the attempt; the Step is the individual action.

# 12. Run ID and failures

A Run should record failures in a structured way.

JSON

```
{
  "run_id": "RUN-002",
  "task_id": "WT-1001",
  "status": "failed",

  "failures": [
    {
      "code": "MCP_TIMEOUT",
      "type": "dependency_failure",
      "message": "Tracking service did not respond",
      "retryable": true,
      "step_id": "STEP-004",
      "timestamp": "2026-09-06T20:00:05Z"
    }
  ]
}
```

The `retryable` field is important.

CWD can decide whether to:

* retry

* select another Worker

* wait for dependency recovery

* ask for clarification

* escalate

* terminate.

A Run records the failure; LangGraph and policy determine the recovery path.

# 13. Run ID and retries

Suppose the task fails:

```
WT-1001
   │
   ├── RUN-001 → Timeout
   │
   ├── RUN-002 → Dependency failure
   │
   └── RUN-003 → Completed
```

The Task ID remains:

```
WT-1001
```

but each Run ID is different.

This allows CWD to calculate:

```
Retry Count = Number of additional runs
```

and:

```
Recovery Success Rate
=
Tasks recovered after failure
/
Tasks that initially failed
```

# 14. Run ID and Worker reassignment

Suppose the first attempt uses Worker A:

```
RUN-001
   └── Worker A → unavailable
```

The second attempt uses Worker B:

```
RUN-002
   └── Worker B → success
```

The task remains:

```
WT-1001
```

This gives CWD a clear execution history:

```
WT-1001
   │
   ├── RUN-001 → Worker A → failed
   └── RUN-002 → Worker B → success
```

This is especially important in dynamically routed Worker pools.

# 15. Run ID and asynchronous processing

With Service Bus, the task may be accepted now and completed later.

```
Coordinator
     │
     ▼
Service Bus
     │
     ▼
Worker
     │
     ▼
RUN-003
     │
     ▼
Completed
```

The Run ID lets CWD associate:

* the message

* the Worker execution

* the result

* the completion event.

Example:

JSON

```
{
  "message_id": "MSG-10001",
  "correlation_id": "CORR-7890",
  "task_id": "WT-1001",
  "run_id": "RUN-003",
  "status": "completed"
}
```

This is useful for long-running tasks and delayed results.

# 16. Run ID and LangGraph

LangGraph can maintain the current Run ID in workflow state:

Python

Run

```
state = {
    "correlation_id": "CORR-7890",
    "workflow_id": "WF-1001",
    "task_id": "WT-1001",
    "run_id": "RUN-003",
    "attempt": 3,
    "status": "running"
}
```

As the graph executes:

```
START
  ↓
Validate
  ↓
Select Worker
  ↓
Execute
  ↓
Validate Result
  ↓
Complete
```

the Run ID identifies the current attempt.

If a failure occurs:

```
RUN-003
   │
   └── Failure
         ↓
      Recovery
```

A new attempt may create:

```
RUN-004
```

while the Task ID remains unchanged.

# 17. Run ID and observability

A telemetry event should include:

JSON

```
{
  "correlation_id": "CORR-7890",
  "workflow_id": "WF-1001",
  "task_id": "WT-1001",
  "run_id": "RUN-003",
  "step_id": "STEP-004",

  "agent_id": "tracking-worker",
  "event": "RUN_COMPLETED",
  "status": "success",
  "duration_ms": 1240
}
```

This enables queries such as:

```
run_id = RUN-003
```

> Show everything that happened during this specific attempt.

Or:

```
task_id = WT-1001
```

> Show all attempts for this logical task.

Or:

```
correlation_id = CORR-7890
```

> Show the entire business request.

# 18. Run ID and debugging

Suppose a task failed.

```
WT-1001
   └── RUN-002 → FAILED
```

You can inspect:

```
RUN-002
   │
   ├── Start time
   ├── Assigned Worker
   ├── Step 1 → success
   ├── Step 2 → success
   ├── Step 3 → MCP timeout
   ├── Retry decision
   └── Final failure
```

This answers:

> What happened during this particular attempt?

That is more precise than simply saying:

```
Task failed.
```

# 19. Run ID and latency analysis

Run-level latency can be calculated as:

```
Run Latency
=
Completion Time - Start Time
```

For example:

```
RUN-003
   │
   ├── Queue wait: 500 ms
   ├── Validation: 100 ms
   ├── MCP: 400 ms
   ├── LLM: 200 ms
   └── Finalization: 40 ms
```

Total:

```
Run Latency = 1,240 ms
```

Run-level analysis helps identify whether latency increased because of:

* queue wait

* Worker execution

* tool calls

* RAG

* LLM

* retries

* downstream dependencies.

# 20. Run ID and cost analysis

Each Run may consume resources.

```
RUN-003
   │
   ├── LLM calls
   ├── Embeddings
   ├── RAG/search
   ├── MCP/API calls
   ├── Compute
   └── Messaging
```

Therefore:

```
Run Cost
=
LLM Cost
+
Embedding Cost
+
Compute Cost
+
Search Cost
+
Tool Cost
+
Messaging Cost
```

This allows CWD to compare:

```
RUN-001 → $0.02 → failed
RUN-002 → $0.03 → failed
RUN-003 → $0.04 → success
```

The cost of recovery becomes visible.

# 21. Run ID and reproducibility

A Run record should preserve enough metadata to understand how the attempt was executed.

Useful references include:

```
Agent version
Prompt ID/version
Model/version
Tool version
Workflow version
RAG index/version
Configuration version
Execution environment
```

For example:

JSON

```
{
  "run_id": "RUN-003",
  "task_id": "WT-1001",
  "agent_version": "2.4.1",
  "prompt_version": "2.2.0",
  "model_version": "approved-model-v4",
  "workflow_version": "1.5.0"
}
```

This helps answer:

> Why did this attempt behave differently from the previous one?

# 22. Run ID and partial results

A Run may produce intermediate outputs before failing.

```
RUN-002
   │
   ├── STEP-001 → validated
   ├── STEP-002 → tracking retrieved
   ├── STEP-003 → carrier API timeout
   └── FAILED
```

The Run can preserve references to those outputs:

JSON

```
{
  "run_id": "RUN-002",
  "status": "failed",
  "intermediate_outputs": [
    {
      "step_id": "STEP-002",
      "reference": "result-001"
    }
  ]
}
```

This allows recovery to reuse valid results where policy permits, rather than repeating everything.

# 23. Run ID and business outcome

A technically completed Run does not always mean the business objective was achieved.

```
RUN-003
   │
   ├── Tool returned HTTP 200
   ├── Result schema valid
   └── Wrong shipment data
```

So CWD should distinguish:

```
Execution Status = completed
```

from:

```
Business Outcome = unsuccessful
```

This is why Run records should include:

* execution status

* validation status

* business result

* final result reference

* warnings/errors.

# 24. Run ID and auditability

A Run record supports audit questions such as:

```
Which attempt executed the task?
Which agent/version participated?
When did it start and finish?
Which steps occurred?
Which tools were called?
Which failures occurred?
Which policy decisions applied?
What result was produced?
```

Example:

JSON

```
{
  "event_type": "RUN_COMPLETED",
  "run_id": "RUN-003",
  "task_id": "WT-1001",
  "workflow_id": "WF-1001",
  "correlation_id": "CORR-7890",
  "agent_id": "tracking-worker",
  "status": "SUCCESS",
  "final_result_reference": "result-RUN-003"
}
```

The Run ID makes the execution attempt auditable without confusing it with the broader task.

# 25. Run ID and persistent state

A Run record can be persisted in Cosmos DB or another durable execution store.

```
Cosmos DB
   │
   └── Run Records
         ├── RUN-001
         ├── RUN-002
         └── RUN-003
```

Redis may hold active working state:

```
Redis
   │
   └── run:RUN-003
```

LangGraph controls workflow transitions.

Service Bus delivers messages.

Observability captures detailed telemetry.

```
Run State
   ├── Cosmos → Durable execution record
   ├── Redis → Active working data
   ├── LangGraph → Workflow control
   ├── Service Bus → Message delivery
   └── Observability → Execution telemetry
```

# 26. Run ID vs Task ID vs Step ID

This distinction is essential for architecture and interviews.

```
TASK WT-1001
"What objective?"

   │
   └── RUN-003
       "Which attempt?"

          │
          ├── STEP-001
          │   "What action?"
          │
          ├── STEP-002
          │   "What action?"
          │
          └── STEP-003
              "What action?"
```

Example:

```
Task: Retrieve shipment events
Run:  RUN-003
Step: Execute MCP tool
```

A task can have many runs.

A run can have many steps.

# 27. Complete CWD example

```
User Request
     │
     ▼
Correlation CORR-7890
     │
     ▼
Workflow WF-1001
     │
     ▼
Task WT-1001
"Retrieve shipment events"
     │
     ├── RUN-001
     │     ├── Tracking Worker v2
     │     ├── MCP timeout
     │     └── FAILED
     │
     ├── RUN-002
     │     ├── Tracking Worker v2
     │     ├── Carrier API failure
     │     └── FAILED
     │
     └── RUN-003
           ├── Tracking Worker v3
           ├── MCP success
           ├── Result validation
           └── COMPLETED
```

This is the complete execution history of one logical task.

# 28. Core formula

```
Run State
=
Run Identity
+
Task Reference
+
Workflow Reference
+
Correlation
+
Attempt Number
+
Execution Status
+
Timestamps
+
Participating Agents
+
Step
```


### One-line mental model

```
Task ID = What must be done
Run ID  = Which attempt is doing it
Step ID = What action happened
```

Example: `WT-1001` may have `RUN-001` failed, `RUN-002` timed out, and `RUN-003` completed. The task remains the same; the Run IDs distinguish its execution history.
