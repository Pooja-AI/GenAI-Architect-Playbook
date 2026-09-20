In **LangGraph**, **graph state** is the shared data that carries the **current workflow information from one node to the next**.

### Simple definition

> **Graph State = the current memory/context of the LangGraph workflow.**

For your **CWD**, think of it as the information the Coordinator and Delegator workflow needs while processing one customer request.

```text
User Request
     ↓
┌──────────────────────────┐
│       Graph State        │
│ customer_id = C12345     │
│ intent = customer_briefing│
│ delegators = [Sales, IT] │
│ worker_results = [...]   │
│ errors = [...]            │
└──────────────────────────┘
     ↓
 Coordinator
     ↓
 Sales / IT Delegators
     ↓
 Workers
     ↓
 Graph State updated
     ↓
 Aggregate
```

### Example state

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

Initially:

```python
state = {
    "user_request": "Give me a customer briefing for C12345",
    "intent": "",
    "customer_id": "C12345",
    "delegators": [],
    "worker_results": [],
    "errors": [],
    "final_response": ""
}
```

The **Coordinator node** updates the state:

```python
def coordinator(state):
    return {
        "intent": "customer_briefing",
        "delegators": ["sales", "it"]
    }
```

Now the state becomes conceptually:

```text
intent     = customer_briefing
customer_id = C12345
delegators = [sales, it]
```

Then Workers add results:

```python
{
    "worker_results": [
        {"worker": "customer-worker", "status": "success"},
        {"worker": "incident-worker", "status": "success"}
    ]
}
```

The Aggregator reads those results and produces the final response.

---

### Why is graph state important?

Because CWD is **not stateless**.

We need to remember:

* What the user requested
* Customer ID
* Identified intent
* Which Delegators were selected
* Which Workers completed
* Worker results
* Errors
* Current workflow status
* Final response

Without state, each node would have to independently figure out what happened before.

---

### State vs A2A context

This distinction is important in interviews:

**Graph State**

> Internal workflow state managed by LangGraph.

**A2A task context**

> Information passed between separate agents.

```text
              LangGraph
          ┌───────────────┐
          │   Graph State │
          └───────┬───────┘
                  ↓
             Coordinator
                  ↓
              A2A Task
                  ↓
            Sales Delegator
```

You **don't send the entire graph state through A2A**.

Instead, you extract the required information:

```json
{
  "task_id": "T1001",
  "correlation_id": "C789",
  "intent": "customer_briefing",
  "customer_id": "C12345"
}
```

### Graph State vs Checkpoint

Another common interview question:

* **Graph State** = current workflow data.
* **Checkpoint** = persisted snapshot of that state at a particular point in the workflow.

For example:

```text
State
  ↓
Customer Worker ✓
  ↓
Checkpoint saved
  ↓
Incident Worker ✗
```

After recovery, LangGraph can use the checkpoint to continue from the saved workflow state.

### Interview-ready answer

> **“Graph state is the shared, structured state of a LangGraph workflow. In CWD, it contains information such as the user request, intent, customer ID, selected Delegators, Worker results, errors, and workflow status. Each LangGraph node reads the current state and returns updates, which become available to subsequent nodes. We use this state to support routing, parallel execution, aggregation, and recovery. The graph state is internal workflow state, while A2A carries only the relevant task context between agents.”**

**Easy way to remember:**

> **State = what the workflow currently knows.**
> **Node = what the workflow does.**
> **Edge = where the workflow goes next.**
