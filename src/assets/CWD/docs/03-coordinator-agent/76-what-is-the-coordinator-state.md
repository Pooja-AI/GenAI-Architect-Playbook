In your **CWD architecture, Coordinator state is the runtime memory of the entire Coordinator workflow**.

It stores the information the Coordinator needs to know:

> **what the user requested, what CWD understood, what it planned, what Delegator/Workers were selected, what has completed, what failed, and what should happen next.**

It is managed by **LangGraph**, with durable checkpoint storage so the workflow can survive failures and resume.

---

## 1. Example Coordinator State

For your Customer Briefing use case:

```python
from typing import TypedDict, List, Dict, Any, Optional

class CoordinatorState(TypedDict):
    request_id: str
    user_request: str

    intent: Optional[str]
    entities: Dict[str, Any]
    required_capabilities: List[str]

    selected_delegator: Optional[str]
    execution_plan: Dict[str, Any]

    worker_status: Dict[str, str]
    worker_results: Dict[str, Any]
    failures: List[Dict[str, Any]]

    current_step: str
    final_status: str
    final_response: Optional[str]
```

A runtime state could look like:

```python
state = {
    "request_id": "REQ-123",
    "user_request": "Prepare a customer briefing for C123",

    "intent": "CustomerBriefing",

    "entities": {
        "customer_id": "C123"
    },

    "required_capabilities": [
        "customer_profile",
        "support_history"
    ],

    "selected_delegator": "SalesDelegator",

    "execution_plan": {
        "workers": [
            "CustomerProfileWorker",
            "SupportHistoryWorker"
        ]
    },

    "worker_status": {
        "CustomerProfileWorker": "SUCCESS",
        "SupportHistoryWorker": "RUNNING"
    },

    "worker_results": {
        "CustomerProfileWorker": {
            "customer_name": "ABC Corp"
        }
    },

    "failures": [],

    "current_step": "SupportHistoryWorker",

    "final_status": "RUNNING",

    "final_response": None
}
```

---

# 2. How the state changes

This is the important part for understanding LangGraph.

Initially:

```text
START

intent = None
delegator = None
worker_status = {}
final_status = RUNNING
```

After intent classification:

```text
intent = CustomerBriefing
```

After entity extraction:

```text
customer_id = C123
```

After Delegator selection:

```text
selected_delegator = SalesDelegator
```

After planning:

```text
execution_plan = {
    CustomerProfileWorker,
    SupportHistoryWorker
}
```

After Workers execute:

```text
CustomerProfileWorker → SUCCESS
SupportHistoryWorker  → SUCCESS
```

Then:

```text
final_status = COMPLETED
```

So the state evolves as the graph executes.

---

# 3. Why do we need Coordinator state?

Without state, the Coordinator doesn't have reliable knowledge of what already happened.

Imagine:

```text
CustomerProfileWorker → SUCCESS
SupportHistoryWorker  → SUCCESS
ContractWorker        → FAILED
```

Then the application crashes.

When the system comes back, we **don't want to execute all three Workers again**.

The persisted state/checkpoint tells LangGraph:

```text
CustomerProfileWorker → already SUCCESS
SupportHistoryWorker  → already SUCCESS
ContractWorker        → FAILED
```

So the workflow can resume from the appropriate point.

```text
Checkpoint
    ↓
Restore Coordinator State
    ↓
Skip completed work
    ↓
Retry/Resume failed work
    ↓
Aggregate results
```

---

# 4. State vs Checkpoint

This distinction is very important in an AI Architect interview.

### State

The **current runtime information** of the workflow.

```text
intent
entities
selected delegator
worker results
current step
failures
```

### Checkpoint

A **persisted snapshot of that state** at a particular execution point.

```text
Checkpoint 1
    ↓
intent identified

Checkpoint 2
    ↓
Delegator selected

Checkpoint 3
    ↓
Worker 1 completed

Checkpoint 4
    ↓
Worker 2 completed
```

So:

> **LangGraph manages the state and workflow transitions; a checkpointer persists snapshots of that state.**

---

# 5. Where is the state stored?

Don't confuse this with the **Agent Registry**.

```text
Agent Registry
    ↓
"What agents exist and what can they do?"

Coordinator State
    ↓
"What is happening in REQ-123?"
```

For your Azure CWD architecture, the runtime state can be checkpointed to a durable store such as **Cosmos DB, Redis, PostgreSQL**, depending on the persistence requirements.

For example:

```text
                 CWD
                  │
             Coordinator
                  │
             LangGraph
                  │
          Coordinator State
                  │
             Checkpointer
                  │
          ┌───────┴────────┐
          ↓                ↓
      Cosmos DB           Redis
```

For very large Worker results, I would avoid putting the entire payload into the LangGraph state. Store the result externally and keep a reference in state:

```python
"worker_results": {
    "CustomerProfileWorker": {
        "result_uri": "..."
    }
}
```

---

# 6. What should NOT be in Coordinator state?

You don't want to put everything into state.

For example:

❌ Salesforce passwords
❌ API keys
❌ Key Vault secrets
❌ Huge documents
❌ Entire conversation history unnecessarily
❌ Large raw database responses

Instead:

```text
State
 ├── IDs
 ├── intent
 ├── entities
 ├── plan
 ├── statuses
 ├── references
 └── execution metadata

Key Vault
 └── secrets

External Storage
 └── large documents/results
```

---

# 7. Coordinator State vs Delegator State

This is especially important because **your architecture has the Delegator layer**.

### Coordinator state

Tracks the **overall business workflow**:

```text
Request
 ↓
Intent
 ↓
Selected Delegator
 ↓
Execution status
 ↓
Overall results
```

### Delegator state

Tracks **domain-specific Worker execution**:

```text
SalesDelegator
 ↓
CustomerProfileWorker
 ↓
SupportHistoryWorker
 ↓
ContractWorker
```

For example:

```text
Coordinator State
-----------------
intent = CustomerBriefing
delegator = SalesDelegator
overall_status = PARTIAL_SUCCESS

Delegator State
---------------
CustomerProfileWorker = SUCCESS
SupportHistoryWorker  = SUCCESS
ContractWorker        = FAILED
retry_count = 2
```

The Delegator manages the detailed Worker execution, while the Coordinator maintains the **overall workflow state**.

---

## 🎯 Interview-ready answer

> **“Coordinator state is the runtime memory of the CWD workflow. In LangGraph, I would maintain fields such as request ID, user request, intent, entities, required capabilities, selected Delegator, execution plan, Worker statuses and results, failures, current step, and overall workflow status. LangGraph uses this state to make routing and execution decisions, while a durable checkpointer persists state snapshots. If the workflow fails, we can restore the checkpoint and resume from the last successful point instead of re-executing completed Workers.”**

### One line to memorize

> **“Coordinator state is the execution memory of CWD—it tells LangGraph what we understood, what we planned, what has completed or failed, and what needs to happen next.”**
