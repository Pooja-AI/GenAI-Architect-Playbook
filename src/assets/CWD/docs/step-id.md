# Step ID in CWD

A Step ID uniquely identifies one meaningful execution operation within a workflow run. It allows CWD to track what action was performed, by which agent, with what inputs, what happened, and what result was produced.

> Task ID = What objective must be completed? Run ID = Which execution attempt? Step ID = Which individual operation?

For example, investigating a delayed shipment may involve:

```
User Request
    ↓
Workflow WF-1001
    ↓
Task WT-1001
    ↓
Run RUN-003
    ├── STEP-001 → Planning
    ├── STEP-002 → Agent Delegation
    ├── STEP-003 → Retrieval
    ├── STEP-004 → Tool Execution
    ├── STEP-005 → LLM Analysis
    ├── STEP-006 → Validation
    ├── STEP-007 → Aggregation
    └── STEP-008 → Response Generation
```

The Step ID is the granular execution boundary that connects each operation to the larger conversational and workflow context.

## 1. Where Step ID fits in the execution hierarchy

```
Session
   └── Conversation
        └── Turn
             └── Workflow
                  └── Task
                       └── Run
                            ├── Step 1
                            ├── Step 2
                            ├── Step 3
                            └── Step N
```

Example:

```
Session:       S-1001
Conversation:  CONV-1001
Turn:          TURN-002
Correlation:   CORR-7890
Workflow:      WF-1001
Task:          WT-1001
Run:           RUN-003
Step:          STEP-004
```

This hierarchy allows CWD to move from:

> Which user request?

to:

> Which workflow?

to:

> Which task?

to:

> Which execution attempt?

to:

> Which exact operation caused the result?

## 2. What does a Step ID answer?

A Step ID should answer:

|
Question

|

Example

|
| --- | --- |
|

What operation is this?

|

Tool execution

|
|

Which workflow?

|

`WF-1001`

|
|

Which task?

|

`WT-1001`

|
|

Which run?

|

`RUN-003`

|
|

Which agent executed it?

|

`tracking-worker`

|
|

What was the input?

|

Shipment ID

|
|

What was the output?

|

Tracking events

|
|

What is the status?

|

Completed

|
|

How long did it take?

|

1,240 ms

|
|

Did it fail or retry?

|

No

|
|

What happens next?

|

Validate result

|

So:

> Step ID identifies the individual operation; the surrounding identifiers establish its execution lineage.

## 3. Step ID vs Task ID vs Run ID

These identifiers must not be confused.

### Task ID

Represents the logical objective.

```
WT-1001
"Retrieve shipment tracking events"
```

### Run ID

Represents one attempt to execute that objective.

```
RUN-003
Attempt 3
```

### Step ID

Represents one operation within that attempt.

```
STEP-004
"Execute get_tracking_events"
```

Example:

```
Task WT-1001
   ├── Run RUN-001
   │    └── STEP-001 → Failed
   │
   ├── Run RUN-002
   │    └── STEP-002 → Timeout
   │
   └── Run RUN-003
        ├── STEP-003 → Validate input
        ├── STEP-004 → Execute tool
        └── STEP-005 → Validate output
```

One task can have multiple runs, and one run can contain multiple steps.

## 4. What operations receive a Step ID?

A Step ID can represent meaningful operations across Coordinator, Delegator, and Worker execution.

|
Step type

|

Example operation

|
| --- | --- |
|

Planning

|

Create execution plan

|
|

Authorization

|

Evaluate access policy

|
|

Agent discovery

|

Find eligible Delegator

|
|

Delegation

|

Send task to Delegator

|
|

Decomposition

|

Split domain objective into Worker tasks

|
|

Retrieval

|

Search enterprise knowledge

|
|

Reranking

|

Rank retrieved chunks

|
|

Context construction

|

Assemble authorized evidence

|
|

LLM invocation

|

Generate analysis

|
|

Tool selection

|

Choose approved tool

|
|

Tool execution

|

Call MCP/API tool

|
|

Validation

|

Validate schema/business result

|
|

Aggregation

|

Combine Worker results

|
|

Human approval

|

Wait for approval

|
|

Response generation

|

Produce final answer

|
|

Response validation

|

Check groundedness and policy

|

Not every internal line of code needs a Step ID. A step should represent a meaningful, observable, and recoverable operation, not every function call.

## 5. Step ID and planning

The Coordinator may create a planning step:

```
STEP-001
Step Type: planning
Agent: coordinator
```

Example:

JSON

```
{
  "step_id": "STEP-001",
  "workflow_id": "WF-1001",
  "task_id": "DT-5001",
  "run_id": "RUN-003",
  "step_type": "planning",
  "status": "completed",
  "input": {
    "user_request": "Why is shipment SHIP123 delayed?"
  },
  "output": {
    "intent": "root_cause_analysis",
    "domain": "logistics",
    "required_capabilities": [
      "shipment_tracking",
      "delay_analysis"
    ]
  }
}
```

This lets CWD determine:

* What plan was created?

* Which capabilities were identified?

* Did planning fail?

* Did the plan lead to the correct Delegator?

* How long did planning take?

## 6. Step ID and delegation

The Coordinator may create a delegation step:

```
STEP-002
Step Type: delegation
Agent: coordinator

Coordinator
    │
    └── STEP-002
          │
          └── A2A Task → Shipping Delegator
```

The step can record:

JSON

```
{
  "step_id": "STEP-002",
  "step_type": "delegation",
  "status": "completed",
  "selected_agent": "shipping-delegator",
  "task_reference": "DT-5001"
}
```

This provides evidence of:

> Which agent was selected, when, and for what objective?

The Delegator then creates its own steps for decomposition, Worker selection, and execution.

## 7. Step ID and retrieval

A RAG Worker may execute:

```
STEP-003
Step Type: retrieval
```

The step can record:

JSON

```
{
  "step_id": "STEP-003",
  "step_type": "retrieval",
  "status": "completed",
  "retrieval_mode": "hybrid",
  "candidate_count": 30,
  "authorized_count": 12,
  "selected_count": 5,
  "result_reference": "RESULT-RETRIEVAL-001"
}
```

This helps answer:

* How many documents were retrieved?

* How many passed authorization?

* Which retrieval strategy was used?

* Did retrieval fail or timeout?

* Which evidence contributed to the final answer?

The step should preserve references to evidence and metadata without unnecessarily storing sensitive document content.

## 8. Step ID and LLM invocation

An LLM call is an execution operation:

```
STEP-005
Step Type: llm_invocation
```

Example:

JSON

```
{
  "step_id": "STEP-005",
  "step_type": "llm_invocation",
  "status": "completed",
  "model": "approved-model-v4",
  "prompt_id": "shipment-delay-analysis",
  "prompt_version": "2.2.0",
  "input_tokens": 1850,
  "output_tokens": 420,
  "duration_ms": 2100,
  "output_reference": "RESULT-LLM-001"
}
```

This provides lineage for:

* Which model was used?

* Which prompt version was used?

* How many tokens were consumed?

* How long did the invocation take?

* Did the output pass validation?

* What cost was associated with this step?

A workflow may contain several LLM steps, so each invocation should have its own Step ID.

## 9. Step ID and tool execution

A Worker may execute:

```
STEP-004
Step Type: tool_execution

Worker
   │
   └── STEP-004
         │
         └── MCP
              │
              └── get_tracking_events
```

Example:

JSON

```
{
  "step_id": "STEP-004",
  "step_type": "tool_execution",
  "status": "completed",
  "mcp_server": "shipping-mcp",
  "tool": "get_tracking_events",
  "input_reference": "INPUT-TOOL-001",
  "output_reference": "OUTPUT-TOOL-001",
  "duration_ms": 1240,
  "retry_count": 0
}
```

This lets CWD distinguish:

```
Tool selection
      ↓
Argument validation
      ↓
Authorization
      ↓
Tool invocation
      ↓
Result validation
```

Each may be a separate step when the operation is important enough to observe or recover independently.

## 10. Step ID and validation

Validation is not just a final activity. CWD can validate at multiple points.

```
STEP-001 → Planning validation
STEP-002 → Authorization validation
STEP-004 → Tool result validation
STEP-006 → Business result validation
STEP-008 → Final response validation
```

Example:

JSON

```
{
  "step_id": "STEP-006",
  "step_type": "validation",
  "status": "completed",
  "checks": {
    "schema_valid": true,
    "business_rules_valid": true,
    "grounded": true,
    "security_policy_passed": true
  },
  "result_reference": "RESULT-VALIDATED-001"
}
```

This allows CWD to identify exactly which validation succeeded or failed.

## 11. Step ID and aggregation

Suppose three Workers execute in parallel:

```
STEP-010 → Tracking Worker
STEP-011 → Carrier Status Worker
STEP-012 → Route Constraints Worker
```

The Delegator creates:

```
STEP-013
Step Type: aggregation

STEP-010 ──┐
           │
STEP-011 ──┼──> STEP-013 → Aggregated Domain Result
           │
STEP-012 ──┘
```

The aggregation step records:

JSON

```
{
  "step_id": "STEP-013",
  "step_type": "aggregation",
  "status": "completed",
  "input_steps": [
    "STEP-010",
    "STEP-011",
    "STEP-012"
  ],
  "output_reference": "RESULT-DOMAIN-001"
}
```

This provides a clear explanation of how multiple Worker results became one domain-level result.

## 12. Step ID and response generation

The final response may be produced by:

```
STEP-020
Step Type: response_generation

Validated Domain Results
          ↓
     STEP-020
          ↓
    Final Response
```

Example:

JSON

```
{
  "step_id": "STEP-020",
  "step_type": "response_generation",
  "status": "completed",
  "input_references": [
    "RESULT-DOMAIN-001",
    "RESULT-RETRIEVAL-001"
  ],
  "output_reference": "RESULT-TURN-002"
}
```

This connects the final response to the validated information used to generate it.

## 13. Step lifecycle

A typical step lifecycle is:

```
CREATED
   ↓
READY
   ↓
RUNNING
   ↓
COMPLETED
```

Other states include:

```
WAITING
WAITING_FOR_APPROVAL
RETRYING
FAILED
TIMED_OUT
CANCELLED
SKIPPED
```

Example:

```
STEP-004
   │
   ├── CREATED
   ├── RUNNING
   ├── FAILED
   ├── RETRYING
   └── COMPLETED
```

The step status should describe the execution operation, not merely the overall task.

## 14. Step ID and conditional routing

LangGraph can use step outcomes to determine the next operation.

```
STEP-004: Tool Execution
        │
        ▼
STEP-005: Validate Result
        │
        ├── Valid ───────────> STEP-006: Aggregate
        │
        ├── Retryable Error ─> STEP-007: Retry Tool
        │
        ├── Approval Needed ─> STEP-008: Human Approval
        │
        └── Permanent Error ─> STEP-009: Recovery
```

The Step ID allows the workflow engine to know:

> Which operation completed, which failed, and where execution should continue?

A failed step does not necessarily require restarting the entire workflow.

## 15. Step ID and targeted retry

Suppose the tool execution fails:

```
STEP-004 → FAILED
```

CWD can retry the specific operation:

```
STEP-004
   ├── Attempt 1 → Failed
   └── Attempt 2 → Completed
```

Or create a new run:

```
RUN-003
   └── STEP-004 → Failed

RUN-004
   └── STEP-010 → Retry Tool → Completed
```

The exact retry representation depends on the implementation, but the important principle is:

> Retry the smallest safe execution unit rather than restarting successful work unnecessarily.

Retry must still respect idempotency, deadlines, error classification, authorization, and policy.

## 16. Step ID and checkpointing

LangGraph can checkpoint workflow state after meaningful steps.

```
STEP-001 → Completed
STEP-002 → Completed
STEP-003 → Completed
                 │
                 ▼
          CHECKPOINT-001
                 │
                 ▼
STEP-004 → Failed
```

After recovery:

```
Checkpoint
    ↓
Resume from STEP-004
    ↓
STEP-005
    ↓
STEP-006
```

The checkpoint may contain:

* Current step

* Completed step references

* Pending steps

* Intermediate results

* Retry counts

* Approval status

* Workflow status

* Correlation identifiers

Sensitive state must be protected through classification, access control, encryption, retention, and minimization.

## 17. Step ID and parallel execution

CWD can execute independent steps in parallel.

```
             ┌── STEP-010 → Tracking
             │
STEP-009 ────┼── STEP-011 → Carrier Status
Planning     │
             └── STEP-012 → Route Constraints
                         │
                         ▼
                    STEP-013
                    Aggregation
```

Each branch has its own Step ID.

This enables:

* Independent status tracking

* Branch-level latency measurement

* Partial failure detection

* Parallel execution

* Dependency-aware aggregation

* Targeted retries

* Critical-path analysis.

For example:

```
Sequential:
2s + 3s + 2s = 7s

Parallel:
max(2s, 3s, 2s) = 3s
```

The workflow still needs aggregation and coordination overhead.

## 18. Step ID and observability

A Step ID is the most granular useful execution identifier in many CWD traces.

Example telemetry:

JSON

```
{
  "event": "STEP_COMPLETED",
  "timestamp": "2026-09-06T20:00:00Z",

  "session_id": "S-1001",
  "conversation_id": "CONV-1001",
  "turn_id": "TURN-002",
  "correlation_id": "CORR-7890",

  "workflow_id": "WF-1001",
  "task_id": "WT-1001",
  "run_id": "RUN-003",
  "step_id": "STEP-004",

  "agent_id": "tracking-worker",
  "step_type": "tool_execution",

  "status": "completed",
  "duration_ms": 1240,
  "retry_count": 0
}
```

This enables queries such as:

```
Find all failed steps in workflow WF-1001

Find all tool execution steps for TURN-002

Find the slowest steps for correlation CORR-7890

Find which step caused the final response to fail
```

## 19. Step ID and latency measurement

Step-level latency is:

Tstep=Tend−TstartT_{\text{step}} = T_{\text{end}} - T_{\text{start}}Tstep=Tend−Tstart

For example:

```
STEP-004
Start: 20:00:00.000
End:   20:00:01.240
```

Therefore:

```
Step latency = 1,240 ms
```

CWD can break workflow latency into:

```
Planning
+ Delegation
+ Retrieval
+ Tool Execution
+ LLM Invocation
+ Validation
+ Aggregation
+ Response Generation
```

This identifies the actual bottleneck instead of treating the entire workflow as one opaque operation.

## 20. Step ID and cost measurement

Each step can contribute to total workflow cost.

```
STEP-001 → Planning LLM cost
STEP-003 → Embedding/Search cost
STEP-004 → Tool/API cost
STEP-005 → LLM inference cost
STEP-013 → Compute cost
```

A conceptual formula is:

Cworkflow=∑i=1nCstepiC_{\text{workflow}} = \sum_{i=1}^{n} C_{\text{step}_i}Cworkflow=i=1∑nCstepi

This supports:

* Cost per LLM invocation

* Cost per tool execution

* Cost per Worker

* Cost per task

* Cost per workflow

* Cost per successful business outcome.

## 21. Step ID and auditability

Step-level auditability records what happened during one specific operation.

For example:

```
STEP-004
   │
   ├── Tool selected
   ├── Arguments validated
   ├── Authorization checked
   ├── Tool invoked
   ├── Result received
   ├── Result validated
   └── Result stored
```

An audit record can include:

JSON

```
{
  "event_type": "STEP_COMPLETED",
  "step_id": "STEP-004",
  "workflow_id": "WF-1001",
  "task_id": "WT-1001",
  "run_id": "RUN-003",
  "agent_id": "tracking-worker",
  "action": "get_tracking_events",
  "authorization_decision": "ALLOW",
  "status": "SUCCESS",
  "result_reference": "OUTPUT-TOOL-001"
}
```

This allows an investigator to reconstruct the operation without storing unnecessary sensitive payloads.

## 22. Step ID and failure analysis

Suppose the final answer is incorrect.

CWD can trace:

```
TURN-002
   │
   └── WF-1001
        │
        ├── STEP-001 → Planning ✓
        ├── STEP-002 → Delegation ✓
        ├── STEP-003 → Retrieval ✗
        ├── STEP-004 → Tool Execution ✓
        ├── STEP-005 → LLM Analysis ✓
        └── STEP-006 → Response ✓
```

The Step ID identifies the first meaningful failure.

Possible root causes include:

* Incorrect query transformation

* Unauthorized or incomplete retrieval

* Wrong tool selection

* Invalid tool arguments

* LLM timeout

* Invalid intermediate result

* Aggregation error

* Response validation failure.

Without Step IDs, CWD may only know that the overall workflow failed.

## 23. Step ID and state storage

A practical separation is:

|
Component

|

Responsibility

|
| --- | --- |
|

LangGraph

|

Workflow transitions, conditional routing, checkpointing

|
|

Cosmos DB

|

Durable step snapshots and execution references

|
|

Redis

|

Fast working state and temporary step context

|
|

Service Bus

|

Durable task/message delivery

|
|

OpenTelemetry / Azure Monitor

|

Detailed step telemetry and traces

|
|

Audit store

|

Governed evidence of significant step actions

|

A Step ID should be present across these systems where relevant, allowing the same operation to be correlated.

## 24. Example: complete shipment investigation

```
TURN-002
   │
   └── WF-1001
        │
        ├── STEP-001: Planning
        │     └── Intent = root_cause_analysis
        │
        ├── STEP-002: Delegation
        │     └── Shipping Delegator
        │
        ├── STEP-003: Worker Decomposition
        │     ├── WT-1001
        │     ├── WT-1002
        │     └── WT-1003
        │
        ├── STEP-004: Retrieval
        │     └── Authorized enterprise evidence
        │
        ├── STEP-005: Tool Execution
        │     └── get_tracking_events
        │
        ├── STEP-006: LLM Analysis
        │     └── Delay analysis
        │
        ├── STEP-007: Validation
        │     └── Schema + business + grounding checks
        │
        ├── STEP-008: Aggregation
        │     └── Domain result
        │
        └── STEP-009: Response Generation
              └── Final answer
```

Every step can be independently measured, traced, retried, audited, and linked to the original turn.

## 25. What should not be a Step ID?

Avoid using Step IDs for:

* Every individual Python function call

* Every token generated by an LLM

* Every database row

* Every low-level network packet

* Every internal variable assignment

* Every log message

Those are too granular.

Instead, create Step IDs for meaningful execution operations such as:

```
Planning
Delegation
Retrieval
Tool Execution
LLM Invocation
Validation
Aggregation
Response Generation
```

Low-level details can be represented as logs, spans, or events under the step.

## 26. Step ID and workflow state

A simplified LangGraph state might contain:

Python

Run

```
state = {
    "turn_id": "TURN-002",
    "correlation_id": "CORR-7890",
    "workflow_id": "WF-1001",
    "task_id": "WT-1001",
    "run_id": "RUN-003",

    "current_step_id": "STEP-004",
    "current_step_type": "tool_execution",

    "completed_steps": [
        "STEP-001",
        "STEP-002",
        "STEP-003"
    ],

    "pending_steps": [
        "STEP-005",
        "STEP-006"
    ],

    "step_results": {
        "STEP-003": "RESULT-RETRIEVAL-001"
    }
}
```

The LLM may recommend an action, but the runtime and policy controls determine whether the step can actually execute.

## 27. Core architectural distinction

```
Turn ID
"Which conversational interaction?"

      ↓

Workflow ID
"Which execution process?"

      ↓

Task ID
"What objective?"

      ↓

Run ID
"Which attempt?"

      ↓

Step ID
"Which individual operation?"

      ↓

Event / Span
"What happened during that operation?"
```

This is the foundation of fine-grained execution lineage.

## 28. Core formula

Step State=Step Identity+Step Type+Dependencies+Input+Agent+Status+Attempt+Timestamps+Intermediate Output+Validation+Failure+Result Reference+Execution Metadata\text{Step State} = \text{Step Identity} + \text{Step Type} + \text{Dependencies} + \text{Input} + \text{Agent} + \text{Status} + \text{Attempt} + \text{Timestamps} + \text{Intermediate Output} + \text{Validation} + \text{Failure} + \text{Result Reference} + \text{Execution Metadata}Step State=Step Identity+Step Type+Dependencies+Input+Agent+Status+Attempt+Timestamps+Intermediate Output+Validation+Failure+Result Reference+Execution Metadata

And:

```
Step ID
    ↓
Individual Operation
    ↓
Execution Status
    ↓
Result / Failure
    ↓
Next Workflow Transition
```

## Interview-ready answer

> “In CWD, the Step ID tracks one meaningful execution operation within a workflow run, such as planning, delegation, retrieval, LLM invocation, tool execution, validation, aggregation, or response generation. Each step is linked to the session, conversation, Turn ID, correlation ID, workflow, task, and run, so CWD can reconstruct the exact execution lineage of a user request. Step-level state records the operation type, participating agent, dependencies, inputs, outputs, status, timestamps, retries, validation results, failures, and result references. LangGraph uses step outcomes for conditional routing, checkpointing, parallel execution, and targeted recovery. Cosmos DB can persist durable step snapshots, Redis can hold temporary working context, and observability systems capture detailed step telemetry. This allows CWD to identify bottlenecks, retry failed operations without restarting successful work, trace incorrect responses, calculate cost and latency, and maintain auditability. The Step ID identifies the individual operation; the Run ID identifies the execution attempt; and the Task ID identifies the objective.”

### Core definition

A Step ID in CWD is the unique identifier for one meaningful execution operation within a workflow run. It links the operation to its workflow, task, run, agent, dependencies, inputs, outputs, status, timestamps, retries, validation results, failures, and result references, enabling fine-grained tracing, conditional routing, parallel execution, targeted recovery, checkpointing, latency and cost measurement, and auditability from the original conversational turn to the final response.

### Mental model

```
Session
   ↓
Conversation
   ↓
Turn
   ↓
Workflow
   ↓
Task
   ↓
Run
   ↓
Step
   ↓
Event / Span
```

Step ID = “What individual operation happened, what was its outcome, and what should CWD do next?”


### Practical takeaway

In CWD, Step ID is the smallest meaningful execution boundary. It connects an operation such as `STEP-004: Tool Execution` to its inputs, outputs, status, latency, cost, and next workflow transition.

```
TURN-002
   └── WF-1001
        └── RUN-003
             ├── STEP-001 → Planning
             ├── STEP-002 → Delegation
             ├── STEP-003 → Retrieval
             ├── STEP-004 → Tool Execution
             ├── STEP-005 → LLM Invocation
             ├── STEP-006 → Validation
             ├── STEP-007 → Aggregation
             └── STEP-008 → Response Generation
```

The essential distinction is:

> Task = objective | Run = attempt | Step = operation | Event = what happened during that operation.

This makes CWD execution traceable, recoverable, measurable, and auditable at a much finer level than task or workflow tracking alone.
