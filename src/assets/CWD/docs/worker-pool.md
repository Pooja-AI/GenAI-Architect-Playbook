# Worker Pooling, Scaling, and Dynamic Worker Selection

## 1. Overview

In the CWD architecture, Worker pooling and dynamic Worker selection ensure that enterprise tasks are executed by the right Worker, at the right time, with sufficient capacity, while maintaining reliability, security, and performance.

A Worker should not be treated as a permanently dedicated process for one request. Instead, Workers are deployed as scalable execution units that can be selected, reused, monitored, and replaced according to workload and health.

> Core principle: Separate the logical Worker capability from the physical Worker instance that executes the task.

For example:

* Logical capability: `InvoiceValidationWorker`

* Physical instances: `InvoiceValidationWorker-1`, `InvoiceValidationWorker-2`, `InvoiceValidationWorker-3`

* Selection decision: Choose a healthy, authorized, and sufficiently available instance.

* Scaling decision: Start additional instances when demand exceeds available capacity.

## 2. Why Worker Pooling Is Required

Enterprise workloads are rarely constant. A Worker may receive:

* One request during normal business hours.

* Hundreds of requests during a reporting cycle.

* Large bursts during incident management.

* Long-running tasks that occupy capacity for several minutes.

* High-priority operational tasks that must execute immediately.

A single Worker instance creates several risks:

|
Risk

|

Impact

|
| --- | --- |
|

Single instance dependency

|

One failure can stop task execution

|
|

Fixed capacity

|

Requests wait in queues during bursts

|
|

Resource contention

|

CPU, memory, connections, and tokens become exhausted

|
|

Uneven workload

|

Some instances are overloaded while others remain idle

|
|

Slow recovery

|

Failed tasks cannot be redirected quickly

|
|

Poor cost efficiency

|

Overprovisioning wastes infrastructure resources

|
|

Limited maintenance flexibility

|

Updating one instance may interrupt execution

|

Worker pooling addresses these risks by maintaining multiple interchangeable instances of the same logical capability.

## 3. Logical Worker Versus Physical Worker Instance

The logical Worker represents a business or technical capability. The physical instance is the runtime process or container that performs the work.

```
                    Logical Worker Capability
                    InvoiceValidationWorker
                              |
             ---------------------------------------
             |                  |                  |
       Physical Instance 1 Physical Instance 2 Physical Instance 3
       Healthy             Healthy              Busy
       Capacity: 10        Capacity: 8          Capacity: 0
```

The Delegator or runtime should select the logical capability first and resolve it to an eligible physical instance afterward.

### Example

A task may specify:

JSON

```
{
  "required_capability": "invoice.validation",
  "task_type": "validate_invoice",
  "priority": "high",
  "required_data_classification": "internal"
}
```

The task should not directly specify:

JSON

```
{
  "worker_instance": "invoice-worker-container-17"
}
```

The instance may disappear, restart, become unhealthy, or be replaced. Selection should be based on capability and runtime state rather than a hardcoded instance identity.

## 4. What Is a Worker Pool?

A Worker pool is a group of runtime instances that provide the same logical capability and can execute compatible tasks.

A pool normally contains:

* Worker instances

* A queue or task broker

* Capacity metadata

* Health status

* Concurrency limits

* Routing information

* Version information

* Security and authorization metadata

* Scaling policies

* Observability data

### Conceptual architecture

```
                         CWD Coordinator
                                |
                         CWD Delegator
                                |
                       Task Routing Layer
                                |
                         Agent Registry
                                |
                       Worker Pool Manager
                                |
              -------------------------------------
              |                  |                |
        Worker Instance A  Worker Instance B  Worker Instance C
        Healthy            Healthy            Healthy
              |                  |                |
              ----------- Shared Task Queue --------
                                |
                    Enterprise APIs / Data / Tools
```

The pool may be implemented using containers, Kubernetes deployments, serverless workers, virtual machines, or another runtime. The architectural principle remains the same.

## 5. Worker Pooling Models

### 5.1 Dedicated pool per capability

Each capability has its own pool.

```
Invoice Validation Pool
Purchase Order Pool
Incident Diagnosis Pool
Report Generation Pool
```

Advantages

* Strong isolation

* Independent scaling

* Easier capacity planning

* Capability-specific security policies

* Failures remain localized

Disadvantages

* More infrastructure

* Potentially lower utilization

* More operational complexity

This model is useful for critical, resource-intensive, or highly regulated Workers.

### 5.2 Shared generic Worker pool

Several compatible task types use the same pool.

```
                  Generic Data Processing Pool
                    /          |          \
             Data Cleanup  Data Mapping  Data Validation
```

Advantages

* Better resource utilization

* Lower infrastructure overhead

* Easier management for lightweight tasks

Disadvantages

* Noisy-neighbor risk

* More complex scheduling

* Different tasks may have incompatible dependencies

* Resource isolation becomes harder

### 5.3 Hybrid pooling

CWD can use a hybrid model:

* Dedicated pools for critical or specialized Workers.

* Shared pools for lightweight and compatible tasks.

* GPU pools for model-intensive processing.

* High-memory pools for document or artifact generation.

* Restricted pools for sensitive data.

This is often the most practical enterprise design.

## 6. Horizontal Scaling

Horizontal scaling means increasing or decreasing the number of Worker instances.

```
Low demand:
Worker A

Medium demand:
Worker A + Worker B

High demand:
Worker A + Worker B + Worker C + Worker D
```

Horizontal scaling is preferred for enterprise Worker execution because it provides:

* Higher throughput

* Fault tolerance

* Rolling deployment support

* Better availability

* Independent scaling by capability

* Reduced dependence on a single machine

### Horizontal versus vertical scaling

|
Scaling type

|

Meaning

|

Example

|
| --- | --- | --- |
|

Horizontal

|

Add more instances

|

3 invoice Workers instead of 1

|
|

Vertical

|

Increase resources per instance

|

More CPU or memory for one Worker

|
|

Hybrid

|

Add instances and resize them

|

More high-memory Worker instances

|

Vertical scaling is useful when a single task requires more memory or CPU, but it has practical limits. Horizontal scaling is generally better for independent, concurrent tasks.

## 7. Conditions for Effective Horizontal Scaling

Horizontal scaling works well when Workers are designed to be:

### 7.1 Stateless where possible

A Worker should not depend on local process memory for critical workflow state.

Instead, persist state in:

* Task queue

* Workflow state store

* Database

* Distributed cache

* Object storage

* Durable execution service

### 7.2 Independently executable

Each task should contain enough information for any eligible Worker instance to execute it.

### 7.3 Idempotent

If a task is retried or delivered twice, the operation should not create unintended duplicate effects.

For example:

```
Create purchase order
    |
Use idempotency key
    |
Prevent duplicate purchase order creation
```

### 7.4 Externally observable

The runtime must know:

* Whether the Worker is alive.

* Whether it is ready to accept work.

* How many tasks it is executing.

* Whether it is overloaded.

* Whether it is failing repeatedly.

## 8. Concurrency

Concurrency is the number of tasks a Worker instance can process at the same time.

For example:

```
Worker Instance A
Maximum concurrency = 4

Task 1 → Running
Task 2 → Running
Task 3 → Running
Task 4 → Running
Task 5 → Queued
```

Concurrency is not simply the number of CPU cores. It depends on the task type.

### I/O-bound Workers

Examples:

* Calling enterprise APIs

* Reading from databases

* Retrieving documents

* Waiting for model responses

These Workers may support higher concurrency because much of the time is spent waiting.

### CPU-bound Workers

Examples:

* Large document parsing

* Data transformation

* Complex calculations

* Local model inference

These Workers usually require lower concurrency to avoid CPU saturation.

### GPU-bound Workers

Examples:

* Embedding generation

* Vision inference

* Large model execution

Concurrency must consider:

* GPU memory

* Batch size

* Model size

* Inference latency

* GPU utilization

## 9. Concurrency Controls

Each Worker should define explicit limits.

JSON

```
{
  "worker": "document-processing-worker",
  "max_concurrency": 4,
  "max_queue_depth": 100,
  "max_execution_time_seconds": 300,
  "max_memory_mb": 4096,
  "max_external_connections": 20
}
```

Important controls include:

|
Control

|

Purpose

|
| --- | --- |
|

Maximum concurrency

|

Prevent excessive simultaneous tasks

|
|

Queue depth

|

Limit waiting tasks

|
|

Execution timeout

|

Prevent indefinitely running tasks

|
|

Connection pool limit

|

Protect downstream systems

|
|

Rate limit

|

Prevent API throttling

|
|

Memory limit

|

Avoid out-of-memory failures

|
|

Token budget

|

Control LLM consumption

|
|

Per-tenant quota

|

Prevent one tenant from consuming all capacity

|

## 10. Workload Distribution

Workload distribution determines how tasks are assigned across Worker instances.

The routing mechanism should consider more than simple round-robin assignment.

### Common distribution strategies

|
Strategy

|

Description

|

Best use

|
| --- | --- | --- |
|

Round robin

|

Rotate through instances

|

Similar task durations

|
|

Least loaded

|

Choose instance with lowest load

|

Uneven task durations

|
|

Queue-based

|

Workers pull tasks from a queue

|

Reliable asynchronous processing

|
|

Priority-based

|

High-priority tasks execute first

|

Incident and operational workloads

|
|

Capability-based

|

Match required capability

|

Specialized Workers

|
|

Weighted routing

|

Assign according to capacity

|

Heterogeneous instances

|
|

Affinity-based

|

Prefer same instance or region

|

Cache locality or session affinity

|
|

Cost-aware

|

Prefer lower-cost eligible capacity

|

Non-critical workloads

|

## 11. Queue-Based Workload Distribution

For reliable enterprise execution, a queue-based model is often safer than direct instance-to-instance invocation.

```
Delegator
   |
   v
Task Queue
   |
   +---- Worker A pulls Task 1
   |
   +---- Worker B pulls Task 2
   |
   +---- Worker C pulls Task 3
```

The queue provides:

* Buffering during bursts

* Decoupling between producers and consumers

* Retry support

* Dead-letter handling

* Backpressure

* Work redistribution after failure

* Priority management

* Visibility into backlog

### Pull-based execution

Workers pull tasks when they have available capacity.

```
Worker has capacity?
        |
       Yes
        |
   Pull next task
        |
   Execute task
        |
   Acknowledge completion
```

This naturally distributes work according to actual availability.

## 12. Backpressure

Backpressure prevents the system from accepting more work than it can safely process.

Without backpressure:

```
Incoming tasks increase
        |
Worker concurrency exhausted
        |
Memory increases
        |
Latency increases
        |
Timeouts and failures
```

With backpressure:

```
Incoming tasks increase
        |
Queue absorbs bounded backlog
        |
Concurrency remains controlled
        |
Additional instances scale out
        |
Excess requests are throttled or rejected safely
```

Backpressure mechanisms include:

* Queue limits

* Admission control

* Rate limiting

* Per-tenant quotas

* Maximum in-flight tasks

* Priority queues

* Circuit breakers

* Load shedding for low-priority tasks

## 13. Health Management

Worker health management determines whether an instance is eligible to receive work.

A Worker can be:

|
State

|

Meaning

|
| --- | --- |
|

Starting

|

Runtime is initializing

|
|

Ready

|

Can accept tasks

|
|

Busy

|

Executing tasks but may have capacity

|
|

Draining

|

Finishing existing tasks; no new tasks

|
|

Unhealthy

|

Failing health checks or dependencies

|
|

Quarantined

|

Temporarily removed from routing

|
|

Failed

|

Not available

|
|

Retired

|

Permanently removed from the pool

|

### Health dimensions

Health should not be based only on whether the process is alive.

#### Liveness

Answers:

> Is the Worker process running?

#### Readiness

Answers:

> Can the Worker safely accept a new task?

#### Dependency health

Answers:

> Can the Worker access required APIs, databases, queues, models, and tools?

#### Performance health

Answers:

> Is the Worker responding within acceptable latency and error thresholds?

A Worker may be alive but not ready because its database connection or required model endpoint is unavailable.

## 14. Health Checks

A production Worker should expose or report:

```
Liveness check
Readiness check
Dependency check
Capacity metrics
Error metrics
Execution latency
Active task count
Queue depth
```

Example conceptual health response:

JSON

```
{
  "worker_id": "invoice-worker-03",
  "status": "ready",
  "active_tasks": 3,
  "max_concurrency": 8,
  "available_slots": 5,
  "dependencies": {
    "database": "healthy",
    "enterprise_api": "healthy",
    "mcp_gateway": "healthy",
    "model_endpoint": "degraded"
  },
  "accepting_tasks": true
}
```

If the model endpoint is degraded, the Worker may remain alive but become ineligible for tasks requiring that model.

## 15. Graceful Draining

During deployment, scaling in, or maintenance, a Worker should enter a draining state.

```
Ready
  |
  v
Draining
  |
  +-- Stop accepting new tasks
  |
  +-- Finish active tasks
  |
  +-- Persist checkpoints if supported
  |
  +-- Acknowledge completed tasks
  |
  v
Shutdown
```

Graceful draining prevents:

* Abrupt task termination

* Duplicate execution

* Partial artifact generation

* Lost intermediate state

* Inconsistent downstream updates

Long-running Workers may need checkpointing or durable workflow state so that work can resume safely.

## 16. Dynamic Worker Selection

Dynamic Worker selection means choosing a Worker at execution time based on task requirements and current runtime conditions.

The selection process should consider:

1. Required capability

2. Task type

3. Input and output contract

4. Required tools

5. Data classification

6. User and agent authorization

7. Worker version

8. Region or environment

9. Health status

10. Current load

11. Available concurrency

12. Latency

13. Reliability history

14. Cost constraints

15. Priority and deadline

### Selection flow

```
Task received
     |
Read required capability
     |
Discover eligible Workers
     |
Filter by authorization and policy
     |
Filter by health and readiness
     |
Filter by version and environment
     |
Filter by capacity and concurrency
     |
Rank remaining candidates
     |
Select Worker instance
     |
Dispatch task
     |
Monitor execution
```

## 17. Worker Selection Must Be Policy-Aware

The LLM may recommend a capability, but it should not independently choose an unauthorized runtime instance.

A safe model is:

```
LLM recommends:
"Use InvoiceValidationWorker"

        |
        v

Runtime validates:
- Capability exists
- Worker is registered
- Worker is authorized
- Required tools are approved
- Data classification is allowed
- Instance is healthy
- Capacity is available

        |
        v

Runtime selects and invokes instance
```

### Example selection constraints

JSON

```
{
  "required_capability": "invoice.validation",
  "environment": "production",
  "data_classification": "confidential",
  "required_region": "us",
  "minimum_worker_version": "2.4.0",
  "priority": "high",
  "deadline_seconds": 30
}
```

The Agent Registry should provide the metadata needed for this decision.

## 18. Agent Registry Metadata

A Worker registration may contain:

JSON

```
{
  "worker_id": "invoice-validation-worker",
  "capabilities": [
    "invoice.validation",
    "invoice.duplicate_detection"
  ],
  "supported_input_schema": "InvoiceValidationRequest.v1",
  "supported_output_schema": "InvoiceValidationResult.v1",
  "required_tools": [
    "invoice.database.read",
    "erp.invoice.lookup"
  ],
  "supported_data_classifications": [
    "internal",
    "confidential"
  ],
  "deployment": {
    "environment": "production",
    "region": "us"
  },
  "scaling": {
    "min_instances": 2,
    "max_instances": 20,
    "max_concurrency_per_instance": 8
  },
  "health": {
    "status": "ready"
  }
}
```

The registry should distinguish between:

* Static metadata: capability, schemas, required tools.

* Dynamic metadata: health, load, queue depth, active tasks.

* Policy metadata: authorization, data classification, allowed environments.

## 19. Selection Scoring

A conceptual scoring model can rank eligible Workers:

Score(w)=αC(w)+βH(w)+γA(w)+δV(w)−ϵL(w)−ζE(w)−ηR(w)Score(w) = \alpha C(w) +\beta H(w) +\gamma A(w) +\delta V(w) -\epsilon L(w) -\zeta E(w) -\eta R(w)Score(w)=αC(w)+βH(w)+γA(w)+δV(w)−ϵL(w)−ζE(w)−ηR(w)

Where:

* C(w)C(w)C(w): capability match

* H(w)H(w)H(w): health score

* A(w)A(w)A(w): authorization and policy compatibility

* V(w)V(w)V(w): version compatibility

* L(w)L(w)L(w): current load

* E(w)E(w)E(w): recent error rate

* R(w)R(w)R(w): estimated response latency

However, hard policy constraints must be applied before scoring.

For example, an unauthorized Worker must be excluded even if it has low load and excellent latency.

## 20. Capacity Planning

Capacity planning determines how many Worker instances and resources are required to meet business demand.

The planning process should consider:

* Average request rate

* Peak request rate

* Task execution duration

* Concurrency per instance

* Required latency

* Availability target

* Retry volume

* Failure scenarios

* Tenant growth

* Seasonal demand

* Resource consumption

* Downstream API limits

### Basic throughput formula

If:

* NNN = number of Worker instances

* KKK = concurrency per instance

* TTT = average task duration in seconds

Then approximate throughput is:

Throughput≈N×KTThroughput \approx \frac{N \times K}{T}Throughput≈TN×K

For example, if:

* 4 instances

* 5 concurrent tasks per instance

* 10 seconds average duration

Then:

Throughput≈4×510=2Throughput \approx \frac{4 \times 5}{10} = 2Throughput≈104×5=2

Approximately 2 tasks per second, assuming sufficient downstream capacity and no bottlenecks.

This is a planning approximation, not a guaranteed production throughput figure.

## 21. Queueing and Capacity

Suppose a Worker receives:

* 100 tasks per minute

* Average task duration: 6 seconds

* One instance concurrency: 4

Required concurrency is approximately:

RequiredConcurrency=ArrivalRate×ServiceTimeRequiredConcurrency = ArrivalRate \times ServiceTimeRequiredConcurrency=ArrivalRate×ServiceTime

RequiredConcurrency=10060×6=10RequiredConcurrency = \frac{100}{60} \times 6 = 10RequiredConcurrency=60100×6=10

At least 10 concurrent execution slots are required before considering safety margin, retries, and failures.

If each instance supports 4 concurrent tasks:

RequiredInstances=⌈104⌉=3RequiredInstances = \left\lceil \frac{10}{4} \right\rceil = 3RequiredInstances=⌈410⌉=3

In practice, additional instances may be required for:

* High availability

* Rolling deployments

* Sudden bursts

* Instance failures

* Uneven task durations

* Retry traffic

## 22. Scaling Policies

### Scale-out signals

Scale out when:

* Queue depth increases

* Queue wait time exceeds threshold

* CPU utilization remains high

* Memory utilization is high

* Active tasks approach concurrency limit

* Task latency increases

* Deadline violations increase

* Incoming request rate rises

### Scale-in signals

Scale in when:

* Queue remains low

* Utilization is consistently low

* Active task count is low

* Latency is stable

* Sufficient redundancy remains

* No deployment or recovery activity is occurring

### Example policy

JSON

```
{
  "min_instances": 2,
  "max_instances": 20,
  "scale_out": {
    "queue_depth": 50,
    "cooldown_seconds": 60
  },
  "scale_in": {
    "average_utilization_percent": 30,
    "cooldown_seconds": 300
  }
}
```

The minimum instance count should preserve availability. For critical production Workers, one instance is usually not sufficient.

## 23. Autoscaling Considerations

Autoscaling should not rely on CPU alone.

A Worker may have low CPU utilization while waiting on:

* Database connections

* External APIs

* LLM responses

* MCP tools

* Network I/O

* Queue availability

Useful enterprise metrics include:

|
Metric

|

Why it matters

|
| --- | --- |
|

Queue depth

|

Measures pending work

|
|

Queue age

|

Measures waiting time

|
|

Active tasks

|

Measures current concurrency

|
|

Available slots

|

Measures remaining capacity

|
|

Task latency

|

Measures performance

|
|

Error rate

|

Measures reliability

|
|

Retry rate

|

Measures instability

|
|

CPU and memory

|

Measures resource pressure

|
|

Downstream throttling

|

Measures dependency limits

|
|

Token usage

|

Measures model capacity and cost

|

## 24. Reliability During Scaling

Scaling must preserve task correctness.

Important mechanisms include:

### At-least-once delivery

A task may be delivered more than once. Workers must use idempotency and deduplication where necessary.

### Visibility timeout

If a Worker receives a task but does not complete it within a specified period, the task becomes eligible for redelivery.

### Acknowledgment after completion

The Worker should acknowledge successful completion only after:

* Business processing succeeds.

* Required downstream writes are confirmed.

* Output validation succeeds.

* Durable state is persisted.

### Dead-letter queue

Tasks that repeatedly fail should move to a dead-letter queue for investigation or controlled recovery.

```
Task Queue
   |
   v
Worker execution
   |
   +-- Success → Acknowledge
   |
   +-- Retryable failure → Retry queue
   |
   +-- Repeated failure → Dead-letter queue
```

## 25. Worker Failure and Redistribution

If a Worker instance fails during execution:

```
Worker A fails
     |
Runtime detects missing heartbeat
     |
Task lease expires
     |
Task becomes available again
     |
Worker B claims task
     |
Idempotency prevents duplicate side effects
```

The system must distinguish between:

* Failure before execution

* Failure during execution

* Failure after downstream side effect

* Failure after output generation but before acknowledgment

The last two cases require especially careful transaction and idempotency handling.

## 26. Avoiding Noisy Neighbors

A high-volume tenant or task type should not consume the entire Worker pool.

Controls include:

* Per-tenant concurrency limits

* Per-tenant queue quotas

* Separate priority queues

* Dedicated pools for critical workloads

* Weighted fair scheduling

* Resource quotas

* Maximum task duration

* Admission control

Example:

```
Shared Worker Pool
    |
    +-- Tenant A: max 20 concurrent tasks
    +-- Tenant B: max 10 concurrent tasks
    +-- Tenant C: max 5 concurrent tasks
    +-- Critical operations: reserved capacity
```

## 27. Priority and Deadline-Aware Scheduling

Not all enterprise tasks have equal urgency.

Example priority classes:

|
Priority

|

Example

|
| --- | --- |
|

Critical

|

Production incident remediation

|
|

High

|

Customer-impacting operational task

|
|

Normal

|

Standard business workflow

|
|

Low

|

Batch reporting or enrichment

|

A task with a deadline should be routed to a Worker that can realistically complete it within that deadline.

```
Task deadline = 20 seconds

Candidate A:
Queue wait = 15 seconds
Estimated execution = 10 seconds
Rejected: deadline risk

Candidate B:
Queue wait = 2 seconds
Estimated execution = 8 seconds
Selected
```

Priority should not bypass authorization, safety, or data access controls.

## 28. Observability for Worker Pools

CWD should provide visibility at three levels.

### Pool-level metrics

* Total instances

* Ready instances

* Unhealthy instances

* Queue depth

* Queue age

* Pool throughput

* Pool error rate

* Pool utilization

### Instance-level metrics

* Instance health

* Active tasks

* Available slots

* CPU and memory

* Restart count

* Dependency failures

* Average execution latency

### Task-level metrics

* Task ID

* Correlation ID

* Worker capability

* Selected instance

* Start and end time

* Retry count

* Tool calls

* Output validation status

* Final outcome

Example:

JSON

```
{
  "correlation_id": "corr-123",
  "task_id": "task-456",
  "worker_capability": "invoice.validation",
  "worker_instance": "invoice-worker-03",
  "queue_wait_ms": 120,
  "execution_time_ms": 840,
  "retry_count": 0,
  "status": "completed"
}
```

## 29. Security and Governance

Worker pooling must not weaken enterprise security.

Every dynamically selected Worker should still be evaluated for:

* User authorization

* Agent authorization

* Tool permissions

* Data classification

* Environment restrictions

* Region restrictions

* Tenant isolation

* Secret access

* Network access

* Audit requirements

A Worker instance should use its own managed identity or service identity, with least-privilege access.

The runtime must never assume:

> “The Worker is registered, therefore it is authorized for every task.”

Registration, health, and authorization are separate concerns.

## 30. Recommended CWD Execution Pattern

```
1. Coordinator receives user request
             |
2. Delegator creates structured task
             |
3. Policy validates user and agent permissions
             |
4. Agent Registry resolves required Worker capability
             |
5. Pool Manager retrieves eligible instances
             |
6. Runtime filters unhealthy or overloaded instances
             |
7. Scheduler applies priority and capacity rules
             |
8. Selected Worker claims the task
             |
9. Worker executes through approved MCP tools
             |
10. Worker validates structured output
             |
11. Runtime acknowledges successful completion
             |
12. Delegator aggregates result
             |
13. Coordinator synthesizes final response
```

## 31. Example Worker Selection Pseudocode

Python

Run

```
def select_worker(task, registry, runtime, policy):
    candidates = registry.find_by_capability(
        capability=task.required_capability
    )

    eligible = []

    for worker in candidates:
        if not policy.is_authorized(task, worker):
            continue

        if not worker.supports_schema(task.input_schema):
            continue

        if not worker.supports_data_classification(
            task.data_classification
        ):
            continue

        health = runtime.get_health(worker.id)

        if health.status != "ready":
            continue

        if health.available_slots <= 0:
            continue

        if not runtime.meets_deadline(worker.id, task.deadline):
            continue

        eligible.append(worker)

    if not eligible:
        raise NoEligibleWorkerError(
            "No healthy and authorized Worker has capacity"
        )

    return min(
        eligible,
        key=lambda worker: runtime.estimated_cost(worker.id)
    )
```

This is conceptual logic. In production, selection may be implemented through a scheduler, service mesh, queue broker, orchestration runtime, or custom routing service.

## 32. Common Anti-Patterns

### Anti-pattern 1: Hardcoded Worker instance

```
Delegator → invoice-worker-01
```

Problem: The instance may fail or become overloaded.

Better: Select by capability and current runtime state.

### Anti-pattern 2: Routing only by round robin

Problem: Round robin ignores task duration, health, and capacity.

Better: Combine capability filtering with load-aware scheduling.

### Anti-pattern 3: Scaling only on CPU

Problem: I/O-bound Workers may be overloaded while CPU remains low.

Better: Monitor queue depth, queue age, concurrency, and latency.

### Anti-pattern 4: No concurrency limit

Problem: A Worker may exhaust memory, connections, tokens, or downstream API quotas.

Better: Apply explicit per-instance and per-tenant limits.

### Anti-pattern 5: Treating liveness as readiness

Problem: A running process may be unable to access required dependencies.

Better: Use separate liveness, readiness, and dependency health checks.

### Anti-pattern 6: Acknowledging before completion

Problem: A task may be lost if the Worker acknowledges it before persisting the result.

Better: Acknowledge only after successful and durable completion.

### Anti-pattern 7: Scaling without idempotency

Problem: Retries and redistribution may duplicate business side effects.

Better: Use idempotency keys, deduplication, and transaction-aware processing.

## 33. Responsibility Split in CWD

|
Responsibility

|

Coordinator

|

Delegator

|

Worker Runtime / Pool Manager

|

Worker

|
| --- | --- | --- | --- | --- |
|

Understand user intent

|

Yes

|

No

|

No

|

No

|
|

Decompose domain task

|

No

|

Yes

|

No

|

No

|
|

Discover logical capability

|

Indirectly

|

Yes

|

Supports

|

No

|
|

Select physical instance

|

No

|

Supports

|

Yes

|

No

|
|

Enforce capacity

|

No

|

Supports

|

Yes

|

No

|
|

Manage health

|

Observes

|

Observes

|

Yes

|

Reports

|
|

Execute business logic

|

No

|

No

|

No

|

Yes

|
|

Select approved tools

|

Policy-aware

|

Policy-aware

|

Enforces routing

|

Yes

|
|

Validate task output

|

Aggregates

|

Aggregates

|

Monitors

|

Yes

|
|

Retry infrastructure failure

|

Coordinates

|

Coordinates

|

Supports

|

Handles local failure

|
|

Scale pool

|

No

|

Requests or observes

|

Yes

|

No

|
|

Return business result

|

Final response

|

Domain result

|

Execution status

|

Structured result

|

## 34. Key Design Principles

1. Pool by logical capability, not by individual request.

2. Keep Workers stateless where practical.

3. Use queues to absorb bursts and distribute work.

4. Control concurrency explicitly.

5. Scale based on queue and latency signals, not CPU alone.

6. Separate liveness, readiness, and dependency health.

7. Drain Workers gracefully before shutdown.

8. Use capability, policy, health, and capacity for dynamic selection.

9. Apply authorization before routing.

10. Use idempotency for retries and redistribution.

11. Reserve capacity for critical enterprise workloads.

12. Monitor pool, instance, and task-level metrics.

13. Treat the Agent Registry as the source of capability metadata.

14. Treat runtime state as dynamic and short-lived.

15. Keep LLM recommendations separate from runtime execution control.

## Final Definition

Worker pooling and horizontal scaling in CWD provide a resilient execution layer in which multiple physical Worker instances deliver the same logical capability. Workload distribution, concurrency controls, health management, capacity planning, and policy-aware dynamic selection ensure that each task is routed to a healthy, authorized, and sufficiently available Worker.

### Core formula

Reliable Worker Execution=Capability Matching+Policy Validation+Health Awareness+Capacity-Aware Scheduling+Controlled Concurrency+Horizontal Scaling+Failure Recovery\boxed{ \text{Reliable Worker Execution} = \text{Capability Matching} + \text{Policy Validation} + \text{Health Awareness} + \text{Capacity-Aware Scheduling} + \text{Controlled Concurrency} + \text{Horizontal Scaling} + \text{Failure Recovery} }Reliable Worker Execution=Capability Matching+Policy Validation+Health Awareness+Capacity-Aware Scheduling+Controlled Concurrency+Horizontal Scaling+Failure Recovery
