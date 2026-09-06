# How Workers Return Execution Results to Delegators in CWD

In the **CWD (Coordinator–Delegator–Worker)** architecture, the Worker → Delegator communication is the **result-reporting boundary**.

The fundamental principle is:

> **A Worker executes a specific task, validates what it produced, and returns a structured execution result to the Delegator. The Delegator interprets that result at the domain level and decides what happens next.**

The Worker should **report facts and execution outcomes**. The Delegator owns the **domain-level orchestration decision**.

---

## 1. End-to-end flow

```text
Coordinator
     │
     │ Domain Task
     ▼
Delegator
     │
     │ Worker Task
     ▼
Worker
     │
     ├── Validate input
     ├── Execute business logic
     ├── Call tools / MCP
     ├── Retrieve data
     ├── Validate output
     └── Create execution result
     │
     ▼
Delegator
     │
     ├── Validate result
     ├── Update state
     ├── Aggregate results
     ├── Retry / recover if required
     └── Produce domain result
     │
     ▼
Coordinator
```

---

# 2. What exactly does a Worker return?

A Worker should generally return more than just:

```text
"Success"
```

A production execution result should provide enough information for the Delegator to determine:

1. Did execution succeed?
2. What was produced?
3. Did execution partially succeed?
4. Was there an error?
5. Is the error retryable?
6. What task produced the result?
7. How long did execution take?
8. Are there artifacts?
9. Are there warnings or validation issues?

Conceptually:

```text
Worker Result
=
Task Identity
+
Execution Status
+
Business Result
+
Error Information
+
Artifacts
+
Execution Metadata
```

---

# 3. Example execution-result contract

A useful conceptual contract is:

```json
{
  "task_id": "WT-1001",
  "parent_task_id": "DT-5001",
  "correlation_id": "CORR-7890",

  "worker": {
    "id": "tracking-worker",
    "version": "2.4.1"
  },

  "status": "completed",

  "result": {
    "shipment_id": "SHIP123",
    "latest_status": "delayed",
    "location": "Dallas",
    "delay_reason": "carrier_capacity"
  },

  "artifacts": [],

  "warnings": [],

  "error": null,

  "metadata": {
    "duration_ms": 1240,
    "tools_used": [
      "get_tracking_events"
    ]
  }
}
```

The important distinction is:

```text
status = completed
```

is the **execution outcome**, while:

```text
result = {...}
```

contains the **business output**.

---

# 4. Worker execution lifecycle

A Worker typically follows this lifecycle:

```text
              Worker
                │
                ▼
        Receive Worker Task
                │
                ▼
         Validate Input
                │
                ▼
        Check Authorization
                │
                ▼
        Execute Operation
                │
        ┌───────┴────────┐
        │                │
      Success          Failure
        │                │
        ▼                ▼
 Validate Result    Classify Error
        │                │
        ▼                ▼
 Create Result      Create Error Result
        │                │
        └───────┬────────┘
                ▼
        Return to Delegator
```

---

# 5. Successful execution

Suppose the Delegator asks:

> Get shipment tracking information for SHIP123.

The Worker executes:

```text
Worker
  │
  ├── Validate shipment ID
  │
  ├── Call tracking capability
  │
  ├── Receive tracking events
  │
  ├── Validate response
  │
  └── Build execution result
```

Result:

```json
{
  "task_id": "WT-1001",
  "status": "completed",
  "result": {
    "shipment_id": "SHIP123",
    "status": "delayed",
    "last_location": "Dallas"
  },
  "error": null
}
```

The Delegator can now continue.

---

# 6. Failed execution

Suppose the external carrier API times out.

The Worker should not simply return:

```text
"Something went wrong."
```

Instead:

```json
{
  "task_id": "WT-1001",
  "status": "failed",

  "result": null,

  "error": {
    "code": "CARRIER_API_TIMEOUT",
    "type": "transient",
    "message": "Carrier tracking service timed out",
    "retryable": true
  }
}
```

Now the Delegator can make a deterministic decision.

```text
Worker Result
     │
     ▼
error.type = transient
     │
     ▼
retryable = true
     │
     ▼
Retry / alternate Worker
```

---

# 7. Why error classification matters

Not every failure should be retried.

For example:

| Error                         | Retry?                    |
| ----------------------------- | ------------------------- |
| Network timeout               | Usually yes               |
| Temporary service unavailable | Usually yes               |
| Rate limit                    | Yes, with backoff         |
| Invalid input                 | No                        |
| Unauthorized                  | Usually no                |
| Forbidden                     | No                        |
| Business rule violation       | No                        |
| Missing required data         | Usually no                |
| Worker unavailable            | Possibly alternate Worker |
| Unknown error                 | Controlled recovery       |

Therefore:

```text
RetryDecision =
f(
    ErrorType,
    Retryable,
    RetryCount,
    Deadline,
    WorkerHealth,
    Idempotency,
    Policy
)
```

The Worker reports the error classification; the **Delegator decides the recovery path**.

---

# 8. Partial results

Workers don't always have a simple success/failure outcome.

Suppose a Worker processes 100 records:

```text
95 processed successfully
5 failed
```

The Worker could return:

```json
{
  "task_id": "WT-2001",
  "status": "partial",

  "result": {
    "total": 100,
    "successful": 95,
    "failed": 5
  },

  "errors": [
    {
      "record_id": "R12",
      "code": "INVALID_DATA"
    },
    {
      "record_id": "R45",
      "code": "MISSING_FIELD"
    }
  ]
}
```

The Delegator might decide:

```text
partial
   │
   ├── acceptable → continue
   │
   ├── retry failed records
   │
   └── unacceptable → recovery
```

---

# 9. Multiple Workers returning results

This becomes especially important for Delegators.

Suppose the Shipping Delegator launches:

```text
Tracking Worker
Carrier Worker
Inventory Worker
```

The results may arrive independently:

```text
                 Delegator
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
    Tracking      Carrier    Inventory
     Result        Result      Result
        │           │           │
        └───────────┼───────────┘
                    ▼
                Aggregator
```

For example:

```json
{
  "worker_results": [
    {
      "task_id": "WT-1",
      "worker": "tracking-worker",
      "status": "completed",
      "result": {
        "status": "delayed"
      }
    },
    {
      "task_id": "WT-2",
      "worker": "carrier-worker",
      "status": "completed",
      "result": {
        "reason": "capacity_constraint"
      }
    },
    {
      "task_id": "WT-3",
      "worker": "inventory-worker",
      "status": "completed",
      "result": {
        "replacement_available": true
      }
    }
  ]
}
```

The Delegator combines them into a domain-level conclusion:

```text
Tracking
   ↓
Delayed

Carrier
   ↓
Capacity constraint

Inventory
   ↓
Replacement available

        ↓

Domain Conclusion
        ↓
Reroute shipment
```

---

# 10. Result aggregation is Delegator responsibility

This separation is critical.

### Worker

```text
"What happened?"
```

### Delegator

```text
"What do these results mean for my domain workflow?"
```

For example:

```text
Worker A → shipment delayed
Worker B → carrier capacity issue
Worker C → alternate route available

              ↓

Delegator

              ↓

Root cause = carrier capacity
Action = reroute shipment
```

The Worker should generally not make enterprise-wide decisions beyond its bounded responsibility.

---

# 11. Result propagation through LangGraph

The Worker result becomes part of the Delegator's workflow state.

Conceptually:

```python
state["worker_results"].append(worker_result)
```

Then LangGraph can route based on that state:

```text
Worker Result
     │
     ▼
Update State
     │
     ▼
Validate
     │
     ├── all successful ──► Aggregate
     │
     ├── partial ─────────► Handle Partial
     │
     ├── retryable ───────► Retry
     │
     ├── unavailable ─────► Select Another Worker
     │
     └── permanent ───────► Recovery
```

This gives:

```text
Worker Result
      ↓
LangGraph State
      ↓
Conditional Edge
      ↓
Next Action
```

---

# 12. Conceptual LangGraph example

```python
def process_worker_result(state):

    result = state["worker_result"]

    if result["status"] == "completed":
        state["status"] = "success"

    elif result["status"] == "partial":
        state["status"] = "partial"

    elif result["status"] == "failed":
        error = result["error"]

        if error.get("retryable"):
            state["status"] = "retry"
        else:
            state["status"] = "recovery"

    return state
```

Then conditional routing:

```python
def route_result(state):

    status = state["status"]

    if status == "success":
        return "aggregate"

    if status == "partial":
        return "handle_partial"

    if status == "retry":
        return "retry_worker"

    return "recovery"
```

The important architecture is:

```text
Worker
  │
  │ Result
  ▼
State
  │
  ▼
Conditional Routing
```

---

# 13. Result validation

The Delegator should not blindly trust Worker output.

For example, the Worker says:

```json
{
  "status": "completed",
  "result": {
    "shipment_status": "delayed"
  }
}
```

The Delegator may validate:

```text
Is result present?
Is schema valid?
Is task_id correct?
Is status valid?
Are required fields present?
Is result consistent with task?
Is data authorized?
```

Conceptually:

```text
Worker Result
     │
     ▼
Schema Validation
     │
     ▼
Business Validation
     │
     ▼
Policy Validation
     │
     ▼
Accept / Reject
```

---

# 14. Preventing result confusion

Consider parallel Workers:

```text
WT-1001 → Tracking
WT-1002 → Carrier
WT-1003 → Inventory
```

Each result must preserve its task identity.

```json
{
  "task_id": "WT-1002",
  "worker": "carrier-worker",
  "status": "completed"
}
```

Otherwise, the Delegator could accidentally associate the wrong result with the wrong task.

Therefore:

```text
task_id
+
parent_task_id
+
correlation_id
```

are extremely important.

---

# 15. Parent-child task relationship

Suppose:

```text
Domain Task = DT-5001
```

The Delegator creates:

```text
DT-5001
   │
   ├── WT-1001
   ├── WT-1002
   └── WT-1003
```

Each Worker result contains:

```json
{
  "task_id": "WT-1001",
  "parent_task_id": "DT-5001"
}
```

This lets the Delegator reconstruct:

```text
Domain Task
     │
     ├── Worker Result 1
     ├── Worker Result 2
     └── Worker Result 3
```

---

# 16. Execution metadata

The Worker can return useful operational metadata:

```json
{
  "metadata": {
    "worker_id": "tracking-worker-03",
    "worker_version": "2.4.1",
    "duration_ms": 1240,
    "retry_count": 0,
    "tools_used": [
      "get_tracking_events"
    ]
  }
}
```

This information supports:

* observability
* debugging
* performance analysis
* capacity planning
* auditing
* SLA monitoring

However, don't expose sensitive internal details unnecessarily.

---

# 17. Artifacts

Some Workers produce more than structured JSON.

Examples:

```text
PDF report
CSV file
Image
Data analysis
Generated document
Model output
```

The result can reference an artifact:

```json
{
  "task_id": "WT-3001",
  "status": "completed",

  "result": {
    "summary": "Analysis completed"
  },

  "artifacts": [
    {
      "artifact_id": "ART-001",
      "type": "report",
      "location": "controlled-storage-reference"
    }
  ]
}
```

The Delegator can then decide whether to:

```text
store
aggregate
forward
transform
return to Coordinator
```

---

# 18. Worker result vs raw tool result

This is another important distinction.

Suppose a Worker calls an MCP tool:

```text
Worker
   │
   ▼
MCP Tool
   │
   ▼
Enterprise API
```

The raw API response might be:

```json
{
  "code": 200,
  "payload": {
    "events": [...]
  }
}
```

The Worker should generally transform this into a **Worker-level business result**:

```json
{
  "task_id": "WT-1001",
  "status": "completed",
  "result": {
    "shipment_status": "delayed",
    "latest_event": "capacity_constraint"
  }
}
```

Therefore:

```text
Enterprise API response
        ↓
MCP result
        ↓
Worker interpretation/validation
        ↓
Worker execution result
        ↓
Delegator
```

The Delegator should not need to understand the internal API response format.

---

# 19. Result communication can be synchronous or asynchronous

### Synchronous

```text
Delegator
    │
    │ task
    ▼
Worker
    │
    │ result
    ▼
Delegator
```

Useful for short operations.

### Asynchronous

```text
Delegator
    │
    │ submit task
    ▼
Worker
    │
    │ accepted
    ▼
Delegator
    │
    │
    │ ... Worker executes ...
    │
    ▼
Result/Event
    │
    ▼
Delegator
```

Useful for:

* long-running analysis
* batch processing
* document processing
* ML inference pipelines
* external system operations

---

# 20. Timeout handling

Suppose:

```text
Delegator timeout = 10 seconds
```

Worker doesn't respond.

The Delegator can classify:

```text
No result
   │
   ▼
Timeout
   │
   ├── Worker still healthy?
   │
   ├── Task idempotent?
   │
   ├── Deadline remaining?
   │
   └── Retry budget available?
```

Then:

```text
Retry
   OR
Alternate Worker
   OR
Recovery
   OR
Escalation
```

A timeout is not automatically equivalent to task failure.

For side-effecting operations, the system must consider whether the Worker may have completed the operation even though its response was lost.

---

# 21. Idempotency

Consider:

```text
Delegator → Worker
"Create order"
```

Worker executes successfully, but the response is lost:

```text
Worker → Enterprise System
       ↓
   Order created

Worker → Delegator
       X response lost
```

Delegator retries:

```text
Delegator → Worker
"Create order"
```

Without idempotency:

```text
Order #1 created
Order #2 created
```

With idempotency:

```text
idempotency_key = WT-1001
```

the Worker can recognize that the operation was already processed.

This is critical for side-effecting tasks.

---

# 22. Security of returned results

Worker results may contain sensitive enterprise information.

Therefore:

```text
Worker
  │
  ▼
Result Classification
  │
  ▼
Redaction / Filtering
  │
  ▼
Authorization Check
  │
  ▼
Delegator
```

Avoid returning:

```text
credentials
access tokens
secrets
unnecessary PII
internal security information
raw database credentials
```

The Worker should return the **minimum information required by the Delegator**.

---

# 23. Complete Worker-result state machine

A useful conceptual model:

```text
                 ┌──────────────┐
                 │   CREATED    │
                 └──────┬───────┘
                        │
                        ▼
                 ┌──────────────┐
                 │   RUNNING    │
                 └──────┬───────┘
                        │
              ┌─────────┼─────────┐
              │         │         │
              ▼         ▼         ▼
          COMPLETED   PARTIAL   FAILED
              │         │         │
              │         │    ┌────┴────┐
              │         │    │         │
              │         │ retryable permanent
              │         │    │         │
              │         │    ▼         ▼
              │         │  RETRY    RECOVERY
              │         │
              └─────────┴───────────────┐
                                        ▼
                                   AGGREGATE
```

The actual statuses should be defined by your CWD contract rather than relying on arbitrary strings.

---

# 24. Complete CWD result flow

```text
                           Coordinator
                                │
                                │ Domain Task
                                ▼
                           Delegator
                                │
                                │ Worker Task
                                ▼
                           ┌────────┐
                           │ Worker │
                           └───┬────┘
                               │
                      Execute specialized task
                               │
                     ┌─────────┴─────────┐
                     │                   │
                     ▼                   ▼
                  Success              Failure
                     │                   │
                     ▼                   ▼
               Validate Result      Classify Error
                     │                   │
                     └─────────┬─────────┘
                               ▼
                        Execution Result
                               │
                               ▼
                           Delegator
                               │
                    ┌──────────┼──────────┐
                    │          │          │
                    ▼          ▼          ▼
                Aggregate    Retry      Recovery
                    │
                    ▼
              Domain Result
                    │
                    ▼
               Coordinator
```

---

# 25. The key architectural separation

The cleanest mental model is:

```text
Delegator → "Here is the task."

Worker → "Here is what happened."

Delegator → "Based on all Worker results,
             here is what the domain workflow should do next."
```

Therefore:

### Worker owns

```text
Execution
Validation
Tool interaction
Business logic
Result generation
Error reporting
```

### Delegator owns

```text
Task decomposition
Worker selection
Dependency management
Result aggregation
Conditional routing
Retry/recovery
Domain-level decisions
```

### Coordinator owns

```text
Enterprise-level orchestration
Cross-domain coordination
Final aggregation
Enterprise response
```

---

# 26. Interview-ready answer

> **Workers return execution results to Delegators through a structured task-result contract. Each result should contain the task identity, parent task or correlation information, execution status, business result, errors, artifacts, and relevant execution metadata. After completing a task, the Worker validates and sanitizes its output before returning it. The Delegator then validates the result, updates its LangGraph workflow state, and determines the next action. Successful results can be aggregated, partial results can be handled according to domain policy, transient failures can be retried, unavailable Workers can be replaced, and permanent failures can enter recovery or escalation.**
>
> **This separation is important because the Worker reports the execution outcome while the Delegator owns domain-level orchestration. When multiple Workers execute in parallel, their task IDs and parent-task relationships allow the Delegator to correctly correlate and aggregate their results. If Workers use MCP to access enterprise systems, raw MCP or API responses are transformed into a bounded Worker-level result before being returned to the Delegator.**

## Core formula

```text
Worker Execution Result
=
Task Identity
+
Status
+
Validated Business Result
+
Error Information
+
Artifacts
+
Execution Metadata
```

And the overall flow:

```text
Worker
  │
  │ Execution Result
  ▼
Delegator
  │
  ├── Validate
  ├── Update State
  ├── Correlate
  ├── Aggregate
  ├── Retry
  ├── Recover
  └── Route
  │
  ▼
Domain Result
```

### One-line definition

> **Worker-to-Delegator result communication is the governed mechanism through which a specialized Worker reports the validated outcome of its assigned task, allowing the Delegator to correlate, aggregate, and route the domain workflow based on that execution result.**
