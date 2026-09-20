## What are Edges in LangGraph?

**Edges define the path or flow between nodes.**
They tell LangGraph **which node should execute next** after the current node finishes.

Think:

> **Node = What to do**
> **Edge = Where to go next**

### In CWD

Your workflow can look like:

```text
                    ┌──→ Sales Delegator ──→ Sales Workers ──┐
User → Coordinator ─┤                                        ├→ Aggregate → Response
                    └──→ IT Delegator ─────→ IT Workers ────┘
```

The arrows (`→`) are **edges**.

---

## 1. Normal / Direct Edge

A direct edge always goes from one node to another.

```python
graph.add_edge("coordinator", "sales_delegator")
```

Meaning:

```text
Coordinator
     ↓
Sales Delegator
```

Example:

```python
graph.add_edge("sales_delegator", "aggregate")
```

After Sales Delegator finishes, LangGraph moves to `aggregate`.

---

## 2. Conditional Edge

A **conditional edge chooses the next node based on the current state**.

This is very important in your CWD architecture.

For example, Coordinator determines which Delegator is required:

```python
def route_delegator(state):
    if state["intent"] == "customer_briefing":
        return "sales_delegator"
    elif state["intent"] == "incident":
        return "it_delegator"
    else:
        return "unknown"
```

Then:

```python
graph.add_conditional_edges(
    "coordinator",
    route_delegator,
    {
        "sales_delegator": "sales_delegator",
        "it_delegator": "it_delegator",
        "unknown": "error"
    }
)
```

Flow:

```text
                 ┌──→ Sales Delegator
                 │
Coordinator ─────┤
                 │
                 └──→ IT Delegator
```

The **state determines the route**.

---

## 3. Parallel Edges

You can also have multiple paths execute independently.

For example, Customer Briefing needs:

* Customer information
* IT incidents

```text
                 ┌──→ Sales Delegator ──→ Customer Worker
Coordinator ─────┤
                 └──→ IT Delegator ─────→ Incident Worker

                         ↓
                     Aggregate
```

Conceptually:

```python
graph.add_edge("coordinator", "sales_delegator")
graph.add_edge("coordinator", "it_delegator")

graph.add_edge("sales_delegator", "aggregate")
graph.add_edge("it_delegator", "aggregate")
```

This allows independent branches to execute and eventually converge.

---

## 4. Conditional Edge for Failure

Edges can also control recovery.

For example:

```text
Worker
  ↓
Validate
  ↓
 ┌───────────────┐
 │               │
Valid          Invalid
 │               │
 ↓               ↓
Aggregate      Retry
                 ↓
              Worker
```

The validation result can determine the next node.

```python
def validation_route(state):
    if state["valid"]:
        return "aggregate"
    return "retry"
```

---

## Edge vs Node vs State

| Concept              | Purpose                  | CWD Example                    |
| -------------------- | ------------------------ | ------------------------------ |
| **Node**             | Performs work            | Coordinator                    |
| **Edge**             | Controls next step       | Coordinator → Delegator        |
| **Conditional Edge** | Dynamically chooses path | Customer Briefing → Sales      |
| **State**            | Carries workflow data    | `customer_id`, results, errors |

### Simple CWD example

```text
State:
customer_id = C12345
intent = customer_briefing

        ↓

[Coordinator Node]
        |
        | Conditional Edge
        ↓
[Sales Delegator]
        |
        ↓
[Customer Worker]
        |
        ↓
[Aggregate Node]
```

The **Coordinator node does the decision-making**, while the **conditional edge implements the routing based on that decision/state**.

### Interview-ready answer

> **“Edges in LangGraph define the control flow between nodes. A direct edge specifies a fixed next step, while a conditional edge dynamically chooses the next node based on the graph state. In our CWD architecture, after the Coordinator identifies the intent, a conditional edge routes the workflow to the appropriate Delegator, such as Sales or IT. After the Delegators complete their work, edges route the results to validation and aggregation.”**

**Easy memory:**

> **Node = Do the work**
> **Edge = Move to the next step**
> **Conditional Edge = Decide where to go next**
