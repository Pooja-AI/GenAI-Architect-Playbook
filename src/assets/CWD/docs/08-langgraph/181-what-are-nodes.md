## What are Nodes in LangGraph?

**Nodes are the individual units of work in a LangGraph workflow.**
Each node is usually a Python function that **reads the current graph state, performs one task, and returns updates to the state**.

### In CWD

Your CWD can have nodes like:

```text
User Request
     ↓
[Coordinator Node]
     ↓
[Routing Node]
   ↙       ↘
[Sales]    [IT]
Delegator  Delegator
   ↓          ↓
[Workers]   [Workers]
   ↓          ↓
     [Aggregate Node]
           ↓
      Final Response
```

### Example

```python
from typing import TypedDict
from langgraph.graph import StateGraph

class CWDState(TypedDict):
    user_request: str
    intent: str
    customer_id: str
    worker_results: list
    final_response: str


def coordinator_node(state: CWDState):
    return {
        "intent": "customer_briefing",
        "customer_id": "C12345"
    }


def sales_delegator_node(state: CWDState):
    customer_id = state["customer_id"]

    # Call Sales Workers
    result = {
        "customer_name": "ABC Corp",
        "revenue": "$10M"
    }

    return {
        "worker_results": [result]
    }


def aggregate_node(state: CWDState):
    results = state["worker_results"]

    return {
        "final_response": f"Customer briefing: {results}"
    }
```

Then register them as nodes:

```python
graph = StateGraph(CWDState)

graph.add_node("coordinator", coordinator_node)
graph.add_node("sales_delegator", sales_delegator_node)
graph.add_node("aggregate", aggregate_node)
```

### What does a node actually do?

Think of every node as:

```text
Node
 ↓
Read State
 ↓
Perform Work
 ↓
Return State Updates
```

For example:

```text
Coordinator Node
    ↓
Reads: user_request
    ↓
Determines: intent + customer_id
    ↓
Updates:
intent = customer_briefing
customer_id = C12345
```

Then the Sales Delegator node can use that updated state.

### Important distinction

A **node is not necessarily an agent**.

For example:

| Concept         | Meaning in CWD                                               |
| --------------- | ------------------------------------------------------------ |
| **Node**        | A unit of work in the LangGraph workflow                     |
| **Coordinator** | An agent/component responsible for planning and coordination |
| **Delegator**   | Domain-level agent/component that coordinates Workers        |
| **Worker**      | Specialized agent/component performing a business capability |
| **A2A**         | Communication between agents                                 |
| **MCP**         | Communication with tools/enterprise systems                  |

So you might implement a **Coordinator as one or more LangGraph nodes**, while a Delegator could itself have its own LangGraph/subgraph.

### Interview-ready answer

> **“In LangGraph, a node is an individual unit of work represented by a function or runnable. It reads the current graph state, performs an operation such as planning, routing, calling a Delegator, validating results, or aggregating results, and returns updates to the state. In our CWD architecture, examples include the Coordinator node, Delegator execution nodes, validation node, and aggregation node. LangGraph then uses edges to determine which node executes next.”**

**Easy memory:**
**Node = What the workflow does.**
**Edge = Where the workflow goes next.**
**State = What the workflow currently knows.**
