# How Delegators Return Results to the Coordinator in CWD

In the **CWD (Coordinator–Delegator–Worker)** architecture, the **Delegator → Coordinator** communication is the **domain-result reporting boundary**.

The fundamental principle is:

> **Workers produce specialized execution results, the Delegator validates and aggregates those results into a coherent domain-level result, and the Coordinator uses that domain result to continue enterprise-level orchestration and produce the final response.**

---

## 1. Where this fits in CWD

The complete flow is:

```text
User
 │
 ▼
Coordinator
 │
 │ Domain Task
 ▼
Delegator
 │
 ├── Worker A
 ├── Worker B
 └── Worker C
 │
 │ Worker Results
 ▼
Delegator
 │
 │ Domain Result
 ▼
Coordinator
 │
 ▼
Final Response
```

The communication boundaries are:

```text
Coordinator ──A2A──► Delegator
Delegator   ──Task──► Worker
Worker      ──Result► Delegator
Delegator   ──Result► Coordinator
```

The last step is what we're focusing on here.

---

# 2. Why Delegators return results to the Coordinator

The Coordinator should not need to understand the internal execution details of a domain.

For example, the Coordinator may know:

```text
Shipping domain
```

but shouldn't need to know:

```text
Tracking Worker
Carrier Worker
Inventory Worker
Route Worker
Carrier API
Tracking database
```

Instead, the Delegator hides that complexity.

```text
                  Coordinator
                       │
                       │
                       ▼
               Shipping Delegator
                 /      |      \
                /       |       \
               ▼        ▼        ▼
          Tracking   Carrier  Inventory
           Worker     Worker    Worker
```

The Delegator converts all of this:

```text
Worker A result
Worker B result
Worker C result
```

into:

```text
Domain-level result
```

and returns that to the Coordinator.

---

# 3. Worker results → Domain result

Suppose the Workers return:

```text
Tracking Worker
→ Shipment delayed

Carrier Worker
→ Carrier capacity constraint

Inventory Worker
→ Replacement inventory available
```

The Delegator aggregates:

```text
             Worker Results
                   │
       ┌───────────┼───────────┐
       ▼           ▼           ▼
   Tracking     Carrier     Inventory
       │           │           │
       └───────────┼───────────┘
                   ▼
              Delegator
                   │
              Aggregation
                   │
                   ▼
            Domain Result
```

The domain result might be:

```json
{
  "domain": "shipping",
  "status": "completed",
  "root_cause": "carrier_capacity_constraint",
  "shipment_status": "delayed",
  "recommendation": "reroute_shipment"
}
```

The Coordinator doesn't need to know how those conclusions were produced.

---

# 4. Delegator result contract

A production Delegator result should be structured.

For example:

```json
{
  "task_id": "DT-5001",
  "parent_task_id": "REQ-1001",
  "correlation_id": "CORR-7890",

  "source_agent": "shipping-delegator",
  "target_agent": "coordinator",

  "status": "completed",

  "result": {
    "domain": "shipping",
    "shipment_status": "delayed",
    "root_cause": "carrier_capacity",
    "recommended_action": "reroute"
  },

  "worker_summary": {
    "total": 3,
    "successful": 3,
    "failed": 0
  },

  "errors": [],

  "artifacts": [],

  "metadata": {
    "duration_ms": 4200
  }
}
```

The important distinction is:

```text
status
   ↓
Execution outcome

result
   ↓
Business/domain outcome
```

---

# 5. What the Delegator should return

A good domain result should contain:

| Field            | Purpose                   |
| ---------------- | ------------------------- |
| `task_id`        | Identifies Delegator task |
| `parent_task_id` | Links to Coordinator task |
| `correlation_id` | End-to-end tracing        |
| `source_agent`   | Identifies Delegator      |
| `target_agent`   | Identifies Coordinator    |
| `status`         | Execution state           |
| `result`         | Domain-level output       |
| `worker_summary` | Execution summary         |
| `errors`         | Failures/warnings         |
| `artifacts`      | Generated outputs         |
| `metadata`       | Operational information   |

---

# 6. The Delegator should aggregate before returning

Consider three Workers:

```text
Worker A
  ↓
Tracking Result

Worker B
  ↓
Carrier Result

Worker C
  ↓
Inventory Result
```

The Delegator should not simply forward all raw Worker results to the Coordinator.

Instead:

```text
Worker Results
      │
      ▼
Delegator Validation
      │
      ▼
Domain Aggregation
      │
      ▼
Domain Result
      │
      ▼
Coordinator
```

This gives the Coordinator a clean abstraction.

### Bad

```json
{
  "worker1_raw_api_response": "...",
  "worker2_raw_api_response": "...",
  "worker3_raw_api_response": "..."
}
```

### Better

```json
{
  "shipment_status": "delayed",
  "root_cause": "carrier_capacity",
  "recommendation": "reroute"
}
```

---

# 7. Delegator result lifecycle

A Delegator typically follows:

```text
Worker Results
      │
      ▼
Collect Results
      │
      ▼
Validate Results
      │
      ▼
Correlate Results
      │
      ▼
Aggregate Results
      │
      ▼
Determine Domain Status
      │
      ▼
Create Domain Result
      │
      ▼
Return to Coordinator
```

This can be managed through a Delegator's LangGraph workflow.

---

# 8. LangGraph's role

LangGraph manages the Delegator's internal workflow and state.

For example:

```text
START
  │
  ▼
Receive Worker Results
  │
  ▼
Validate
  │
  ▼
Aggregate
  │
  ▼
Determine Status
  │
  ├── complete ──────► Return Result
  │
  ├── retry ─────────► Execute Worker Again
  │
  ├── partial ───────► Handle Partial Result
  │
  └── recovery ──────► Recovery
```

The final state might contain:

```python
state = {
    "task_id": "DT-5001",
    "worker_results": [...],
    "domain_result": {...},
    "status": "completed"
}
```

The Delegator then maps that internal state to the external result contract.

---

# 9. Conditional result reporting

Not every Delegator execution ends in `completed`.

Possible outcomes include:

```text
completed
partial
failed
needs_input
needs_approval
timeout
cancelled
```

For example:

```text
Delegator
    │
    ▼
Worker Results
    │
    ▼
Evaluate
    │
    ├── All successful
    │       ↓
    │   COMPLETED
    │
    ├── Some failed
    │       ↓
    │    PARTIAL
    │
    ├── Retryable failure
    │       ↓
    │     RETRY
    │
    ├── Approval required
    │       ↓
    │ NEEDS_APPROVAL
    │
    └── Permanent failure
            ↓
          FAILED
```

The Coordinator can then determine the enterprise-level next step.

---

# 10. Example: successful result

```json
{
  "task_id": "DT-5001",
  "status": "completed",

  "result": {
    "domain": "shipping",
    "shipment_status": "delayed",
    "root_cause": "carrier_capacity",
    "recommendation": "reroute"
  }
}
```

Coordinator receives:

```text
Shipping investigation completed.
```

It can continue its workflow.

---

# 11. Example: partial result

Suppose:

```text
Tracking Worker → success
Carrier Worker  → success
Inventory Worker → failed
```

The Delegator could return:

```json
{
  "task_id": "DT-5001",
  "status": "partial",

  "result": {
    "shipment_status": "delayed",
    "root_cause": "carrier_capacity"
  },

  "worker_summary": {
    "total": 3,
    "successful": 2,
    "failed": 1
  },

  "errors": [
    {
      "worker": "inventory-worker",
      "code": "INVENTORY_SERVICE_TIMEOUT",
      "retryable": true
    }
  ]
}
```

The Coordinator might then decide:

```text
Partial result
     │
     ▼
Is inventory information required?
     │
     ├── No → Continue
     │
     └── Yes → Retry / re-delegate
```

---

# 12. Example: Delegator failure

Suppose all Workers fail or the domain cannot produce a valid result.

```json
{
  "task_id": "DT-5001",
  "status": "failed",

  "result": null,

  "error": {
    "code": "SHIPPING_DOMAIN_UNAVAILABLE",
    "type": "transient",
    "retryable": true
  }
}
```

The Coordinator can then decide:

```text
Delegator failed
      │
      ▼
Retry?
  │       │
 YES      NO
  │        │
  ▼        ▼
Retry    Recovery
```

The Delegator reports the domain failure; **the Coordinator controls the enterprise recovery strategy**.

---

# 13. Coordinator should not receive internal Worker details unnecessarily

The Delegator acts as an abstraction boundary.

Instead of returning:

```text
Worker A logs
Worker B database response
Worker C MCP response
Worker D internal reasoning
```

return:

```text
Domain Result
+
Execution Status
+
Relevant Errors
+
Required Metadata
```

This reduces:

* coupling
* data exposure
* token usage
* response size
* implementation leakage

---

# 14. Domain-level abstraction

This is one of the most important architectural concepts.

Suppose the Shipping Delegator internally executes:

```text
Tracking Worker
Carrier Worker
Route Worker
Inventory Worker
```

The Coordinator only sees:

```text
Shipping Delegator
        │
        ▼
Shipping Domain Result
```

Therefore:

```text
Coordinator
    │
    │
    ▼
┌───────────────────────┐
│ Shipping Delegator    │
│                       │
│ W1 + W2 + W3 + W4     │
└───────────────────────┘
    │
    ▼
Shipping Result
```

This is **encapsulation at the agent level**.

---

# 15. Result correlation

Suppose the Coordinator has three Delegators:

```text
DT-100 → Shipping Delegator
DT-200 → Customer Delegator
DT-300 → Finance Delegator
```

Each result must preserve identity.

```json
{
  "task_id": "DT-100",
  "parent_task_id": "REQ-500",
  "correlation_id": "CORR-7890",
  "source_agent": "shipping-delegator"
}
```

This allows the Coordinator to correctly associate:

```text
DT-100 → Shipping result
DT-200 → Customer result
DT-300 → Finance result
```

---

# 16. Multiple Delegators returning results

This is where CWD becomes a true multi-agent orchestration architecture.

```text
                         Coordinator
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼
        Shipping           Customer          Finance
        Delegator          Delegator         Delegator
             │                │                │
             ▼                ▼                ▼
        Domain Result     Domain Result    Domain Result
             │                │                │
             └────────────────┼────────────────┘
                              ▼
                       Coordinator
                              │
                         Aggregate
                              │
                              ▼
                        Final Response
```

For example:

```text
Shipping:
shipment delayed

Customer:
customer is VIP

Finance:
refund eligible
```

The Coordinator can combine these:

```text
Customer is VIP
+
Shipment delayed
+
Refund eligible

        ↓

Enterprise Decision
        ↓
Offer expedited replacement + refund
```

---

# 17. Coordinator uses Delegator results for conditional routing

The Coordinator's LangGraph can use the Delegator result:

```text
Delegator Result
       │
       ▼
Update Coordinator State
       │
       ▼
Conditional Routing
       │
       ├── complete → Aggregate
       │
       ├── partial → Request Additional Work
       │
       ├── failed → Retry / Alternate Delegator
       │
       ├── approval → Human Review
       │
       └── invalid → Recovery
```

Conceptually:

```python
def route_domain_result(state):

    status = state["delegator_result"]["status"]

    if status == "completed":
        return "aggregate"

    if status == "partial":
        return "additional_analysis"

    if status == "failed":
        return "recovery"

    if status == "needs_approval":
        return "human_review"

    return "error"
```

---

# 18. Retry and alternate Delegator

Suppose:

```text
Shipping Delegator
       │
       X
 unavailable
```

The Coordinator can consult the Agent Registry:

```text
Agent Registry
      │
      ├── Shipping Delegator v1 → unavailable
      ├── Shipping Delegator v2 → healthy
      └── Backup Shipping Agent → healthy
```

The Coordinator can route accordingly.

This is one benefit of keeping the Coordinator independent from the Delegator's implementation.

---

# 19. Asynchronous result communication

Delegators may execute long-running domain workflows.

The communication can therefore be:

```text
Coordinator
     │
     │ Submit Task
     ▼
Delegator
     │
     │ Task Accepted
     ▼
Coordinator
     │
     │ ... continues / waits ...
     │
     ▼
Delegator
     │
     │ Result Event
     ▼
Coordinator
```

A message broker can support:

```text
Task Queue
Result Queue
Status Events
Retry
Dead-letter handling
```

while the agent-level contract remains standardized.

---

# 20. Security and result filtering

The Delegator should not return everything it knows.

Before returning:

```text
Worker Results
      │
      ▼
Delegator
      │
      ├── Validate
      ├── Aggregate
      ├── Redact sensitive data
      ├── Apply policy
      └── Create domain result
      │
      ▼
Coordinator
```

This is especially important if Worker results contain:

* sensitive customer data
* internal system information
* restricted business information
* security-related information

The Delegator should return only what the Coordinator is authorized and expected to receive.

---

# 21. Observability

The result should be traceable across the entire CWD execution.

```text
correlation_id
      │
      ├── Coordinator request
      │
      ├── Delegator task
      │
      ├── Worker task A
      │
      ├── Worker task B
      │
      ├── Worker task C
      │
      └── Delegator result
```

Useful fields include:

```text
correlation_id
task_id
parent_task_id
delegator
worker_count
successful_workers
failed_workers
duration
retry_count
status
error_code
```

---

# 22. Important distinction: raw results vs domain results

This distinction is critical for enterprise CWD.

### Worker returns

```text
Specialized Execution Result
```

Example:

```json
{
  "tracking_status": "delayed"
}
```

### Delegator returns

```text
Domain Result
```

Example:

```json
{
  "shipment_status": "delayed",
  "root_cause": "carrier_capacity",
  "recommendation": "reroute"
}
```

### Coordinator returns

```text
Enterprise-level Final Response
```

Example:

```text
"Your shipment is delayed because of a carrier capacity issue.
An alternate route is available, so I recommend rerouting it."
```

Therefore:

```text
Worker
   ↓
Execution Result

Delegator
   ↓
Domain Result

Coordinator
   ↓
Enterprise Result / Final Response
```

---

# 23. Full CWD result propagation

```text
                         USER
                           │
                           ▼
                    ┌────────────┐
                    │ Coordinator│
                    └─────┬──────┘
                          │
                       A2A Task
                          │
                          ▼
                    ┌────────────┐
                    │ Delegator  │
                    └─────┬──────┘
                          │
                    Worker Tasks
                          │
             ┌────────────┼────────────┐
             ▼            ▼            ▼
          Worker A     Worker B     Worker C
             │            │            │
             └────────────┼────────────┘
                          ▼
                   Worker Results
                          │
                          ▼
                    ┌────────────┐
                    │ Delegator  │
                    │ Aggregate  │
                    └─────┬──────┘
                          │
                    Domain Result
                          │
                          ▼
                    Coordinator
                          │
                ┌─────────┴─────────┐
                │                   │
             Continue             Recover
                │
                ▼
             Aggregate
                │
                ▼
           Final Response
```

---

# 24. Responsibility separation

| Layer                       | Responsibility                        |
| --------------------------- | ------------------------------------- |
| **Worker**                  | Execute specialized task              |
| **Worker → Delegator**      | Return execution result               |
| **Delegator**               | Validate and aggregate Worker results |
| **Delegator → Coordinator** | Return domain-level result            |
| **Coordinator**             | Combine domain results                |
| **Coordinator → User**      | Produce final enterprise response     |

This prevents responsibilities from becoming mixed.

---

# 25. Core architectural principle

The complete result transformation is:

```text
Specialized Execution
        ↓
Worker Result
        ↓
Delegator Validation
        ↓
Delegator Aggregation
        ↓
Domain Result
        ↓
Coordinator Validation
        ↓
Cross-Domain Aggregation
        ↓
Enterprise Result
        ↓
Final Response
```

Or mathematically:

```text
DomainResult
    =
Aggregate(
    Validate(
        WorkerResults
    )
)
```

Then:

```text
EnterpriseResult
    =
Aggregate(
    DomainResults
)
```

---

# Interview-ready answer

> **In CWD, Delegators return results to the Coordinator through a structured domain-level result contract. The Delegator first collects and validates the results from its Workers, correlates them with their task IDs, handles partial failures or retries, and aggregates the successful Worker outputs into a coherent domain result. It then returns that result to the Coordinator along with execution status, correlation information, relevant errors, artifacts, and operational metadata. The Coordinator does not need to know the internal Worker implementation; it consumes the Delegator's domain-level result and uses its own LangGraph workflow to decide whether to continue, request additional work, retry, recover, require human approval, or combine the result with results from other Delegators.**

### Final mental model

```text
Worker
   │
   │ "Here is what I executed."
   ▼
Delegator
   │
   │ "Here is what happened in my domain."
   ▼
Coordinator
   │
   │ "Here is what happened across the enterprise."
   ▼
User
```

### Core formula

```text
Delegator → Coordinator Result
=
Validated Worker Results
+
Domain Aggregation
+
Execution Status
+
Errors/Warnings
+
Correlation
+
Artifacts
+
Execution Metadata
```

**One-line definition:**

> **A Delegator returns a validated, correlated, and aggregated domain-level result to the Coordinator, hiding Worker-level implementation details while giving the Coordinator enough information to perform enterprise-level routing, aggregation, recovery, and final response generation.**
