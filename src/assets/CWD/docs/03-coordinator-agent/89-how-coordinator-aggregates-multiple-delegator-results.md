In **CWD**, the Coordinator aggregates results from **multiple Delegators at the business-workflow level**. Each Delegator first completes its own Workers and returns a **structured Delegator result**. The Coordinator then validates, merges, and synthesizes those results into the final response.

### Example

Suppose the user asks:

> **“Prepare a complete customer briefing for C123, including sales information and manufacturing issues.”**

The Coordinator may route to two Delegators:

```text
                    Coordinator
                   /           \
                  /             \
        Sales Delegator    Manufacturing Delegator
              |                    |
        ┌─────┴─────┐          ┌───┴────┐
        ↓           ↓          ↓        ↓
     CRM Worker  Contract    Failure   Quality
                  Worker     Worker    Worker
```

Each Delegator returns a structured result.

```python
sales_result = {
    "delegator": "SalesDelegator",
    "status": "SUCCESS",
    "results": {
        "customer_profile": {...},
        "contract": {...}
    }
}

manufacturing_result = {
    "delegator": "ManufacturingDelegator",
    "status": "SUCCESS",
    "results": {
        "failure_analysis": {...},
        "quality_issues": {...}
    }
}
```

---

## 1. Each Delegator owns its domain aggregation

The **Delegator does not just return raw Worker responses**.

For example:

```text
SalesDelegator
   ↓
CustomerProfileWorker
ContractWorker
   ↓
Validate
   ↓
Sales domain result
```

Similarly:

```text
ManufacturingDelegator
   ↓
FailureAnalysisWorker
QualityWorker
   ↓
Validate
   ↓
Manufacturing domain result
```

Then:

```text
Sales Result
      \
       → Coordinator → Final Aggregation
      /
Manufacturing Result
```

This keeps the responsibilities clean.

> **Delegator = domain-level aggregation.**
> **Coordinator = enterprise/business-level aggregation.**

---

## 2. Coordinator receives structured results

I would standardize the Delegator response using a schema.

For example:

```python
class DelegatorResult(BaseModel):
    delegator_id: str
    status: str
    results: dict
    errors: list
    warnings: list
    execution_metadata: dict
```

So the Coordinator doesn't have to interpret arbitrary text from each Delegator.

---

## 3. Coordinator validates each Delegator result

Before aggregation:

```text
Delegator Result
      ↓
Schema validation
      ↓
Status validation
      ↓
Authorization validation
      ↓
Completeness validation
      ↓
Accept / Reject / Partial
```

For example:

```python
if result.status == "SUCCESS":
    validate_schema(result)
    validate_required_fields(result)
```

This prevents the final LLM from receiving malformed or incomplete data.

---

## 4. Parallel Delegators can be merged using reducers

If Sales and Manufacturing are independent:

```text
Coordinator
    |
    ├── SalesDelegator ─────────┐
    |                           |
    └── ManufacturingDelegator ─┤
                                ↓
                         Aggregate Results
```

LangGraph can execute these branches and use a reducer to merge their updates into shared Coordinator state.

Conceptually:

```python
def merge_delegator_results(existing, new):
    return {
        **existing,
        **new
    }
```

For failures:

```python
def append_failures(existing, new):
    return existing + new
```

So the Coordinator state might become:

```python
{
    "delegator_results": {
        "SalesDelegator": {...},
        "ManufacturingDelegator": {...}
    },
    "failures": []
}
```

---

## 5. Handle partial Delegator failures

This is very important.

Suppose:

```text
SalesDelegator          → SUCCESS
ManufacturingDelegator  → FAILED
```

The Coordinator doesn't automatically discard everything.

It checks the workflow policy:

```text
Is Manufacturing information mandatory?
       |
   ┌───┴────┐
   ↓        ↓
  YES       NO
   ↓        ↓
Incomplete  Partial result
```

For example:

```text
Sales information:
✓ Available

Manufacturing information:
⚠ Unavailable — Manufacturing Delegator timed out
```

The final answer should **not invent manufacturing information**.

---

## 6. Aggregation is not just dictionary merging

This is an important interview point.

Suppose two Delegators return:

```text
SalesDelegator:
customer_name = "ABC Corp"

ManufacturingDelegator:
customer_name = "ABC Corporation"
```

The Coordinator shouldn't blindly choose one.

Aggregation can involve:

* schema validation
* duplicate detection
* conflict detection
* source priority
* timestamp/freshness
* business rules
* completeness
* confidence/evidence
* authorization

For example:

```text
Sales system → authoritative customer identity
Manufacturing system → manufacturing metrics
```

The **source-of-truth policy** determines which system owns each field.

---

## 7. Then the LLM synthesizes the final response

Once deterministic aggregation is complete:

```text
Sales Result
      +
Manufacturing Result
      ↓
Validated Aggregated Context
      ↓
Final LLM
      ↓
Customer Briefing
```

The LLM's job here is **synthesis and natural-language generation**, not deciding which Delegator result is trustworthy.

For example:

```text
Customer: ABC Corp

Sales:
- Active customer
- Current contract details
- Account information

Manufacturing:
- Recent production issue
- Failure analysis
- Quality findings
```

Then the final response can summarize the combined business picture.

---

# How it looks in LangGraph

Conceptually:

```text
                         Coordinator
                              |
                    create_execution_plan
                              |
                    ┌─────────┴─────────┐
                    ↓                   ↓
             SalesDelegator      ManufacturingDelegator
                    ↓                   ↓
             Domain Result        Domain Result
                    └─────────┬─────────┘
                              ↓
                   validate_delegator_results
                              ↓
                    aggregate_results
                              ↓
                  generate_final_response
                              ↓
                    validate_response
                              ↓
                             END
```

### Important distinction

| Layer           | Responsibility                                              |
| --------------- | ----------------------------------------------------------- |
| **Worker**      | Produces individual capability/data result                  |
| **Delegator**   | Executes and aggregates Workers within its domain           |
| **Coordinator** | Aggregates results across Delegators                        |
| **LLM**         | Synthesizes validated results into natural language         |
| **LangGraph**   | Manages state, parallel branches, transitions, and reducers |

### Interview-ready answer

> **“In CWD, each Delegator first executes and validates its Workers and returns a standardized structured result. The Coordinator receives results from multiple Delegators, validates their schema, status, completeness, authorization, and any conflicts, and then aggregates them into shared Coordinator state. For independent Delegators, LangGraph can execute them in parallel and reducers merge their results. If one Delegator fails, the Coordinator applies the workflow policy to determine whether a partial result is acceptable or the workflow must be marked incomplete. Finally, the LLM synthesizes the validated aggregated results into the user-facing response.”**

### One line to memorize

> **“Delegators aggregate within their domain; the Coordinator validates and aggregates across Delegators; the LLM only synthesizes the validated combined result.”**
