Yes. **Conditional routing is where LangGraph becomes dynamic**. Instead of always doing:

```text
Coordinator → Delegator → Worker → Validation → Response
```

the graph examines the current `CWDState` and decides **which node should execute next**.

In your CWD architecture:

> **State + Decision Function → Next Workflow Path**

The routing decision can depend on **user intent, task status, Coordinator decisions, Worker availability, tool results, validation, or failures**.

---

# 1. Basic conditional routing pattern

The core LangGraph pattern is:

```python
builder.add_conditional_edges(
    "source_node",
    routing_function,
    {
        "route_a": "node_a",
        "route_b": "node_b"
    }
)
```

Conceptually:

```text
                    Current State
                         │
                         ▼
                 Routing Function
                  /       |       \
                 /        |        \
                ▼         ▼         ▼
             Node A     Node B    Node C
```

The routing function does **not perform the actual work**. It only determines where the graph should go next.

---

# 2. CWD state

Let's create a state containing the information that routing decisions may need.

```python
from typing import TypedDict, List, Optional
from langgraph.graph import StateGraph, START, END


class CWDState(TypedDict, total=False):

    # Request information
    user_request: str
    user_intent: str

    # Planning
    plan: List[str]

    # Coordinator
    coordinator_decision: str

    # Delegator
    current_task: str
    selected_worker: str
    worker_available: bool

    # Worker
    worker_status: str
    worker_result: str

    # Tools
    tool_required: bool
    tool_name: str
    tool_result: str

    # Validation
    validation_passed: bool
    validation_errors: List[str]

    # Retry / failure
    retry_count: int
    max_retries: int

    # Final response
    final_response: Optional[str]

    status: str
```

Now the graph has a **shared state object** that routing functions can inspect.

---

# 3. Routing based on user intent

Suppose the user asks:

```text
"Research our customer support policy"
```

The request could be classified as:

```text
research
analysis
support
general
```

The intent classifier:

```python
def classify_intent(state):

    request = state["user_request"].lower()

    if "research" in request:
        intent = "research"

    elif "analyze" in request:
        intent = "analysis"

    elif "support" in request:
        intent = "support"

    else:
        intent = "general"

    return {
        "user_intent": intent,
        "status": "INTENT_CLASSIFIED"
    }
```

Now create the routing function:

```python
def route_by_intent(state):

    intent = state["user_intent"]

    if intent == "research":
        return "research"

    elif intent == "analysis":
        return "analysis"

    elif intent == "support":
        return "support"

    return "general"
```

Connect it to the graph:

```python
builder.add_conditional_edges(
    "classify_intent",
    route_by_intent,
    {
        "research": "research_worker",
        "analysis": "analysis_worker",
        "support": "support_worker",
        "general": "general_worker"
    }
)
```

So:

```text
                Intent
                  │
                  ▼
          route_by_intent()
             /    |    \
            /     |     \
           ▼      ▼      ▼
      Research  Analysis Support
       Worker    Worker   Worker
```

---

# 4. Routing based on Coordinator decision

Now consider the Coordinator.

The Coordinator may decide:

```text
delegate
direct_answer
needs_clarification
```

```python
def coordinator(state):

    intent = state["user_intent"]

    if intent == "general":
        decision = "direct_answer"

    elif intent in ["research", "analysis", "support"]:
        decision = "delegate"

    else:
        decision = "needs_clarification"

    return {
        "coordinator_decision": decision,
        "status": "COORDINATED"
    }
```

Routing function:

```python
def route_after_coordinator(state):

    decision = state["coordinator_decision"]

    if decision == "delegate":
        return "delegate"

    if decision == "direct_answer":
        return "direct"

    if decision == "needs_clarification":
        return "clarification"

    return "failure"
```

Conditional edge:

```python
builder.add_conditional_edges(
    "coordinator",
    route_after_coordinator,
    {
        "delegate": "delegator",
        "direct": "response_generation",
        "clarification": "human_clarification",
        "failure": END
    }
)
```

Now the Coordinator controls the next stage:

```text
                     Coordinator
                          │
            ┌─────────────┼──────────────┐
            ▼             ▼              ▼
        Delegate       Direct       Clarification
            │             │              │
            ▼             ▼              ▼
        Delegator      Response       Human
```

---

# 5. Routing based on Worker availability

This is particularly useful in your CWD architecture.

Suppose the Delegator selects:

```python
def delegator(state):

    intent = state["user_intent"]

    if intent == "research":
        worker = "research_worker"

    elif intent == "analysis":
        worker = "analysis_worker"

    else:
        worker = "support_worker"

    # Example availability check
    available = True

    return {
        "selected_worker": worker,
        "worker_available": available,
        "status": "WORKER_SELECTED"
    }
```

Now route based on availability:

```python
def route_worker_availability(state):

    if state["worker_available"]:
        return "worker_available"

    return "worker_unavailable"
```

Conditional routing:

```python
builder.add_conditional_edges(
    "delegator",
    route_worker_availability,
    {
        "worker_available": "worker_execution",
        "worker_unavailable": "fallback_worker"
    }
)
```

Flow:

```text
                 Delegator
                    │
                    ▼
             Worker Available?
                /        \
              YES         NO
               │           │
               ▼           ▼
           Worker       Fallback
          Execution      Worker
```

---

# 6. Routing based on task status

Suppose the Worker returns:

```text
WORK_COMPLETED
WORK_IN_PROGRESS
WORK_FAILED
```

Worker:

```python
def worker_execution(state):

    try:

        result = "Customer policy analysis completed."

        return {
            "worker_result": result,
            "worker_status": "WORK_COMPLETED",
            "status": "WORK_COMPLETED"
        }

    except Exception as e:

        return {
            "worker_status": "WORK_FAILED",
            "status": "WORK_FAILED"
        }
```

Routing:

```python
def route_after_worker(state):

    status = state["worker_status"]

    if status == "WORK_COMPLETED":
        return "completed"

    if status == "WORK_IN_PROGRESS":
        return "continue"

    if status == "WORK_FAILED":
        return "failed"

    return "unknown"
```

Conditional edges:

```python
builder.add_conditional_edges(
    "worker_execution",
    route_after_worker,
    {
        "completed": "validation",
        "continue": "worker_execution",
        "failed": "failure_handler",
        "unknown": END
    }
)
```

This gives:

```text
                   Worker
                     │
             ┌───────┼────────┐
             │       │        │
             ▼       ▼        ▼
          Complete InProgress Failed
             │       │        │
             ▼       │        ▼
        Validation ◄─┘     Failure
```

---

# 7. Routing based on tool results

A Worker may decide that a tool is required.

```python
def worker_decision(state):

    request = state["user_request"].lower()

    if "customer database" in request:
        return {
            "tool_required": True,
            "tool_name": "customer_database"
        }

    return {
        "tool_required": False
    }
```

Routing:

```python
def route_tool(state):

    if state.get("tool_required"):
        return "tool"

    return "no_tool"
```

Conditional edge:

```python
builder.add_conditional_edges(
    "worker_decision",
    route_tool,
    {
        "tool": "tool_invocation",
        "no_tool": "worker_execution"
    }
)
```

Flow:

```text
                 Worker Decision
                       │
                Tool required?
                  /        \
                YES         NO
                 │           │
                 ▼           ▼
             Tool Call     Worker
                 │
                 ▼
              Worker
```

---

# 8. Routing based on tool result

The tool itself may return different outcomes.

```python
def tool_invocation(state):

    tool_name = state["tool_name"]

    if tool_name == "customer_database":

        result = "CUSTOMER_FOUND"

    else:

        result = "TOOL_ERROR"

    return {
        "tool_result": result
    }
```

Routing function:

```python
def route_after_tool(state):

    result = state["tool_result"]

    if result == "CUSTOMER_FOUND":
        return "success"

    if result == "CUSTOMER_NOT_FOUND":
        return "not_found"

    if result == "TOOL_ERROR":
        return "error"

    return "unknown"
```

Conditional edges:

```python
builder.add_conditional_edges(
    "tool_invocation",
    route_after_tool,
    {
        "success": "worker_execution",
        "not_found": "fallback_worker",
        "error": "tool_retry",
        "unknown": END
    }
)
```

---

# 9. Routing based on validation outcome

This is one of the most important patterns for production CWD.

After the Worker completes:

```text
Worker
   │
   ▼
Validation
   │
   ├── PASS ──► Response
   │
   └── FAIL ──► Retry
```

Validation:

```python
def validation(state):

    result = state.get("worker_result")

    if result and len(result) > 10:

        return {
            "validation_passed": True,
            "validation_errors": []
        }

    return {
        "validation_passed": False,
        "validation_errors": [
            "Worker result is incomplete"
        ]
    }
```

Routing:

```python
def route_after_validation(state):

    if state["validation_passed"]:
        return "passed"

    return "failed"
```

Conditional edge:

```python
builder.add_conditional_edges(
    "validation",
    route_after_validation,
    {
        "passed": "response_generation",
        "failed": "retry_decision"
    }
)
```

---

# 10. Routing based on failure conditions

Now combine validation failure with retry limits.

```python
def route_after_failure(state):

    retry_count = state.get("retry_count", 0)
    max_retries = state.get("max_retries", 3)

    if retry_count < max_retries:
        return "retry"

    return "permanent_failure"
```

Conditional edge:

```python
builder.add_conditional_edges(
    "retry_decision",
    route_after_failure,
    {
        "retry": "retry_worker",
        "permanent_failure": "failure_handler"
    }
)
```

Retry:

```python
def retry_worker(state):

    retry_count = state.get("retry_count", 0)

    return {
        "retry_count": retry_count + 1,
        "status": "RETRYING"
    }
```

Connect it back:

```python
builder.add_edge(
    "retry_worker",
    "worker_execution"
)
```

Flow:

```text
                       Validation
                           │
                    ┌──────┴──────┐
                    │             │
                  PASS          FAIL
                    │             │
                    ▼             ▼
                Response    Retry Decision
                    │             │
                    │       ┌─────┴─────┐
                    │       │           │
                    │     Retry      Max Retry
                    │       │           │
                    │       ▼           ▼
                    │     Worker      Failure
                    │       │
                    │       ▼
                    │   Validation
                    │
                    ▼
                   END
```

---

# 11. Complete conditional CWD example

Here is the complete pattern bringing these routing decisions together.

```python
from typing import TypedDict, List
from langgraph.graph import StateGraph, START, END


# ============================================================
# STATE
# ============================================================

class CWDState(TypedDict, total=False):

    user_request: str
    user_intent: str

    coordinator_decision: str

    selected_worker: str
    worker_available: bool

    tool_required: bool
    tool_name: str
    tool_result: str

    worker_status: str
    worker_result: str

    validation_passed: bool
    validation_errors: List[str]

    retry_count: int
    max_retries: int

    final_response: str
    status: str


# ============================================================
# NODE 1: REQUEST / INTENT
# ============================================================

def classify_intent(state):

    request = state["user_request"].lower()

    if "research" in request:
        intent = "research"

    elif "analyze" in request:
        intent = "analysis"

    elif "support" in request:
        intent = "support"

    else:
        intent = "general"

    return {
        "user_intent": intent
    }


# ============================================================
# NODE 2: COORDINATOR
# ============================================================

def coordinator(state):

    intent = state["user_intent"]

    if intent == "general":
        decision = "direct_answer"

    else:
        decision = "delegate"

    return {
        "coordinator_decision": decision
    }


# ============================================================
# NODE 3: DELEGATOR
# ============================================================

def delegator(state):

    intent = state["user_intent"]

    workers = {
        "research": "research_worker",
        "analysis": "analysis_worker",
        "support": "support_worker"
    }

    worker = workers.get(
        intent,
        "support_worker"
    )

    # Simulated availability check
    available = True

    return {
        "selected_worker": worker,
        "worker_available": available
    }


# ============================================================
# NODE 4: WORKER DECISION
# ============================================================

def worker_decision(state):

    request = state["user_request"].lower()

    if "customer database" in request:

        return {
            "tool_required": True,
            "tool_name": "customer_database"
        }

    return {
        "tool_required": False
    }


# ============================================================
# NODE 5: TOOL
# ============================================================

def tool_invocation(state):

    tool_name = state["tool_name"]

    if tool_name == "customer_database":

        return {
            "tool_result": "CUSTOMER_FOUND"
        }

    return {
        "tool_result": "TOOL_ERROR"
    }


# ============================================================
# NODE 6: WORKER
# ============================================================

def worker_execution(state):

    worker = state["selected_worker"]

    result = (
        f"{worker} completed the requested task."
    )

    return {
        "worker_result": result,
        "worker_status": "WORK_COMPLETED"
    }


# ============================================================
# NODE 7: VALIDATION
# ============================================================

def validation(state):

    result = state.get("worker_result")

    if result:

        return {
            "validation_passed": True,
            "validation_errors": []
        }

    return {
        "validation_passed": False,
        "validation_errors": [
            "Worker produced no result"
        ]
    }


# ============================================================
# NODE 8: RETRY
# ============================================================

def retry_worker(state):

    retry_count = state.get(
        "retry_count",
        0
    )

    return {
        "retry_count": retry_count + 1
    }


# ============================================================
# NODE 9: FALLBACK
# ============================================================

def fallback_worker(state):

    return {
        "worker_result":
            "Fallback worker handled the request.",
        "worker_status":
            "FALLBACK_COMPLETED"
    }


# ============================================================
# NODE 10: FAILURE
# ============================================================

def failure_handler(state):

    return {
        "final_response":
            "The request could not be completed.",
        "status":
            "FAILED"
    }


# ============================================================
# NODE 11: RESPONSE
# ============================================================

def response_generation(state):

    return {
        "final_response":
            state["worker_result"],
        "status":
            "COMPLETED"
    }


# ============================================================
# ROUTING 1: COORDINATOR
# ============================================================

def route_after_coordinator(state):

    decision = state["coordinator_decision"]

    if decision == "delegate":
        return "delegate"

    if decision == "direct_answer":
        return "response"

    return "failure"


# ============================================================
# ROUTING 2: WORKER AVAILABILITY
# ============================================================

def route_worker_availability(state):

    if state.get("worker_available"):
        return "available"

    return "unavailable"


# ============================================================
# ROUTING 3: TOOL REQUIREMENT
# ============================================================

def route_tool_requirement(state):

    if state.get("tool_required"):
        return "tool"

    return "worker"


# ============================================================
# ROUTING 4: TOOL RESULT
# ============================================================

def route_tool_result(state):

    result = state.get("tool_result")

    if result == "CUSTOMER_FOUND":
        return "success"

    if result == "TOOL_ERROR":
        return "error"

    return "failure"


# ============================================================
# ROUTING 5: VALIDATION
# ============================================================

def route_validation(state):

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


# Nodes

builder.add_node(
    "classify_intent",
    classify_intent
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
    "worker_decision",
    worker_decision
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
    "fallback_worker",
    fallback_worker
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
# SEQUENTIAL FLOW
# ============================================================

builder.add_edge(
    START,
    "classify_intent"
)

builder.add_edge(
    "classify_intent",
    "coordinator"
)


# ============================================================
# CONDITIONAL: COORDINATOR
# ============================================================

builder.add_conditional_edges(
    "coordinator",
    route_after_coordinator,
    {
        "delegate": "delegator",
        "response": "response_generation",
        "failure": "failure_handler"
    }
)


# ============================================================
# CONDITIONAL: WORKER AVAILABILITY
# ============================================================

builder.add_conditional_edges(
    "delegator",
    route_worker_availability,
    {
        "available": "worker_decision",
        "unavailable": "fallback_worker"
    }
)


# ============================================================
# CONDITIONAL: TOOL
# ============================================================

builder.add_conditional_edges(
    "worker_decision",
    route_tool_requirement,
    {
        "tool": "tool_invocation",
        "worker": "worker_execution"
    }
)


# ============================================================
# CONDITIONAL: TOOL RESULT
# ============================================================

builder.add_conditional_edges(
    "tool_invocation",
    route_tool_result,
    {
        "success": "worker_execution",
        "error": "retry_worker",
        "failure": "failure_handler"
    }
)


# ============================================================
# WORKER → VALIDATION
# ============================================================

builder.add_edge(
    "worker_execution",
    "validation"
)


# ============================================================
# CONDITIONAL: VALIDATION
# ============================================================

builder.add_conditional_edges(
    "validation",
    route_validation,
    {
        "success": "response_generation",
        "retry": "retry_worker",
        "failure": "failure_handler"
    }
)


# ============================================================
# RETRY → WORKER
# ============================================================

builder.add_edge(
    "retry_worker",
    "worker_execution"
)


# ============================================================
# FALLBACK → VALIDATION
# ============================================================

builder.add_edge(
    "fallback_worker",
    "validation"
)


# ============================================================
# RESPONSE → END
# ============================================================

builder.add_edge(
    "response_generation",
    END
)


# ============================================================
# FAILURE → END
# ============================================================

builder.add_edge(
    "failure_handler",
    END
)


# ============================================================
# COMPILE
# ============================================================

graph = builder.compile()


# ============================================================
# EXECUTION
# ============================================================

initial_state = {
    "user_request":
        "Research the customer support policy",
    "retry_count": 0,
    "max_retries": 3,
    "status": "STARTED"
}

result = graph.invoke(initial_state)

print(result)
```

---

# 12. What makes this "dynamic"?

The graph structure is defined once:

```text
Coordinator
    ↓
Delegator
    ↓
Worker
    ↓
Validation
    ↓
Response
```

But the **actual execution path can change at runtime**.

For example:

### Scenario A — Normal request

```text
Request
 ↓
Coordinator
 ↓
Delegator
 ↓
Worker
 ↓
Validation PASS
 ↓
Response
 ↓
END
```

### Scenario B — Worker unavailable

```text
Request
 ↓
Coordinator
 ↓
Delegator
 ↓
Worker unavailable
 ↓
Fallback Worker
 ↓
Validation
 ↓
Response
```

### Scenario C — Tool required

```text
Request
 ↓
Coordinator
 ↓
Delegator
 ↓
Worker Decision
 ↓
Tool Required
 ↓
Tool Invocation
 ↓
Worker
 ↓
Validation
 ↓
Response
```

### Scenario D — Validation failure

```text
Worker
 ↓
Validation FAIL
 ↓
Retry
 ↓
Worker
 ↓
Validation PASS
 ↓
Response
```

### Scenario E — Maximum retries exceeded

```text
Worker
 ↓
Validation FAIL
 ↓
Retry
 ↓
Worker
 ↓
Validation FAIL
 ↓
Retry
 ↓
Worker
 ↓
Validation FAIL
 ↓
Max Retry
 ↓
Failure Handler
 ↓
END
```

---

# 13. The important CWD architecture relationship

This gives you a very clean separation:

```text
┌─────────────────────────────────────────────────────────┐
│                    LangGraph                            │
│              Workflow Control Layer                    │
│                                                         │
│  State + Conditional Routing + Retry + Persistence      │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
                  ┌─────────────┐
                  │ Coordinator │
                  │    WHAT?    │
                  └──────┬──────┘
                         │
                   decision
                         │
                         ▼
                  ┌─────────────┐
                  │  Delegator  │
                  │    WHO?     │
                  └──────┬──────┘
                         │
                  worker selection
                         │
          ┌──────────────┼───────────────┐
          ▼              ▼               ▼
     Research         Analysis        Support
      Worker           Worker          Worker
          │              │               │
          └──────────────┼───────────────┘
                         ▼
                    Validation
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
           SUCCESS                FAILURE
              │                     │
              ▼                     ▼
          Response                Retry
              │                     │
              ▼                     │
             END ◄──────────────────┘
```

### In one sentence

**Conditional routing in LangGraph allows your production CWD workflow to inspect the current state at runtime and dynamically choose the next node—whether that means moving from Coordinator → Delegator, selecting an available Worker, invoking a tool, retrying a failed Worker, sending output for validation, or terminating the workflow.**
