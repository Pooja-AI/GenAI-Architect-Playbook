## How does LangGraph support parallel execution?

**LangGraph supports parallel execution by allowing multiple nodes to be reached from the same point in the graph.** If those branches are independent, LangGraph can execute them concurrently and then merge their state updates using **reducers**.

### CWD example

For a **Customer Briefing**, the Coordinator may need information from both Sales and IT:

```text
                         ┌──→ Sales Delegator ──→ Customer Worker
                         │
Coordinator ─────────────┤
                         │
                         └──→ IT Delegator ─────→ Incident Worker
                                     
                         ↓
                     Aggregate
```

Sales and IT don't need to wait for each other, so they can run in parallel.

---

## 1. Define the shared state

```python
from typing import Annotated, TypedDict
import operator

class CWDState(TypedDict):
    customer_id: str
    sales_result: dict
    it_result: dict
    worker_results: Annotated[list, operator.add]
```

The reducer on `worker_results` allows results from parallel branches to be combined.

---

## 2. Create the parallel nodes

```python
def sales_delegator(state):
    customer_id = state["customer_id"]

    # Sales workers → MCP → Salesforce
    result = {
        "source": "Salesforce",
        "customer": "ABC Corp",
        "revenue": "$10M"
    }

    return {
        "worker_results": [result]
    }


def it_delegator(state):
    customer_id = state["customer_id"]

    # IT workers → MCP → ServiceNow
    result = {
        "source": "ServiceNow",
        "open_incidents": 3
    }

    return {
        "worker_results": [result]
    }
```

---

## 3. Connect both branches

```python
graph.add_edge("coordinator", "sales_delegator")
graph.add_edge("coordinator", "it_delegator")

graph.add_edge("sales_delegator", "aggregate")
graph.add_edge("it_delegator", "aggregate")
```

Conceptually:

```text
                    ┌── Sales ──┐
Coordinator ────────┤            ├──→ Aggregate
                    └── IT ─────┘
```

Because both branches originate from the Coordinator and are independent, LangGraph can schedule them as parallel work.

---

## 4. Reducer combines the results

Suppose:

```text
Sales:
{
  "customer": "ABC Corp",
  "revenue": "$10M"
}
```

and:

```text
IT:
{
  "open_incidents": 3
}
```

The reducer combines them:

```text
worker_results = [
    Sales result,
    IT result
]
```

Then:

```python
def aggregate(state):
    results = state["worker_results"]

    return {
        "final_response": f"Customer briefing: {results}"
    }
```

---

# Why parallel execution is useful

Suppose:

```text
Sales API = 2 seconds
ServiceNow API = 3 seconds
```

Sequential execution:

```text
Sales 2s
   +
IT 3s
   =
~5 seconds
```

Parallel execution:

```text
Sales ── 2s ──┐
              ├──→ Aggregate
IT ───── 3s ──┘

≈ 3 seconds + orchestration overhead
```

So parallel execution can reduce overall workflow latency when tasks are independent.

---

## What if one branch fails?

This is important for your CWD interview.

```text
             ┌── Sales → SUCCESS
Coordinator ─┤
             └── IT → FAILURE
```

You don't necessarily want the whole workflow to fail.

You can:

```text
Sales → result
IT → retry → timeout → DLQ/fallback
                    ↓
                 Aggregate
```

The workflow can aggregate the successful result and record the IT failure if the business requirement allows partial results.

For example:

```python
{
    "worker_results": [
        {"source": "Salesforce", "status": "success"}
    ],
    "errors": [
        {"source": "ServiceNow", "error": "timeout"}
    ]
}
```

---

## Important: Parallel execution vs asynchronous communication

Don't confuse these in an interview.

**Parallel execution:**

> Multiple workflow branches execute independently/concurrently.

**A2A:**

> Provides communication between agents.

**Service Bus:**

> Can provide durable asynchronous messaging when the architecture requires queued/background processing.

**LangGraph:**

> Manages the workflow/state and coordinates the branches.

So in CWD:

```text
Coordinator
    ↓
LangGraph
    ├── Sales Delegator
    │      ↓
    │   Workers → MCP → Salesforce
    │
    └── IT Delegator
           ↓
        Workers → MCP → ServiceNow
```

---

### Interview-ready answer

> **“LangGraph supports parallel execution by allowing independent nodes or branches to execute from the same point in the workflow. In our CWD Customer Briefing use case, the Coordinator can trigger the Sales Delegator and IT Delegator in parallel because their work is independent. Each branch produces results, and a reducer combines those state updates. Once the required branches complete, the aggregation node combines and validates the results. This reduces latency compared with executing independent tasks sequentially.”**

**Easy memory:**

> **Independent work → Parallel branches → Reducer → Aggregate**
