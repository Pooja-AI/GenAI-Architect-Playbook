In **CWD**, retries are handled mainly at the **Delegator/Worker execution layer**, with **LangGraph state/checkpointing** helping us recover without rerunning successful Workers.

### How retries work

Suppose the **Sales Delegator** executes three Workers:

```text
Sales Delegator
 ├── CustomerProfileWorker → Salesforce
 ├── SupportHistoryWorker → ServiceNow
 └── ContractWorker → Contract System
```

If `ContractWorker` gets a timeout:

```text
ContractWorker
      ↓
Timeout / 503 / 429
      ↓
Is error retryable?
      ↓ Yes
Exponential Backoff + Jitter
      ↓
Retry
      ↓
Success → continue
```

### 1. Classify the error

We first determine whether the failure is **retryable**.

**Retryable:**

* Network timeout
* Connection reset
* HTTP 429 rate limit
* HTTP 502/503
* Temporary database/service unavailability

**Non-retryable:**

* Invalid `customer_id`
* Authentication/authorization failure
* Invalid request
* Business validation failure
* Unsupported operation

We should **not blindly retry every error**.

---

### 2. Use exponential backoff + jitter

For example:

```python
retry_delay = min(base_delay * (2 ** attempt), max_delay)
```

With jitter:

```text
Attempt 1 → ~1 sec
Attempt 2 → ~2 sec
Attempt 3 → ~4 sec
```

The random jitter prevents many Workers from retrying at exactly the same time.

---

### 3. Limit the number of retries

For example:

```python
WORKER_CONFIG = {
    "ContractWorker": {
        "max_retries": 3,
        "timeout": 10,
        "retryable_errors": [
            "TIMEOUT",
            "429",
            "502",
            "503"
        ]
    }
}
```

After three failed attempts, we stop retrying.

---

### 4. Don't rerun successful Workers

Suppose:

```text
CustomerProfileWorker → SUCCESS
SupportHistoryWorker  → SUCCESS
ContractWorker        → FAILED
```

We persist the state:

```text
CustomerProfile = SUCCESS
SupportHistory  = SUCCESS
Contract        = FAILED
```

When the workflow resumes, **only ContractWorker is retried**.

This is where **LangGraph checkpointing** is important.

```text
              Sales Delegator
                    |
        ┌───────────┼───────────┐
        ↓           ↓           ↓
       W1          W2          W3
     SUCCESS     SUCCESS      FAILED
                              |
                              ↓
                         Retry W3
                              |
                              ↓
                           SUCCESS
                              |
                              ↓
                     Aggregate Results
```

---

### 5. Handle retry exhaustion

If `ContractWorker` continues failing after the maximum retries:

```text
Retry 1 → Failed
Retry 2 → Failed
Retry 3 → Failed
        ↓
Retry Exhausted
```

Then the **workflow policy** decides what happens.

If ContractWorker is **optional**:

```text
Continue with partial result
+ warning
```

If ContractWorker is **mandatory**:

```text
Workflow = INCOMPLETE / FAILED
```

The LLM should **not** decide this. The workflow policy determines it.

---

### 6. Add idempotency

This is very important for production systems.

Suppose a Worker creates a ticket:

```text
Worker → ServiceNow → Create Ticket
```

The API call succeeds, but the response is lost because of a network timeout.

If we retry blindly, we could create **two tickets**.

So we use an **idempotency key**:

```text
request_id + worker_id + operation
```

Example:

```text
REQ-123:SupportWorker:CreateTicket
```

The downstream system can recognize that the operation was already processed.

---

### 7. Add observability

Every retry should be traceable:

```text
request_id
run_id
delegator_id
worker_id
attempt_number
error_type
retry_delay
latency
tool/API
final_status
```

Example:

```text
REQ-123
Worker: ContractWorker
Attempt: 2/3
Error: HTTP 503
Retryable: true
Delay: 2.4 sec
```

This helps troubleshoot production failures.

---

## Technologies involved in CWD

| Requirement            | Technology                         |
| ---------------------- | ---------------------------------- |
| Workflow orchestration | **LangGraph**                      |
| Retry decision         | Worker/Delegator logic + policy    |
| Backoff                | Python retry logic / library       |
| State/checkpoint       | LangGraph + durable store          |
| Async retry            | Service Bus / queue                |
| Failed messages        | Dead Letter Queue                  |
| Idempotency            | Request/operation ID + persistence |
| Monitoring             | Azure App Insights / Log Analytics |
| LLM tracing            | Langfuse / OpenTelemetry           |
| AWS equivalent         | CloudWatch + X-Ray + SQS/DLQ       |

### Interview-ready answer

> **“In CWD, we don't blindly retry every failure. The Worker or Delegator classifies the error as retryable or non-retryable. For transient errors such as timeout, 429, 502, or 503, we use limited retries with exponential backoff and jitter. We persist the workflow state through LangGraph checkpointing, so after a failure we retry only the failed Worker rather than rerunning successful Workers. We also use idempotency for operations that could create duplicate side effects. If retries are exhausted, the workflow policy determines whether we continue with a partial result or mark the workflow as incomplete.”**

**One line to memorize:**
**“Retry transient failures with exponential backoff and jitter, persist state, retry only failed Workers, use idempotency, and stop after a policy-defined retry limit.”**
