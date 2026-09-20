## Delegator vs Worker in CWD

The simplest way to remember:

> **Delegator = decides and coordinates which Workers should execute.**
> **Worker = performs one specific business capability.**

### Example: Customer Briefing

```text
Coordinator
     ↓
Sales Delegator
     ↓
 ┌───────────────┬───────────────┐
 ↓               ↓               ↓
Customer       Contract       Sales History
Worker         Worker           Worker
 ↓               ↓               ↓
Salesforce    Contract DB     CRM/API
```

### Key difference

| Area                 | Delegator                                     | Worker                                   |
| -------------------- | --------------------------------------------- | ---------------------------------------- |
| **Scope**            | Domain-level                                  | Capability-level                         |
| **Main question**    | **Which Workers should run and in what way?** | **How do I perform this specific task?** |
| **Responsibility**   | Orchestration                                 | Execution                                |
| **Selects**          | Workers                                       | Tools/APIs needed for its task           |
| **Handles**          | Dependencies, parallelism, retries, timeouts  | Actual business operation                |
| **Calls**            | Multiple Workers                              | MCP tools / APIs / enterprise systems    |
| **Aggregation**      | Aggregates Worker results                     | Returns its individual result            |
| **Failure handling** | Decides retry/recovery/partial-result policy  | Detects and reports its failure          |
| **Domain knowledge** | Broad domain knowledge                        | Narrow capability knowledge              |
| **Example**          | Sales Delegator                               | CustomerProfile Worker                   |
| **Output**           | Domain-level result                           | Capability-level result                  |

---

## 1. What does the Delegator do?

Suppose the **Sales Delegator** receives:

> "Get customer information and contract details for C123."

The Delegator determines:

```text
Sales Delegator
     │
     ├── CustomerProfileWorker
     │       ↓
     │    Salesforce
     │
     └── ContractWorker
             ↓
         Contract System
```

It decides:

* Which Workers are required
* Which Workers can run in parallel
* Which Workers depend on others
* Worker timeout
* Retry policy
* Failure handling
* Whether partial results are acceptable
* How Worker results should be aggregated

So the Delegator is an **orchestrator**.

---

## 2. What does the Worker do?

The Worker performs **one concrete capability**.

For example:

```text
CustomerProfileWorker
       ↓
MCP tool
       ↓
Salesforce
       ↓
Customer C123
       ↓
Customer profile
```

The Worker doesn't decide:

> "Should I also call the Contract Worker?"

That's the Delegator's responsibility.

The Worker focuses on:

> **"Given customer_id=C123, retrieve the customer profile."**

---

## 3. Where does MCP fit?

This is an important interview distinction.

```text
Delegator
    ↓
CustomerProfileWorker
    ↓
MCP Client
    ↓
MCP Server
    ↓
Salesforce/API
```

The **Worker uses MCP to access enterprise tools**.

For example:

```python
result = await mcp_client.call_tool(
    "get_customer_profile",
    {"customer_id": "C123"}
)
```

The Worker then converts the tool response into a standardized result:

```python
{
    "worker": "CustomerProfileWorker",
    "status": "SUCCESS",
    "customer_id": "C123",
    "data": {
        "name": "ABC Corp",
        "industry": "Semiconductor"
    }
}
```

The Delegator receives that result and manages the overall domain workflow.

---

## 4. Failure example

Suppose:

```text
Sales Delegator
 ├── CustomerProfileWorker → SUCCESS
 ├── ContractWorker        → SUCCESS
 └── SalesHistoryWorker    → TIMEOUT
```

The **Worker** reports:

```text
TIMEOUT
retryable = true
```

The **Delegator** decides:

```text
Is this retryable?
       ↓
YES
       ↓
Retry Worker
       ↓
Still failed?
       ↓
Is Worker mandatory?
   ↙           ↘
 YES           NO
 ↓             ↓
Incomplete    Continue
workflow      with warning
```

So:

> **Worker reports the problem; Delegator manages the recovery strategy.**

---

## 5. Dependency example

Suppose:

```text
CustomerProfileWorker
          ↓
          ↓
RiskAnalysisWorker
```

`RiskAnalysisWorker` needs customer information first.

The Delegator understands:

```python
{
    "CustomerProfileWorker": {
        "depends_on": []
    },
    "RiskAnalysisWorker": {
        "depends_on": ["CustomerProfileWorker"]
    }
}
```

Therefore:

```text
CustomerProfileWorker
        ↓
   completed
        ↓
RiskAnalysisWorker
```

But independent Workers can run in parallel:

```text
             ┌─ CustomerProfileWorker ─┐
SalesDelegator ─ ContractWorker ───────┤
             └─ SalesHistoryWorker ────┘
                         ↓
                    Aggregation
```

---

## The architectural boundary

```text
Coordinator
    ↓
"Which domain?"
    ↓
Delegator
    ↓
"Which capabilities/workers?"
    ↓
Worker
    ↓
"How do I perform this capability?"
    ↓
MCP / API / Enterprise System
```

### Interview-ready answer

> **"The Delegator is responsible for domain-level orchestration, while the Worker is responsible for executing a specific business capability. For example, a Sales Delegator may select CustomerProfile, Contract, and SalesHistory Workers. It manages their dependencies, parallel execution, retries, timeouts, and aggregation. Each Worker performs its specific task, typically using MCP to call an enterprise system such as Salesforce or ServiceNow, and returns a structured result. So the Delegator coordinates the work, while the Worker performs the work."**

### One-line to memorize

> **"Delegator coordinates multiple Workers within a domain; Worker executes one specific capability using the required tools or enterprise APIs."**
