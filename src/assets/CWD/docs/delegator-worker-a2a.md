# Task Communication Between Delegators and Workers in CWD

In the **CWD (Coordinator–Delegator–Worker)** architecture, communication between the **Delegator and Worker** is the execution-level communication boundary.

The core idea is:

> **The Delegator decides what specialized work needs to be performed; the Worker performs that specific task and returns a structured result.**

This is different from Coordinator → Delegator communication, where the focus is **domain-level delegation**.

---

## 1. Where Delegator–Worker communication fits

The complete CWD flow is:

```text
User
 │
 ▼
Coordinator
 │
 │ A2A
 ▼
Delegator
 │
 │ Task
 ▼
Worker
 │
 │ MCP / API / DB / RAG
 ▼
Enterprise Systems
```

The responsibilities are intentionally separated:

| Component   | Responsibility                       |
| ----------- | ------------------------------------ |
| Coordinator | Enterprise-level orchestration       |
| Delegator   | Domain-level orchestration           |
| Worker      | Specialized task execution           |
| A2A         | Agent-to-agent communication         |
| LangGraph   | Workflow state and routing           |
| MCP         | Enterprise tool/resource integration |

---

# 2. Why Delegators communicate with Workers

A Delegator shouldn't execute every piece of domain logic itself.

Suppose the **Shipping Delegator** receives:

> "Investigate why shipment SHIP123 is delayed."

The Delegator decomposes the domain task:

```text
Shipping Delegator
       │
       ├──► Tracking Worker
       │
       ├──► Carrier Worker
       │
       ├──► Inventory Worker
       │
       └──► Route Optimization Worker
```

Each Worker has a narrow responsibility.

For example:

```text
Tracking Worker
    → retrieve shipment tracking events

Carrier Worker
    → analyze carrier events

Inventory Worker
    → check inventory availability

Route Worker
    → determine alternative routes
```

The Delegator then combines their results.

---

# 3. Delegator creates a Worker task

The Delegator should send a **well-defined task contract**.

Conceptually:

```json
{
  "task_id": "WT-1001",
  "parent_task_id": "DT-5001",
  "correlation_id": "CORR-7890",

  "source": "shipping-delegator",
  "target": "tracking-worker",

  "capability": "shipment_tracking",

  "action": "get_tracking_events",

  "input": {
    "shipment_id": "SHIP123"
  },

  "constraints": {
    "timeout_ms": 5000,
    "priority": "high"
  },

  "expected_output": {
    "tracking_events": true,
    "latest_status": true
  }
}
```

Notice that the Worker receives a **specific execution task**, not the entire business request.

---

# 4. What the Worker does with the task

The Worker follows an execution pipeline:

```text
Receive Task
     │
     ▼
Validate Input
     │
     ▼
Check Authorization
     │
     ▼
Determine Execution
     │
     ▼
Select Approved Tool
     │
     ▼
MCP / API / RAG
     │
     ▼
Execute Business Logic
     │
     ▼
Validate Result
     │
     ▼
Return Structured Result
```

For example:

```text
Tracking Worker
      │
      ▼
Validate shipment_id
      │
      ▼
Check permission
      │
      ▼
Call tracking capability
      │
      ▼
Carrier/Tracking API
      │
      ▼
Tracking events
      │
      ▼
Validate response
      │
      ▼
Return result
```

---

# 5. Worker response

The Worker should return structured data.

For example:

```json
{
  "task_id": "WT-1001",
  "status": "completed",

  "result": {
    "shipment_id": "SHIP123",
    "latest_status": "Delayed",
    "last_location": "Dallas",
    "last_event": "Carrier capacity constraint",
    "event_time": "2026-09-06T15:10:00Z"
  },

  "metadata": {
    "worker": "tracking-worker",
    "duration_ms": 1250
  }
}
```

The Delegator can now consume the result deterministically.

---

# 6. Delegator aggregates multiple Worker results

Suppose three Workers execute in parallel:

```text
                  Delegator
                     │
          ┌──────────┼──────────┐
          │          │          │
          ▼          ▼          ▼
      Tracking     Carrier    Inventory
       Worker       Worker      Worker
          │          │          │
          ▼          ▼          ▼
       Result A    Result B    Result C
          │          │          │
          └──────────┼──────────┘
                     ▼
                  Aggregate
                     │
                     ▼
               Domain Result
```

For example:

```json
{
  "tracking": {
    "status": "delayed"
  },

  "carrier": {
    "reason": "capacity_constraint"
  },

  "inventory": {
    "replacement_available": true
  }
}
```

The Delegator analyzes these results:

```text
Tracking → delayed
Carrier  → capacity issue
Inventory → replacement available

             ↓

Root Cause → Carrier capacity
             ↓
Recommendation → Reroute shipment
```

---

# 7. Sequential Worker execution

Not every task should execute in parallel.

Sometimes one Worker depends on another.

Example:

```text
Worker A
Get shipment status
     │
     ▼
Worker B
Analyze delay
     │
     ▼
Worker C
Find alternative route
```

The Delegator therefore manages dependencies:

```text
Task A
  │
  ▼
Task B
  │
  ▼
Task C
```

This is where **LangGraph** becomes useful.

---

# 8. Parallel Worker execution

If Workers are independent:

```text
                 Delegator
                     │
              ┌──────┼──────┐
              │      │      │
              ▼      ▼      ▼
             W1     W2     W3
              │      │      │
              └──────┼──────┘
                     ▼
                  Aggregate
```

For example:

```text
Tracking Worker ──────┐
                      │
Carrier Worker ───────┼──► Aggregator
                      │
Inventory Worker ─────┘
```

Parallel execution reduces latency.

If:

```text
T1 = 2 sec
T2 = 3 sec
T3 = 2 sec
```

Sequential:

```text
Ttotal = 2 + 3 + 2 = 7 sec
```

Parallel:

```text
Ttotal ≈ max(2, 3, 2) = 3 sec
```

plus orchestration overhead.

---

# 9. Worker selection

The Delegator should not necessarily hardcode:

```python
worker = "tracking-worker-01"
```

Instead, it can use an **Agent/Worker Registry**.

Conceptually:

```text
Delegator
    │
    ▼
Worker Registry
    │
    ├── capability
    ├── health
    ├── version
    ├── permissions
    ├── workload
    └── availability
    │
    ▼
Best Worker
```

Selection can be represented as:

```text
Selected Worker =
f(
  Capability,
  Policy,
  Health,
  Load,
  Version,
  Availability,
  Deadline
)
```

This supports Worker pools and horizontal scaling.

---

# 10. Worker pools

In production, the Delegator usually communicates with a **logical capability**, not a specific physical instance.

For example:

```text
             Tracking Worker Pool
          ┌─────────┬─────────┬─────────┐
          │         │         │
          ▼         ▼         ▼
       Instance 1 Instance 2 Instance 3
```

The Delegator says:

```text
"Execute shipment_tracking"
```

rather than:

```text
"Call tracking-worker-instance-2"
```

The runtime can select an available instance.

This makes scaling easier:

```text
Low load
   ↓
3 Worker instances

High load
   ↓
10 Worker instances
```

The Delegator doesn't need to change.

---

# 11. Worker communication and MCP

There is an important distinction.

The Delegator → Worker interaction is **task delegation**.

The Worker → Enterprise System interaction may use **MCP**.

```text
Delegator
    │
    │ Worker Task
    ▼
Worker
    │
    │ MCP
    ▼
MCP Server
    │
    ▼
Enterprise API
```

For example:

```text
Shipping Delegator
       │
       ▼
Tracking Worker
       │
       ▼
MCP Client
       │
       ▼
Tracking MCP Server
       │
       ▼
Carrier Tracking API
```

So:

> **Delegator tells the Worker what to do; MCP gives the Worker a governed interface for accessing enterprise capabilities.**

---

# 12. Delegator vs Worker intelligence

A common architectural mistake is allowing Workers to become uncontrolled agents.

### Delegator

Responsible for:

```text
Decomposition
Dependency management
Worker selection
Parallelization
Aggregation
Domain-level recovery
```

### Worker

Responsible for:

```text
Task validation
Specialized reasoning
Tool selection within approved boundaries
Business logic
Data retrieval
Output validation
Execution result
```

Think:

```text
Delegator = "Orchestrate the domain"

Worker = "Execute the specialized operation"
```

---

# 13. LangGraph inside Delegator

A Delegator can use LangGraph to manage Worker execution.

Example:

```text
START
  │
  ▼
Receive Task
  │
  ▼
Decompose Task
  │
  ▼
Select Workers
  │
  ▼
Execute Workers
  │
  ├──────────┬──────────┐
  ▼          ▼          ▼
Worker A   Worker B   Worker C
  │          │          │
  └──────────┼──────────┘
             ▼
        Validate Results
             │
             ▼
          Aggregate
             │
             ▼
        Return Result
```

Conceptually:

```python
def execute_workers(state):

    tasks = state["worker_tasks"]

    results = run_workers(tasks)

    state["worker_results"] = results

    return state
```

Then:

```python
def validate_results(state):

    results = state["worker_results"]

    if all_valid(results):
        state["status"] = "completed"
    else:
        state["status"] = "recovery"

    return state
```

---

# 14. Conditional routing

The Delegator needs to make decisions based on Worker results.

For example:

```text
Worker Result
     │
     ▼
Validate
     │
     ├── success ───────► Aggregate
     │
     ├── retryable ─────► Retry Worker
     │
     ├── unavailable ───► Select Another Worker
     │
     ├── approval ──────► Human Review
     │
     └── permanent ────► Recovery
```

This is one of the major reasons to combine **Delegator + LangGraph**.

---

# 15. Failure handling

Suppose:

```text
Carrier Worker
     │
     ▼
Carrier API
     │
     X
   Timeout
```

The Worker should report:

```json
{
  "task_id": "WT-1002",
  "status": "failed",
  "error": {
    "code": "CARRIER_TIMEOUT",
    "type": "transient",
    "retryable": true
  }
}
```

The Delegator can then decide:

```text
Retry?
   │
   ├── Yes → retry Worker
   │
   └── No → select alternate capability/Worker
```

Retry should consider:

```text
Error type
Retry count
Backoff
Worker health
Deadline
Idempotency
Policy
```

Never blindly retry side-effecting operations.

---

# 16. Worker unavailable

Suppose:

```text
Tracking Worker
     │
     ▼
UNAVAILABLE
```

The Delegator can query the registry:

```text
Worker Registry
      │
      ├── tracking-worker-01 → unhealthy
      ├── tracking-worker-02 → healthy
      └── tracking-worker-03 → healthy
```

Then route to another instance:

```text
Delegator
    │
    └──► tracking-worker-02
```

This provides resilience without changing the business workflow.

---

# 17. Timeout and deadline propagation

Suppose the Coordinator gives the Delegator:

```text
Deadline = 30 seconds
```

The Delegator shouldn't give every Worker an unlimited timeout.

It can derive budgets:

```text
Coordinator deadline
       │
       ▼
Delegator budget = 30 sec
       │
       ├── Worker A = 5 sec
       ├── Worker B = 8 sec
       ├── Worker C = 10 sec
       └── Aggregation = 3 sec
```

This prevents one Worker from blocking the entire workflow.

---

# 18. Context propagation

The Delegator should pass only the context needed by the Worker.

For example:

```json
{
  "task_id": "WT-1001",
  "correlation_id": "CORR-7890",

  "context": {
    "shipment_id": "SHIP123"
  },

  "constraints": {
    "deadline_ms": 5000
  }
}
```

Avoid:

```text
Entire user conversation
Entire Coordinator state
Secrets
Unnecessary customer information
Internal prompts
Access credentials
```

This supports:

* data minimization
* security
* performance
* lower token usage
* cleaner Worker contracts

---

# 19. Security boundary

Delegator → Worker should also be treated as a security boundary.

```text
Delegator
    │
    │ authenticated task
    ▼
Worker Endpoint
    │
    ├── Authenticate
    ├── Authorize
    ├── Validate task
    ├── Validate input
    ├── Check policy
    └── Execute
```

The Worker should not assume:

> "The Delegator called me, so everything is automatically allowed."

Defense in depth remains important.

---

# 20. Audit trail

Every Worker execution should be traceable.

Example:

```text
correlation_id = CORR-7890
      │
      ├── Coordinator request
      │
      ├── Delegator task DT-5001
      │
      ├── Worker task WT-1001
      │
      ├── MCP tool call
      │
      ├── Enterprise API call
      │
      └── Worker result
```

Useful telemetry:

```text
task_id
parent_task_id
correlation_id
delegator
worker
capability
start_time
end_time
duration
status
retry_count
tool_calls
error_code
policy_decision
```

This is essential for enterprise debugging and compliance.

---

# 21. Complete end-to-end example

User asks:

> "Why is order ORD123 delayed?"

### Coordinator

```text
Intent:
Investigate shipment delay
```

### Coordinator → Shipping Delegator

```text
A2A Task
```

### Shipping Delegator

Decomposes:

```text
Task
 │
 ├── Get tracking events
 ├── Check carrier events
 └── Check inventory
```

### Worker tasks

```text
                 Shipping Delegator
                        │
           ┌────────────┼────────────┐
           ▼            ▼            ▼
      Tracking       Carrier      Inventory
       Worker         Worker        Worker
           │            │            │
           ▼            ▼            ▼
        MCP/API      MCP/API      MCP/API
```

### Results

```text
Tracking:
Shipment delayed

Carrier:
Capacity constraint

Inventory:
Replacement available
```

### Delegator aggregation

```text
Root Cause:
Carrier capacity constraint

Recommendation:
Reroute shipment
```

### Delegator → Coordinator

```json
{
  "status": "completed",
  "result": {
    "root_cause": "carrier_capacity",
    "shipment_status": "delayed",
    "recommendation": "reroute"
  }
}
```

---

# 22. Complete communication model

The complete CWD interaction becomes:

```text
                         ┌──────────────┐
                         │ Coordinator  │
                         └──────┬───────┘
                                │
                               A2A
                                │
                                ▼
                         ┌──────────────┐
                         │  Delegator   │
                         └──────┬───────┘
                                │
                         Worker Tasks
                                │
                  ┌─────────────┼─────────────┐
                  ▼             ▼             ▼
             ┌─────────┐   ┌─────────┐   ┌─────────┐
             │ Worker  │   │ Worker  │   │ Worker  │
             │    A    │   │    B    │   │    C    │
             └────┬────┘   └────┬────┘   └────┬────┘
                  │             │             │
                  │            MCP            │
                  ▼             ▼             ▼
             Enterprise    Enterprise    Enterprise
              Systems       Systems       Systems
                  │             │             │
                  └─────────────┼─────────────┘
                                ▼
                         Worker Results
                                │
                                ▼
                         ┌──────────────┐
                         │  Delegator   │
                         │  Aggregate   │
                         └──────┬───────┘
                                │
                              A2A
                                │
                                ▼
                         ┌──────────────┐
                         │ Coordinator  │
                         └──────────────┘
```

---

# 23. A2A vs Worker task communication

This distinction is important for your CWD architecture.

| Communication           | Purpose                           |
| ----------------------- | --------------------------------- |
| Coordinator → Delegator | Agent/domain-level delegation     |
| Delegator → Worker      | Specialized execution task        |
| Worker → MCP Server     | Enterprise capability/tool access |
| Worker → Database/API   | Backend execution                 |

In other words:

```text
Coordinator
     │
     │ A2A
     ▼
Delegator
     │
     │ Worker Task Contract
     ▼
Worker
     │
     │ MCP
     ▼
Enterprise Capability
```

The Worker communication contract can use internal APIs, queues, RPC, events, or another governed mechanism. **A2A is most important when the Worker itself is an independently collaborating agent**, rather than merely an internal execution component.

---

# 24. Key architectural principle

The cleanest CWD separation is:

```text
Coordinator
    │
    │ "Which domain needs to act?"
    ▼
Delegator
    │
    │ "Which specialized operations are required?"
    ▼
Worker
    │
    │ "Perform this operation."
    ▼
Enterprise System
```

Therefore:

> **The Delegator owns domain orchestration; the Worker owns specialized execution.**

And:

> **The Delegator should communicate tasks, constraints, context, and expected outputs—not implementation details.**

---

## Interview-ready answer

> **In CWD, the Delegator-to-Worker interaction is the execution boundary within a domain. The Delegator receives a domain-level task from the Coordinator, decomposes it into smaller specialized tasks, selects appropriate Workers based on capability, health, workload, policy, and availability, and sends each Worker a structured task contract. The Worker validates the task, performs its specialized business or technical operation, accesses approved enterprise capabilities through mechanisms such as MCP, validates its output, and returns a structured result. The Delegator then aggregates the Worker results and either completes the domain task, retries, selects another Worker, requests human approval, or enters a recovery path. LangGraph can manage this Worker execution workflow, including state, dependencies, parallel execution, conditional routing, retries, and checkpointing.**

### Core formula

```text
Delegator–Worker Communication
=
Task Decomposition
+ Worker Selection
+ Task Contract
+ Context Propagation
+ Authorization
+ Specialized Execution
+ Result Validation
+ Aggregation
+ Error Handling
+ Retry/Recovery
+ Observability
```

### Mental model

```text
Coordinator → "What needs to be done?"

Delegator   → "How should this domain work be broken down?"

Worker      → "Perform this specific operation."

MCP         → "How does the Worker access the enterprise capability?"

LangGraph   → "How is the execution state and workflow controlled?"
```
