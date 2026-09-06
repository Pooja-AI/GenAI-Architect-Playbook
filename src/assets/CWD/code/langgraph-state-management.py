Yes. In the CWD architecture, **execution state is the shared context that travels through the entire LangGraph workflow**.

The pattern is:

```text
Initial State
     │
     ▼
Request Processing
     │  updates state
     ▼
Coordinator
     │  updates state
     ▼
Delegator
     │  updates state
     ▼
Worker
     │  updates state
     ▼
Tool / Retrieval
     │  updates state
     ▼
Validation
     │  updates state
     ▼
Response Generation
     │
     ▼
Final State
```

Each node receives the **current state**, performs its responsibility, and returns **state updates**. LangGraph then propagates those updates to the next node.

---

# 1. Define the CWD execution state

First, define a shared state object.

```python
from typing import TypedDict, List, Dict, Any, Optional


class CWDState(TypedDict, total=False):

    # ==================================================
    # Request Context
    # ==================================================

    request_id: str
    user_request: str
    user_id: str
    request_type: str
    user_intent: str

    # ==================================================
    # Planning / Coordinator
    # ==================================================

    plan: List[str]
    coordinator_decision: str

    # ==================================================
    # Task Information
    # ==================================================

    tasks: List[Dict[str, Any]]
    current_task: Optional[Dict[str, Any]]
    task_status: str

    # ==================================================
    # Worker Information
    # ==================================================

    current_worker: Optional[str]
    worker_status: str
    worker_result: Optional[str]

    # ==================================================
    # Retrieval
    # ==================================================

    retrieved_documents: List[str]
    retrieved_context: Optional[str]

    # ==================================================
    # Tool Execution
    # ==================================================

    tool_required: bool
    tool_name: Optional[str]
    tool_input: Optional[Dict[str, Any]]
    tool_output: Optional[Any]

    # ==================================================
    # Validation
    # ==================================================

    validation_passed: bool
    validation_errors: List[str]

    # ==================================================
    # Error Handling
    # ==================================================

    error: Optional[str]
    retry_count: int
    max_retries: int

    # ==================================================
    # Final Response
    # ==================================================

    final_response: Optional[str]

    # ==================================================
    # Workflow Status
    # ==================================================

    status: str
```

This state becomes the **shared execution context** for the entire CWD workflow.

---

# 2. Create the initial state

When a request enters the system, we create the initial state.

```python
initial_state = {

    "request_id": "REQ-001",

    "user_id": "USER-1001",

    "user_request":
        "Research the customer support policy and summarize it.",

    "request_type": "knowledge_request",

    "user_intent": "",

    "plan": [],

    "coordinator_decision": "",

    "tasks": [],

    "current_task": None,

    "task_status": "NOT_STARTED",

    "current_worker": None,

    "worker_status": "NOT_STARTED",

    "worker_result": None,

    "retrieved_documents": [],

    "retrieved_context": None,

    "tool_required": False,

    "tool_name": None,

    "tool_input": None,

    "tool_output": None,

    "validation_passed": False,

    "validation_errors": [],

    "error": None,

    "retry_count": 0,

    "max_retries": 3,

    "final_response": None,

    "status": "STARTED"
}
```

At this point:

```text
CWDState
│
├── request context
├── planning information
├── task information
├── worker information
├── retrieval information
├── tool information
├── validation information
├── error information
└── response information
```

---

# 3. Request processing updates the state

The first node receives the state.

```python
def request_processing(state: CWDState):

    request = state["user_request"]

    print("Processing request:")
    print(request)

    return {
        "request_type": "knowledge_request",
        "user_intent": "research",
        "status": "REQUEST_PROCESSED"
    }
```

Notice something important:

The node does **not recreate the entire state**.

It only returns the fields it wants to update:

```python
return {
    "request_type": "knowledge_request",
    "user_intent": "research",
    "status": "REQUEST_PROCESSED"
}
```

LangGraph propagates those updates into the existing state.

---

# 4. Planning updates the state

The planning node receives the updated state.

```python
def planning(state: CWDState):

    intent = state["user_intent"]

    plan = [
        "Understand research request",
        "Retrieve enterprise documents",
        "Execute research worker",
        "Validate worker result",
        "Generate final response"
    ]

    return {
        "plan": plan,
        "status": "PLAN_CREATED"
    }
```

The state now contains:

```text
user_request
     +
user_intent
     +
plan
     +
status
```

---

# 5. Coordinator updates the state

The Coordinator reads the current state.

```python
def coordinator(state: CWDState):

    intent = state["user_intent"]

    if intent == "research":

        decision = "delegate"

    else:

        decision = "direct_answer"

    return {
        "coordinator_decision": decision,
        "status": "COORDINATED"
    }
```

State becomes conceptually:

```python
{
    "user_request": "...",

    "user_intent": "research",

    "plan": [
        "Understand research request",
        "Retrieve enterprise documents",
        "Execute research worker",
        "Validate worker result",
        "Generate final response"
    ],

    "coordinator_decision": "delegate",

    "status": "COORDINATED"
}
```

---

# 6. Delegator adds task information

The Delegator converts the plan into an executable task.

```python
def delegator(state: CWDState):

    task = {
        "task_id": "TASK-001",
        "description": "Research customer support policy",
        "worker": "research_worker",
        "priority": "HIGH"
    }

    return {
        "tasks": [task],

        "current_task": task,

        "current_worker": "research_worker",

        "task_status": "ASSIGNED",

        "status": "TASK_ASSIGNED"
    }
```

Now state contains:

```text
Request
   │
   ├── user_request
   └── user_intent
        │
        ▼
Plan
        │
        ▼
Task
   │
   ├── task_id
   ├── description
   ├── worker
   └── priority
```

---

# 7. Retrieval updates intermediate data

The Worker may need enterprise knowledge.

```python
def retrieval(state: CWDState):

    documents = [
        "Customer Support Policy",
        "Customer Escalation Guidelines",
        "Support SLA Documentation"
    ]

    context = "\n".join(documents)

    return {
        "retrieved_documents": documents,

        "retrieved_context": context,

        "status": "RETRIEVAL_COMPLETED"
    }
```

The retrieval result becomes part of the execution state.

```python
state["retrieved_documents"]
```

contains:

```text
Customer Support Policy
Customer Escalation Guidelines
Support SLA Documentation
```

This information can now be consumed by downstream nodes.

---

# 8. Worker decides whether a tool is required

The Worker can inspect the state.

```python
def worker_decision(state: CWDState):

    request = state["user_request"].lower()

    if "customer database" in request:

        return {
            "tool_required": True,
            "tool_name": "customer_database",
            "tool_input": {
                "request": request
            }
        }

    return {
        "tool_required": False
    }
```

Now the state contains tool execution information.

---

# 9. Tool output becomes state

Suppose the tool is invoked.

```python
def tool_invocation(state: CWDState):

    tool_name = state["tool_name"]

    print(f"Calling tool: {tool_name}")

    result = {
        "customer_count": 1250,
        "status": "ACTIVE"
    }

    return {
        "tool_output": result,
        "status": "TOOL_COMPLETED"
    }
```

The state now contains:

```python
{
    "tool_name": "customer_database",

    "tool_input": {
        "request": "..."
    },

    "tool_output": {
        "customer_count": 1250,
        "status": "ACTIVE"
    }
}
```

The downstream Worker can consume this information.

---

# 10. Worker updates execution results

Now the Worker executes the actual task.

```python
def worker_execution(state: CWDState):

    documents = state.get(
        "retrieved_documents",
        []
    )

    tool_output = state.get(
        "tool_output"
    )

    worker = state["current_worker"]

    result = (
        f"{worker} completed the task. "
        f"Analyzed {len(documents)} documents. "
        f"Tool output: {tool_output}"
    )

    return {

        "worker_result": result,

        "worker_status": "COMPLETED",

        "task_status": "COMPLETED",

        "status": "WORK_COMPLETED"
    }
```

Now we have:

```text
Request
   ↓
Plan
   ↓
Task
   ↓
Worker
   ↓
Retrieved Documents
   ↓
Tool Output
   ↓
Worker Result
```

All of these can exist together in the state.

---

# 11. Validation updates the state

The validation node reads the Worker output.

```python
def validation(state: CWDState):

    worker_result = state.get(
        "worker_result"
    )

    errors = []

    if not worker_result:

        errors.append(
            "Worker result is empty"
        )

    if len(worker_result) < 20:

        errors.append(
            "Worker result is too short"
        )

    passed = len(errors) == 0

    return {

        "validation_passed": passed,

        "validation_errors": errors,

        "status":
            "VALIDATION_PASSED"
            if passed
            else "VALIDATION_FAILED"
    }
```

Successful state:

```python
{
    "validation_passed": True,
    "validation_errors": [],
    "status": "VALIDATION_PASSED"
}
```

Failed state:

```python
{
    "validation_passed": False,
    "validation_errors": [
        "Worker result is empty"
    ],
    "status": "VALIDATION_FAILED"
}
```

---

# 12. Errors are also propagated through state

Suppose a Worker fails.

```python
def worker_execution(state: CWDState):

    try:

        # Worker logic
        result = "Research completed successfully."

        return {
            "worker_result": result,
            "worker_status": "COMPLETED",
            "error": None,
            "status": "WORK_COMPLETED"
        }

    except Exception as e:

        return {
            "worker_status": "FAILED",
            "error": str(e),
            "status": "WORK_FAILED"
        }
```

Now downstream routing can inspect:

```python
state["error"]
```

and:

```python
state["worker_status"]
```

to determine what happens next.

---

# 13. Retry state

The retry node updates the retry counter.

```python
def retry_worker(state: CWDState):

    retry_count = state.get(
        "retry_count",
        0
    )

    retry_count += 1

    return {

        "retry_count": retry_count,

        "worker_status": "RETRYING",

        "status": "RETRYING"
    }
```

The state evolves:

```text
retry_count = 0
       ↓
retry_count = 1
       ↓
retry_count = 2
       ↓
retry_count = 3
```

A routing function can then stop infinite retries.

---

# 14. Final response updates the state

After successful validation:

```python
def response_generation(state: CWDState):

    worker_result = state["worker_result"]

    response = (
        "Based on the enterprise knowledge and "
        "validated worker execution:\n\n"
        + worker_result
    )

    return {

        "final_response": response,

        "status": "COMPLETED"
    }
```

The final state now contains:

```text
┌───────────────────────────────────────┐
│              CWDState                 │
├───────────────────────────────────────┤
│ request_id                            │
│ user_request                          │
│ user_intent                           │
│ plan                                  │
│ coordinator_decision                  │
│ tasks                                 │
│ current_task                          │
│ current_worker                        │
│ retrieved_documents                   │
│ retrieved_context                     │
│ tool_name                             │
│ tool_input                            │
│ tool_output                           │
│ worker_result                         │
│ validation_passed                     │
│ validation_errors                     │
│ retry_count                           │
│ error                                 │
│ final_response                        │
│ status = COMPLETED                    │
└───────────────────────────────────────┘
```

---

# 15. Complete executable LangGraph example

Here is the complete version.

```python
from typing import TypedDict, List, Dict, Any, Optional

from langgraph.graph import (
    StateGraph,
    START,
    END
)


# ============================================================
# 1. CWD EXECUTION STATE
# ============================================================

class CWDState(TypedDict, total=False):

    # Request context
    request_id: str
    user_id: str
    user_request: str
    request_type: str
    user_intent: str

    # Planning
    plan: List[str]

    # Coordinator
    coordinator_decision: str

    # Tasks
    tasks: List[Dict[str, Any]]
    current_task: Optional[Dict[str, Any]]
    task_status: str

    # Worker
    current_worker: Optional[str]
    worker_status: str
    worker_result: Optional[str]

    # Retrieval
    retrieved_documents: List[str]
    retrieved_context: Optional[str]

    # Tools
    tool_required: bool
    tool_name: Optional[str]
    tool_input: Optional[Dict[str, Any]]
    tool_output: Optional[Any]

    # Validation
    validation_passed: bool
    validation_errors: List[str]

    # Error / retry
    error: Optional[str]
    retry_count: int
    max_retries: int

    # Response
    final_response: Optional[str]

    # Workflow
    status: str


# ============================================================
# 2. REQUEST PROCESSING
# ============================================================

def request_processing(state: CWDState):

    request = state["user_request"]

    print("Request processing...")

    return {
        "request_type": "knowledge_request",
        "user_intent": "research",
        "status": "REQUEST_PROCESSED"
    }


# ============================================================
# 3. PLANNING
# ============================================================

def planning(state: CWDState):

    print("Planning...")

    plan = [
        "Understand request",
        "Retrieve enterprise knowledge",
        "Delegate task",
        "Execute worker",
        "Validate result",
        "Generate response"
    ]

    return {
        "plan": plan,
        "status": "PLAN_CREATED"
    }


# ============================================================
# 4. COORDINATOR
# ============================================================

def coordinator(state: CWDState):

    print("Coordinator...")

    return {
        "coordinator_decision": "delegate",
        "status": "COORDINATED"
    }


# ============================================================
# 5. DELEGATOR
# ============================================================

def delegator(state: CWDState):

    print("Delegator...")

    task = {
        "task_id": "TASK-001",
        "description": "Research customer support policy",
        "worker": "research_worker",
        "priority": "HIGH"
    }

    return {
        "tasks": [task],
        "current_task": task,
        "current_worker": "research_worker",
        "task_status": "ASSIGNED",
        "status": "TASK_ASSIGNED"
    }


# ============================================================
# 6. RETRIEVAL
# ============================================================

def retrieval(state: CWDState):

    print("Retrieving enterprise knowledge...")

    documents = [
        "Customer Support Policy",
        "Customer Escalation Guidelines",
        "Support SLA Documentation"
    ]

    context = "\n".join(documents)

    return {
        "retrieved_documents": documents,
        "retrieved_context": context,
        "status": "RETRIEVAL_COMPLETED"
    }


# ============================================================
# 7. TOOL DECISION
# ============================================================

def tool_decision(state: CWDState):

    request = state["user_request"].lower()

    if "customer database" in request:

        return {
            "tool_required": True,
            "tool_name": "customer_database",
            "tool_input": {
                "request": request
            }
        }

    return {
        "tool_required": False
    }


# ============================================================
# 8. TOOL INVOCATION
# ============================================================

def tool_invocation(state: CWDState):

    print("Tool invocation...")

    result = {
        "customer_count": 1250,
        "database_status": "ACTIVE"
    }

    return {
        "tool_output": result,
        "status": "TOOL_COMPLETED"
    }


# ============================================================
# 9. WORKER EXECUTION
# ============================================================

def worker_execution(state: CWDState):

    print("Worker execution...")

    try:

        documents = state.get(
            "retrieved_documents",
            []
        )

        tool_output = state.get(
            "tool_output"
        )

        worker = state.get(
            "current_worker"
        )

        result = (
            f"{worker} completed the task. "
            f"Analyzed {len(documents)} enterprise documents. "
            f"Tool output: {tool_output}"
        )

        return {

            "worker_result": result,

            "worker_status": "COMPLETED",

            "task_status": "COMPLETED",

            "error": None,

            "status": "WORK_COMPLETED"
        }

    except Exception as e:

        return {

            "worker_status": "FAILED",

            "error": str(e),

            "status": "WORK_FAILED"
        }


# ============================================================
# 10. VALIDATION
# ============================================================

def validation(state: CWDState):

    print("Validation...")

    result = state.get(
        "worker_result"
    )

    errors = []

    if not result:
        errors.append(
            "Worker result is empty"
        )

    if result and len(result) < 20:
        errors.append(
            "Worker result is too short"
        )

    passed = len(errors) == 0

    return {

        "validation_passed": passed,

        "validation_errors": errors,

        "status":
            "VALIDATION_PASSED"
            if passed
            else "VALIDATION_FAILED"
    }


# ============================================================
# 11. RETRY
# ============================================================

def retry_worker(state: CWDState):

    retry_count = state.get(
        "retry_count",
        0
    )

    return {

        "retry_count": retry_count + 1,

        "worker_status": "RETRYING",

        "status": "RETRYING"
    }


# ============================================================
# 12. FAILURE HANDLER
# ============================================================

def failure_handler(state: CWDState):

    error = state.get(
        "error",
        "Unknown workflow failure"
    )

    return {

        "final_response":
            f"Request could not be completed. "
            f"Error: {error}",

        "status": "FAILED"
    }


# ============================================================
# 13. RESPONSE GENERATION
# ============================================================

def response_generation(state: CWDState):

    result = state["worker_result"]

    response = (
        "Final validated response:\n\n"
        + result
    )

    return {

        "final_response": response,

        "status": "COMPLETED"
    }


# ============================================================
# ROUTING
# ============================================================

def route_tool(state: CWDState):

    if state.get("tool_required"):
        return "tool"

    return "worker"


def route_validation(state: CWDState):

    if state.get("validation_passed"):
        return "success"

    retry_count = state.get(
        "retry_count",
        0
    )

    max_retries = state.get(
        "max_retries",
        3
    )

    if retry_count < max_retries:
        return "retry"

    return "failure"


# ============================================================
# BUILD GRAPH
# ============================================================

builder = StateGraph(CWDState)


# Add nodes

builder.add_node(
    "request_processing",
    request_processing
)

builder.add_node(
    "planning",
    planning
)

builder.add_node(
    "coordinator",
    coordinator
)

builder.add_node(
    "delegator",
    delegator
)

builder.add_node(
    "retrieval",
    retrieval
)

builder.add_node(
    "tool_decision",
    tool_decision
)

builder.add_node(
    "tool_invocation",
    tool_invocation
)

builder.add_node(
    "worker_execution",
    worker_execution
)

builder.add_node(
    "validation",
    validation
)

builder.add_node(
    "retry_worker",
    retry_worker
)

builder.add_node(
    "failure_handler",
    failure_handler
)

builder.add_node(
    "response_generation",
    response_generation
)


# ============================================================
# EDGES
# ============================================================

builder.add_edge(
    START,
    "request_processing"
)

builder.add_edge(
    "request_processing",
    "planning"
)

builder.add_edge(
    "planning",
    "coordinator"
)

builder.add_edge(
    "coordinator",
    "delegator"
)

builder.add_edge(
    "delegator",
    "retrieval"
)

builder.add_edge(
    "retrieval",
    "tool_decision"
)


# Tool routing

builder.add_conditional_edges(
    "tool_decision",
    route_tool,
    {
        "tool": "tool_invocation",
        "worker": "worker_execution"
    }
)


builder.add_edge(
    "tool_invocation",
    "worker_execution"
)

builder.add_edge(
    "worker_execution",
    "validation"
)


# Validation routing

builder.add_conditional_edges(
    "validation",
    route_validation,
    {
        "success": "response_generation",
        "retry": "retry_worker",
        "failure": "failure_handler"
    }
)


builder.add_edge(
    "retry_worker",
    "worker_execution"
)

builder.add_edge(
    "response_generation",
    END
)

builder.add_edge(
    "failure_handler",
    END
)


# ============================================================
# COMPILE
# ============================================================

graph = builder.compile()


# ============================================================
# INITIAL STATE
# ============================================================

initial_state: CWDState = {

    "request_id": "REQ-001",

    "user_id": "USER-1001",

    "user_request":
        "Research the customer support policy",

    "retry_count": 0,

    "max_retries": 3,

    "status": "STARTED"
}


# ============================================================
# EXECUTE
# ============================================================

result = graph.invoke(
    initial_state
)


# ============================================================
# FINAL STATE
# ============================================================

print("\n==============================")
print("FINAL STATE")
print("==============================")

for key, value in result.items():

    print(f"{key}: {value}")
```

---

# 16. State propagation visually

The most important concept is this:

```text
                    CWDState
                       │
                       ▼
              Request Processing
                       │
              + user_intent
              + request_type
                       │
                       ▼
                  Planning
                       │
                   + plan
                       │
                       ▼
                 Coordinator
                       │
              + coordinator_decision
                       │
                       ▼
                  Delegator
                       │
              + task
              + worker
                       │
                       ▼
                 Retrieval
                       │
              + documents
              + context
                       │
                       ▼
                Tool Decision
                       │
                       ▼
                Tool Invocation
                       │
                  + tool_output
                       │
                       ▼
                 Worker
                       │
                  + result
                  + status
                       │
                       ▼
                 Validation
                       │
            + validation result
            + errors
                       │
                       ▼
             Response Generation
                       │
                + final_response
                       │
                       ▼
                      END
```

### The critical idea

LangGraph does **not** create a completely separate state for every node.

Instead, conceptually:

```python
state_0
   ↓
state_1 = state_0 + request_updates
   ↓
state_2 = state_1 + planning_updates
   ↓
state_3 = state_2 + coordinator_updates
   ↓
state_4 = state_3 + task_updates
   ↓
state_5 = state_4 + retrieval_updates
   ↓
state_6 = state_5 + tool_updates
   ↓
state_7 = state_6 + worker_updates
   ↓
state_8 = state_7 + validation_updates
   ↓
state_9 = state_8 + response_updates
```

So the **execution state acts as the memory/context carrier for the workflow**.

---

## 17. CWD responsibility vs State responsibility

This is a very useful architectural distinction:

| Component           | Responsibility                         |
| ------------------- | -------------------------------------- |
| **Coordinator**     | Decides what should happen             |
| **Delegator**       | Decides who should execute it          |
| **Worker**          | Performs the task                      |
| **Retrieval**       | Adds retrieved knowledge to state      |
| **Tool**            | Adds external/tool results to state    |
| **Validation**      | Adds quality/status information        |
| **LangGraph State** | Carries execution context across nodes |
| **LangGraph Edges** | Determine where execution goes next    |
| **Final Response**  | Consumes validated state               |

In other words:

> **State carries the information; nodes modify the information; edges use the information to control the workflow.**

That is the foundation for making your production CWD workflow **stateful, traceable, recoverable, and controllable**.
