## What are Reducers in LangGraph?

**Reducers define how LangGraph should combine a node's update with the existing state when multiple nodes update the same state field.**

This becomes especially important in your **CWD parallel execution**.

### Why do we need reducers?

Suppose Coordinator sends work to two Delegators:

```text
                 ┌──→ Sales Delegator ──→ Customer Worker
Coordinator ─────┤
                 └──→ IT Delegator ─────→ Incident Worker
                           ↓
                    Both return results
                           ↓
                       Aggregate
```

Both branches want to update:

```python
worker_results
```

Without a reducer, LangGraph may treat the updates as competing values rather than something that should be combined.

A reducer tells LangGraph:

> **"When multiple nodes update this field, combine the values this way."**

---

## Simple example

Define the state:

```python
from typing import Annotated, TypedDict
import operator

class CWDState(TypedDict):
    customer_id: str
    worker_results: Annotated[list, operator.add]
```

Here:

```python
Annotated[list, operator.add]
```

means:

> When multiple nodes update `worker_results`, **append/combine the lists** instead of replacing the previous value.

### Sales Worker

```python
def sales_worker(state):
    return {
        "worker_results": [
            {"source": "Salesforce", "customer": "ABC Corp"}
        ]
    }
```

### IT Worker

```python
def it_worker(state):
    return {
        "worker_results": [
            {"source": "ServiceNow", "open_incidents": 3}
        ]
    }
```

The reducer combines them:

```text
Sales result:
[
  {"source": "Salesforce", "customer": "ABC Corp"}
]

        +

IT result:
[
  {"source": "ServiceNow", "open_incidents": 3}
]

        ↓ reducer

worker_results:
[
  {"source": "Salesforce", "customer": "ABC Corp"},
  {"source": "ServiceNow", "open_incidents": 3}
]
```

Then the Coordinator's aggregation step can consume the combined results.

---

## Without a reducer

Imagine:

```text
Sales → worker_results = [Sales result]

IT → worker_results = [IT result]
```

If both update the same field and the state field is not configured for accumulation, one update can overwrite the other depending on the graph execution/update semantics.

You don't want:

```text
worker_results = [IT result]
```

because the Sales result has disappeared.

You want:

```text
worker_results = [
    Sales result,
    IT result
]
```

That's where the reducer is useful.

---

## Reducer ≠ Aggregation Node

This distinction is important in an interview.

### Reducer

Combines **state updates**:

```text
Sales result ──┐
               ├── Reducer → worker_results
IT result ─────┘
```

### Aggregation Node

Performs **business-level result processing**:

```text
worker_results
      ↓
Aggregate Node
      ↓
Customer Briefing
```

For example, the Aggregation Node may decide:

```text
Salesforce:
Customer = ABC Corp
Revenue = $10M

ServiceNow:
Open incidents = 3

        ↓

Final Customer Briefing
```

So:

> **Reducer = How state updates are combined.**
> **Aggregator = How business results are interpreted/assembled.**

---

## Another common reducer: messages

LangGraph commonly needs to accumulate conversation messages:

```python
from typing import Annotated
from langgraph.graph.message import add_messages

class State(TypedDict):
    messages: Annotated[list, add_messages]
```

Instead of replacing the entire message history, the reducer combines the new messages with the existing message state.

---

## CWD example

Your CWD state could look like:

```python
class CWDState(TypedDict):
    user_request: str
    intent: str
    customer_id: str

    delegator_results: Annotated[list, operator.add]

    errors: Annotated[list, operator.add]

    final_response: str
```

Now parallel Delegators can contribute results:

```text
                 ┌── Sales Delegator ──→ result
Coordinator ─────┤
                 │
                 └── IT Delegator ─────→ result
                                     
                       ↓
                   Reducer
                       ↓
             delegator_results
                       ↓
                  Aggregate
```

Similarly, multiple branches can contribute errors:

```text
Sales error ──┐
              ├──→ errors
IT error ─────┘
```

---

## Interview-ready answer

> **“A reducer in LangGraph defines how state updates should be combined when multiple nodes update the same state field. In our CWD architecture, Sales and IT Delegators can execute in parallel and both return results. We use a reducer on the results collection so their outputs are accumulated rather than overwritten. The combined results are then passed to the aggregation node for business-level validation and response generation.”**

### Easy memory

> **Node → produces an update**
> **Reducer → combines updates**
> **Aggregator → interprets combined results**
> **State → stores the result**
