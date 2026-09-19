In **CWD**, if one Worker fails, we **do not automatically fail the entire request**. The behavior depends on whether that Worker is independent or a dependency for other Workers.

### Example

Suppose the **Sales Delegator** has 3 Workers:

```text
Sales Delegator
   ├── W1: Salesforce Customer Profile
   ├── W2: Salesforce Opportunities
   └── W3: Salesforce Orders
```

The user asks:

> “Give me a complete customer briefing for customer 12345.”

All three Workers need the same `customer_id`, so they can execute in parallel.

If:

```text
W1 → SUCCESS
W2 → SUCCESS
W3 → TIMEOUT
```

CWD handles it like this:

```text
                 Sales Delegator
                       |
             ┌─────────┼─────────┐
             ↓         ↓         ↓
            W1        W2        W3
          SUCCESS   SUCCESS    FAILED
             |         |         |
             └─────────┼─────────┘
                       ↓
              Validate Results
                       ↓
             Partial Domain Result
                       ↓
                 Coordinator
                       ↓
             Final Validation
                       ↓
              LLM Synthesis
```

### 1. Worker reports a structured failure

The Worker should not simply return:

```text
"Something went wrong"
```

It returns something structured:

```json
{
  "worker_id": "salesforce_order_worker",
  "status": "FAILED",
  "error_type": "TIMEOUT",
  "retryable": true,
  "source": "Salesforce",
  "execution_id": "exec-123",
  "correlation_id": "corr-456"
}
```

This allows the orchestration layer to understand **what failed and whether it can retry**.

---

### 2. Delegator determines whether to retry

For a temporary failure:

```text
Timeout
429 rate limit
Temporary 5xx
Network failure
```

the Delegator can retry with exponential backoff:

```text
Attempt 1 → failed
     ↓
wait 1 sec
     ↓
Attempt 2 → failed
     ↓
wait 2 sec
     ↓
Attempt 3 → SUCCESS
```

But for something like:

```text
Invalid customer ID
Unauthorized
Forbidden
Invalid request
```

we normally **don't blindly retry**.

---

### 3. What if retry also fails?

Suppose:

```text
W1 → SUCCESS
W2 → SUCCESS
W3 → FAILED after retries
```

The Delegator marks W3 as failed and returns a **partial domain result**.

Important:

> **Failure is not treated as “no data.”**

For example, we should NOT tell the LLM:

```text
orders = []
```

because that could mean:

> “The customer has no orders.”

Instead:

```json
{
  "customer": {...},
  "opportunities": [...],
  "orders": {
    "status": "UNAVAILABLE",
    "reason": "Salesforce order worker failed"
  }
}
```

This prevents the LLM from hallucinating that there are no orders.

---

## 4. What if another Worker depends on the failed Worker?

This is more important.

Suppose:

```text
W1: Get Customer
       ↓
W2: Get Opportunities
       ↓
W3: Get Contracts
```

If W2 fails:

```text
W1 → SUCCESS
W2 → FAILED
W3 → BLOCKED
```

W3 should **not execute**, because it needs the opportunity IDs produced by W2.

Notice the difference:

```text
W2 = FAILED
W3 = BLOCKED
```

**Failed** means the Worker executed but couldn't complete.

**Blocked** means the Worker could not safely execute because a required dependency was unavailable.

---

## 5. LangGraph manages this state

In our CWD architecture, LangGraph maintains the workflow state.

For example:

```python
state = {
    "customer_id": "12345",
    "worker_results": {},
    "errors": [],
    "blocked_workers": []
}
```

After W1:

```python
state["worker_results"]["W1"] = {
    "status": "SUCCESS",
    "data": customer_data
}
```

After W2 failure:

```python
state["worker_results"]["W2"] = {
    "status": "FAILED",
    "error": "Salesforce timeout",
    "retryable": True
}
```

The graph then evaluates dependencies:

```text
W2 failed
   ↓
Does W3 require W2 output?
   ↓
YES
   ↓
W3 = BLOCKED
```

LangGraph controls the transition rather than allowing W3 to run with incomplete inputs.

---

## 6. Coordinator receives the partial result

The Delegator sends something like:

```json
{
  "delegator": "Sales",
  "status": "PARTIAL",
  "results": {
    "customer": {...},
    "opportunities": [...]
  },
  "failed_workers": [
    {
      "worker": "salesforce_order_worker",
      "reason": "timeout"
    }
  ]
}
```

The Coordinator combines this with results from other Delegators.

For example:

```text
Coordinator
     |
     ├── Sales Delegator
     │      ├── Customer → SUCCESS
     │      ├── Opportunity → SUCCESS
     │      └── Orders → FAILED
     │
     └── Service Delegator
            └── Incidents → SUCCESS
```

The Coordinator can still produce a useful response.

---

## 7. Final response clearly communicates partial availability

The LLM receives the **validated structured context**, including the failure information.

It should generate something like:

> Customer 12345 has three active opportunities and two recent ServiceNow incidents. Order information could not be retrieved because the Salesforce order service timed out.

It should **not** say:

> Customer 12345 has no orders.

because we don't actually know that.

---

# What if the Worker failure is critical?

Some Workers may be marked as **mandatory**.

For example:

```text
Customer Identity Worker → mandatory
Salesforce Opportunity Worker → optional
Order Worker → optional
```

If the mandatory Worker fails:

```text
Customer Identity Worker
          ↓
       FAILED
          ↓
Entire task cannot safely continue
```

The Coordinator may stop the workflow and return:

```text
REQUEST_FAILED
reason = "Required customer identity data unavailable"
```

Whereas an optional Worker failure results in:

```text
PARTIAL_SUCCESS
```

So CWD can distinguish:

| Situation                   | Action                            |
| --------------------------- | --------------------------------- |
| Temporary timeout           | Retry                             |
| 429 / rate limit            | Retry with backoff                |
| Temporary 5xx               | Retry                             |
| Invalid input               | Fail                              |
| Authorization failure       | Fail/deny                         |
| Optional Worker fails       | Continue with partial result      |
| Required Worker fails       | Stop dependent workflow           |
| Dependency Worker fails     | Downstream Worker becomes BLOCKED |
| All required data available | Continue normally                 |

### Interview answer

> **“In CWD, a Worker failure doesn't automatically fail the entire request. The Worker returns a structured status containing the error type, retryability, source, and execution metadata. The Delegator retries transient failures such as timeouts, 429s, or temporary 5xx errors using backoff. If the Worker still fails, we check whether it is optional or a dependency for another Worker. Independent optional failures are represented as partial results, while downstream Workers that depend on the failed Worker are marked BLOCKED rather than executed with incomplete data. LangGraph maintains the execution state and allows the workflow to resume from the last successful checkpoint. The Delegator returns the partial domain result and failure metadata to the Coordinator, which performs final validation and decides whether to return a partial response or fail the overall request. Most importantly, we never interpret missing data as negative data.”**

### The key architecture principle

```text
Worker fails
     ↓
Classify failure
     ↓
Retry if retryable
     ↓
Still failing?
     ↓
Check dependencies
     ├── Independent → continue
     ├── Dependent → block downstream
     └── Critical → fail workflow
     ↓
Persist state
     ↓
Coordinator aggregates successful + failed results
     ↓
Final response explicitly indicates unavailable data
```

**Interview one-liner:**

> “We use failure isolation, retries, dependency-aware blocking, checkpointed state, and partial-result handling so one Worker failure doesn't unnecessarily bring down the entire multi-agent workflow.”

For **CWD Worker failure handling**, no single technology handles everything. Each layer has a specific responsibility.

### CWD failure-handling tech stack

| Responsibility              | Technology                                      | What it handles                                                        |
| --------------------------- | ----------------------------------------------- | ---------------------------------------------------------------------- |
| **Workflow orchestration**  | **LangGraph**                                   | Worker states, transitions, dependencies, retries, conditional routing |
| **Durable execution/state** | **LangGraph checkpointer + Redis/PostgreSQL**   | Saves workflow state so execution can resume                           |
| **Retry / backoff**         | **LangGraph logic + application retry library** | Retries transient failures                                             |
| **Async messaging**         | **Azure Service Bus**                           | Queuing, retries, DLQ, decoupling Workers                              |
| **Dead-letter handling**    | **Azure Service Bus DLQ**                       | Stores messages that repeatedly fail                                   |
| **Worker execution**        | **FastAPI + Python services**                   | Executes Worker business logic                                         |
| **Tool integration**        | **MCP**                                         | Standardized access to Salesforce, ServiceNow, databases, APIs         |
| **Authorization**           | **Microsoft Entra ID + RBAC/ACL**               | Prevents unauthorized Worker execution                                 |
| **Timeout/circuit breaker** | **Python resilience logic / service layer**     | Prevents cascading failures                                            |
| **Monitoring**              | **Azure App Insights + Log Analytics**          | Errors, latency, retries, traces                                       |
| **Distributed tracing**     | **OpenTelemetry + App Insights**                | Tracks Coordinator → Delegator → Worker                                |
| **Secrets**                 | **Azure Key Vault**                             | Credentials/API secrets                                                |
| **Container runtime**       | **AKS / Azure Container Apps**                  | Runs Worker services                                                   |

### The most important one: LangGraph

For your interview, emphasize:

```text
Coordinator
     ↓
Delegator
     ↓
LangGraph execution graph
     ↓
Worker 1 ──→ SUCCESS
Worker 2 ──→ FAILED ──→ RETRY
Worker 3 ──→ BLOCKED
     ↓
Persist State / Checkpoint
     ↓
Delegator
     ↓
Coordinator
```

**LangGraph** handles the **workflow state and decision logic**:

```python
Worker 1 → success
Worker 2 → retry
Worker 2 → failed
        ↓
Does Worker 3 depend on Worker 2?
        ↓
      YES
        ↓
Worker 3 → BLOCKED
```

### Where Azure Service Bus fits

Service Bus is more for **reliable asynchronous messaging**, especially when Workers are independently deployed:

```text
Delegator
   ↓
Service Bus Queue
   ↓
Worker
   ↓
Success
   │
   └── Failure → Retry
                    ↓
              Max retries
                    ↓
                  DLQ
```

So don't say **“Service Bus handles Worker dependencies.”**

Instead:

> **LangGraph handles workflow dependencies and state; Service Bus provides reliable asynchronous messaging, retry delivery, and dead-letter handling.**

### Where MCP fits

MCP does **not** manage failure orchestration.

For example:

```text
Salesforce Worker
       ↓
MCP Client
       ↓
MCP Server
       ↓
Salesforce API
```

If Salesforce times out:

```text
MCP/tool call
     ↓
timeout
     ↓
Worker catches error
     ↓
LangGraph retry policy
     ↓
retry
```

So:

> **MCP standardizes tool access; LangGraph manages the workflow response to the failure.**

### Best interview summary

> **“In our CWD architecture, LangGraph is the primary orchestration layer for Worker failure handling. It maintains execution state, models dependencies, controls conditional transitions, and supports retry/resume behavior. Service Bus is used for asynchronous decoupling and reliable message delivery, including retries and dead-letter queues. Workers are implemented as Python/FastAPI services, and MCP standardizes their access to enterprise systems such as Salesforce and ServiceNow. App Insights, Log Analytics, and OpenTelemetry provide observability and distributed tracing. So LangGraph handles workflow recovery, Service Bus handles messaging reliability, and the Worker/service layer handles the actual business and tool-level errors.”**
