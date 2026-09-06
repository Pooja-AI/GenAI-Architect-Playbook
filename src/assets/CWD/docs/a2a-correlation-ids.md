# Correlation IDs for Distributed Agent Execution Tracking

In the **CWD (Coordinator–Delegator–Worker)** architecture, a **correlation ID** is the identifier that connects all agent messages, tasks, tool calls, workflow steps, and results that belong to the **same end-to-end business request**.

> **Correlation ID answers: “Which overall request does this execution belong to?”**

---

## 1. Why Correlation IDs Are Needed

A single user request can trigger a large distributed execution:

```text
User
  │
  ▼
Coordinator
  │
  ├── Shipping Delegator
  │      ├── Tracking Worker
  │      └── Carrier Worker
  │
  ├── Customer Delegator
  │      └── Customer Worker
  │
  └── Finance Delegator
         └── Refund Worker
```

Without a correlation ID, logs might look like:

```text
tracking-worker → completed
carrier-worker → failed
customer-worker → completed
refund-worker → completed
```

The platform cannot easily determine which user request these events belong to.

With:

```text
CORR-7890
```

every related execution can be connected:

```text
CORR-7890
│
├── Coordinator
├── Shipping Delegator
├── Tracking Worker
├── Carrier Worker
├── Customer Delegator
├── Customer Worker
└── Finance Delegator
```

This creates an **end-to-end execution trace**.

---

# 2. Correlation ID vs Task ID

These are not the same.

| Identifier        | Purpose                                           |
| ----------------- | ------------------------------------------------- |
| `correlation_id`  | Identifies the overall business/request execution |
| `workflow_id`     | Identifies a workflow execution                   |
| `task_id`         | Identifies one specific task                      |
| `parent_task_id`  | Identifies the task that created the current task |
| `message_id`      | Identifies one communication message              |
| `idempotency_key` | Prevents duplicate side-effecting operations      |

Think of the hierarchy as:

```text
Correlation ID
      │
      ▼
Workflow
      │
      ├── Task A
      │     ├── Task A1
      │     └── Task A2
      │
      └── Task B
            ├── Task B1
            └── Task B2
```

For example:

```text
CORR-7890
    │
    └── WF-1001
          │
          ├── TASK-5001
          │     ├── TASK-5101
          │     └── TASK-5102
          │
          └── TASK-5201
```

---

# 3. Correlation ID Propagation

The most important rule is:

> **The correlation ID should be propagated across the entire execution path.**

Example:

```text
User Request
     │
     │ CORR-7890
     ▼
Coordinator
     │
     │ CORR-7890
     ▼
Shipping Delegator
     │
     │ CORR-7890
     ▼
Tracking Worker
     │
     │ CORR-7890
     ▼
MCP Server
     │
     │ CORR-7890
     ▼
Enterprise API
```

The exact propagation mechanism depends on the communication boundary, but the execution context should remain traceable end to end.

---

# 4. Coordinator Creates the Correlation ID

At the beginning of a new business request:

```text
User
 │
 ▼
Gateway
 │
 ▼
Coordinator
 │
 └── Generate CORR-7890
```

Conceptually:

```python
correlation_id = generate_correlation_id()
```

The Coordinator then places it into the execution context.

```json
{
  "correlation_id": "CORR-7890"
}
```

Every downstream component receives or derives its execution context from this correlation.

---

# 5. Coordinator → Delegator

The Coordinator sends:

```json
{
  "message_id": "MSG-9001",
  "correlation_id": "CORR-7890",
  "workflow_id": "WF-1001",
  "task": {
    "task_id": "TASK-5001"
  },
  "source_agent": "coordinator",
  "target_agent": "shipping-delegator"
}
```

The Delegator does **not** create a new correlation ID for the same business request.

It continues using:

```text
CORR-7890
```

It may create a new task ID:

```text
TASK-5100
```

but:

```text
correlation_id = CORR-7890
```

---

# 6. Delegator → Worker

The Delegator decomposes its domain task.

```text
TASK-5001
    │
    ├── TASK-5101 → Tracking Worker
    ├── TASK-5102 → Carrier Worker
    └── TASK-5103 → Logistics Worker
```

All of these can share:

```text
correlation_id = CORR-7890
```

while having different task IDs.

For example:

```json
{
  "task_id": "TASK-5101",
  "parent_task_id": "TASK-5001",
  "correlation_id": "CORR-7890"
}
```

This gives us two dimensions of tracking:

```text
correlation_id
    ↓
overall request

parent_task_id
    ↓
task hierarchy
```

---

# 7. Worker Result Propagation

Suppose Tracking Worker completes:

```json
{
  "message_id": "MSG-9201",
  "correlation_id": "CORR-7890",

  "task": {
    "task_id": "TASK-5101",
    "parent_task_id": "TASK-5001"
  },

  "status": "completed",

  "result": {
    "shipment_status": "delayed"
  }
}
```

The Delegator can immediately determine:

```text
Which request?
→ CORR-7890

Which Worker task?
→ TASK-5101

Which parent domain task?
→ TASK-5001
```

---

# 8. Correlation IDs and LangGraph

Correlation information becomes part of the LangGraph execution state.

Conceptually:

```python
state = {
    "correlation_id": "CORR-7890",
    "workflow_id": "WF-1001",

    "tasks": [],
    "results": [],
    "errors": [],

    "status": "working"
}
```

As the graph executes:

```text
Message
   ↓
State
   ↓
LangGraph Node
   ↓
State Update
   ↓
Next Node
```

The correlation ID remains available throughout the workflow.

This allows each node to produce traceable events.

---

# 9. Correlation IDs and Parallel Execution

This is where correlation IDs become especially valuable.

Suppose the Coordinator launches three Delegators:

```text
                    CORR-7890
                        │
              ┌─────────┼─────────┐
              ▼         ▼         ▼
          Shipping   Customer   Finance
          Delegator  Delegator  Delegator
              │         │         │
             ...       ...       ...
```

Each branch can execute independently.

But all events still contain:

```text
CORR-7890
```

Therefore the Coordinator can aggregate them back into the original request.

```text
Shipping Result ──┐
Customer Result ──┼──► Coordinator
Finance Result  ──┘
```

---

# 10. Correlation IDs and Distributed Logging

Every important component should include the correlation ID in structured logs.

Example:

```json
{
  "timestamp": "2026-09-06T15:10:03Z",
  "level": "INFO",
  "service": "tracking-worker",
  "agent": "tracking-worker",
  "correlation_id": "CORR-7890",
  "workflow_id": "WF-1001",
  "task_id": "TASK-5101",
  "event": "task_completed"
}
```

Now an observability platform can query:

```text
correlation_id = CORR-7890
```

and retrieve the entire execution.

---

# 11. Distributed Execution Trace

The resulting trace might look like:

```text
CORR-7890
│
├── Gateway
│     └── request_received
│
├── Coordinator
│     ├── intent_detected
│     ├── authorization_completed
│     └── planning_completed
│
├── Shipping Delegator
│     ├── task_received
│     ├── workers_selected
│     └── tasks_dispatched
│
├── Tracking Worker
│     ├── task_received
│     ├── MCP_tool_called
│     └── task_completed
│
├── Carrier Worker
│     ├── task_received
│     └── task_completed
│
├── Shipping Delegator
│     └── domain_result_created
│
└── Coordinator
      ├── results_aggregated
      └── response_generated
```

This is effectively the **execution story of one request**.

---

# 12. Correlation IDs and Retry

Suppose:

```text
TASK-5101
```

fails because of a transient Worker timeout.

The Delegator retries it.

```text
CORR-7890
    │
    ├── TASK-5101
    │     └── attempt 1 → timeout
    │
    └── TASK-5101
          └── attempt 2 → success
```

The correlation ID remains:

```text
CORR-7890
```

The task can retain the same task identity or use a retry-attempt identifier according to the platform contract.

The important point is that the retry remains associated with the same overall execution.

---

# 13. Correlation IDs and Failure Recovery

Imagine:

```text
Tracking Worker
     ↓
timeout
```

The Delegator can log:

```json
{
  "correlation_id": "CORR-7890",
  "task_id": "TASK-5101",
  "status": "failed",
  "error_type": "timeout",
  "retryable": true
}
```

LangGraph can then route:

```text
Failure
   │
   ├── retryable → Retry
   │
   ├── non-retryable → Recovery
   │
   └── approval-required → Human Review
```

All of those transitions remain associated with:

```text
CORR-7890
```

---

# 14. Correlation IDs and Checkpointing

Suppose the workflow is checkpointed:

```text
CORR-7890
     │
     ▼
Checkpoint
     │
     ├── completed tasks
     ├── pending tasks
     ├── results
     ├── retry count
     └── current node
```

If the runtime fails:

```text
Runtime Failure
      ↓
Restore Checkpoint
      ↓
Resume CORR-7890
```

The correlation ID helps connect the resumed execution with the original business request.

---

# 15. Correlation ID vs Distributed Trace ID

In a mature production architecture, it is useful to distinguish **business correlation** from **technical distributed tracing**.

For example:

```text
correlation_id = CORR-7890
trace_id       = TRACE-ABC123
span_id        = SPAN-001
```

Conceptually:

| Identifier     | Meaning                                |
| -------------- | -------------------------------------- |
| Correlation ID | Business/request-level correlation     |
| Trace ID       | Technical end-to-end distributed trace |
| Span ID        | Individual operation within the trace  |
| Task ID        | Agent task                             |
| Message ID     | Individual message                     |

They can be related but should not automatically be treated as interchangeable.

---

# 16. Example End-to-End Metadata

A production-oriented message might contain:

```json
{
  "message_id": "MSG-9001",

  "correlation_id": "CORR-7890",
  "workflow_id": "WF-1001",

  "task_id": "TASK-5101",
  "parent_task_id": "TASK-5001",

  "trace_id": "TRACE-ABC123",

  "source_agent": "shipping-delegator",
  "target_agent": "tracking-worker",

  "message_type": "TASK_REQUEST",

  "timestamp": "2026-09-06T15:10:00Z",

  "control": {
    "priority": "high",
    "timeout_ms": 5000,
    "max_retries": 2,
    "idempotency_key": "IDEMP-5101"
  },

  "payload": {
    "capability": "shipment_tracking",
    "action": "get_tracking_events",
    "input": {
      "shipment_id": "SHIP123"
    }
  }
}
```

This gives the Worker enough context to execute the task while allowing the platform to trace it.

---

# 17. Correlation Across CWD Boundaries

The complete model is:

```text
                         CORR-7890
                            │
                            ▼
                      Coordinator
                            │
                       A2A Message
                            │
                            ▼
                       Delegator
                            │
                       Task Message
                            │
                            ▼
                        Worker
                            │
                       MCP Request
                            │
                            ▼
                    Enterprise System
                            │
                            ▼
                         Result
                            │
                            ▼
                        Worker
                            │
                            ▼
                       Delegator
                            │
                            ▼
                      Coordinator
```

At every boundary, the execution context remains correlated.

---

# 18. Why Correlation IDs Are Critical in Production

Without correlation IDs:

```text
Distributed Agents
       ↓
Thousands of events
       ↓
Difficult to identify request
       ↓
Difficult debugging
       ↓
Difficult incident investigation
```

With correlation IDs:

```text
Business Request
       ↓
CORR-7890
       ↓
All related events
       ↓
Complete execution trace
       ↓
Debug / Audit / Recovery / SLA analysis
```

They are therefore important for:

* distributed tracing
* debugging
* incident investigation
* auditability
* SLA measurement
* latency analysis
* retry tracking
* failure recovery
* workflow reconstruction
* cross-agent observability

---

# 19. Common Anti-Patterns

### ❌ Generate a new correlation ID at every agent

```text
Coordinator → CORR-1
Delegator   → CORR-2
Worker      → CORR-3
```

This breaks end-to-end correlation.

### ❌ Use only task IDs

Task IDs identify individual tasks but do not necessarily identify the complete business request.

### ❌ Put correlation only in logs

The communication context should carry the correlation information so downstream components can propagate it.

### ❌ Lose correlation during asynchronous processing

Queue/message-bus consumers must preserve the relevant correlation context.

### ❌ Trust arbitrary client-supplied correlation IDs

The platform should validate or generate correlation identifiers according to its security and tracing model.

### ❌ Put sensitive business data inside the correlation ID

A correlation ID should be opaque:

```text
CORR-7890
```

not:

```text
CORR-user-john-finance-account-12345
```

---

# 20. CWD Responsibility Model

| Component        | Correlation responsibility                          |
| ---------------- | --------------------------------------------------- |
| Gateway          | Establish/validate initial request context          |
| Coordinator      | Create or adopt the request correlation context     |
| Delegator        | Propagate correlation context                       |
| Worker           | Preserve correlation context in execution/results   |
| A2A              | Carry agent communication context                   |
| MCP layer        | Propagate appropriate execution/tracing context     |
| LangGraph        | Maintain correlation in workflow state              |
| Message Bus      | Preserve message correlation metadata               |
| Observability    | Index/search by correlation ID                      |
| Checkpoint Store | Associate execution state with workflow/correlation |
| Audit Platform   | Record correlation for audit reconstruction         |

---

# 21. The Complete CWD Execution Model

The most useful mental model is:

```text
                   CORRELATION ID
                         │
                         ▼
                  ┌─────────────┐
                  │ Coordinator │
                  └──────┬──────┘
                         │
                  ┌──────▼──────┐
                  │  Delegator  │
                  └──────┬──────┘
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
           Worker     Worker     Worker
              │          │          │
              └──────────┼──────────┘
                         │
                      Results
                         │
                         ▼
                    Delegator
                         │
                         ▼
                    Coordinator
                         │
                         ▼
                    Final Result

       All associated execution remains traceable
                  through CORR-7890
```

## Interview-Ready Answer

> **A correlation ID is an opaque identifier used to associate all messages, tasks, workflow steps, Worker executions, retries, tool interactions, results, and observability events that belong to the same end-to-end business request. In CWD, the Coordinator establishes the correlation context and it is propagated through Delegators and Workers rather than generating a new correlation ID at every layer. Task IDs identify individual units of work, while parent task IDs establish the task hierarchy. LangGraph maintains the correlation context as part of workflow state, and the observability platform uses it to reconstruct the complete distributed execution. This allows production CWD to trace parallel agent execution, diagnose failures, correlate retries, support recovery, and perform auditing.**

### Core Formula

```text
Distributed Agent Tracking
=
Correlation ID
+
Workflow ID
+
Task ID
+
Parent Task ID
+
Message ID
+
Trace Context
+
Structured Logging
```

### One-line definition

> **A correlation ID is the end-to-end identifier that ties distributed Coordinator, Delegator, Worker, and supporting-system activities back to one business request, enabling CWD to trace, debug, audit, and recover agent execution across the entire production workflow.**
