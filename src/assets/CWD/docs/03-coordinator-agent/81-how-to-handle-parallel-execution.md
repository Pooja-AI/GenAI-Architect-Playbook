In your **CWD architecture**, I handle parallel execution at the **Delegator → Worker level** using LangGraph's graph structure. The key is to run **independent Workers concurrently** and keep dependent Workers sequential.

### CWD example

For a Customer Briefing:

```text
                 Coordinator
                      ↓
                SalesDelegator
                      ↓
          ┌───────────┼───────────┐
          ↓           ↓           ↓
     Customer      Support      Contract
      Worker        Worker       Worker
          ↓           ↓           ↓
     Salesforce    ServiceNow   Contract DB
          └───────────┼───────────┘
                      ↓
               Results / Reducer
                      ↓
                 Coordinator
```

If all three only need:

```text
customer_id = C123
```

and don't depend on each other's output, they can execute in parallel.

---

## 1. How LangGraph handles it

The Delegator creates/executes branches for the independent Workers:

```python id="x7y3p2"
workflow.add_edge("prepare_worker_inputs", "customer_profile_worker")
workflow.add_edge("prepare_worker_inputs", "support_history_worker")
workflow.add_edge("prepare_worker_inputs", "contract_worker")
```

Conceptually:

```text
prepare_inputs
      │
 ┌────┼────┐
 ↓    ↓    ↓
W1   W2    W3
```

LangGraph can execute the independent branches concurrently rather than waiting for W1 before starting W2.

---

## 2. Reducer combines the results

Each Worker produces its own result:

```text id="m8q2r4"
W1 → customer_profile
W2 → support_history
W3 → contract
```

The results are merged into shared state using a reducer:

```python id="r9k4t1"
worker_results = {
    "customer_profile": {...},
    "support_history": {...},
    "contract": {...}
}
```

This prevents concurrent updates from simply overwriting each other.

---

## 3. Dependencies determine parallel vs sequential

This is very important.

### Independent Workers → Parallel

```text id="a3b7c9"
        Customer ID
        /    |    \
       ↓     ↓     ↓
      W1     W2    W3
```

### Dependent Workers → Sequential

Suppose Worker 2 needs the output of Worker 1:

```text id="d5e8f1"
W1: Customer Profile
          ↓
W2: Customer Risk Analysis
          ↓
W3: Generate Recommendation
```

You cannot safely execute W2 before W1 finishes.

So the graph represents that dependency:

```text id="q1w4e7"
W1 → W2 → W3
```

---

# 4. How do we determine whether Workers are independent?

The **execution plan / Worker Registry** contains dependency information.

For example:

```python id="n2v5c8"
WORKER_CONFIG = {
    "CustomerProfileWorker": {
        "depends_on": []
    },

    "SupportHistoryWorker": {
        "depends_on": []
    },

    "ContractWorker": {
        "depends_on": []
    },

    "RiskAnalysisWorker": {
        "depends_on": [
            "CustomerProfileWorker"
        ]
    }
}
```

The Coordinator/Delegator uses this information to construct the execution graph.

So the LLM should **not arbitrarily decide**:

> "Let's run these three in parallel."

Instead:

```text id="p6r9t2"
LLM / planning
      ↓
Proposed plan
      ↓
Dependency metadata + policy
      ↓
Validated execution plan
      ↓
LangGraph
      ↓
Parallel execution
```

---

# 5. What about failures?

Parallel execution means one Worker can fail while others succeed.

Example:

```text id="j4k7m1"
W1 → SUCCESS
W2 → SUCCESS
W3 → FAILED
```

The Delegator doesn't necessarily restart W1 and W2.

The state records:

```python id="v8x2n5"
worker_status = {
    "CustomerProfileWorker": "SUCCESS",
    "SupportHistoryWorker": "SUCCESS",
    "ContractWorker": "FAILED"
}
```

Then the failure policy determines what happens:

```text id="b3c6d9"
W3 failed
   ↓
Retryable?
 ├── YES → retry W3
 └── NO
      ↓
Mandatory?
 ├── YES → workflow incomplete/failure
 └── NO  → continue with partial results
```

Completed Workers remain completed.

---

# 6. Controlling concurrency

In production, I would **not allow unlimited parallel Workers**.

For example:

```python id="f2h5k8"
MAX_CONCURRENCY = 10
```

You need to consider:

* downstream API rate limits
* LLM rate limits
* database connection limits
* CPU/memory
* Worker capacity
* tenant-level quotas
* cost

You can use concurrency limits, queues, and backpressure to prevent a large request from spawning hundreds of calls.

---

# 7. Why parallel execution improves CWD latency

Suppose:

```text
CustomerProfile = 2 sec
SupportHistory  = 3 sec
Contract        = 4 sec
```

### Sequential

```text
2 + 3 + 4 = 9 seconds
```

### Parallel

Approximately:

```text
max(2, 3, 4) = 4 seconds
```

plus orchestration overhead.

So parallelism can significantly reduce workflow latency when Workers are independent.

---

## 🎯 Interview-ready answer

> **“In CWD, we parallelize independent Workers at the Delegator level using LangGraph's graph execution model. The execution plan contains Worker dependencies, so Workers with no dependency on each other can execute concurrently, while dependent Workers execute sequentially. Each Worker updates the shared state, and reducers merge the results. We also enforce concurrency limits to protect downstream systems and handle individual Worker failures independently. For example, Customer Profile, Support History, and Contract Workers can run in parallel because they all use the same customer ID but don't depend on each other's output.”**

### One line to memorize

> **“Independent Workers run in parallel; dependent Workers run sequentially; LangGraph manages the execution flow and reducers merge the results.”**
