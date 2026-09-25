# How do you handle container failures?

## Short answer

For CWD on ECS/Fargate, I handle container failures using:

**Detect → Health Check → Replace → Retry → Recover → Monitor**

If a container becomes unhealthy or crashes, ECS removes it from service and starts a replacement task. For application/downstream failures, I use timeouts, retries, backoff, circuit breakers, idempotency, and durable state.

---

## CWD flow

```text
                    ECS Service
                        ↓
              ┌─────────┴─────────┐
              ↓                   ↓
        CWD Task 1            CWD Task 2
              ↓                   ↓
          Healthy ✓           Healthy ✓
```

Suppose Task 1 crashes:

```text
Task 1
  ↓
Crash / Health check failure
  ↓
ALB stops sending traffic
  ↓
ECS detects unhealthy task
  ↓
Task 1 replaced
  ↓
New Task 3 starts
  ↓
Health check passes
  ↓
Traffic resumes
```

---

# 1. Detect the failure

I use multiple signals:

```text
Container exit
Health-check failure
5xx errors
Timeouts
High restart count
CPU/memory problems
ALB target unhealthy
```

CloudWatch provides the metrics and logs.

---

# 2. Health checks

For example:

```text
GET /health/live
GET /health/ready
```

If the task repeatedly fails:

```text
Healthy
   ↓
Unhealthy
   ↓
ECS replacement
```

The ALB also stops routing traffic to an unhealthy task.

---

# 3. ECS automatically replaces failed tasks

Suppose:

```text
Desired count = 3
```

Initially:

```text
Task 1 ✓
Task 2 ✓
Task 3 ✓
```

Task 2 crashes:

```text
Task 1 ✓
Task 2 ✗
Task 3 ✓
```

ECS launches:

```text
Task 4
```

After it becomes healthy:

```text
Task 1 ✓
Task 3 ✓
Task 4 ✓
```

So the service returns to the desired capacity.

---

# 4. Handle application failures

Not every failure requires replacing the container.

For example:

```text
Worker
  ↓
MCP
  ↓
Salesforce
  ↓
503
```

The container itself may still be healthy.

I would use:

```text
Timeout
   ↓
Retry
   ↓
Exponential Backoff + Jitter
   ↓
Retry limit
   ↓
Circuit breaker / failure
```

---

# 5. Handle Worker failures

CWD has:

```text
Coordinator
    ↓
Delegator
    ↓
Workers
```

Suppose:

```text
Sales Worker → SUCCESS
CRM Worker   → SUCCESS
Incident Worker → TIMEOUT
```

The Delegator determines whether the Worker is mandatory.

### Optional Worker

```text
Continue
   ↓
Aggregate successful results
   ↓
Partial response
```

### Mandatory Worker

```text
Retry
   ↓
Failure
   ↓
Workflow failure / recovery
```

The system should **not invent the missing information**.

---

# 6. Keep state outside the container

This is critical.

If a container crashes:

```text
❌ Workflow state inside container memory
```

could be lost.

Instead:

```text
CWD Container
      ↓
DynamoDB → durable workflow state
Redis    → cache
S3       → documents
```

For example:

```text
RUN123
 ↓
Step 1 COMPLETED
Step 2 COMPLETED
Step 3 IN_PROGRESS
```

If the Worker/container crashes, the workflow can resume based on durable state/checkpointing rather than starting blindly from the beginning.

---

# 7. Prevent duplicate operations

Suppose the container crashes **after Salesforce successfully created a ticket but before CWD recorded success**.

A retry could accidentally create another ticket.

So I use **idempotency**:

```text
Request ID
   ↓
DynamoDB idempotency record
   ↓
Check existing operation
   ↓
Execute
   ↓
Store result
```

For example:

```text
RUN123-STEP05
```

If the same operation is retried, the system can recognize it as the same logical request.

---

# 8. Handle memory/CPU failures

Suppose:

```text
Memory → 95%
```

I would investigate:

* Container memory limits
* Memory leaks
* Large prompts
* Excessive RAG context
* Too many concurrent Workers
* Large document processing

Then:

```text
Immediate → replace unhealthy task if needed
Long term → optimize resource usage
```

I would **not blindly increase memory** without understanding the cause.

---

# 9. Handle repeated failures

If a new container repeatedly fails:

```text
New version
    ↓
Crash
    ↓
Restart
    ↓
Crash
    ↓
Restart
```

I would stop treating it as a simple infrastructure problem.

Check:

```text
Application logs
Configuration
Secrets
IAM permissions
Dependency connectivity
Image/version
Environment variables
Resource limits
```

If the failure is caused by a bad deployment, rollback:

```text
v1.5 ❌
 ↓
v1.4 ✓
```

---

# 10. Monitor failures

I would monitor:

```text
Task count
Healthy/unhealthy task count
Container restarts
Exit codes
5xx errors
CPU
Memory
ALB target health
P50/P95/P99 latency
MCP failures
Bedrock errors
Worker failures
Retry count
DLQ messages
```

And create CloudWatch alarms for important conditions.

---

# 🎯 Strong interview answer

> **“I handle ECS container failures in multiple layers. First, I detect failures using container and ALB health checks, CloudWatch metrics and logs. ECS automatically replaces unhealthy or stopped tasks and the ALB routes traffic only to healthy tasks. For application and downstream failures, I use timeouts, bounded retries with exponential backoff and jitter, circuit breakers and idempotency. CWD workflow state is stored outside the container so a task failure doesn't lose the workflow, and the Delegator determines whether a failed Worker is mandatory or optional. For repeated failures caused by a deployment, I roll back to the previous healthy version.”**

## Easy memory trick

**Detect → Remove → Replace → Retry → Resume → Monitor**

```text
Failure
   ↓
Detect
   ↓
ALB stops traffic
   ↓
ECS replaces task
   ↓
Retry downstream operation if transient
   ↓
Resume from durable state
   ↓
Monitor
```

### Key distinction

**Container failure** → ECS replaces the task.

**Application failure** → Retry / recover / circuit breaker.

**Worker failure** → Delegator decides partial vs failure.

**Workflow state** → Persist outside the container.

**Bad deployment** → Roll back.
