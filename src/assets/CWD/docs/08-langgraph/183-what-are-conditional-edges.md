## What are Conditional Edges in LangGraph?

**Conditional edges are decision-based connections between nodes.** They determine **which node should execute next based on the current graph state or a decision returned by a routing function.**

### Simple idea

```text
Node
 ↓
Check condition
 ↓
 ┌───────────────┐
 │               │
Condition A   Condition B
 │               │
 ↓               ↓
Node A          Node B
```

In your **CWD architecture**, the Coordinator can use a conditional edge to decide which **Delegator** should handle the request.

### CWD example

Suppose the user asks:

> "Give me a customer briefing for C12345."

The Coordinator determines:

```text
intent = customer_briefing
customer_id = C12345
```

Then the conditional edge routes the workflow:

```text
                 ┌──→ Sales Delegator
                 │
Coordinator ─────┤
                 │
                 └──→ IT Delegator
```

For example:

```python
def route_request(state):
    if state["intent"] == "customer_briefing":
        return "sales_delegator"

    elif state["intent"] == "incident":
        return "it_delegator"

    return "error"
```

Then:

```python
graph.add_conditional_edges(
    "coordinator",
    route_request,
    {
        "sales_delegator": "sales_delegator",
        "it_delegator": "it_delegator",
        "error": "error"
    }
)
```

### What happens at runtime?

```text
User Request
     ↓
Coordinator Node
     ↓
Updates State
     ↓
Conditional Edge
     ↓
Checks intent
     ↓
customer_briefing?
     ↓ YES
Sales Delegator
```

If the intent were `incident`:

```text
Coordinator
     ↓
Conditional Edge
     ↓
intent = incident
     ↓
IT Delegator
```

### Conditional edge for failure handling

You can also use it for validation/recovery:

```text
              ┌──→ Aggregate
              │
Validate ─────┤
              │
              └──→ Retry
```

```python
def validation_route(state):
    if state["validation_passed"]:
        return "aggregate"
    return "retry"
```

So conditional edges are useful for:

* **Routing** → Which Delegator?
* **Validation** → Valid or invalid?
* **Failures** → Retry or fail?
* **Approvals** → Continue or wait for HITL?
* **Business rules** → Which workflow path?

### Important distinction

**Conditional edge does not perform the business work.**

The **node** performs the work:

```text
Coordinator Node
    ↓
does planning
```

The **conditional edge** decides:

```text
Where should we go next?
```

### Interview-ready answer

> **“A conditional edge in LangGraph dynamically determines the next node based on the current graph state or a routing function. In our CWD architecture, after the Coordinator identifies the intent, the conditional edge routes the request to the appropriate Delegator, such as Sales or IT. We can also use conditional edges for validation, retry, failure handling, and human-approval paths.”**

**Easy memory:**

> **Normal Edge = fixed path**
> **Conditional Edge = decision-based path**
> **Node = performs the work**
