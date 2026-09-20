In **CWD**, the execution plan is basically a **structured blueprint for how the user's request should be executed**.

It tells the system:

> **What to execute, who should execute it, in what order, with what inputs, what can run in parallel, what happens on failure, and when the workflow is considered complete.**

### Example: Customer Briefing

User:

> “Prepare a customer briefing for C123 with CRM information, support history, and contract details.”

The Coordinator could create:

```python
execution_plan = {
    "intent": "CustomerBriefing",

    "entities": {
        "customer_id": "C123"
    },

    "delegator": "SalesDelegator",

    "workers": [
        {
            "name": "CustomerProfileWorker",
            "mandatory": True,
            "depends_on": [],
            "execution": "parallel"
        },
        {
            "name": "SupportHistoryWorker",
            "mandatory": False,
            "depends_on": [],
            "execution": "parallel"
        },
        {
            "name": "ContractWorker",
            "mandatory": True,
            "depends_on": [],
            "execution": "parallel"
        }
    ],

    "aggregation": {
        "strategy": "Coordinator"
    },

    "failure_policy": {
        "max_retries": 3,
        "allow_partial_result": True
    }
}
```

## What does each part mean?

### 1. Intent

What business outcome does the user want?

```text
CustomerBriefing
```

---

### 2. Entities / Inputs

What information is required to execute the request?

```text
customer_id = C123
```

Other examples could be:

```text
incident_id
product_id
manufacturing_line
date_range
```

---

### 3. Selected Delegator

Which business-domain Delegator owns the execution?

```text
CustomerBriefing
       ↓
SalesDelegator
```

The Coordinator selects the **Delegator**, not individual enterprise APIs.

---

### 4. Workers / Capabilities

Which Workers are needed?

```text
SalesDelegator
    ├── CustomerProfileWorker
    ├── SupportHistoryWorker
    └── ContractWorker
```

Each Worker represents a business capability.

---

### 5. Dependencies

The plan specifies whether a Worker depends on another Worker.

Example:

```text
Worker A
   ↓
Worker B
```

means B cannot start until A finishes.

If there is no dependency:

```text
Worker A ──┐
Worker B ──┼── parallel
Worker C ──┘
```

they can execute concurrently.

---

### 6. Execution order / parallelism

The plan specifies:

```text
parallel
```

or:

```text
sequential
```

For Customer Briefing, if all three Workers only need `customer_id`, they can run in parallel.

---

### 7. Worker inputs

The plan should specify what input each Worker receives.

Example:

```text
CustomerProfileWorker
    input:
        customer_id = C123
```

The Worker then uses its MCP tool to access the appropriate enterprise system.

---

### 8. Mandatory vs optional

The plan can include business policy:

```text
Customer Profile → mandatory
Support History  → optional
Contract         → mandatory
```

If Support History fails, the workflow may continue.

If Contract fails, the workflow may be marked incomplete.

**Important:** this policy should come from the approved workflow configuration, not be invented by the LLM.

---

### 9. Failure / retry policy

The plan can contain execution constraints such as:

```text
max_retries = 3
timeout = 10 seconds
retryable_errors = timeout, 429, 503
```

The Delegator enforces the Worker-level recovery behavior.

---

### 10. Aggregation strategy

The plan needs to define what happens after Workers finish.

```text
Customer Profile ──┐
Support History ───┼──→ Coordinator
Contract ──────────┘
                         ↓
                     Validate
                         ↓
                     Aggregate
                         ↓
                Customer Briefing
```

In your CWD design, the **Coordinator validates and aggregates the Worker results** before producing the final business response.

---

### 11. Completion criteria

The plan should define what constitutes success.

For example:

```text
Customer Profile = SUCCESS
Contract = SUCCESS
Support History = SUCCESS or FAILED
```

Because Support History is optional, the workflow can still complete if it fails.

---

# Complete picture

```text
                  EXECUTION PLAN
                        │
        ┌───────────────┼────────────────┐
        ↓               ↓                ↓
      Intent         Entities        Delegator
        │               │                │
 CustomerBriefing    C123          SalesDelegator
                                         │
                              ┌──────────┼──────────┐
                              ↓          ↓          ↓
                           Profile    Support    Contract
                           Worker      Worker      Worker
                              │          │          │
                              └──────────┼──────────┘
                                         ↓
                                   Dependencies
                                   / Parallelism
                                         ↓
                                    Failure Policy
                                         ↓
                                     Aggregation
                                         ↓
                                    Completion
```

## Interview answer

> **“The execution plan contains the intent, extracted entities and inputs, selected Delegator, required Workers, Worker dependencies, execution order or parallelism, mandatory versus optional policies, timeouts and retry policies, aggregation strategy, and completion criteria. In CWD, the LLM can propose the plan, but deterministic policies and the Worker Registry validate it before execution. LangGraph then executes that validated plan and maintains its state.”**

### Easy way to remember

**Plan = WHAT + WHO + INPUT + ORDER + DEPENDENCY + POLICY + FAILURE + OUTPUT**

Or even shorter:

> **“The execution plan is the blueprint that tells CWD what to execute, who executes it, with what inputs, in what order, under what policies, and how the results are finalized.”**
