# Execution State Management Across CWD

> **Execution state is the shared, evolving context of a CWD workflow. It is created when a request enters the Coordinator, continuously updated as nodes and agents execute, propagated across Coordinator → Delegator → Worker boundaries, and finally transformed into the completed response state.**

In CWD, the execution state is what allows the system to remember **what was requested, what needs to be done, what has already happened, what each agent returned, what tools produced, what failed, what remains, and what should happen next.**

---

## 1. What Is Execution State?

Execution state represents the **current snapshot of a running CWD workflow**.

Conceptually:

```text
Execution State
│
├── Request Context
│   ├── User request
│   ├── User/session context
│   ├── Correlation ID
│   ├── Workflow ID
│   └── Request metadata
│
├── Task Information
│   ├── Intent
│   ├── Objective
│   ├── Task list
│   ├── Dependencies
│   └── Current task
│
├── Agent Information
│   ├── Selected Delegator
│   ├── Selected Workers
│   ├── Agent decisions
│   └── Agent results
│
├── Tool Information
│   ├── Tool calls
│   ├── Tool inputs
│   ├── Tool outputs
│   └── Tool status
│
├── Intermediate Data
│   ├── Retrieved documents
│   ├── Calculations
│   ├── Transformations
│   └── Partial results
│
├── Execution Control
│   ├── Current node
│   ├── Status
│   ├── Retry count
│   ├── Errors
│   └── Pending tasks
│
└── Final Response
    ├── Aggregated results
    ├── Validation status
    └── Final answer
```

The important point is that **state is not just the final answer**.

It represents the entire execution context required to safely continue the workflow.

---

# 2. Execution State Lifecycle

The state evolves throughout the CWD lifecycle.

```text
User Request
     │
     ▼
Create Initial State
     │
     ▼
Coordinator Processing
     │
     ▼
Planning / Task Creation
     │
     ▼
Delegator Execution
     │
     ▼
Worker Execution
     │
     ├── Retrieval
     ├── Tool Calls
     ├── Business Logic
     └── Validation
     │
     ▼
Results Update State
     │
     ▼
Coordinator Aggregation
     │
     ▼
Final Validation
     │
     ▼
Final Response State
     │
     ▼
User Response
```

At every stage:

```text
Current State
     │
     ▼
Node Executes
     │
     ▼
State Updated
     │
     ▼
Next Node
```

This is the fundamental StateGraph execution model.

---

# 3. Creating the Initial Execution State

When a request enters CWD, the Coordinator creates the initial execution context.

For example:

```python
state = {
    "workflow_id": "wf-12345",
    "correlation_id": "corr-789",
    "user_request": "Analyze yesterday's production incidents",

    "intent": None,
    "tasks": [],

    "selected_agents": [],
    "agent_results": [],

    "tool_outputs": [],
    "intermediate_data": [],

    "errors": [],
    "status": "RECEIVED",

    "current_node": "request_processing",

    "final_response": None
}
```

The initial state establishes the **execution identity and context**.

Important identifiers include:

| State            | Purpose                            |
| ---------------- | ---------------------------------- |
| `workflow_id`    | Identifies the workflow execution  |
| `correlation_id` | Traces the request across services |
| `user_request`   | Original user intent/request       |
| `status`         | Current execution status           |
| `current_node`   | Current workflow position          |
| `tasks`          | Work that must be executed         |

---

# 4. Request Context

Request context provides the information needed throughout the workflow.

```text
Request Context
│
├── User Request
├── User / Session Context
├── Workflow ID
├── Correlation ID
├── Timestamp
├── Tenant / Environment
├── Authorization Context
└── Request Metadata
```

For example:

```python
state["request_context"] = {
    "workflow_id": "wf-12345",
    "correlation_id": "corr-789",
    "request": "Analyze yesterday's production incidents",
    "environment": "production",
    "authorization": "approved"
}
```

This context should propagate downstream so that the Delegator and Workers understand **which workflow and request they are executing**.

---

# 5. State Is Updated by Nodes

Each LangGraph node performs a unit of work and updates the state.

Conceptually:

```text
Node
 │
 ├── Read State
 │
 ├── Perform Work
 │
 └── Update State
```

Mathematically:

$$
S_{t+1} = Node(S_t)
$$

Where:

* \(S_t\) = current execution state
* `Node` = unit of workflow execution
* \(S_{t+1}\) = updated execution state

For example:

```python
def classify_intent(state):

    intent = classify(state["user_request"])

    return {
        "intent": intent,
        "status": "PLANNED"
    }
```

The node doesn't create an entirely unrelated context.

It **transforms the existing execution state**.

---

# 6. State After Intent Classification

Initially:

```text
Request
Intent = None
Tasks = []
Status = RECEIVED
```

After the intent node:

```text
Request
Intent = Production Incident Analysis
Tasks = []
Status = PLANNING
```

The next node receives this updated state.

```text
Request Node
      │
      ▼
Intent Node
      │
      │ updates state
      ▼
Planning Node
```

Therefore, state provides continuity between nodes.

---

# 7. State During Planning

The Coordinator converts the user request into executable tasks.

For example:

```python
state["tasks"] = [
    {
        "task_id": "task-1",
        "description": "Retrieve production incidents",
        "assigned_to": "incident-delegator",
        "status": "PENDING"
    },
    {
        "task_id": "task-2",
        "description": "Analyze incident patterns",
        "assigned_to": "analytics-delegator",
        "status": "PENDING"
    }
]
```

The state now contains the execution plan.

```text
User Request
      │
      ▼
Intent
      │
      ▼
Execution Plan
      │
      ├── Task 1
      └── Task 2
```

This enables the Coordinator to track the workflow independently of the LLM's conversational context.

---

# 8. State Propagation from Coordinator to Delegator

The Coordinator does not simply send:

```text
"Analyze incidents"
```

Instead, it sends a structured task context.

Conceptually:

```json
{
  "workflow_id": "wf-12345",
  "correlation_id": "corr-789",
  "task_id": "task-1",
  "intent": "production_incident_analysis",
  "objective": "Retrieve production incidents",
  "constraints": {},
  "authorization_context": {},
  "deadline": "...",
  "status": "ASSIGNED"
}
```

The Delegator receives this information and creates or enriches its own execution state.

```text
Coordinator State
       │
       │ A2A
       ▼
Delegator State
```

The Delegator should preserve the parent execution identity:

```text
workflow_id
      │
      ├── Coordinator
      │
      └── Delegator
            │
            ├── Worker A
            └── Worker B
```

This creates a **parent-child execution relationship**.

---

# 9. Delegator State

The Delegator maintains domain-specific execution information.

For example:

```python
delegator_state = {
    "workflow_id": "wf-12345",
    "parent_task_id": "task-1",

    "domain": "incident_management",

    "worker_tasks": [
        {
            "task_id": "worker-task-1",
            "worker": "incident-retrieval-worker",
            "status": "PENDING"
        }
    ],

    "worker_results": [],
    "errors": [],
    "status": "RUNNING"
}
```

The Delegator can now manage its own domain workflow while remaining connected to the parent Coordinator workflow.

---

# 10. State Propagation to Workers

The Delegator sends an authorized, well-defined task to a Worker.

```text
Coordinator
     │
     │ Parent State
     ▼
Delegator
     │
     │ Worker Task Context
     ▼
Worker
```

The Worker receives information such as:

```json
{
  "workflow_id": "wf-12345",
  "parent_task_id": "task-1",
  "worker_task_id": "worker-task-1",

  "objective": "Retrieve production incidents",

  "inputs": {
    "date": "2026-09-04"
  },

  "authorization": "...",
  "deadline": "...",

  "status": "ASSIGNED"
}
```

The Worker doesn't need the entire global CWD state.

It receives the **relevant execution context required for its responsibility**.

This is important for security, scalability, and separation of responsibilities.

---

# 11. Worker Updates State During Execution

A Worker may execute several internal steps.

```text
Worker
 │
 ├── Validate Input
 │
 ├── Retrieve Data
 │
 ├── Invoke Tool
 │
 ├── Process Data
 │
 └── Validate Output
```

Each step can update execution state.

For example:

```text
Status = RUNNING

      ↓

Data Retrieved

      ↓

Tool Executed

      ↓

Result Generated

      ↓

Output Validated

      ↓

Status = COMPLETED
```

---

# 12. Tool Outputs Become State

Suppose a Worker calls a production monitoring system through MCP.

The result can become part of the Worker execution state:

```python
state["tool_outputs"].append({
    "tool": "production_monitor",
    "operation": "get_incidents",
    "status": "SUCCESS",
    "result": incident_data
})
```

The important architecture distinction is:

```text
LLM
 │
 │ decides/recommends
 ▼
Worker
 │
 │ governed execution
 ▼
MCP
 │
 ▼
Enterprise System
```

The tool output comes back into the Worker workflow and becomes available for subsequent processing.

---

# 13. Intermediate Data

Not every piece of information is a final result.

Workers frequently generate intermediate information.

For example:

```text
Raw Incident Data
       │
       ▼
Filtered Incidents
       │
       ▼
Normalized Data
       │
       ▼
Incident Categories
       │
       ▼
Pattern Analysis
       │
       ▼
Final Domain Result
```

The state can maintain references to these intermediate artifacts:

```python
state["intermediate_data"] = {
    "incident_count": 42,
    "critical_incidents": 7,
    "categories": [
        "deployment",
        "network",
        "database"
    ]
}
```

In production systems, large payloads should generally not be copied through every state transition.

Instead:

```text
Execution State
      │
      ├── Metadata
      ├── References
      ├── IDs
      └── Small Results
             │
             ▼
      External Storage
      ├── Documents
      ├── Large Results
      └── Artifacts
```

State should carry the **context and references**, while large data can remain in appropriate storage.

---

# 14. Agent Results Update State

When a Worker finishes:

```python
worker_result = {
    "task_id": "worker-task-1",
    "worker": "incident-retrieval-worker",
    "status": "COMPLETED",
    "result": {
        "incident_count": 42
    }
}
```

The Delegator updates:

```python
state["worker_results"].append(worker_result)
```

and:

```python
state["status"] = "COMPLETED"
```

The result then flows back toward the Coordinator.

```text
Worker
   │
   ▼
Delegator
   │
   │ Domain Result
   ▼
Coordinator
```

---

# 15. Error State

Errors are also part of execution state.

For example:

```python
state["errors"].append({
    "task_id": "worker-task-2",
    "node": "tool_invocation",
    "error_type": "TIMEOUT",
    "retryable": True,
    "attempt": 1
})
```

The workflow can then make a decision based on that state.

```text
Error
 │
 ├── Retryable?
 │      │
 │      ├── Yes → Retry
 │      │
 │      └── No
 │
 ├── Human Approval?
 │
 └── Recovery / Fail
```

This is where execution state becomes critical for resilience.

The system doesn't merely know **that something failed**.

It knows:

* where it failed
* which task failed
* what type of failure occurred
* how many times it was retried
* whether it is retryable
* whether the deadline has expired
* what recovery action should occur

---

# 16. Status State

CWD can maintain task and workflow status.

Typical states:

```text
RECEIVED
   ↓
VALIDATING
   ↓
PLANNING
   ↓
ASSIGNED
   ↓
RUNNING
   ↓
WAITING
   ↓
RETRYING
   ↓
COMPLETED
```

Failure states may include:

```text
FAILED
CANCELLED
REJECTED
TIMED_OUT
```

The state therefore acts as the workflow's **execution control plane**.

---

# 17. Conditional Routing Uses State

This connects directly to the previous discussion about LangGraph edges.

The next node can be determined from the current state:

$$
NextNode = f(State)
$$

For example:

```python
def route(state):

    if state["status"] == "COMPLETED":
        return "aggregate"

    if state["errors"] and state["retry_count"] < 3:
        return "retry"

    if state["approval_required"]:
        return "human_review"

    if state["status"] == "FAILED":
        return "recovery"

    return "continue"
```

Therefore:

```text
                 ┌── Retry
                 │
Current State ───┼── Human Review
                 │
                 ├── Recovery
                 │
                 └── Continue
```

The state determines the path.

---

# 18. State During Coordinator–Delegator–Worker Execution

The complete flow can be visualized as:

```text
                         CWD Execution State
                                │
                                ▼
                         ┌─────────────┐
                         │ Coordinator │
                         └──────┬──────┘
                                │
                    Request + Intent + Plan
                                │
                                ▼
                         ┌─────────────┐
                         │  Delegator  │
                         └──────┬──────┘
                                │
                   Domain Tasks + Context
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
              ┌──────────┐            ┌──────────┐
              │ Worker A │            │ Worker B │
              └────┬─────┘            └────┬─────┘
                   │                       │
              Tool/Data                Tool/Data
                   │                       │
                   ▼                       ▼
               Result A                Result B
                    \                     /
                     \                   /
                      ▼                 ▼
                         Delegator
                             │
                       Domain Result
                             │
                             ▼
                        Coordinator
                             │
                       Aggregate State
                             │
                             ▼
                      Final Response
```

The execution context is therefore **propagated downward and results are propagated upward**.

---

# 19. Parent and Child State

CWD can be understood as a hierarchical state model.

```text
Workflow State
│
└── Coordinator State
      │
      ├── Task A
      │     └── Delegator State
      │            ├── Worker A
      │            └── Worker B
      │
      └── Task B
            └── Delegator State
                   ├── Worker C
                   └── Worker D
```

The Coordinator maintains the global workflow context.

The Delegator maintains domain execution context.

The Worker maintains task-specific execution context.

This gives CWD:

```text
Global State
     +
Domain State
     +
Task State
```

without requiring every component to own the entire global state.

---

# 20. Aggregating Results

After Delegators complete their work, the Coordinator receives domain results.

For example:

```python
state["agent_results"] = [
    {
        "agent": "incident-delegator",
        "status": "COMPLETED",
        "result": {...}
    },
    {
        "agent": "analytics-delegator",
        "status": "COMPLETED",
        "result": {...}
    }
]
```

The Coordinator then creates an aggregated state:

```text
Worker Results
      │
      ▼
Delegator Results
      │
      ▼
Coordinator Aggregation
      │
      ▼
Unified Execution Result
```

---

# 21. Final Response State

The final response is produced only after the workflow reaches the appropriate completion state.

For example:

```python
state["final_response"] = {
    "status": "COMPLETED",
    "summary": "...",
    "findings": [...],
    "sources": [...],
    "confidence": "...",
}
```

The final state might look like:

```text
Workflow ID: wf-12345

Status: COMPLETED

Intent:
Production Incident Analysis

Tasks:
5

Completed:
5

Failed:
0

Agent Results:
3

Tool Calls:
8

Retries:
1

Validation:
PASSED

Final Response:
Generated
```

The final response is therefore **the output of the execution state**, not an isolated LLM generation.

---

# 22. Checkpointing Execution State

LangGraph checkpointing can persist execution state at important points.

For example:

```text
State
 │
 ▼
Planning
 │
 ▼
Checkpoint
 │
 ▼
Delegator Execution
 │
 ▼
Checkpoint
 │
 ▼
Worker Execution
 │
 ▼
Checkpoint
 │
 ▼
Aggregation
 │
 ▼
Final Response
```

If the runtime fails:

```text
Worker Execution
      │
      X Runtime Failure
      │
      ▼
Restore Checkpoint
      │
      ▼
Resume Workflow
```

This is particularly important for long-running enterprise workflows.

---

# 23. Human-in-the-Loop Uses the Same State

Suppose a workflow requires approval.

The state can become:

```python
{
    "status": "WAITING_FOR_APPROVAL",
    "approval_required": True,
    "approval_status": "PENDING",
    "current_node": "human_review"
}
```

The workflow pauses.

Later:

```text
Approval Received
       │
       ▼
State Updated
       │
       ▼
Resume From Checkpoint
       │
       ▼
Next Node
```

The system does not have to restart the entire workflow because the execution state preserves where it stopped.

---

# 24. Execution State vs Long-Term Memory

These are different concepts.

| Execution State        | Long-Term Memory          |
| ---------------------- | ------------------------- |
| Current workflow       | Persistent knowledge      |
| Current tasks          | Historical context        |
| Current status         | User preferences          |
| Current results        | Previous interactions     |
| Current errors         | Learned information       |
| Current node           | Knowledge/document memory |
| Short/medium lifecycle | Long lifecycle            |

For CWD:

```text
LangGraph State
      │
      │ Current execution
      ▼
Workflow

Long-Term Memory
      │
      │ Persistent context
      ▼
Future workflows
```

This distinction is important because **workflow state should not become an uncontrolled replacement for enterprise memory**.

---

# 25. What Should Be in CWD State?

A practical CWD execution state can be organized as:

```python
CWDState = {

    # Identity
    "workflow_id": ...,
    "correlation_id": ...,

    # Request
    "request_context": ...,
    "user_request": ...,

    # Planning
    "intent": ...,
    "plan": ...,
    "tasks": ...,

    # Agent execution
    "selected_agents": ...,
    "agent_results": ...,

    # Worker execution
    "worker_tasks": ...,
    "worker_results": ...,

    # Tools
    "tool_calls": ...,
    "tool_outputs": ...,

    # Data
    "intermediate_data": ...,
    "artifacts": ...,

    # Control
    "current_node": ...,
    "status": ...,
    "retry_count": ...,

    # Errors
    "errors": ...,

    # Governance
    "authorization": ...,
    "approval_status": ...,

    # Finalization
    "validation": ...,
    "final_response": ...
}
```

The exact schema will depend on the CWD implementation, but the principle remains the same.

---

# 26. State Ownership in CWD

A critical architectural principle is **state ownership**.

```text
Coordinator
│
├── Owns global workflow state
│
Delegator
│
├── Owns domain execution state
│
Worker
│
└── Owns task execution state
```

The Worker should not arbitrarily modify Coordinator-owned state.

Instead:

```text
Worker Result
      │
      ▼
Delegator
      │
      ▼
Coordinator
      │
      ▼
Global State Update
```

This preserves clear boundaries and prevents uncontrolled state mutation.

---

# 27. State Propagation ≠ Copying Everything

State propagation does **not** mean sending the complete state object everywhere.

Instead:

```text
Global State
     │
     ├── Relevant context
     │
     ├── Task information
     │
     ├── Authorization context
     │
     └── Required references
            │
            ▼
       Delegator
```

Then:

```text
Delegator State
     │
     ├── Domain context
     ├── Worker task
     ├── Required inputs
     └── Required authorization
            │
            ▼
          Worker
```

This minimizes:

* unnecessary data transfer
* security exposure
* context size
* state duplication
* coupling between agents

---

# 28. State and Security

Execution state may contain sensitive information.

Therefore CWD must consider:

```text
State
 │
 ├── Data classification
 ├── Authorization
 ├── Encryption
 ├── Retention
 ├── Access control
 ├── Logging controls
 └── PII / restricted-data handling
```

Particularly important:

> **Do not assume that because information exists in workflow state, every downstream agent or Worker is authorized to access it.**

Authorization must still be enforced at the appropriate boundaries.

---

# 29. State and Observability

Execution state also supports traceability.

A production workflow can expose:

```text
workflow_id
correlation_id
task_id
agent
worker
current_node
status
duration
retry_count
tool_call
checkpoint
error
final_outcome
```

This creates an execution trace:

```text
wf-12345
 │
 ├── Coordinator.Intent
 │
 ├── Coordinator.Planning
 │
 ├── Delegator.Decompose
 │
 ├── Worker.Retrieve
 │
 ├── Worker.ToolCall
 │
 ├── Worker.Validate
 │
 ├── Delegator.Aggregate
 │
 └── Coordinator.FinalResponse
```

This is essential for production debugging, auditing, and operational monitoring.

---

# 30. Complete CWD State Evolution

The entire lifecycle can be summarized as:

```text
1. REQUEST RECEIVED
       │
       ▼
2. INITIAL STATE CREATED
       │
       ▼
3. INTENT IDENTIFIED
       │
       ▼
4. PLAN CREATED
       │
       ▼
5. TASKS CREATED
       │
       ▼
6. DELEGATORS SELECTED
       │
       ▼
7. WORKERS SELECTED
       │
       ▼
8. WORKERS EXECUTE
       │
       ├── Tool Outputs
       ├── Intermediate Data
       ├── Results
       └── Errors
       │
       ▼
9. STATE UPDATED
       │
       ▼
10. CONDITIONAL ROUTING
       │
       ├── Retry
       ├── Recovery
       ├── Human Approval
       └── Continue
       │
       ▼
11. RESULTS AGGREGATED
       │
       ▼
12. FINAL VALIDATION
       │
       ▼
13. FINAL RESPONSE STATE
       │
       ▼
14. RESPONSE TO USER
```

---

# 31. How This Maps to LangGraph

This is where `StateGraph` becomes the foundation.

```text
StateGraph
│
├── State
│    └── CWD Execution Context
│
├── Nodes
│    └── Individual execution steps
│
├── Edges
│    └── Workflow progression
│
├── Conditional Edges
│    └── Dynamic routing
│
├── Checkpoints
│    └── State persistence
│
└── Recovery
     └── Resume / retry / human approval
```

Therefore:

```text
StateGraph
    +
CWD State
    +
Coordinator / Delegator / Worker
    +
A2A
    +
MCP
    +
Policy
    +
Agent Registry
    =
Enterprise Agent Execution
```

---

# 32. Key Architectural Separation

It is important not to confuse the responsibilities:

| Component          | Responsibility                             |
| ------------------ | ------------------------------------------ |
| **LLM**            | Reasoning, interpretation, recommendations |
| **StateGraph**     | State, workflow, transitions, lifecycle    |
| **Coordinator**    | Enterprise orchestration                   |
| **Delegator**      | Domain orchestration                       |
| **Worker**         | Specialized execution                      |
| **A2A**            | Agent-to-agent communication               |
| **MCP**            | Agent/Worker-to-tool interaction           |
| **Agent Registry** | Capability discovery                       |
| **Policy**         | Authorization and governance               |
| **Checkpointing**  | State persistence/resume                   |
| **Observability**  | Execution tracing and monitoring           |

The LLM should not be responsible for maintaining the authoritative execution state.

The **workflow runtime and state management layer** provide that control.

---

# 33. The Core Mental Model

The easiest way to understand CWD execution state is:

```text
              STATE
                │
        ┌───────┴───────┐
        │               │
     Context          Status
        │               │
        ├── Request     ├── Running
        ├── Tasks       ├── Waiting
        ├── Results     ├── Retrying
        ├── Tools       ├── Failed
        └── Data        └── Completed
                │
                ▼
             NODE
                │
          Performs Work
                │
                ▼
          STATE UPDATE
                │
                ▼
          CONDITIONAL EDGE
                │
                ▼
           NEXT NODE
```

So the execution loop is:

$$
\boxed{
State_t
\rightarrow
Node
\rightarrow
State_{t+1}
\rightarrow
Edge
\rightarrow
Next\ Node
}
$$

---

# Final Definition

> **CWD execution state is the authoritative, evolving context of a workflow that captures request context, task information, execution progress, agent and Worker results, tool outputs, intermediate data, errors, status, authorization/approval information, and final response information. LangGraph StateGraph provides the structure for creating, updating, routing, checkpointing, and resuming this state across the Coordinator–Delegator–Worker execution lifecycle.**

### Core Formula

$$
\boxed{
Execution\ State =
Context + Tasks + Results + Tool\ Outputs + Intermediate\ Data + Errors + Status + Control + Final\ Response
}
$$

And the most important CWD principle is:

> **State carries the execution context, nodes perform the work, edges control progression, and Coordinator–Delegator–Worker boundaries propagate the appropriate context and results throughout the enterprise workflow.**
