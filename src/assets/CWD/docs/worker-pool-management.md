# How Workers Are Organized, Monitored, Scaled, and Managed Within a Domain

In the CWD architecture, **Workers are the task-execution layer**.

A Delegator manages a collection of specialized Workers within its business domain. Each Worker is responsible for a well-defined capability, while the Delegator controls **which Worker receives a task, how much work it receives, whether it is healthy and available, and how execution capacity is managed**.

The overall model is:

```text id="3hx6o8"
                    Domain Delegator
                          |
                    Worker Registry
                          |
        +-----------------+------------------+
        |                 |                  |
        v                 v                  v
   Worker Pool A     Worker Pool B     Worker Pool C
   Customer Data     Revenue           Opportunity
        |                 |                  |
        v                 v                  v
   Enterprise        Enterprise        Enterprise
   Systems           Systems           Systems
```

The Delegator therefore acts as the **domain-level control plane for Worker execution**.

---

# 1. Workers Are Organized by Domain and Capability

Workers are not organized as one large global pool.

They are logically grouped around business domains and capabilities.

For example:

```text id="4h3b7k"
Sales Domain
    |
    +-- Customer Profile Workers
    +-- Opportunity Workers
    +-- Revenue Workers
    +-- Pricing Workers
    +-- Quote Workers
    +-- Interaction Workers
```

Another domain:

```text id="8y1v7n"
Finance Domain
    |
    +-- Invoice Workers
    +-- Payment Workers
    +-- Revenue Workers
    +-- Financial Reporting Workers
```

This provides **domain isolation** while allowing each domain to evolve independently.

---

# 2. Worker Pools

For a frequently used capability, there may be multiple instances of the same Worker.

For example:

```text id="sq8m1f"
Opportunity Capability
        |
        v
+-----------------------------+
| Opportunity Worker Pool     |
+-----------------------------+
       |       |       |
       v       v       v
    Worker  Worker  Worker
      A       B       C
```

All three Workers may provide the same capability but execute as separate runtime instances.

This enables:

* Load distribution
* Horizontal scaling
* Failure isolation
* Higher concurrency
* Better availability

The Delegator can treat them as a **logical Worker capability pool** rather than requiring business logic to know individual instances.

---

# 3. Agent Registry as the Worker Inventory

The **Agent Registry** provides the Delegator with Worker metadata.

Conceptually:

```text id="4l0hwl"
Agent Registry
      |
      +-- Worker ID
      +-- Domain
      +-- Capabilities
      +-- Endpoint
      +-- Version
      +-- Health
      +-- Availability
      +-- Status
      +-- Supported Tools
      +-- Routing Metadata
```

The Delegator uses this information when deciding where to send work.

For example:

```json id="yzdyja"
{
  "agent_id": "sales-opportunity-worker-01",
  "domain": "sales",
  "capabilities": [
    "opportunity_retrieval"
  ],
  "status": "healthy",
  "available": true,
  "version": "2.1"
}
```

Another instance:

```json id="0qj9vi"
{
  "agent_id": "sales-opportunity-worker-02",
  "domain": "sales",
  "capabilities": [
    "opportunity_retrieval"
  ],
  "status": "healthy",
  "available": true,
  "version": "2.1"
}
```

The Delegator can route requests to either eligible instance.

---

# 4. Worker Availability

Worker availability answers:

> **"Can this Worker accept new work right now?"**

A Worker can technically support a capability but still be unavailable.

For example:

```text id="p9pzzr"
Worker A → Available
Worker B → Available
Worker C → Maintenance
Worker D → Disabled
```

The Delegator should exclude unavailable Workers from routing.

```text id="sckhce"
Available Workers
       |
       v
Routing Candidate Pool
```

Availability can change dynamically because of:

* Deployment
* Maintenance
* Capacity limits
* Service shutdown
* Configuration
* Runtime failures

---

# 5. Worker Health

Health answers:

> **"Is this Worker functioning correctly?"**

The platform can monitor Worker health through runtime health information and observability signals.

Example:

```text id="nplnfu"
Worker A → Healthy
Worker B → Healthy
Worker C → Degraded
Worker D → Unhealthy
```

The Delegator can then apply routing rules such as:

```text id="5z6d8r"
Healthy
   ↓
Preferred

Degraded
   ↓
Limited / Lower Priority

Unhealthy
   ↓
Do Not Route
```

This prevents new work from being sent to known unhealthy Workers.

---

# 6. Health Is Different From Availability

These concepts should not be confused.

| Condition                 | Meaning                                                |
| ------------------------- | ------------------------------------------------------ |
| **Healthy + Available**   | Worker can normally receive work                       |
| **Healthy + Unavailable** | Worker is functioning but not accepting work           |
| **Degraded + Available**  | Worker can accept work but may have reduced capacity   |
| **Unhealthy**             | Worker should generally be removed from normal routing |

For example:

```text id="7e9x3d"
Worker
   |
   +-- Health = Healthy
   |
   +-- Availability = Available
   |
   +-- Capacity = 80%
   |
   +-- Active Tasks = 4
```

The Delegator combines these signals when making routing decisions.

---

# 7. Load Distribution

When multiple Workers provide the same capability, the Delegator should distribute work across them.

Example:

```text id="8l8jwx"
                    Opportunity Tasks
                           |
                           v
                  Sales Delegator
                           |
              +------------+------------+
              |            |            |
              v            v            v
          Worker A      Worker B      Worker C
             10%           20%           15%
```

The goal is to avoid:

```text id="8q1rfi"
Worker A → 100 tasks
Worker B → 2 tasks
Worker C → 1 task
```

when all three Workers are capable of handling the workload.

Load distribution improves:

* Throughput
* Response time
* Worker utilization
* Availability
* Capacity utilization

---

# 8. Workload-Aware Routing

The Delegator can consider current Worker workload when selecting among eligible Workers.

For example:

```text id="5o3c9k"
Worker A
Active Tasks = 3
Capacity     = 10

Worker B
Active Tasks = 9
Capacity     = 10

Worker C
Active Tasks = 5
Capacity     = 10
```

A new task may preferably be sent to Worker A.

Conceptually:

```text id="v2n5lz"
Eligible Workers
       |
       v
Check Current Load
       |
       v
Check Remaining Capacity
       |
       v
Select Suitable Worker
```

This is particularly useful for high-volume domains.

---

# 9. Concurrency Management

Concurrency determines:

> **"How many tasks can a Worker execute simultaneously?"**

For example:

```text id="p5yqdr"
Worker A
Maximum Concurrency = 10

Current:
    Task 1
    Task 2
    Task 3
    Task 4

Available Capacity = 6
```

If the Worker reaches its configured concurrency limit:

```text id="d83u7w"
Worker A
Concurrency = 10 / 10
        |
        v
No additional execution
```

The Delegator should route new work to another eligible Worker or queue the task.

---

# 10. Why Concurrency Limits Matter

Without concurrency control:

```text id="b8y9tc"
100 incoming tasks
       |
       v
Single Worker
       |
       v
Resource Exhaustion
       |
       +-- High latency
       +-- Timeouts
       +-- Memory pressure
       +-- API throttling
       +-- Failures
```

With controlled concurrency:

```text id="dbdy8a"
100 incoming tasks
       |
       v
Delegator
       |
       +-- Worker A → 10
       +-- Worker B → 10
       +-- Worker C → 10
       +-- Queue    → Remaining
```

This provides controlled execution.

---

# 11. Capacity Management

Worker capacity represents how much work a Worker or Worker pool can safely handle.

Capacity may depend on:

* Maximum concurrent tasks
* CPU
* Memory
* External API limits
* Database connection limits
* LLM throughput
* Token limits
* Queue depth
* Business-defined limits

Conceptually:

```text id="5p9thc"
Worker Capacity
      |
      +-- Compute Capacity
      +-- Concurrency Capacity
      +-- API Capacity
      +-- Data Capacity
      +-- LLM Capacity
```

The Delegator should consider these constraints when routing work.

---

# 12. Worker Pool Scaling

When demand increases, the Worker pool can scale horizontally.

For example:

```text id="3k3fqc"
Normal Load

Sales Opportunity Worker
        |
        +-- Instance A
        +-- Instance B
```

During high demand:

```text id="l0d1a4"
High Load

Sales Opportunity Worker Pool
        |
        +-- Instance A
        +-- Instance B
        +-- Instance C
        +-- Instance D
        +-- Instance E
```

When demand falls:

```text id="2dglqk"
Low Load

Worker Pool
        |
        +-- Instance A
        +-- Instance B
```

This is **horizontal scaling**.

---

# 13. Delegator vs Runtime Platform Scaling

There are two different responsibilities.

### Delegator

Determines:

```text id="o8w86k"
"Where should this task go?"
```

### Runtime Platform

Determines:

```text id="e1pnkr"
"How many Worker instances should exist?"
```

For example:

```text id="l1o6qz"
                    Delegator
                       |
                 Worker Pool
                       |
        +--------------+--------------+
        |              |              |
        v              v              v
     Worker A       Worker B       Worker C
        ^              ^              ^
        |              |              |
        +--------------+--------------+
                       |
                  ACA / AKS
                Scaling Mechanism
```

The Delegator should not manually create containers.

The infrastructure platform manages runtime scaling based on configured scaling policies.

---

# 14. Queue-Based Load Distribution

For asynchronous or high-volume workloads, messaging can help smooth demand.

Conceptually:

```text id="fxz7jc"
Delegator
    |
    v
Service Bus / Kafka
    |
    v
Worker Queue
    |
    +---- Worker A
    +---- Worker B
    +---- Worker C
```

The queue acts as a buffer between incoming demand and Worker capacity.

This helps when:

```text id="g2bl0y"
Incoming Rate > Processing Rate
```

Instead of immediately overwhelming Workers:

```text id="h3h4f8"
Incoming Tasks
      |
      v
    Queue
      |
      v
Workers consume according to capacity
```

---

# 15. Backpressure

Backpressure prevents the system from accepting more work than it can safely process.

For example:

```text id="qz9z1n"
Incoming Load
      |
      v
Worker Pool
      |
      v
Capacity Reached
      |
      +-- Queue
      +-- Throttle
      +-- Reject
      +-- Lower Priority
```

The exact response depends on the task and policy.

This protects the domain from cascading failures.

---

# 16. Priority-Based Workload Management

Not all tasks necessarily have the same business priority.

For example:

```text id="q6p2t4"
Priority 1
Customer-facing request

Priority 2
Business analysis

Priority 3
Background enrichment
```

The Delegator can route according to priority policies.

```text id="gq5f9h"
Worker Capacity
      |
      +-- High Priority → Execute first
      |
      +-- Normal Priority → Queue
      |
      +-- Low Priority → Execute when capacity exists
```

This becomes particularly useful when Worker capacity is limited.

---

# 17. Worker Health + Workload + Capacity

Worker routing should combine multiple runtime signals.

For example:

```text id="v7fnzt"
                    Candidate Workers
                           |
          +----------------+----------------+
          |                |                |
          v                v                v
       Worker A         Worker B         Worker C
       Healthy          Healthy          Degraded
       Available        Available        Available
       Load: 20%        Load: 70%        Load: 30%
       Capacity: High   Capacity: Medium  Capacity: Low
          |                |                |
          +----------------+----------------+
                           |
                           v
                    Routing Decision
                           |
                           v
                       Worker A
```

Worker A is preferred because it is healthy, available, and has more available capacity.

---

# 18. Worker Registration and Lifecycle

Workers should follow a managed lifecycle.

Conceptually:

```text id="x0fvzo"
Develop
   |
   v
Register
   |
   v
Validate
   |
   v
Deploy
   |
   v
Healthy
   |
   v
Available
   |
   v
Receive Work
   |
   v
Monitor
   |
   +----> Scale
   |
   +----> Degrade
   |
   +----> Recover
   |
   +----> Disable
   |
   v
Retire
```

The Agent Registry provides the logical inventory, while deployment/runtime infrastructure manages the actual Worker instances.

---

# 19. Worker Health Monitoring

Observability should capture Worker execution signals such as:

```text id="y7qf5m"
Worker Health
Worker Availability
Active Tasks
Queue Depth
Execution Latency
Error Rate
Timeout Rate
Success Rate
Resource Utilization
Throughput
```

For example:

```text id="9gcg1z"
Opportunity Worker

Health        = Healthy
Availability  = Available
Active Tasks  = 7
Concurrency   = 10
Queue Depth   = 2
Success Rate  = 98%
Error Rate    = 2%
Latency       = 1.8 sec
```

These signals help the Delegator and platform determine whether the Worker should continue receiving traffic.

---

# 20. Failure Isolation

Worker pools also provide failure isolation.

Suppose:

```text id="o4s8g7"
Worker A → Healthy
Worker B → Unhealthy
Worker C → Healthy
```

The Delegator can remove Worker B from routing:

```text id="h4evy4"
Worker Pool
   |
   +-- Worker A ✓
   +-- Worker B ✗
   +-- Worker C ✓
```

The domain remains operational.

This is much better than having a single Worker instance responsible for an entire capability.

---

# 21. Worker Replacement

Suppose Worker A has a problem:

```text id="5b0d10"
Worker A
   |
Failure
   |
   v
Remove from active routing
   |
   v
Worker B / C continue
```

A new instance can subsequently join:

```text id="u4q5l6"
Worker Pool
   |
   +-- Worker B
   +-- Worker C
   +-- Worker D ← New Instance
```

The Delegator does not need to change its business logic.

It discovers the eligible Worker through the registry/routing mechanism.

---

# 22. Worker-Level Observability

Every Worker execution should carry the CWD execution identifiers.

For example:

```text id="j6p7cq"
session_id
task_id
run_id
turn_id
step_id
correlation_id
```

This creates an end-to-end trace:

```text id="7p6ujt"
User
 |
 v
Coordinator
 |
 v
Sales Delegator
 |
 v
Revenue Worker
 |
 v
MCP
 |
 v
Snowflake
```

The same correlation context allows operations teams to answer:

* Which Worker handled the task?
* How long did it take?
* Did it retry?
* Did it fail?
* Which enterprise system caused the delay?
* How much workload was active?
* Was the Worker overloaded?

---

# 23. Worker Management During Execution

The Delegator continuously manages the domain Worker pool.

Conceptually:

```text id="b50wzv"
              Domain Delegator
                     |
             Worker Management
                     |
      +--------------+--------------+
      |              |              |
      v              v              v
 Availability      Health        Workload
      |              |              |
      +--------------+--------------+
                     |
                     v
              Routing Decision
                     |
                     v
              Worker Execution
```

The Delegator does not simply select a Worker once and forget about it.

It manages the **execution lifecycle**.

---

# 24. End-to-End Example

Suppose the Sales Delegator receives 100 opportunity-analysis requests.

The Worker pool contains:

```text id="y48x8k"
Opportunity Worker Pool

Worker A
Capacity = 10
Active = 4
Healthy

Worker B
Capacity = 10
Active = 9
Healthy

Worker C
Capacity = 10
Active = 10
Healthy

Worker D
Capacity = 10
Active = 0
Healthy
```

The Delegator evaluates:

```text id="7z6ydc"
Worker A → Eligible
Worker B → Eligible
Worker C → At Capacity
Worker D → Eligible
```

It distributes new work primarily to A and D.

Meanwhile:

```text id="3o6o9c"
Incoming Tasks
      |
      v
Delegator
      |
      +-- Worker A
      +-- Worker D
      +-- Queue
```

If workload continues increasing, the runtime platform can scale the Worker pool:

```text id="a0q9jw"
Worker Pool
   |
   +-- A
   +-- B
   +-- C
   +-- D
   +-- E
   +-- F
```

The Agent Registry/routing layer can then make the new Workers available for selection.

---

# 25. Complete Worker Management Flow

```text id="0xgqcr"
                    Domain Delegator
                           |
                           v
                    Domain Task
                           |
                           v
                 Required Capability
                           |
                           v
                    Agent Registry
                           |
                           v
                    Worker Pool
                           |
          +----------------+----------------+
          |                |                |
          v                v                v
      Capability       Permissions       Task Fit
          |                |                |
          +----------------+----------------+
                           |
                           v
                    Runtime Signals
                           |
          +----------------+----------------+
          |                |                |
          v                v                v
       Health        Availability       Workload
          |                |                |
          +----------------+----------------+
                           |
                           v
                      Capacity
                           |
                           v
                   Routing Policy
                           |
                           v
                 Selected Worker
                           |
                           v
                      Execute
                           |
             +-------------+-------------+
             |                           |
          Success                     Failure
             |                           |
             v                           v
        Result                    Retry / Fallback
             |                           |
             +-------------+-------------+
                           |
                           v
                    Result Management
                           |
                           v
                    Domain Result
                           |
                           v
                      Coordinator
```

# 26. Responsibility Split

The CWD architecture should maintain a clear responsibility boundary.

| Responsibility        | Delegator          | Agent Registry | Runtime Platform | Worker |
| --------------------- | ------------------ | -------------- | ---------------- | ------ |
| Domain routing        | ✓                  |                |                  |        |
| Capability matching   | ✓                  | Metadata       |                  |        |
| Worker discovery      | ✓                  | ✓              |                  |        |
| Worker selection      | ✓                  |                |                  |        |
| Permission validation | ✓ / Policy Service |                |                  |        |
| Health information    | Consume            | Metadata       | ✓                | ✓      |
| Availability          | Consume            | Metadata       | ✓                | ✓      |
| Load distribution     | ✓                  |                | ✓                |        |
| Concurrency policy    | ✓                  |                | ✓                | ✓      |
| Horizontal scaling    |                    |                | ✓                |        |
| Task execution        | Coordinate         |                |                  | ✓      |
| Tool/API execution    |                    |                |                  | ✓      |
| Failure handling      | ✓                  |                | ✓                | ✓      |
| Result aggregation    | ✓                  |                |                  | ✓      |

---

# 27. Key Architectural Principle

The Delegator should manage **logical Worker capacity**, while the runtime platform manages **physical Worker instances**.

```text id="crv0as"
                    Delegator
                       |
                Logical Worker Pool
                       |
        +--------------+--------------+
        |              |              |
        v              v              v
    Worker A        Worker B        Worker C
        |              |              |
        +--------------+--------------+
                       |
                       v
                 Runtime Platform
                  ACA / AKS
                       |
                       v
              Scaling / Compute
```

This separation allows CWD to scale without making the Delegator responsible for infrastructure management.

---

# 28. Final Definition

> **Within CWD, Workers are organized into domain-specific capability pools and managed by their Delegator. The Delegator discovers eligible Workers through the Agent Registry, evaluates capability, domain ownership, permissions, tool access, health, availability, workload, concurrency, and task requirements, and routes work to the most appropriate Worker. Worker pools can scale horizontally through the runtime platform, while health monitoring, workload distribution, concurrency limits, queueing, backpressure, and capacity policies prevent overload and maintain reliable execution.**

The complete model is:

```text id="zll2uo"
Worker Management
      =
Worker Organization
+
Discovery
+
Health Monitoring
+
Availability Management
+
Load Distribution
+
Concurrency Control
+
Capacity Management
+
Horizontal Scaling
+
Failure Isolation
+
Observability
```

And the architectural relationship is:

```text id="1f9b8a"
Coordinator
      |
      | Enterprise orchestration
      v
Delegator
      |
      | Domain Worker management
      v
Worker Pool
      |
      | Capability execution
      v
Workers
      |
      | Tools / MCP
      v
Enterprise Systems
```

**In simple terms:**

> **The Delegator decides which Worker should do the work, while the Worker pool and runtime platform ensure that enough healthy capacity exists to do that work reliably and at scale.**
