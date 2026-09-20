### What happens if one Worker fails?

The Delegator first identifies whether the failure is retryable or non-retryable. For a transient failure, such as a timeout, we retry with exponential backoff. If it still fails, we can use a fallback or mark that Worker as failed and continue if the task is not mandatory. The failure is recorded for observability and passed to the Coordinator. " can you explain in depth "


### Example scenario

Suppose the **Sales Delegator** has three Workers:

```text
Sales Delegator
   ├── Customer Profile Worker → Salesforce
   ├── Support History Worker  → ServiceNow
   └── Contract Worker         → Contract DB
```

User asks:

> "Prepare a customer briefing for customer C123."

The Delegator executes:

```text
Customer Profile Worker  → SUCCESS
Support History Worker   → TIMEOUT ❌
Contract Worker          → SUCCESS
```

Now the failure-handling flow looks like this:

```text
                Coordinator
                     │
                     ▼
              Sales Delegator
               /      |       \
              ▼       ▼        ▼
          Profile   Support   Contract
           Worker    Worker     Worker
             │         │          │
          SUCCESS   TIMEOUT     SUCCESS
                       │
                       ▼
                Error Handler
                       │
                classify error
                       │
             ┌─────────┴─────────┐
             │                   │
          Retryable          Non-Retryable
             │                   │
       Retry + backoff      Fallback / Fail
             │
          Success?
          /     \
        Yes      No
         │        │
         ▼        ▼
      Result    FAILED
                   │
                   ▼
              Delegator
                   │
                   ▼
              Coordinator
```

## 1. First, the Worker detects the failure

The Worker is responsible for calling its underlying tool/API.

For example:

```python
result = await salesforce_tool.get_customer(customer_id)
```

Suppose Salesforce responds within 2 seconds:

```text
200 OK
```

No problem.

But suppose ServiceNow doesn't respond:

```text
Timeout after 10 seconds
```

The Worker should **not simply crash the entire workflow**.

Instead, it returns a structured error:

```python
{
    "worker": "support_history_worker",
    "status": "FAILED",
    "error_type": "TIMEOUT",
    "retryable": True,
    "message": "ServiceNow API timeout",
    "correlation_id": "run-123"
}
```

This structured result is important because the Delegator needs to make a decision.

---

# 2. Delegator classifies the failure

The Delegator's error-handling logic determines:

> "Is this failure temporary, or is retrying useless?"

There are generally two categories.

### Retryable failures

Examples:

```text
Timeout
Connection reset
HTTP 429
Temporary network error
HTTP 502
HTTP 503
Transient database connection failure
```

These may succeed if we try again.

### Non-retryable failures

Examples:

```text
Invalid customer_id
Authentication failure
Authorization denied
Malformed request
Required data does not exist
Business validation failure
Unsupported operation
```

Retrying these usually won't solve the problem.

For example:

```text
customer_id = ABC999
```

If the customer doesn't exist, making the same API call five times doesn't help.

---

# 3. Retryable failure → exponential backoff

Suppose the Support History Worker receives:

```text
HTTP 503 Service Unavailable
```

The Delegator classifies it as retryable.

Instead of immediately calling ServiceNow repeatedly:

```text
Attempt 1 → fail
Attempt 2 → fail
Attempt 3 → fail
Attempt 4 → fail
```

we use **exponential backoff**.

For example:

```text
Attempt 1 → immediate
Attempt 2 → wait 1 second
Attempt 3 → wait 2 seconds
Attempt 4 → wait 4 seconds
```

Usually we also add **jitter** so that many workers don't retry at exactly the same time.

Conceptually:

```python
delay = min(
    base_delay * (2 ** retry_count),
    max_delay
)
```

With jitter:

```python
delay = exponential_delay + random_jitter
```

This protects downstream systems from a **retry storm**.

---

# 4. What if retry succeeds?

Suppose:

```text
Attempt 1 → Timeout
Attempt 2 → Timeout
Attempt 3 → SUCCESS
```

Then the Worker returns:

```json
{
  "worker": "support_history_worker",
  "status": "SUCCESS",
  "attempt": 3,
  "data": {
    "open_cases": 2,
    "resolved_cases": 17
  }
}
```

The Delegator now has:

```text
Profile Worker   → SUCCESS
Support Worker   → SUCCESS
Contract Worker  → SUCCESS
```

So the Delegator aggregates these results and sends them to the Coordinator.

---

# 5. What if all retries fail?

Suppose:

```text
Attempt 1 → Timeout
Attempt 2 → Timeout
Attempt 3 → Timeout
```

Now we don't retry forever.

We have a configured retry policy:

```text
max_retries = 3
```

After the maximum attempts:

```text
Worker status = FAILED
```

The Delegator then determines whether that Worker is **mandatory or optional**.

This is a very important part of your interview answer.

---

# 6. Mandatory vs optional Worker

Imagine your customer briefing requires:

```text
Customer Profile → mandatory
Contract Details → mandatory
Support History  → optional
```

If Support History fails:

```text
Profile     → SUCCESS
Contract    → SUCCESS
Support     → FAILED
```

The Delegator can continue because Support History is optional.

It might produce:

```json
{
  "customer_profile": {...},
  "contract": {...},
  "support_history": null,
  "warnings": [
    "Support history unavailable"
  ]
}
```

But if the **Contract Worker** fails:

```text
Contract Worker → FAILED
```

and contract information is mandatory, the Delegator should not pretend that the briefing is complete.

It could return:

```json
{
  "status": "PARTIAL_FAILURE",
  "completed_workers": [
    "customer_profile",
    "support_history"
  ],
  "failed_workers": [
    "contract"
  ],
  "blocking_failure": true
}
```

The Coordinator then decides what the final response should be.

---

# 7. What happens to the successful Workers?

This is another important point.

Suppose:

```text
W1 → SUCCESS
W2 → SUCCESS
W3 → FAILED
```

We **do not execute W1 and W2 again** just because W3 failed.

Their results are persisted.

For example:

```text
Workflow State

W1:
status = SUCCESS
result = Customer Profile

W2:
status = SUCCESS
result = Support History

W3:
status = FAILED
error = ServiceNow timeout
```

This is where **LangGraph state persistence/checkpointing** becomes important in your CWD architecture.

The workflow knows:

```text
W1 completed
W2 completed
W3 failed
```

So if the workflow resumes, it can continue from W3 rather than restarting everything.

---

# 8. Where does LangGraph come into this?

In your CWD implementation, **LangGraph manages the workflow state and transitions**.

Conceptually:

```text
START
  ↓
Delegator Planning
  ↓
Execute Workers
  ↓
Worker Result
  ↓
Evaluate Result
  ├── SUCCESS → Continue
  ├── RETRY   → Retry Worker
  ├── FALLBACK → Execute fallback
  └── FAILURE → Mark Failed
  ↓
Aggregate Results
  ↓
Coordinator Validation
  ↓
END
```

You could have nodes such as:

```text
plan_workers
      ↓
execute_worker
      ↓
handle_worker_result
      ↓
retry_worker
      ↓
aggregate_results
```

The graph's state might contain:

```python
class CWDState(TypedDict):
    request_id: str
    worker_results: dict
    worker_status: dict
    retry_count: dict
    failures: list
    errors: list
```

For example:

```python
state["worker_status"] = {
    "customer_profile": "SUCCESS",
    "support_history": "FAILED",
    "contract": "SUCCESS"
}
```

---

# 9. What if there is a fallback?

Sometimes retry isn't enough.

For example:

```text
Primary:
ServiceNow API
```

fails repeatedly.

You might have:

```text
Fallback:
ServiceNow cached data
```

or:

```text
Primary database
       ↓ failure
Read replica
       ↓ failure
Cached result
```

So:

```text
Support Worker
      │
      ▼
ServiceNow
      │
   failure
      ▼
Retry
      │
   failure
      ▼
Fallback
      │
      ├── success → continue
      │
      └── failure → mark failed
```

However, the fallback must be **business-safe**. You shouldn't return stale or incomplete data as if it were current.

---

# 10. How does the Coordinator know there was a failure?

The Delegator sends a structured response.

For example:

```json
{
  "delegator": "sales_delegator",
  "status": "PARTIAL_SUCCESS",

  "workers": {
    "customer_profile": {
      "status": "SUCCESS",
      "data": {...}
    },

    "support_history": {
      "status": "FAILED",
      "error_type": "TIMEOUT",
      "retry_count": 3
    },

    "contract": {
      "status": "SUCCESS",
      "data": {...}
    }
  },

  "warnings": [
    "Support history could not be retrieved"
  ]
}
```

The Coordinator then performs its own validation.

---

# 11. Coordinator validation is different from failure handling

This distinction is important for interviews.

### Worker

Responsible for:

```text
Calling tool/API
Processing response
Returning worker result/error
```

### Delegator

Responsible for:

```text
Worker execution
Retry
Backoff
Failure classification
Fallback
Dependency management
Partial execution
Worker-level aggregation
```

### Coordinator

Responsible for:

```text
Cross-delegator orchestration
Final validation
Result aggregation
Business-level response
User-facing response
```

So don't say:

> "The Coordinator retries the Worker."

In your architecture, a better answer is:

> **The Delegator owns Worker-level failure handling and retry policies, while the Coordinator handles workflow-level validation and aggregation.**

---

# 12. Observability

Every failure should be traceable.

For example:

```text
correlation_id = req-789
run_id         = run-456
delegator      = sales_delegator
worker         = support_history_worker
attempt        = 3
tool           = ServiceNow
error          = timeout
latency        = 10.2 sec
```

You can send this telemetry to:

```text
Azure Application Insights
Azure Log Analytics
Langfuse
```

For your AWS architecture, the equivalent monitoring stack could include:

```text
CloudWatch
X-Ray
OpenTelemetry
Langfuse
```

This allows you to answer:

> Which Worker failed?
> Why did it fail?
> How many times was it retried?
> Which tool caused the failure?
> How long did it take?
> Did the workflow eventually recover?

---

# 13. Complete CWD example

Imagine:

```text
User
 │
 │ "Prepare customer briefing for C123"
 ▼
Coordinator
 │
 ▼
Sales Delegator
 │
 ├───────────────┬────────────────┐
 ▼               ▼                ▼
Profile        Support          Contract
Worker         Worker            Worker
 │               │                │
 ▼               ▼                ▼
Salesforce     ServiceNow       Contract DB
SUCCESS        TIMEOUT          SUCCESS
                 │
                 ▼
           Classify Failure
                 │
              RETRYABLE
                 │
                 ▼
          Exponential Backoff
                 │
                 ▼
              Retry #1
                 │
              TIMEOUT
                 │
                 ▼
              Retry #2
                 │
              TIMEOUT
                 │
                 ▼
              Retry #3
                 │
              TIMEOUT
                 │
                 ▼
             Max Retries
                 │
                 ▼
          Mark Worker FAILED
                 │
                 ▼
       Is Worker Mandatory?
             /          \
           No            Yes
           │              │
           ▼              ▼
     Continue        Block workflow
           │
           ▼
    Aggregate results
           │
           ▼
       Coordinator
           │
           ▼
     Validate results
           │
           ▼
      Final response
```

If Support History is optional, the final response might say:

> Customer profile and contract information were retrieved successfully. Support history was temporarily unavailable after multiple attempts.

That's much better than returning a fabricated support history or failing the entire customer briefing.

---

## Interview answer — 60 seconds

If the interviewer asks **"What happens if one Worker fails?"**, I would answer:

> "In CWD, Worker-level failure handling is primarily managed by the Delegator. When a Worker fails, we first classify the error as retryable or non-retryable. For transient failures such as timeout, 429, or 503, we retry using exponential backoff with jitter and a maximum retry limit. If retries are exhausted, we can use a defined fallback or mark the Worker as failed. The Delegator also determines whether that Worker is mandatory or optional. If it is optional, the workflow can continue with a partial result and a warning; if it is mandatory, the workflow can be blocked or moved to a failure state. Successful Worker results are persisted, so we don't re-execute completed Workers unnecessarily. LangGraph manages the workflow state and checkpointing, while the failure details, retry count, correlation ID, latency, and error information are captured through our observability stack. Finally, the Delegator sends the structured result to the Coordinator, and the Coordinator performs final validation and aggregation before generating the response."

### The key architecture sentence to remember

**Worker detects → Delegator classifies/retries/recoveries → LangGraph persists state → Delegator aggregates → Coordinator validates and produces the final result.**

### What happens if two Workers succeed and one fails?

CWD supports partial success. The Delegator collects the two successful results and records the failed Worker separately. If the failed Worker provides optional information, the workflow can continue and the final response clearly indicates that information was unavailable. If it is a mandatory dependency, the workflow can pause, retry, or fail gracefully.

### How does CWD resume a partially completed workflow?

We persist the LangGraph workflow state/checkpoint after important execution steps. If a Worker fails, the completed results and current workflow state are already stored. After recovery, CWD resumes from the last successful checkpoint instead of starting the entire workflow again.
