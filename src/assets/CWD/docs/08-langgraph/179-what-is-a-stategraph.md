In **LangGraph**, a **`StateGraph`** is the graph that defines **how workflow state moves between different nodes**.

For your **CWD**, think of it as the **workflow blueprint + shared state container** for the Coordinator/Delegator orchestration.

### Simple definition

> **StateGraph = Nodes + Edges + Shared State**

```text
              State
                ↓
        ┌──────────────┐
        │  Coordinator │
        └──────┬───────┘
               ↓
        Route Delegators
          /          \
         ↓            ↓
      Sales           IT
    Delegator       Delegator
         \            /
          ↓          ↓
           Aggregate
               ↓
              END
```

Each node reads the current state and returns updates to that state.

---

## 1. Define the state

For CWD:

```python
from typing import TypedDict

class CWDState(TypedDict):
    user_request: str
    intent: str
    customer_id: str
    delegators: list
    worker_results: list
    errors: list
    final_response: str
```

This state is the shared workflow context.

---

## 2. Define nodes

Each node performs one responsibility:

```python
def coordinator(state: CWDState):
    return {
        "intent": "customer_briefing",
        "delegators": ["sales", "it"]
    }
```

Another node:

```python
def sales_delegator(state: CWDState):
    result = {
        "customer": "ABC Corp",
        "opportunities": 3
    }

    return {
        "worker_results": [result]
    }
```

---

## 3. Create the StateGraph

```python
from langgraph.graph import StateGraph, START, END

graph = StateGraph(CWDState)

graph.add_node("coordinator", coordinator)
graph.add_node("sales", sales_delegator)
graph.add_node("aggregate", aggregate)

graph.add_edge(START, "coordinator")
graph.add_edge("coordinator", "sales")
graph.add_edge("sales", "aggregate")
graph.add_edge("aggregate", END)
```

Then compile it:

```python
app = graph.compile()
```

Execute:

```python
result = app.invoke({
    "user_request": "Give me a customer briefing for C12345",
    "customer_id": "C12345",
    "delegators": [],
    "worker_results": [],
    "errors": []
})
```

---

## 4. Why is it called **StateGraph**?

Because the graph isn't just:

```text
Node → Node → Node
```

It is:

```text
State
 ↓
Node
 ↓
State update
 ↓
Node
 ↓
State update
```

For example:

```text
Initial State
customer_id = C12345
        ↓
Coordinator
        ↓
State updated
intent = customer_briefing
delegators = [sales, it]
        ↓
Delegators
        ↓
State updated
worker_results = [...]
        ↓
Aggregator
        ↓
Final State
```

---

## 5. Conditional edges

CWD doesn't always follow the same path.

For example:

```python
def route(state):
    if "sales" in state["delegators"]:
        return "sales"

    return "it"
```

Then:

```python
graph.add_conditional_edges(
    "coordinator",
    route
)
```

So the graph can dynamically decide where to go.

---

## 6. StateGraph vs A2A

This is important for your interviews.

**StateGraph:**

> Controls the workflow.

**A2A:**

> Communicates between agents.

**MCP:**

> Connects agents/workers to enterprise tools.

```text
                StateGraph
             Workflow control
                    ↓
              Coordinator
                    ↓
                   A2A
                    ↓
               Delegator
                    ↓
                 Worker
                    ↓
                  MCP
                    ↓
        Salesforce / ServiceNow
```

### Interview-ready answer

> **“A StateGraph in LangGraph is a graph-based workflow where nodes perform tasks and edges control the execution path, while a shared state carries information between those nodes. In CWD, I use StateGraph to model the Coordinator and Delegator orchestration, maintain intent, customer ID, worker results and errors, and support conditional routing, parallel execution, checkpointing and recovery. A2A handles communication between agents, while MCP handles access to enterprise tools.”**

### Easy way to remember

**StateGraph = Workflow + State**

**Node = Work**

**Edge = Next step**

**State = Information shared across the workflow**
