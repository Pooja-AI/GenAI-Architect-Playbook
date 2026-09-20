In **CWD**, **fan-out/fan-in** is the pattern used when the Delegator needs to execute multiple independent Workers in parallel and then combine their results.

### 1. What fan-out/fan-in means

```text
              Delegator
                  │
              FAN-OUT
          ┌───────┼───────┐
          ↓       ↓       ↓
       Worker A Worker B Worker C
          ↓       ↓       ↓
          └───────┼───────┘
              FAN-IN
                  ↓
              Aggregator
```

* **Fan-out** = one workflow splits into multiple parallel Worker executions.
* **Fan-in** = those parallel results are merged back into one workflow.

---

## 2. CWD example

For a **Customer Briefing**, the Sales Delegator needs:

```text
CustomerProfileWorker
ContractWorker
SalesHistoryWorker
```

All three need only:

```text
customer_id = C123
```

and don't depend on one another.

So the Delegator performs **fan-out**:

```text
SalesDelegator
      │
      ├── CustomerProfileWorker
      ├── ContractWorker
      └── SalesHistoryWorker
```

All three can execute concurrently.

---

## 3. LangGraph represents this as branches

Conceptually:

```text
START
  ↓
SalesDelegator
  ↓
 ┌──────────────┬──────────────┬──────────────┐
 ↓              ↓              ↓
Worker A       Worker B       Worker C
 ↓              ↓              ↓
 └──────────────┴──────────────┘
                 ↓
              Reducer
                 ↓
             Aggregator
                 ↓
                END
```

The branches represent the **fan-out**.

The reducer/aggregation step represents the **fan-in**.

---

## 4. Fan-out sends the right context to each Worker

The Delegator doesn't send the entire conversation to every Worker.

It creates Worker-specific inputs:

```python id="2qj2fd"
customer_context = {
    "request_id": "REQ-123",
    "customer_id": "C123"
}
```

Then:

```text
CustomerProfileWorker
→ customer_id = C123

ContractWorker
→ customer_id = C123

SalesHistoryWorker
→ customer_id = C123
```

Each Worker independently calls its required MCP tools.

---

## 5. Workers return structured results

For example:

```python id="q3j7vw"
CustomerProfileWorker:
{
    "status": "SUCCESS",
    "data": {
        "name": "ABC Corp",
        "industry": "Semiconductor"
    }
}
```

```python id="0g7zft"
ContractWorker:
{
    "status": "SUCCESS",
    "data": {
        "contract_status": "Active"
    }
}
```

```python id="8h7u1e"
SalesHistoryWorker:
{
    "status": "SUCCESS",
    "data": {
        "recent_sales": [...]
    }
}
```

---

## 6. Fan-in merges the results

Now all three branches return to the common aggregation point:

```text
Worker A ──┐
Worker B ──┼──→ Reducer → Delegator Aggregator
Worker C ──┘
```

The **LangGraph reducer** merges the parallel updates into the shared state.

For example:

```python id="6c7m9n"
state["worker_results"] = {
    "customer_profile": {...},
    "contract": {...},
    "sales_history": {...}
}
```

Then the Delegator's aggregation node validates these results.

---

## 7. Fan-in does not mean blindly concatenating results

The Aggregator checks:

```text
1. Did required Workers complete?
2. Did any Worker fail?
3. Are results schema-valid?
4. Are there conflicts?
5. Are dependencies satisfied?
6. Is the result complete enough for the business request?
```

For example:

```text
Customer Profile ✓
Contract         ✓
Sales History    ✓
       ↓
Validation
       ↓
Combined Sales Result
```

---

## 8. Partial success also works with fan-in

Suppose:

```text
CustomerProfileWorker → SUCCESS
ContractWorker        → SUCCESS
SalesHistoryWorker    → FAILED
```

Fan-in still happens:

```text
Worker A ──SUCCESS──┐
Worker B ──SUCCESS──┼──→ Reducer → Aggregator
Worker C ──FAILED───┘
```

The Aggregator receives:

```python id="w6n8d3"
{
    "customer_profile": {...},
    "contract": {...},
    "sales_history": None,
    "failed_workers": ["SalesHistoryWorker"]
}
```

Then the workflow policy determines whether the result is:

```text
PARTIAL_SUCCESS
```

or

```text
INCOMPLETE
```

depending on whether the failed Worker was optional or mandatory.

---

## 9. Fan-out/fan-in across Delegators

The same pattern can happen at the Coordinator level.

For Customer Briefing:

```text
                     Coordinator
                          │
                       FAN-OUT
                    ┌─────┴─────┐
                    ↓           ↓
              SalesDelegator  ITDelegator
                    ↓           ↓
               Sales Workers  IT Workers
                    ↓           ↓
                    └─────┬─────┘
                       FAN-IN
                          ↓
                    Coordinator
                          ↓
                    Final Response
```

So there are potentially **two levels of fan-out/fan-in**:

```text
Coordinator
   ↓
Delegator-level parallelism
   ↓
Worker-level parallelism
```

---

## 10. Where each technology fits

| Component        | Role                                  |
| ---------------- | ------------------------------------- |
| **Coordinator**  | Can fan-out to independent Delegators |
| **Delegator**    | Fans-out to independent Workers       |
| **LangGraph**    | Defines and executes branches         |
| **State**        | Tracks each branch's result           |
| **Reducer**      | Merges parallel state updates         |
| **Aggregator**   | Validates and combines results        |
| **MCP**          | Workers call enterprise tools         |
| **Checkpointer** | Persists state for recovery           |



> **“In CWD, we implement fan-out/fan-in using LangGraph. The Delegator first identifies independent Workers and fans the execution out into parallel branches. Each Worker receives its required context and executes independently, typically using MCP to access enterprise systems such as Salesforce or ServiceNow. Their results are written back to the shared LangGraph state, and a reducer merges the parallel updates. The fan-in stage then validates and aggregates those results before returning a single domain-level result to the Coordinator. If a branch fails, the aggregation still captures its status and the workflow applies the mandatory/optional failure policy.”**

**One line to remember:**

**Fan-out = split into parallel Workers; Fan-in = merge, validate, and aggregate their results.**
