# Delegator – Worker Communication, Context Transfer & Execution Management

## 1. Overview

In CWD, the **Delegator is the communication and execution-control layer between the Coordinator and specialized Workers**.

The Coordinator sends a domain-level objective to the Delegator.

The Delegator then:

1. Understands the domain task
2. Decomposes it into Worker tasks
3. Identifies required capabilities
4. Selects appropriate Workers
5. Builds the Worker execution request
6. Transfers the required context and metadata
7. Invokes the Worker
8. Tracks execution status
9. Collects and validates responses
10. Handles failures and retries
11. Coordinates synchronous or asynchronous execution
12. Aggregates domain results
13. Returns the result to the Coordinator

The overall pattern is:

```text
Coordinator
     │
     │ Domain Task
     ▼
┌─────────────────┐
│    Delegator    │
│                 │
│ Decompose      │
│ Select Worker  │
│ Build Context  │
│ Invoke         │
│ Track          │
│ Recover        │
│ Aggregate      │
└────────┬────────┘
         │
       A2A / Messaging
         │
    ┌────┼────┬────┐
    ▼    ▼    ▼    ▼
 Worker Worker Worker Worker
    │    │    │    │
    ▼    ▼    ▼    ▼
  MCP   API   RAG  DB
```

---

# 2. Delegator–Worker Communication Boundary

The communication boundary depends on whether the Worker is treated as:

* a separate agent/service, or
* an internal execution component of the Delegator.

For CWD, when the Worker is an independent agent/service, the recommended pattern is:

```text
Delegator
    │
    │ A2A
    ▼
Worker Agent
```

For Worker-to-tool communication:

```text
Worker
    │
    │ MCP / API / SDK
    ▼
Enterprise Tool / System
```

Therefore:

```text
A2A = Agent-to-Agent communication

MCP = Agent-to-Tool / System communication
```

The Delegator should not bypass the Worker and directly execute Worker-owned capabilities.

---

# 3. Communication Options

CWD can support both **synchronous** and **asynchronous** Worker execution.

### Synchronous

```text
Delegator
    │
    │ Request
    ▼
Worker
    │
    │ Response
    ▼
Delegator
```

The Delegator waits for the Worker response.

Suitable for:

* Fast queries
* Simple calculations
* Short-running retrieval
* Low-latency operations
* Immediate business responses

---

### Asynchronous

```text
Delegator
    │
    │ Task
    ▼
Service Bus / Kafka
    │
    ▼
Worker
    │
    │ Result
    ▼
Service Bus / Callback
    │
    ▼
Delegator
```

The Delegator does not remain blocked while the Worker executes.

Suitable for:

* Long-running workflows
* Large data processing
* Document generation
* Batch operations
* Multiple parallel Workers
* External systems with unpredictable latency

---

# 4. Worker Task Contract

The Delegator should never send an unstructured message such as:

```text
"Get customer revenue."
```

Instead, it should create a structured Worker task.

Example:

```json
{
  "task_id": "TASK-1001",
  "run_id": "RUN-501",
  "step_id": "STEP-03",
  "correlation_id": "CORR-789",
  "domain": "sales",
  "capability": "revenue_lookup",
  "worker_id": "sales-revenue-worker",
  "objective": "Retrieve revenue for customer CUST-123",
  "input": {
    "customer_id": "CUST-123",
    "period": "FY2026"
  },
  "execution_mode": "synchronous",
  "priority": "normal",
  "timeout_seconds": 30
}
```

This creates a consistent contract between Delegator and Worker.

---

# 5. What Context Does the Delegator Transfer?

The Delegator must transfer enough context for the Worker to understand and execute the task.

But it should **not blindly pass the entire conversation or all available enterprise data**.

Context should follow the principle:

> **Minimum necessary context required to perform the authorized task.**

---

# 6. Business Context

Business context explains **what the task means**.

Example:

```json
{
  "domain": "sales",
  "intent": "customer_briefing",
  "customer_id": "CUST-123",
  "requested_period": "FY2026",
  "business_objective": "Prepare customer revenue summary"
}
```

This allows the Worker to understand the business purpose.

---

# 7. Execution Context

Execution context identifies **where the task belongs in the workflow**.

Typical CWD identifiers include:

```text
session_id
task_id
run_id
turn_id
step_id
correlation_id
```

Example:

```json
{
  "session_id": "SESSION-100",
  "task_id": "TASK-1001",
  "run_id": "RUN-501",
  "turn_id": "TURN-07",
  "step_id": "STEP-03",
  "correlation_id": "CORR-789"
}
```

These identifiers allow the complete execution chain to be traced.

---

# 8. Authorization Context

The Delegator should also propagate the relevant authorization context.

For example:

```json
{
  "identity": {
    "user_id": "USER-123",
    "tenant_id": "TENANT-01",
    "roles": [
      "sales_manager"
    ]
  },
  "authorization": {
    "domain": "sales",
    "capability": "revenue_lookup",
    "data_scope": [
      "CUST-123"
    ]
  }
}
```

The Worker can then enforce execution-level authorization rather than trusting the incoming task blindly.

---

# 9. Tool and Data Scope

The Delegator can specify what the Worker is allowed to use.

Example:

```json
{
  "allowed_tools": [
    "snowflake_revenue_query"
  ],
  "allowed_data_sources": [
    "sales_revenue"
  ],
  "data_scope": {
    "customer_ids": [
      "CUST-123"
    ]
  }
}
```

This prevents a Worker from interpreting:

```text
"Retrieve revenue"
```

as permission to query the entire enterprise data estate.

---

# 10. Execution Metadata

Execution metadata helps the Worker and platform understand how the task should be executed.

Example:

```json
{
  "execution": {
    "mode": "synchronous",
    "priority": "high",
    "timeout_seconds": 30,
    "max_retries": 2,
    "idempotency_key": "TASK-1001-RUN-501",
    "requested_at": "2026-09-06T17:00:00Z"
  }
}
```

This allows the Worker runtime to apply appropriate execution controls.

---

# 11. Complete Worker Request

Conceptually, the Worker request can contain:

```text
WorkerTask
│
├── Identity
│   ├── user_id
│   ├── tenant_id
│   └── roles/claims
│
├── Business Context
│   ├── domain
│   ├── intent
│   ├── objective
│   └── business entities
│
├── Execution Context
│   ├── session_id
│   ├── task_id
│   ├── run_id
│   ├── turn_id
│   ├── step_id
│   └── correlation_id
│
├── Input
│   ├── parameters
│   └── upstream results
│
├── Authorization
│   ├── capability
│   ├── data scope
│   └── policy context
│
├── Tool Scope
│   ├── allowed tools
│   └── allowed data sources
│
└── Execution
    ├── mode
    ├── timeout
    ├── priority
    └── retry policy
```

---

# 12. How the Delegator Invokes a Worker

After selecting a Worker, the Delegator creates the execution request.

Conceptually:

```python
worker_task = WorkerTask(
    task_id=task.task_id,
    run_id=context.run_id,
    step_id=step.step_id,
    correlation_id=context.correlation_id,
    domain="sales",
    capability="revenue_lookup",
    input={
        "customer_id": "CUST-123",
        "period": "FY2026"
    },
    execution_mode="synchronous"
)

result = await worker_client.execute(
    worker_id="sales-revenue-worker",
    task=worker_task
)
```

The important point is that:

```text
Delegator
    ↓
Worker Client / A2A
    ↓
Worker
```

rather than:

```text
Delegator
    ↓
Direct Worker Python function
```

when the Worker is an independent agent.

---

# 13. A2A Invocation

If the Worker is an independent agent, the Delegator can invoke it through the CWD A2A layer.

```text
Delegator
    │
    ▼
A2A Client
    │
    ▼
A2A Gateway
    │
    ├── Authentication
    ├── Authorization
    ├── Correlation
    ├── Idempotency
    ├── Routing
    └── Policy
    │
    ▼
Worker Agent
```

The Worker receives a standardized task contract rather than a custom message from every Delegator.

---

# 14. Agent Registry in Worker Invocation

The Delegator should discover Workers through the Agent Registry.

Example:

```text
Required capability:
    revenue_lookup

       ↓

Agent Registry

       ↓

Worker A
Worker B
Worker C

       ↓

Filter

Domain
Capability
Authorization
Tool Access
Health
Availability
Workload
Version

       ↓

Selected Worker
```

This makes Worker routing dynamic.

---

# 15. Synchronous Execution

For a synchronous operation:

```text
Delegator
    │
    │ 1. Send task
    ▼
Worker
    │
    │ 2. Execute
    ▼
Worker Tools
    │
    ▼
Enterprise System
    │
    ▼
Worker
    │
    │ 3. Return result
    ▼
Delegator
```

Example:

```text
User:
"Get revenue for customer ABC."

Coordinator
    ↓
Sales Delegator
    ↓
Revenue Worker
    ↓
Snowflake
    ↓
Revenue Worker
    ↓
Sales Delegator
    ↓
Coordinator
```

If the operation completes in a few seconds, synchronous execution is appropriate.

---

# 16. Asynchronous Execution

For a long-running task:

```text
Delegator
    │
    │ Submit Task
    ▼
Message Broker
    │
    ▼
Worker
    │
    │ Processing
    ▼
Enterprise Systems
```

The Delegator receives:

```json
{
  "task_id": "TASK-1001",
  "status": "ACCEPTED"
}
```

It does not need to block.

Later:

```text
Worker
   │
   │ Result
   ▼
Message Broker
   │
   ▼
Delegator
```

The Delegator correlates the result using:

```text
task_id
run_id
correlation_id
```

---

# 17. Service Bus / Kafka

CWD can use messaging infrastructure for asynchronous execution.

Conceptually:

```text
Delegator
     │
     ▼
Service Bus / Kafka
     │
     ├───────────────┐
     ▼               ▼
Worker A          Worker B
     │               │
     ▼               ▼
Result A          Result B
     │               │
     └───────┬───────┘
             ▼
       Message Broker
             │
             ▼
         Delegator
```

This supports:

* buffering
* asynchronous processing
* parallel execution
* retry
* dead-letter handling
* workload isolation
* backpressure

---

# 18. Parallel Worker Execution

A domain task may require multiple Workers.

Example:

```text
Customer Briefing
        │
        ▼
Sales Delegator
        │
   ┌────┼────┬────┐
   ▼    ▼    ▼    ▼
Profile Revenue Opportunities Interactions
Worker   Worker     Worker       Worker
   │       │          │            │
   └───────┴──────────┴────────────┘
                   │
                   ▼
            Delegator
```

The Delegator can execute independent tasks in parallel.

For example:

```text
T1 → Customer Profile
T2 → Revenue
T3 → Opportunities
T4 → Interactions
```

These may execute concurrently.

Then:

```text
T1 + T2 + T3 + T4
           ↓
     Generate Briefing
```

---

# 19. Dependency-Aware Execution

Not every Worker task can execute immediately.

Example:

```text
T1: Resolve Customer
       │
       ├──────────────┐
       ▼              ▼
T2: Revenue      T3: Opportunities
       │              │
       └──────┬───────┘
              ▼
        T4: Customer Brief
```

The Delegator maintains the dependency graph.

```text
T1 = COMPLETED
        ↓
T2 = READY
T3 = READY
        ↓
T2 + T3 = COMPLETED
        ↓
T4 = READY
```

This is where LangGraph can manage domain workflow state and transitions.

---

# 20. Tracking Worker Status

Every Worker task should have a lifecycle.

```text
PENDING
   ↓
READY
   ↓
SUBMITTED
   ↓
RUNNING
   ↓
COMPLETED
```

Failure paths:

```text
RUNNING
   ↓
FAILED
   ↓
RETRYING
   ↓
RUNNING
```

Or:

```text
FAILED
   ↓
FALLBACK
   ↓
ALTERNATE WORKER
```

Or:

```text
FAILED
   ↓
ESCALATED
```

---

# 21. Worker Response Contract

Workers should return structured results.

Example:

```json
{
  "task_id": "TASK-1001",
  "run_id": "RUN-501",
  "step_id": "STEP-03",
  "correlation_id": "CORR-789",
  "worker_id": "sales-revenue-worker",
  "status": "COMPLETED",
  "result": {
    "customer_id": "CUST-123",
    "revenue": 12500000,
    "currency": "USD"
  },
  "metadata": {
    "source": "snowflake",
    "execution_time_ms": 842
  }
}
```

The Delegator should never depend on unstructured Worker responses.

---

# 22. Response Tracking

When the response arrives, the Delegator correlates it.

```text
Response
    │
    ├── task_id
    ├── run_id
    ├── step_id
    └── correlation_id
          │
          ▼
Delegator State
```

The Delegator determines:

```text
Which task?
Which run?
Which step?
Which Worker?
Which domain workflow?
Which Coordinator request?
```

This is critical when multiple Workers are running concurrently.

---

# 23. Response Validation

The Delegator validates:

```text
Schema
Status
Required fields
Business rules
Data completeness
Authorization
Data classification
Policy constraints
Provenance
```

Example:

```text
Worker Result
      ↓
Schema valid?       YES
Required fields?    YES
Authorized data?    YES
Business rules?     YES
Policy compliant?   YES
      ↓
ACCEPT
```

Otherwise:

```text
REJECT / REDACT / RETRY / ESCALATE
```

---

# 24. Partial Results

Suppose four Workers are required:

```text
Profile       → SUCCESS
Revenue       → SUCCESS
Opportunity   → SUCCESS
Interactions  → TIMEOUT
```

The Delegator determines whether the failed task is critical.

```text
Interactions = Optional
```

Then:

```text
Customer Briefing
    ↓
Generate with partial data
    ↓
Mark interactions unavailable
```

But if:

```text
Revenue = Critical
```

then the Delegator may stop final aggregation.

This is domain-specific execution policy.

---

# 25. Failure Handling

The Delegator handles failures at the Worker boundary.

Common failures:

```text
Worker unavailable
Worker timeout
A2A failure
Message delivery failure
Tool failure
API failure
Database failure
Rate limit
Invalid response
Authorization failure
Policy violation
```

The Delegator classifies the failure.

```text
Failure
  │
  ├── Transient
  │      ↓
  │    Retry
  │
  ├── Timeout
  │      ↓
  │    Retry / Fallback
  │
  ├── Worker unavailable
  │      ↓
  │    Alternate Worker
  │
  ├── Authorization
  │      ↓
  │    Stop
  │
  └── Policy violation
         ↓
       Stop / Escalate
```

---

# 26. Retry

Retries should be controlled.

Example:

```text
Attempt 1
   ↓
Timeout
   ↓
Wait
   ↓
Attempt 2
   ↓
Timeout
   ↓
Attempt 3
   ↓
Success
```

Use:

```text
Maximum retry count
Exponential backoff
Timeout policy
Idempotency key
Failure classification
```

The Delegator should never endlessly retry.

---

# 27. Idempotency

For operations that modify enterprise systems, retries can be dangerous.

Example:

```text
Create CRM Opportunity
```

If the Worker times out after creating the opportunity, retrying may create a duplicate.

Therefore:

```text
task_id
+
run_id
+
idempotency_key
```

should be used to identify the operation.

The Worker or downstream system can determine:

```text
Already processed?
    ↓
YES → return existing result
NO  → execute
```

---

# 28. Worker Timeout

The Delegator should maintain task-specific timeout policies.

Example:

```text
Customer Lookup
    timeout = 10 sec

Revenue Query
    timeout = 30 sec

Document Generation
    timeout = 5 min
```

A timeout should result in a controlled state transition:

```text
RUNNING
   ↓
TIMEOUT
   ↓
Retry / Fallback / Partial / Escalate
```

---

# 29. Worker Health Monitoring

The Delegator can use Agent Registry/runtime health information before selecting a Worker.

Example:

```text
Worker A
Health = Healthy
Load = 20%
Queue = Low

Worker B
Health = Degraded
Load = 90%
Queue = High

Worker C
Health = Healthy
Load = 40%
Queue = Medium
```

The Delegator should prefer an eligible healthy Worker rather than blindly selecting Worker A every time.

---

# 30. Worker Availability vs Health

These should be treated separately.

### Health

Can the Worker technically operate?

```text
Healthy
Degraded
Unhealthy
```

### Availability

Can the Worker accept another task?

```text
Available
Busy
At Capacity
Unavailable
```

Therefore:

```text
Healthy + Available
        ↓
Best candidate
```

while:

```text
Healthy + At Capacity
        ↓
Delay / Queue / Alternate Worker
```

---

# 31. Concurrency Control

The Delegator must avoid overwhelming a Worker.

Example:

```text
Worker capacity = 10 concurrent tasks

Current:
    10 running
```

New task arrives:

```text
New Task
   ↓
Worker at capacity
   ↓
Queue
or
Alternate Worker
```

This prevents cascading failures.

---

# 32. Backpressure

If incoming workload exceeds Worker capacity:

```text
Requests
████████████████████
          ↓
      Delegator
          ↓
     Queue/Buffer
          ↓
       Workers
```

The Delegator can apply:

```text
Priority
Concurrency limits
Queueing
Rate limits
Load shedding
Alternate Worker selection
```

This is particularly important for asynchronous workloads.

---

# 33. Synchronous vs Asynchronous Decision

The Delegator can determine execution mode based on task characteristics.

| Condition                             | Execution                   |
| ------------------------------------- | --------------------------- |
| Fast operation                        | Synchronous                 |
| Short API call                        | Synchronous                 |
| Simple retrieval                      | Synchronous                 |
| Long-running task                     | Asynchronous                |
| Large document generation             | Asynchronous                |
| Batch processing                      | Asynchronous                |
| Multiple independent Workers          | Often asynchronous/parallel |
| External dependency with long latency | Asynchronous                |
| Human approval required               | Asynchronous                |

Conceptually:

```python
if task.estimated_duration <= SYNC_THRESHOLD:
    mode = "synchronous"
else:
    mode = "asynchronous"
```

In production, this should be policy-driven rather than hard-coded.

---

# 34. Long-Running Task

For a long-running Worker:

```text
Delegator
    │
    ├── Submit
    │
    ▼
Worker
    │
    │ status = ACCEPTED
    ▼
Delegator
```

The Delegator can continue other work.

Later:

```text
Worker
    │
    │ status = COMPLETED
    ▼
Message/Event
    │
    ▼
Delegator
```

The Delegator resumes the domain workflow.

---

# 35. State Management

The Delegator should persist workflow state.

Example:

```text
Domain Task
     │
     ▼
Delegator State
     │
     ├── task status
     ├── Worker status
     ├── dependencies
     ├── outputs
     ├── retry count
     ├── errors
     └── execution metadata
```

Redis can support short-term execution state/cache, while durable state mechanisms can be used for longer-running workflows where required.

---

# 36. LangGraph Role

LangGraph can manage the Delegator's domain workflow state.

For example:

```text
START
  ↓
Validate Task
  ↓
Identify Capabilities
  ↓
Select Workers
  ↓
Create Worker Tasks
  ↓
Execute Parallel Tasks
  ↓
Track Results
  ↓
Retry Failed Tasks
  ↓
Aggregate
  ↓
Validate
  ↓
END
```

The important separation is:

```text
Delegator
    = Domain orchestration decisions

LangGraph
    = Workflow state + transitions

A2A
    = Agent communication

Agent Registry
    = Worker discovery

MCP
    = Tool/system access

Policy Service
    = Governance decisions
```

---

# 37. Complete Delegator–Worker Flow

A production execution can look like this:

```text
Coordinator
     │
     │ A2A
     ▼
Delegator
     │
     ├── Validate domain task
     ├── Validate authorization
     ├── Apply domain policies
     ├── Decompose task
     ├── Determine dependencies
     ├── Identify capabilities
     │
     ▼
Agent Registry
     │
     ├── Find Workers
     ├── Check capability
     ├── Check health
     ├── Check availability
     ├── Check permissions
     └── Check workload
     │
     ▼
Worker Selection
     │
     ▼
Build Worker Task
     │
     ├── Business context
     ├── Execution context
     ├── Authorization context
     ├── Data scope
     ├── Tool scope
     └── Execution metadata
     │
     ▼
A2A / Messaging
     │
     ▼
Worker
     │
     ├── LLM reasoning
     ├── MCP/tool invocation
     ├── RAG retrieval
     └── Enterprise API
     │
     ▼
Worker Result
     │
     ▼
Delegator
     │
     ├── Correlate
     ├── Validate
     ├── Handle failure
     ├── Retry/fallback
     ├── Update state
     └── Aggregate
     │
     ▼
Coordinator
```

---

# 38. Example: Customer Briefing

Suppose the Coordinator sends:

```text
"Prepare a customer briefing for Customer ABC."
```

The Sales Delegator receives the domain task.

It decomposes:

```text
T1 → Customer Profile
T2 → Revenue
T3 → Opportunities
T4 → Recent Interactions
T5 → Generate Briefing
```

Dependencies:

```text
T1 ─────┐
T2 ─────┤
T3 ─────┼──→ T5
T4 ─────┘
```

The Delegator selects Workers:

```text
T1 → Customer Profile Worker
T2 → Revenue Worker
T3 → Opportunity Worker
T4 → Interaction Worker
T5 → Briefing Worker
```

Then:

```text
T1 ──┐
T2 ──┤
T3 ──┼── Parallel
T4 ──┘
       │
       ▼
     Results
       │
       ▼
       T5
       │
       ▼
 Customer Briefing
```

The Delegator validates the results and sends the domain-level result back to the Coordinator.

---

# 39. Responsibility Boundary

| Activity                | Coordinator           | Delegator        | Worker    |
| ----------------------- | --------------------- | ---------------- | --------- |
| Enterprise intent       | Yes                   | No               | No        |
| Domain selection        | Yes                   | Validate         | No        |
| Domain decomposition    | No                    | Yes              | No        |
| Worker selection        | No                    | Yes              | No        |
| Task creation           | High-level            | Yes              | No        |
| Context propagation     | Enterprise            | Domain           | Execution |
| A2A communication       | Coordinator→Delegator | Delegator→Worker | Respond   |
| Tool invocation         | No                    | Controls         | Yes       |
| Enterprise data access  | No                    | Governs          | Executes  |
| Worker execution        | No                    | Controls         | Yes       |
| Status tracking         | Overall               | Domain           | Local     |
| Retry                   | Enterprise            | Domain           | Local     |
| Worker failure recovery | No                    | Yes              | Limited   |
| Result validation       | Final                 | Domain           | Local     |
| Domain aggregation      | No                    | Yes              | No        |
| Final response          | Yes                   | No               | No        |

---

# 40. Final Architecture Principle

The Delegator should be viewed as the **domain execution controller**.

It does not simply forward messages.

It manages the complete lifecycle:

```text
Receive
  ↓
Validate
  ↓
Decompose
  ↓
Select
  ↓
Contextualize
  ↓
Invoke
  ↓
Track
  ↓
Recover
  ↓
Validate
  ↓
Aggregate
  ↓
Return
```

The architectural relationship is:

```text
                 Coordinator
                      │
                Enterprise Task
                      │
                     A2A
                      │
                      ▼
                 Delegator
                      │
       ┌──────────────┼──────────────┐
       │              │              │
       ▼              ▼              ▼
   Worker A        Worker B       Worker C
       │              │              │
       ▼              ▼              ▼
      MCP            API            RAG
       │              │              │
       └──────────────┼──────────────┘
                      ▼
             Enterprise Systems
```

### One-line definition

> **Delegator = Decompose + Contextualize + Invoke + Track + Recover + Aggregate Worker execution.**

### Most important CWD principle

> **The Coordinator controls the enterprise workflow, the Delegator controls domain-level execution, and the Worker performs the authorized capability.**

This separation allows CWD to support **synchronous execution for low-latency tasks, asynchronous execution for long-running tasks, parallel Worker execution for independent tasks, and dependency-aware recovery for complex domain workflows** while maintaining consistent context, correlation, authorization, observability, and governance across the entire execution chain.
