In **CWD**, Worker-result aggregation happens primarily at the **Delegator level**, and then the **Coordinator aggregates the results from multiple Delegators**.

### 1. Worker executes its task

For example, the **Sales Delegator** invokes three Workers for a Customer Briefing:

```text
Sales Delegator
   ├── CustomerProfileWorker
   ├── ContractWorker
   └── SalesHistoryWorker
```

Each Worker returns a **structured result**, not just plain text.

```python
{
    "worker_id": "CustomerProfileWorker",
    "status": "SUCCESS",
    "data": {
        "customer_name": "ABC Corp",
        "industry": "Semiconductor",
        "region": "US"
    }
}
```

---

### 2. Delegator collects the Worker results

The Delegator receives all Worker outputs.

For example:

```text
CustomerProfileWorker → Customer information
ContractWorker        → Contract information
SalesHistoryWorker    → Sales information
```

The Delegator stores these results in the **LangGraph state**.

Conceptually:

```python
state["worker_results"] = {
    "CustomerProfileWorker": {...},
    "ContractWorker": {...},
    "SalesHistoryWorker": {...}
}
```

---

### 3. LangGraph reducer merges parallel results

If Workers execute in parallel, each Worker may update the shared state.

For example:

```text
                 ┌─ CustomerProfileWorker ─┐
Sales Delegator ─┼─ ContractWorker ─────────┼→ Reducer → Combined State
                 └─ SalesHistoryWorker ─────┘
```

A **LangGraph reducer** merges those concurrent updates rather than allowing one Worker update to overwrite another.

Conceptually:

```python
def merge_results(existing, new):
    return {
        **existing,
        **new
    }
```

For list-based results, you could use an append/concatenate reducer.

---

### 4. Delegator validates the results

Before returning the aggregate result, the Delegator checks:

* Did the Worker succeed?
* Is the required data present?
* Is the output schema valid?
* Did a mandatory Worker fail?
* Is the result consistent with the expected capability?
* Are there dependent Workers that still need to run?

For example:

```text
CustomerProfileWorker → SUCCESS
ContractWorker        → SUCCESS
SalesHistoryWorker    → SUCCESS
```

The Delegator can produce:

```python
{
    "delegator": "SalesDelegator",
    "status": "SUCCESS",
    "results": {
        "customer_profile": {...},
        "contract": {...},
        "sales_history": {...}
    }
}
```

---

### 5. What if one Worker fails?

Suppose:

```text
CustomerProfileWorker → SUCCESS
ContractWorker        → SUCCESS
SalesHistoryWorker    → FAILED
```

The Delegator applies the workflow policy.

If `SalesHistoryWorker` is optional:

```text
Sales Delegator
    ↓
Partial Success
    ├── Customer Profile ✓
    ├── Contract ✓
    └── Sales History ✗
```

If it is mandatory:

```text
Sales Delegator
    ↓
INCOMPLETE
    └── Mandatory SalesHistoryWorker failed
```

The Delegator should **not simply hide the failure**.

---

### 6. Delegator sends one standardized result to Coordinator

The Coordinator does not need to understand every internal Worker.

Instead:

```text
Workers
   ↓
Delegator
   ↓
DelegatorResult
   ↓
Coordinator
```

Example:

```python
{
    "delegator_id": "SalesDelegator",
    "status": "SUCCESS",
    "results": {
        "customer_profile": {...},
        "contract": {...},
        "sales_history": {...}
    },
    "failed_workers": [],
    "warnings": []
}
```

This gives the Coordinator a clean domain-level result.

---

### 7. Coordinator aggregates Delegator results

Suppose the Customer Briefing requires two domains:

```text
                 Coordinator
                 /          \
                /            \
       Sales Delegator    IT Delegator
            ↓                  ↓
       Sales Workers       IT Workers
```

Sales returns:

```text
Customer + Contract + Sales History
```

IT returns:

```text
Incidents + Service Tickets
```

The Coordinator combines them:

```text
                 Coordinator
                      ↓
          ┌───────────┴───────────┐
          ↓                       ↓
     Sales Results           IT Results
          ↓                       ↓
          └───────────┬───────────┘
                      ↓
              Combined Context
                      ↓
             Final Response
```

Then the LLM can synthesize the final business response from this **validated structured data**.

---

## Where each technology fits

| Component                  | Responsibility                                                          |
| -------------------------- | ----------------------------------------------------------------------- |
| **Worker**                 | Produces individual result                                              |
| **MCP**                    | Worker communicates with enterprise tools such as Salesforce/ServiceNow |
| **Delegator**              | Collects, validates and aggregates Worker results                       |
| **LangGraph State**        | Maintains workflow/results state                                        |
| **LangGraph Reducer**      | Merges concurrent Worker updates                                        |
| **LangGraph Checkpointer** | Persists state for recovery/resume                                      |
| **Coordinator**            | Aggregates results from multiple Delegators                             |
| **LLM**                    | Synthesizes validated results into the final response                   |

### Important distinction

The **LLM should not be responsible for blindly merging raw Worker outputs**.

The safer pattern is:

```text
Worker
  ↓
Structured Result
  ↓
Delegator
  ↓
Validation + Aggregation
  ↓
Coordinator
  ↓
Cross-domain Aggregation
  ↓
LLM Response Synthesis
  ↓
Final Response Validation
```



> **“In CWD, Workers return structured results to their Delegator. The Delegator validates and aggregates those results, while LangGraph state and reducers handle the merging of parallel execution results. The Delegator then returns a standardized domain-level result to the Coordinator. If multiple Delegators participate, the Coordinator validates and aggregates their results and passes the combined, trusted context to the LLM for final response synthesis.”**

**One line to remember:**
**Worker produces → Delegator aggregates → Coordinator combines → LLM synthesizes.**
