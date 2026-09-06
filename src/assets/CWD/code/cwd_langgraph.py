Below is a production-oriented Python example showing the major pieces together.

### 1. CWD + LangGraph execution model

```text
                         User Request
                              │
                              ▼
                    ┌───────────────────┐
                    │    Coordinator    │
                    │ Understand Intent │
                    │ Create Execution   │
                    │ Plan              │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │     Delegator     │
                    │ Select Worker(s)  │
                    │ Create Tasks      │
                    └─────────┬─────────┘
                              │
                 ┌────────────┼────────────┐
                 ▼            ▼            ▼
             ┌───────┐   ┌───────┐   ┌───────┐
             │Worker │   │Worker │   │Worker │
             │Search │   │Analyze│   │Write  │
             └───┬───┘   └───┬───┘   └───┬───┘
                 │           │           │
                 └───────────┼───────────┘
                             ▼
                    ┌───────────────────┐
                    │   State Update    │
                    │ Results / Errors  │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │ Conditional Route │
                    └───────┬─────┬─────┘
                            │     │
                       retry │     │ success
                            ▼     ▼
                         Worker  Finalize
                                  │
                                  ▼
                               Response
```

The important point is that **LangGraph owns the execution flow and state**, while the LLM-based agents perform reasoning within that controlled flow.

---

# 2. Install LangGraph

```bash
pip install langgraph langchain langchain-openai
```

---

# 3. Define the CWD state

The state is the central piece.

Every Coordinator, Delegator, and Worker reads from and writes to this shared execution state.

```python
from typing import TypedDict, List, Dict, Any, Optional


class CWDState(TypedDict, total=False):

    # Original user request
    user_request: str

    # Coordinator information
    plan: List[str]
    coordinator_decision: str

    # Delegator information
    tasks: List[Dict[str, Any]]
    current_task: Optional[Dict[str, Any]]

    # Worker execution
    worker_results: List[Dict[str, Any]]

    # Execution control
    current_worker: Optional[str]
    retry_count: int
    max_retries: int

    # Error handling
    error: Optional[str]

    # Human approval
    human_approval_required: bool
    human_approved: bool

    # Final response
    final_response: Optional[str]

    # Lifecycle
    status: str
```

Conceptually:

```text
CWDState
   │
   ├── user_request
   ├── plan
   ├── tasks
   ├── current_task
   ├── worker_results
   ├── retry_count
   ├── error
   ├── human_approval
   └── final_response
```

This is what makes the architecture **stateful**.

---

# 4. Coordinator

The Coordinator determines **what needs to be done**.

It should generally **not perform the actual work**.

```python
def coordinator(state: CWDState) -> CWDState:

    request = state["user_request"]

    print("\n[Coordinator]")
    print("Request:", request)

    # In production this can be an LLM call
    plan = [
        "Understand the request",
        "Retrieve required information",
        "Analyze the information",
        "Generate final response"
    ]

    return {
        "plan": plan,
        "coordinator_decision": "delegate",
        "status": "PLANNED"
    }
```

The Coordinator is therefore responsible for:

* intent understanding
* planning
* determining execution strategy
* deciding whether delegation is necessary

---

# 5. Delegator

The Delegator converts the Coordinator's plan into executable tasks.

```python
def delegator(state: CWDState) -> CWDState:

    print("\n[Delegator]")

    tasks = [
        {
            "id": "task_1",
            "worker": "research_worker",
            "description": "Retrieve relevant information"
        },
        {
            "id": "task_2",
            "worker": "analysis_worker",
            "description": "Analyze retrieved information"
        }
    ]

    return {
        "tasks": tasks,
        "current_task": tasks[0],
        "current_worker": tasks[0]["worker"],
        "retry_count": 0,
        "status": "DELEGATED"
    }
```

This creates a clear separation:

```text
Coordinator
     │
     │ What should happen?
     ▼
Delegator
     │
     │ Who should do it?
     ▼
Worker
     │
     │ Perform the task
     ▼
Result
```

---

# 6. Worker execution

Now we implement workers.

```python
def research_worker(state: CWDState) -> CWDState:

    print("\n[Research Worker]")

    try:

        # Real implementation could call:
        # - RAG
        # - Search API
        # - Database
        # - MCP tool
        # - Enterprise API

        result = {
            "task_id": state["current_task"]["id"],
            "worker": "research_worker",
            "status": "SUCCESS",
            "output": "Research information retrieved successfully."
        }

        return {
            "worker_results": state.get("worker_results", []) + [result],
            "error": None,
            "status": "WORK_COMPLETED"
        }

    except Exception as e:

        return {
            "error": str(e),
            "status": "WORK_FAILED"
        }
```

---

# 7. Analysis Worker

```python
def analysis_worker(state: CWDState) -> CWDState:

    print("\n[Analysis Worker]")

    try:

        previous_results = state.get("worker_results", [])

        result = {
            "task_id": state["current_task"]["id"],
            "worker": "analysis_worker",
            "status": "SUCCESS",
            "output": f"Analysis completed using {len(previous_results)} previous result(s)."
        }

        return {
            "worker_results": previous_results + [result],
            "error": None,
            "status": "WORK_COMPLETED"
        }

    except Exception as e:

        return {
            "error": str(e),
            "status": "WORK_FAILED"
        }
```

Notice something important here.

The Analysis Worker can access the results generated by the Research Worker because both operate against the **same graph state**.

---

# 8. Conditional routing

This is where LangGraph becomes particularly useful.

We don't simply execute:

```text
Coordinator → Delegator → Worker → Final
```

Instead, we can dynamically decide:

```text
                  Worker
                    │
             ┌──────┴──────┐
             │             │
          SUCCESS        FAILURE
             │             │
             ▼             ▼
          Next Task       Retry
                           │
                    ┌──────┴──────┐
                    │             │
                 Retry OK      Max Retries
                    │             │
                    ▼             ▼
                  Worker        Error
```

The routing function:

```python
def route_after_worker(state: CWDState):

    if state.get("status") == "WORK_COMPLETED":
        return "next_task"

    if state.get("status") == "WORK_FAILED":

        if state.get("retry_count", 0) < state.get("max_retries", 3):
            return "retry"

        return "failure"

    return "failure"
```

This gives the workflow explicit control over failures.

---

# 9. Retry handling

```python
def retry_worker(state: CWDState) -> CWDState:

    retry_count = state.get("retry_count", 0) + 1

    print(f"\n[Retry] Attempt {retry_count}")

    return {
        "retry_count": retry_count,
        "status": "RETRYING"
    }
```

Then route back to the worker.

```text
Worker
  │
  ├── success ───────────────► Next Task
  │
  └── failure
        │
        ▼
      Retry
        │
        └──────────────► Worker
```

This prevents an agent failure from automatically killing the entire workflow.

---

# 10. Move to the next task

```python
def next_task(state: CWDState) -> CWDState:

    tasks = state.get("tasks", [])
    current = state.get("current_task")

    current_index = 0

    if current:
        for i, task in enumerate(tasks):
            if task["id"] == current["id"]:
                current_index = i
                break

    next_index = current_index + 1

    if next_index >= len(tasks):

        return {
            "status": "ALL_WORK_COMPLETED",
            "current_task": None
        }

    task = tasks[next_index]

    return {
        "current_task": task,
        "current_worker": task["worker"],
        "retry_count": 0,
        "status": "NEXT_TASK"
    }
```

---

# 11. Worker router

Because different tasks can require different workers, we can dynamically select the Worker.

```python
def route_to_worker(state: CWDState):

    worker = state.get("current_worker")

    if worker == "research_worker":
        return "research"

    if worker == "analysis_worker":
        return "analysis"

    return "failure"
```

This is **conditional graph routing**.

The graph itself determines which node executes next.

---

# 12. Human-in-the-loop

One of the strongest patterns for enterprise CWD systems is to stop execution before a sensitive operation.

For example:

```text
Coordinator
      ↓
Delegator
      ↓
Worker
      ↓
Sensitive Action
      ↓
HUMAN APPROVAL
      ↓
   ┌──┴──┐
 APPROVE REJECT
   ↓      ↓
 Worker   Stop
```

We can implement an approval node:

```python
def human_review(state: CWDState) -> CWDState:

    print("\n[Human Review Required]")

    return {
        "human_approval_required": True,
        "status": "WAITING_FOR_HUMAN"
    }
```

The important part is that **the graph can pause**.

The human doesn't need to be another agent.

---

# 13. Build the LangGraph

Now we combine everything.

```python
from langgraph.graph import StateGraph, START, END


builder = StateGraph(CWDState)


# -----------------------
# Nodes
# -----------------------

builder.add_node("coordinator", coordinator)
builder.add_node("delegator", delegator)

builder.add_node(
    "research_worker",
    research_worker
)

builder.add_node(
    "analysis_worker",
    analysis_worker
)

builder.add_node(
    "retry_worker",
    retry_worker
)

builder.add_node(
    "next_task",
    next_task
)

builder.add_node(
    "human_review",
    human_review
)


# -----------------------
# Entry point
# -----------------------

builder.add_edge(
    START,
    "coordinator"
)


# -----------------------
# Coordinator
# -----------------------

builder.add_edge(
    "coordinator",
    "delegator"
)


# -----------------------
# Delegator → Worker
# -----------------------

builder.add_conditional_edges(
    "delegator",
    route_to_worker,
    {
        "research": "research_worker",
        "analysis": "analysis_worker",
        "failure": END
    }
)


# -----------------------
# Worker → conditional
# -----------------------

builder.add_conditional_edges(
    "research_worker",
    route_after_worker,
    {
        "next_task": "next_task",
        "retry": "retry_worker",
        "failure": END
    }
)


builder.add_conditional_edges(
    "analysis_worker",
    route_after_worker,
    {
        "next_task": "next_task",
        "retry": "retry_worker",
        "failure": END
    }
)


# -----------------------
# Retry
# -----------------------

builder.add_conditional_edges(
    "retry_worker",
    route_to_worker,
    {
        "research": "research_worker",
        "analysis": "analysis_worker",
        "failure": END
    }
)


# -----------------------
# Next task
# -----------------------

builder.add_conditional_edges(
    "next_task",
    route_to_worker,
    {
        "research": "research_worker",
        "analysis": "analysis_worker",
        "failure": END
    }
)


graph = builder.compile()
```

---

# 14. Checkpointing / persistence

For production CWD, you don't want execution state to exist only in memory.

LangGraph supports checkpointing so that graph state can be persisted and execution can be resumed.

For example:

```python
from langgraph.checkpoint.memory import InMemorySaver

checkpointer = InMemorySaver()

graph = builder.compile(
    checkpointer=checkpointer
)
```

Then execute using a `thread_id`.

```python
config = {
    "configurable": {
        "thread_id": "cwd-request-001"
    }
}


initial_state = {
    "user_request": "Analyze the customer complaint",
    "worker_results": [],
    "retry_count": 0,
    "max_retries": 3,
    "human_approval_required": False,
    "human_approved": False,
    "status": "STARTED"
}


result = graph.invoke(
    initial_state,
    config=config
)

print(result)
```

The `thread_id` gives you a durable execution identity.

Conceptually:

```text
thread_id = cwd-request-001
             │
             ▼
       ┌─────────────┐
       │ Checkpoint  │
       └──────┬──────┘
              │
       ┌──────▼──────┐
       │ Graph State │
       └──────┬──────┘
              │
       ┌──────▼──────┐
       │ Resume      │
       │ Execution   │
       └─────────────┘
```

For production, you would typically use a persistent checkpointer rather than `InMemorySaver`.

---

# 15. Human approval + checkpointing

This is where the combination becomes powerful.

Suppose a Worker wants to perform:

```text
Send customer email
Update CRM
Approve transaction
Delete record
Execute external API
```

The graph can reach:

```python
def requires_human_approval(state: CWDState):

    if state.get("human_approval_required"):
        return "human"

    return "continue"
```

Then:

```python
builder.add_conditional_edges(
    "analysis_worker",
    requires_human_approval,
    {
        "human": "human_review",
        "continue": "next_task"
    }
)
```

The execution lifecycle becomes:

```text
                    CWD Request
                         │
                         ▼
                   Coordinator
                         │
                         ▼
                    Delegator
                         │
                         ▼
                      Worker
                         │
                         ▼
                  Sensitive Action
                         │
                         ▼
                  Human Approval
                         │
                  ┌──────┴──────┐
                  │             │
                APPROVE       REJECT
                  │             │
                  ▼             ▼
             Continue         Stop
```

The checkpoint preserves the graph state while waiting.

---

# 16. Complete simplified CWD example

Putting the architecture into one executable example:

```python
from typing import TypedDict, List, Dict, Any, Optional

from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import InMemorySaver


# ==========================================================
# STATE
# ==========================================================

class CWDState(TypedDict, total=False):

    user_request: str

    plan: List[str]

    tasks: List[Dict[str, Any]]
    current_task: Optional[Dict[str, Any]]

    current_worker: Optional[str]

    worker_results: List[Dict[str, Any]]

    retry_count: int
    max_retries: int

    error: Optional[str]

    human_approval_required: bool
    human_approved: bool

    status: str


# ==========================================================
# COORDINATOR
# ==========================================================

def coordinator(state):

    print("COORDINATOR")

    return {
        "plan": [
            "Research",
            "Analyze"
        ],
        "status": "PLANNED"
    }


# ==========================================================
# DELEGATOR
# ==========================================================

def delegator(state):

    print("DELEGATOR")

    tasks = [
        {
            "id": "1",
            "worker": "research_worker",
            "description": "Research information"
        },
        {
            "id": "2",
            "worker": "analysis_worker",
            "description": "Analyze research"
        }
    ]

    first_task = tasks[0]

    return {
        "tasks": tasks,
        "current_task": first_task,
        "current_worker": first_task["worker"],
        "retry_count": 0,
        "max_retries": 3,
        "status": "DELEGATED"
    }


# ==========================================================
# RESEARCH WORKER
# ==========================================================

def research_worker(state):

    print("RESEARCH WORKER")

    result = {
        "worker": "research_worker",
        "output": "Research completed",
        "status": "SUCCESS"
    }

    return {
        "worker_results":
            state.get("worker_results", []) + [result],

        "error": None,

        "status": "WORK_COMPLETED"
    }


# ==========================================================
# ANALYSIS WORKER
# ==========================================================

def analysis_worker(state):

    print("ANALYSIS WORKER")

    result = {
        "worker": "analysis_worker",
        "output": "Analysis completed",
        "status": "SUCCESS"
    }

    return {
        "worker_results":
            state.get("worker_results", []) + [result],

        "error": None,

        "status": "WORK_COMPLETED"
    }


# ==========================================================
# RETRY
# ==========================================================

def retry_worker(state):

    retry = state.get("retry_count", 0) + 1

    print(
        f"RETRY ATTEMPT: {retry}"
    )

    return {
        "retry_count": retry,
        "status": "RETRYING"
    }


# ==========================================================
# NEXT TASK
# ==========================================================

def next_task(state):

    tasks = state["tasks"]

    current = state["current_task"]

    current_index = next(
        i for i, task in enumerate(tasks)
        if task["id"] == current["id"]
    )

    next_index = current_index + 1

    if next_index >= len(tasks):

        return {
            "status": "ALL_WORK_COMPLETED",
            "current_task": None,
            "current_worker": None
        }

    task = tasks[next_index]

    return {
        "current_task": task,
        "current_worker": task["worker"],
        "retry_count": 0,
        "status": "NEXT_TASK"
    }


# ==========================================================
# HUMAN REVIEW
# ==========================================================

def human_review(state):

    print("WAITING FOR HUMAN APPROVAL")

    return {
        "human_approval_required": True,
        "status": "WAITING_FOR_HUMAN"
    }


# ==========================================================
# ROUTING
# ==========================================================

def route_worker(state):

    worker = state.get("current_worker")

    if worker == "research_worker":
        return "research"

    if worker == "analysis_worker":
        return "analysis"

    return "end"


def route_after_worker(state):

    if state["status"] == "WORK_COMPLETED":
        return "next"

    if state["status"] == "WORK_FAILED":

        if state["retry_count"] < state["max_retries"]:
            return "retry"

        return "end"

    return "end"


# ==========================================================
# GRAPH
# ==========================================================

builder = StateGraph(CWDState)


builder.add_node(
    "coordinator",
    coordinator
)

builder.add_node(
    "delegator",
    delegator
)

builder.add_node(
    "research_worker",
    research_worker
)

builder.add_node(
    "analysis_worker",
    analysis_worker
)

builder.add_node(
    "retry_worker",
    retry_worker
)

builder.add_node(
    "next_task",
    next_task
)

builder.add_node(
    "human_review",
    human_review
)


# ==========================================================
# GRAPH FLOW
# ==========================================================

builder.add_edge(
    START,
    "coordinator"
)

builder.add_edge(
    "coordinator",
    "delegator"
)


builder.add_conditional_edges(
    "delegator",
    route_worker,
    {
        "research": "research_worker",
        "analysis": "analysis_worker",
        "end": END
    }
)


builder.add_conditional_edges(
    "research_worker",
    route_after_worker,
    {
        "next": "next_task",
        "retry": "retry_worker",
        "end": END
    }
)


builder.add_conditional_edges(
    "analysis_worker",
    route_after_worker,
    {
        "next": "next_task",
        "retry": "retry_worker",
        "end": END
    }
)


builder.add_conditional_edges(
    "next_task",
    route_worker,
    {
        "research": "research_worker",
        "analysis": "analysis_worker",
        "end": END
    }
)


builder.add_conditional_edges(
    "retry_worker",
    route_worker,
    {
        "research": "research_worker",
        "analysis": "analysis_worker",
        "end": END
    }
)


# ==========================================================
# CHECKPOINTING
# ==========================================================

checkpointer = InMemorySaver()

graph = builder.compile(
    checkpointer=checkpointer
)


# ==========================================================
# EXECUTION
# ==========================================================

config = {
    "configurable": {
        "thread_id": "cwd-001"
    }
}


state = {
    "user_request":
        "Analyze customer complaint",

    "worker_results": [],

    "retry_count": 0,

    "max_retries": 3,

    "human_approval_required": False,

    "human_approved": False,

    "status": "STARTED"
}


result = graph.invoke(
    state,
    config=config
)


print("\nFINAL STATE")
print(result)
```

---

# 17. How this maps to CWD

| CWD responsibility       | LangGraph implementation            |
| ------------------------ | ----------------------------------- |
| Workflow orchestration   | `StateGraph`                        |
| Shared execution context | `CWDState`                          |
| Coordinator              | Graph node                          |
| Delegator                | Graph node                          |
| Worker                   | Graph nodes                         |
| Worker selection         | Conditional edges                   |
| Dynamic routing          | `add_conditional_edges()`           |
| Retry                    | Retry node + conditional routing    |
| Failure handling         | State/status + routing              |
| Persistence              | Checkpointer                        |
| Resume                   | `thread_id` + checkpoint            |
| Human approval           | Interrupt/pause pattern             |
| Execution lifecycle      | Graph                               |
| Controlled execution     | Explicit graph edges                |
| Agent coordination       | Shared state                        |
| Recovery                 | Checkpoint + retry                  |
| Observability            | State transitions / graph execution |

### The key architectural distinction

Without LangGraph:

```text
Agent → Agent → Agent → Agent
```

The control flow can become difficult to govern.

With LangGraph:

```text
                 ┌──────────────┐
                 │    State     │
                 └──────┬───────┘
                        │
                        ▼
                 Coordinator
                        │
                        ▼
                  Delegator
                        │
                 Conditional
                   Routing
                  /    |    \
                 /     |     \
                ▼      ▼      ▼
             Worker  Worker  Worker
                │      │      │
                └──────┼──────┘
                       ▼
                  State Update
                       │
                ┌──────┴──────┐
                ▼             ▼
              Retry        Continue
                │             │
                └──────┬──────┘
                       ▼
                 Human Review
                       │
                       ▼
                    Finalize
```

So, **LangGraph is not the Coordinator, Delegator, or Worker itself**. It is the **execution/control plane around them**.

That distinction is especially important when explaining CWD in an architecture/interview context:

> **CWD defines who is responsible for reasoning and execution; LangGraph defines how those agents are orchestrated, how state moves between them, when execution branches, how failures are retried, where execution can pause for human approval, and how the workflow can recover from a persisted checkpoint.**

That is the core reason LangGraph fits a **production CWD architecture** so well.
