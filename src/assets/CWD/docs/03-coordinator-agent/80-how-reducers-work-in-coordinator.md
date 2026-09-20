In your **CWD Coordinator**, a **reducer** defines **how updates from multiple LangGraph nodes or parallel branches are combined into the shared Coordinator state**.

The easiest way to remember it:

> **State = shared data; Reducer = rule for merging updates into that data.**

---

## 1. Why do we need reducers?

Your CWD can execute multiple Workers in parallel:

```text id="8nq0px"
                  Coordinator
                       │
                  SalesDelegator
                       │
          ┌────────────┼────────────┐
          ↓            ↓            ↓
      Customer       Support      Contract
       Worker         Worker       Worker
          │            │            │
          ↓            ↓            ↓
       Result 1      Result 2      Result 3
          └────────────┼────────────┘
                       ↓
                 Coordinator State
```

All three branches may try to update the same state field, such as:

```python
worker_results
```

The Coordinator needs a deterministic way to combine those updates.

That's what the reducer does.

---

# 2. Simple example

Suppose Worker 1 returns:

```python
{"customer_profile": {"name": "ABC Corp"}}
```

Worker 2 returns:

```python
{"support_history": {"open_tickets": 2}}
```

Worker 3 returns:

```python
{"contract": {"status": "Active"}}
```

The reducer combines them:

```python
{
    "customer_profile": {"name": "ABC Corp"},
    "support_history": {"open_tickets": 2},
    "contract": {"status": "Active"}
}
```

Without a proper reducer, concurrent updates can overwrite each other.

---

# 3. Reducer for Worker results

Conceptually:

```python id="g8x3t1"
def merge_results(existing, new):
    return {
        **existing,
        **new
    }
```

Then:

```text id="l3p5k2"
Existing State
{
  customer_profile: ...
}

        +

New Worker Result
{
  support_history: ...
}

        ↓

Reducer

        ↓

{
  customer_profile: ...,
  support_history: ...
}
```

---

# 4. Reducer for failures

You can also use a reducer for collecting failures.

Worker 1:

```python
[]
```

Worker 2:

```python
[
    {
        "worker": "SupportHistoryWorker",
        "error": "ServiceNow timeout"
    }
]
```

Worker 3:

```python
[
    {
        "worker": "ContractWorker",
        "error": "API unavailable"
    }
]
```

Reducer:

```python id="n7k4w2"
def append_failures(existing, new):
    return existing + new
```

Final state:

```python
[
    {
        "worker": "SupportHistoryWorker",
        "error": "ServiceNow timeout"
    },
    {
        "worker": "ContractWorker",
        "error": "API unavailable"
    }
]
```

---

# 5. Reducer for execution events

You could also maintain an execution history:

```python id="p2r8s4"
execution_events = [
    "CustomerProfileWorker started",
    "CustomerProfileWorker completed",
    "SupportHistoryWorker started",
    "SupportHistoryWorker failed"
]
```

Each branch adds its events, and the reducer combines them.

This is useful for **auditability and troubleshooting**, although in production I would also send structured events to your observability platform rather than relying only on graph state.

---

# 6. Reducer vs normal state update

This is an important distinction.

### Normal field

If the state contains:

```python
current_step: str
```

you normally want the latest value:

```text
"select_delegator"
      ↓
"execute_workers"
      ↓
"aggregate_results"
```

You don't want:

```text
"select_delegator"
"execute_workers"
"aggregate_results"
```

all merged into `current_step`.

### Reducer field

For:

```python
worker_results
failures
execution_events
```

you often want to **accumulate/merge** values from multiple branches.

---

# 7. Example Coordinator State

Conceptually:

```python id="r4m9t7"
class CoordinatorState(TypedDict):
    request_id: str
    intent: str
    selected_delegator: str

    worker_results: Annotated[
        dict,
        merge_results
    ]

    failures: Annotated[
        list,
        append_failures
    ]

    execution_events: Annotated[
        list,
        operator.add
    ]

    current_step: str
```

The important part is:

```python
Annotated[dict, merge_results]
```

which tells the graph how updates to that field should be combined.

---

# 8. CWD example with parallel Workers

Suppose all three Workers finish approximately at the same time:

```text id="v1c3x5"
CustomerProfileWorker
        │
        └──► {customer_profile: ...}

SupportHistoryWorker
        │
        └──► {support_history: ...}

ContractWorker
        │
        └──► {contract: ...}
```

The Coordinator state receives three updates.

The reducer combines them:

```text id="k7m2q9"
                    Reducer
                       │
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
 customer_profile  support_history  contract
        └──────────────┼──────────────┘
                       ↓
                 worker_results
```

Final state:

```python id="s6d8f2"
worker_results = {
    "customer_profile": {...},
    "support_history": {...},
    "contract": {...}
}
```

Then the Coordinator's `validate_results` node can inspect the combined results and determine whether the workflow is complete or partial.

---

# 9. Reducer does NOT decide business logic

This is another important interview distinction.

The reducer should **not decide**:

> "ContractWorker is mandatory, therefore fail the workflow."

That's **workflow/business policy**.

Instead:

```text id="a4b6c8"
Workers
  ↓
Reducer
  ↓
Combined Results
  ↓
validate_results
  ↓
Workflow Policy
  ↓
COMPLETE / PARTIAL / FAILED
```

So:

**Reducer = merge state**

**Validation = check correctness**

**Policy = determine business outcome**

---

## 🎯 Interview-ready answer

> **“In our CWD Coordinator, reducers are used when multiple parallel branches update the same shared state. For example, Customer Profile, Support History, and Contract Workers can execute in parallel and each return a result. Instead of allowing one update to overwrite another, the reducer merges those results into the Coordinator's `worker_results` state. We can use similar reducers to accumulate failures or execution events. The reducer only handles state merging; it does not make business decisions such as whether a Worker is mandatory or whether the workflow can complete.”**

### One line to memorize

> **“In CWD, reducers safely merge concurrent Worker updates into shared Coordinator state without overwriting results.”**
