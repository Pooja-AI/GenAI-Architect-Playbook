In **CWD**, Workers execute in parallel when they are **independent of each other**. LangGraph can create multiple execution branches from the same Delegator state and run those branches concurrently.

### 1. Delegator identifies independent Workers

For example, the **Sales Delegator** needs:

```text
CustomerProfileWorker
ContractWorker
SalesHistoryWorker
```

If all three only need the same `customer_id` and don't depend on each other's results:

```text
CustomerProfileWorker ──┐
ContractWorker ─────────┼──→ Aggregate Results
SalesHistoryWorker ─────┘
```

There is no reason to wait for one before starting another.

---

### 2. LangGraph creates parallel branches

Conceptually:

```text
                  SalesDelegator
                       |
              ┌────────┼────────┐
              ↓        ↓        ↓
          Worker A  Worker B  Worker C
              ↓        ↓        ↓
              └────────┼────────┘
                       ↓
                   Reducer
                       ↓
                  Aggregation
```

Each Worker gets its own task.

For example:

```python
tasks = [
    customer_profile_worker,
    contract_worker,
    sales_history_worker
]
```

The workflow runtime executes these branches concurrently rather than:

```text
A → wait → B → wait → C
```

---

### 3. Each Worker performs its own operation

For your CWD example:

```text
CustomerProfileWorker
        ↓
MCP
        ↓
Salesforce
```

At the same time:

```text
ContractWorker
        ↓
MCP
        ↓
Salesforce
```

And:

```text
SalesHistoryWorker
        ↓
MCP
        ↓
Salesforce
```

So the calls can be in flight simultaneously.

---

### 4. Results are merged using state/reducers

Suppose:

```text
CustomerProfileWorker → Customer information
ContractWorker        → Contract information
SalesHistoryWorker    → Sales information
```

The results are written back into the shared LangGraph state.

A reducer combines the parallel updates:

```python
state["worker_results"] = {
    "customer_profile": customer_result,
    "contract": contract_result,
    "sales_history": sales_result
}
```

Then the Delegator continues to its aggregation node.

```text
Worker A ──┐
Worker B ──┼──→ Reducer → Aggregator
Worker C ──┘
```

---

### 5. It does NOT run everything in parallel

This is very important.

If there is a dependency:

```text
CustomerProfileWorker
        ↓
ContractWorker
```

then ContractWorker must wait.

But if:

```text
CustomerProfileWorker
ContractWorker
SalesHistoryWorker
```

are independent, they can run concurrently.

So the rule is:

> **Independent Workers → parallel**
> **Dependent Workers → sequential**

---

### 6. Example with Salesforce + ServiceNow

For Customer Briefing:

```text
                    Coordinator
                         ↓
                 Customer Briefing
                         ↓
              ┌──────────┴──────────┐
              ↓                     ↓
        SalesDelegator         ITDelegator
              ↓                     ↓
       ┌──────┴──────┐        IncidentWorker
       ↓             ↓              ↓
 CustomerProfile  Contract      ServiceNow
       ↓             ↓
   Salesforce     Salesforce
```

Sales Workers can run in parallel if independent.

At the same time, the IT Worker can also run because it belongs to another independent domain.

Therefore, CWD can have **parallelism at multiple levels**:

```text
Coordinator
     │
     ├── SalesDelegator ──┬── Worker A
     │                    └── Worker B
     │
     └── ITDelegator ─────── Worker C
```

---

### 7. What happens when one parallel Worker fails?

Suppose:

```text
Worker A → SUCCESS
Worker B → SUCCESS
Worker C → FAILED
```

The reducer/state preserves all three statuses:

```text
A → SUCCESS
B → SUCCESS
C → FAILED
```

The Delegator then applies the failure policy:

* **Optional C** → continue with partial success.
* **Mandatory C** → mark the workflow incomplete/recovery required.
* **Retryable C** → retry C without rerunning A and B.

This is one major advantage of keeping execution state.

---

### 8. Why parallel execution is useful

Sequential:

```text
A = 2 sec
B = 3 sec
C = 4 sec

Total ≈ 9 sec
```

Parallel:

```text
A = 2 sec
B = 3 sec
C = 4 sec

Total ≈ max(2,3,4) = 4 sec
```

There is still orchestration and aggregation overhead, so production latency won't be exactly 4 seconds, but the principle is that independent work can reduce overall latency substantially.

---

### Where the technologies fit

| Component             | Responsibility                                  |
| --------------------- | ----------------------------------------------- |
| **Delegator**         | Determines which Workers can run independently  |
| **LangGraph**         | Creates/executes the workflow branches          |
| **Parallel branches** | Run independent Workers concurrently            |
| **LangGraph State**   | Tracks each Worker result/status                |
| **Reducer**           | Merges concurrent state updates                 |
| **Aggregator**        | Combines validated Worker results               |
| **Checkpointer**      | Persists state for recovery/resume              |
| **MCP**               | Allows each Worker to call its enterprise tools |


> **“In CWD, the Delegator identifies Workers that have no dependency on each other and LangGraph executes them as parallel branches. Each Worker performs its operation independently, for example calling Salesforce or ServiceNow through MCP. Their results are written back to the LangGraph state and a reducer merges the concurrent updates. Once all required parallel branches complete, the Delegator aggregates and validates the results. If a dependency exists, we execute those Workers sequentially instead.”**

**One line to remember:**

**Independent Workers run in parallel; dependent Workers run sequentially; LangGraph manages the execution and reducer merges the results.**
