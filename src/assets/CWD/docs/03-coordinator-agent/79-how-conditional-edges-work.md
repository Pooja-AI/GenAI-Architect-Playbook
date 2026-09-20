In your **CWD Coordinator**, a **conditional edge** is a LangGraph routing mechanism that decides **which node should execute next based on the current state**.

Think of it as:

> **Node does work → condition checks the state → chooses the next node.**

### Simple example

```text
                 validate_intent
                       │
                ┌──────┴──────┐
                │             │
             valid          invalid
                │             │
                ▼             ▼
       select_delegator   clarification
```

The condition is deterministic application logic—not the LLM freely deciding where to go.

---

## CWD example

Suppose the Coordinator has:

```python id="p8byet"
state = {
    "intent": "CustomerBriefing",
    "needs_clarification": False
}
```

After `validate_intent`, we use a routing function:

```python id="z7j5j0"
def route_after_validation(state):

    if state["needs_clarification"]:
        return "clarification"

    if state["intent"] is None:
        return "routing_failure"

    return "select_delegator"
```

Then define the conditional edge:

```python id="g1e4ch"
workflow.add_conditional_edges(
    "validate_intent",
    route_after_validation,
    {
        "select_delegator": "select_delegator",
        "clarification": "clarification",
        "routing_failure": "routing_failure"
    }
)
```

So LangGraph evaluates the function against the **current state**.

---

# Example 1 — Intent validation

```text id="1e2p3f"
validate_intent
      │
      ▼
route_after_validation()
      │
      ├── valid ──────────► select_delegator
      │
      ├── ambiguous ──────► clarification
      │
      └── unsupported ────► routing_failure
```

---

# Example 2 — Delegator validation

After the Coordinator selects `SalesDelegator`:

```text id="2t4xk8"
validate_delegator
        │
        ▼
 check registry + policy
        │
   ┌────┼────┐
   │    │    │
 valid invalid unhealthy
   │    │    │
   ▼    ▼    ▼
 plan reject retry/fallback
```

For example:

```python id="c5q5v4"
def route_after_delegator_validation(state):

    if state["delegator_valid"]:
        return "create_execution_plan"

    if state["delegator_healthy"] is False:
        return "delegator_recovery"

    return "routing_failure"
```

---

# Example 3 — Worker results

This is particularly useful in your CWD architecture.

Suppose:

```text id="e6y7z8"
CustomerProfileWorker → SUCCESS
SupportHistoryWorker  → SUCCESS
ContractWorker        → FAILED
```

After result validation:

```text id="h1i2j3"
validate_results
      │
      ▼
check_results()
      │
      ├── ALL SUCCESS
      │       ↓
      │    aggregate
      │
      ├── PARTIAL SUCCESS
      │       ↓
      │    partial aggregation
      │
      └── FAILURE
              ↓
          recovery/retry
```

Example:

```python id="f4k5l6"
def route_after_results(state):

    statuses = state["worker_status"].values()

    if all(s == "SUCCESS" for s in statuses):
        return "aggregate_results"

    if any(s == "FAILED" for s in statuses):
        return "recovery"

    return "wait_for_results"
```

---

# Why conditional edges are important

They make your Coordinator a **state-driven workflow**, rather than a fixed sequence.

A normal workflow might be:

```text
A → B → C → D
```

But CWD needs:

```text
       ┌── B ── C
       │
A ─────┤
       │
       └── D ── E
```

The path depends on what happened during execution.

---

## Conditional edge vs LLM decision

This distinction is **very important in your interview**.

You don't want:

```text
LLM → "I think we should go to SalesDelegator"
             ↓
           execute
```

Instead:

```text
LLM
 ↓
proposed intent/delegator
 ↓
deterministic validation
 ↓
current LangGraph state
 ↓
conditional edge
 ↓
next node
```

For example:

> LLM proposes `SalesDelegator`.

Then deterministic logic checks:

```text
Registered?       ✓
Supports intent? ✓
Authorized?       ✓
Healthy?          ✓
Policy allows?    ✓
```

Only then does the conditional edge route to execution.

---

# 🎯 Interview-ready answer

> **“Conditional edges in LangGraph allow the Coordinator to choose the next node based on the current workflow state. For example, after intent validation, the graph can route to Delegator selection if the intent is valid, clarification if information is missing, or a failure path if the intent is unsupported. Similarly, after Worker execution, it can route to aggregation, recovery, or waiting based on Worker status. In CWD, the conditions are primarily deterministic business and workflow rules, while the LLM provides the semantic information used by those rules.”**

### One line to memorize

> **“A conditional edge evaluates the current CWD state and deterministically chooses the next workflow node.”**
