In **CWD**, partial success means **some Workers complete successfully while one or more Workers fail**, but the overall business request can still provide useful results.

The key is: **CWD does not automatically fail the entire workflow because one Worker failed.** It checks whether that Worker is **mandatory or optional** for the specific workflow.

### 1. Workers execute

For a **Customer Briefing**, suppose the Sales Delegator has:

```text
SalesDelegator
   ├── CustomerProfileWorker  ✓
   ├── ContractWorker         ✓
   └── SalesHistoryWorker     ✗
```

The Delegator receives:

```text
Customer Profile → SUCCESS
Contract         → SUCCESS
Sales History    → FAILED
```

---

### 2. Delegator identifies the failure

The failed Worker returns structured failure information:

```python
{
    "worker_id": "SalesHistoryWorker",
    "status": "FAILED",
    "error_type": "TIMEOUT",
    "retryable": True
}
```

The Delegator determines:

```text
Is failure temporary?
        ↓
      Yes
        ↓
Retry Worker
```

For example:

```text
Attempt 1 → timeout
Attempt 2 → timeout
Attempt 3 → timeout
        ↓
Retries exhausted
```

---

### 3. It checks whether the Worker is mandatory

This is the important decision.

```text
Worker failed
     ↓
Is Worker mandatory?
    / \
  Yes  No
   ↓    ↓
Stop/   Continue
Incomplete  with partial result
```

The **mandatory/optional decision comes from workflow/business policy**, not from the LLM.

For example:

```python
WORKFLOW_POLICY = {
    "CustomerProfileWorker": "MANDATORY",
    "ContractWorker": "MANDATORY",
    "SalesHistoryWorker": "OPTIONAL"
}
```

---

### 4. Optional Worker failure → partial success

If `SalesHistoryWorker` is optional:

```text
CustomerProfileWorker ✓
ContractWorker        ✓
SalesHistoryWorker    ✗
```

The Delegator returns:

```python
{
    "status": "PARTIAL_SUCCESS",

    "successful_results": {
        "customer_profile": {...},
        "contract": {...}
    },

    "failed_workers": [
        {
            "worker_id": "SalesHistoryWorker",
            "reason": "TIMEOUT"
        }
    ],

    "warnings": [
        "Sales history could not be retrieved"
    ]
}
```

The important point is that **the successful information is not discarded**.

---

### 5. Coordinator receives the partial result

The flow becomes:

```text
Sales Workers
     ↓
Sales Delegator
     ↓
PARTIAL_SUCCESS
     ↓
Coordinator
```

The Coordinator can combine this with results from other Delegators.

For example:

```text
Sales Delegator → PARTIAL_SUCCESS
IT Delegator    → SUCCESS
```

The Coordinator can still construct a useful Customer Briefing:

```text
Customer Information ✓
Contract Information ✓
Incident Information ✓
Sales History       ✗
```

The final response should clearly indicate that the sales-history portion was unavailable rather than presenting it as if it were retrieved.

---

### 6. What if the failed Worker is mandatory?

Suppose `CustomerProfileWorker` fails:

```text
CustomerProfileWorker ✗  ← mandatory
ContractWorker        ✓
SalesHistoryWorker    ✓
```

Then the Delegator should not claim successful completion.

It returns:

```python
{
    "status": "INCOMPLETE",
    "failed_workers": [
        "CustomerProfileWorker"
    ]
}
```

The Coordinator can then:

```text
Retry/recovery
     OR
Pause for human intervention
     OR
Return incomplete response
```

depending on the workflow policy.

---

### 7. What about dependent Workers?

This is another important case.

Suppose:

```text
CustomerProfileWorker
          ↓
ContractWorker
```

If `CustomerProfileWorker` fails, `ContractWorker` may not have enough information to execute.

So:

```text
CustomerProfileWorker ✗
          ↓
ContractWorker → BLOCKED
```

`ContractWorker` is **blocked**, not necessarily failed.

The Delegator records:

```python
{
    "CustomerProfileWorker": "FAILED",
    "ContractWorker": "BLOCKED",
    "SalesHistoryWorker": "SUCCESS"
}
```

This makes the workflow state accurate.

---

## 8. How LangGraph helps

LangGraph maintains the execution state:

```text
State
 ├── completed_workers
 ├── failed_workers
 ├── blocked_workers
 ├── results
 ├── retry_counts
 └── current_step
```

For example:

```python
state = {
    "completed_workers": [
        "CustomerProfileWorker",
        "ContractWorker"
    ],
    "failed_workers": [
        "SalesHistoryWorker"
    ],
    "blocked_workers": [],
    "retry_counts": {
        "SalesHistoryWorker": 3
    }
}
```

Because the state is checkpointed, CWD can later **resume from the failed portion** instead of rerunning successful Workers.

---

## 9. Final response validation

Before the Coordinator returns the response, it checks:

```text
Did required information succeed?
        ↓
Are there partial failures?
        ↓
Are missing fields clearly identified?
        ↓
Is the response grounded only in available results?
        ↓
Return final response
```

For example:

> Customer ABC Corp has an active contract and three open service incidents. Sales-history information could not be retrieved because the sales system timed out.

This is much safer than:

> Customer ABC Corp has an active contract and three open service incidents. Their recent sales history is...

when the sales-history Worker actually failed.

---

## Technology mapping

| Requirement                        | CWD technology                                      |
| ---------------------------------- | --------------------------------------------------- |
| Detect Worker failure              | Worker + Delegator                                  |
| Retry                              | LangGraph/workflow retry policy                     |
| Track successful/failed Workers    | LangGraph State                                     |
| Merge parallel results             | LangGraph Reducer                                   |
| Persist state                      | LangGraph Checkpointer + Cosmos DB/Redis/PostgreSQL |
| Mandatory/optional decision        | Workflow policy / Worker Registry                   |
| Resume failed Worker               | LangGraph checkpoint + retry/resume                 |
| Trace partial failure              | App Insights / OpenTelemetry / Langfuse             |
| Final response synthesis           | Azure OpenAI                                        |
| Prevent hallucinating missing data | Validation + grounded response generation           |



> **“CWD handles partial success through explicit workflow policies. When a Worker fails, the Delegator classifies the failure and retries if appropriate. After retries are exhausted, it checks whether the Worker is mandatory or optional. If optional, the Delegator returns a partial-success result containing successful outputs plus the failure information. If mandatory, the workflow is marked incomplete or paused for recovery. LangGraph state and checkpointing preserve the successful results so we don't rerun completed Workers, and the Coordinator only generates a final response based on validated available data.”**

**One line to remember:**

**Optional failure → continue with partial result; mandatory failure → workflow becomes incomplete/recovery required.**
