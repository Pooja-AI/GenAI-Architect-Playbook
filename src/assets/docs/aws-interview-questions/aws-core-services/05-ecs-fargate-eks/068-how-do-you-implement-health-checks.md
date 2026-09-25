# How do you implement health checks?

## Short answer

For CWD, I would implement **health checks at multiple levels**:

1. **Container health** – Is the application process alive?
2. **ECS task health** – Is the container healthy?
3. **ALB health** – Can the service receive traffic?
4. **Dependency health** – Are critical dependencies reachable?
5. **Application health** – Is CWD actually able to process requests?

The important point is: **don't make the health endpoint perform expensive LLM or enterprise calls.**

---

## CWD flow

```text
User
 ↓
API Gateway
 ↓
ALB
 ↓
ECS/Fargate
 ↓
┌──────────────────────┐
│ CWD Container        │
│                      │
│ /health/live         │
│ /health/ready        │
└──────────────────────┘
 ↓
Coordinator
 ↓
Delegator
 ↓
Workers
```

---

# 1. Liveness check

Liveness answers:

> **“Is my application process running?”**

Example:

```python
@app.get("/health/live")
def liveness():
    return {"status": "alive"}
```

Response:

```json
{
  "status": "alive"
}
```

This should be very lightweight.

If it fails repeatedly, ECS can replace the unhealthy task.

---

# 2. Readiness check

Readiness answers:

> **“Is this instance ready to receive traffic?”**

Example:

```python
@app.get("/health/ready")
def readiness():
    return {"status": "ready"}
```

A more realistic implementation might check only critical local dependencies/configuration.

For example:

```text
Configuration loaded?       ✓
Required initialization?    ✓
Required internal service?  ✓
        ↓
      READY
```

If the application isn't ready, the load balancer should not send new traffic to that task.

---

# 3. Configure ECS container health check

Example Dockerfile:

```dockerfile
HEALTHCHECK --interval=30s \
            --timeout=5s \
            --start-period=30s \
            --retries=3 \
            CMD curl -f http://localhost:8000/health/live || exit 1
```

This tells ECS:

```text
Every 30 seconds
      ↓
Call /health/live
      ↓
Success → Healthy
Failure → Unhealthy
```

---

# 4. Configure ALB health check

The ALB can also check the application.

```text
ALB
 ↓
GET /health/ready
 ↓
ECS Task
```

For example:

```text
Path: /health/ready
Port: 8000
Protocol: HTTP
Healthy status: 200
```

If:

```text
Task 1 → 200 → Healthy
Task 2 → 200 → Healthy
Task 3 → 503 → Unhealthy
```

The ALB stops sending normal traffic to Task 3.

---

# 5. Dependency health checks

This needs some care.

I would **not** make the normal liveness endpoint call:

```text
Bedrock
Salesforce
ServiceNow
OpenSearch
```

every few seconds.

Otherwise, health checks themselves create unnecessary traffic and cost.

Instead, use lightweight dependency checks where needed:

```text
/health/ready
      ↓
Critical local dependencies
```

And monitor external dependencies separately:

```text
CloudWatch
   ↓
Bedrock metrics
Salesforce latency/errors
MCP latency/errors
OpenSearch health
```

---

# 6. CWD example

Suppose the Customer Briefing Coordinator is running:

```text
ECS Task
   ↓
Coordinator
   ↓
Delegators
   ↓
Workers
```

The container crashes.

```text
Container
   ↓
/health/live → failure
```

ECS detects the unhealthy task:

```text
Unhealthy Task
      ↓
Stop/replace
      ↓
New Fargate Task
      ↓
Health check
      ↓
Healthy
      ↓
ALB sends traffic
```

---

# 7. Startup considerations

CWD may take some time to initialize:

```text
Container starts
      ↓
Python initialization
      ↓
Load configuration
      ↓
Initialize application
      ↓
Ready
```

So I would configure a **start period/grace period** so ECS doesn't kill a task while it is still starting.

For example:

```text
start-period = 30 seconds
```

The actual value should be based on measured startup time.

---

# 8. Monitor health metrics

I would monitor:

```text
Healthy task count
Unhealthy task count
Task restart count
Container exit count
ALB 5xx
ALB target response time
Health-check failures
ECS deployment failures
CPU
Memory
```

And create CloudWatch alarms for important thresholds.

---

# 9. Health check vs monitoring

This is an important interview distinction.

### Health check

Answers:

> **“Can this instance currently serve traffic?”**

### Monitoring

Answers:

> **“What is happening across my system?”**

For example:

```text
Health check
     ↓
Task is healthy

CloudWatch
     ↓
But Bedrock latency increased
     ↓
P95 = 8 seconds
```

The container can be **healthy** while the overall system is experiencing a performance problem.

---

# 🎯 Strong interview answer

> **“I implement health checks at multiple levels. The container exposes lightweight liveness and readiness endpoints. ECS uses the container health check to determine whether the task is healthy, while the ALB uses the readiness endpoint to decide whether the task should receive traffic. I keep these checks lightweight and don't call expensive dependencies like Bedrock or Salesforce on every health check. Dependency health is monitored separately through CloudWatch and distributed tracing. If a task repeatedly fails its health check, ECS replaces it, and the ALB only routes traffic to healthy tasks.”**

## Easy memory trick

**Live → Ready → Route → Replace → Monitor**

```text
Liveness
   ↓
Readiness
   ↓
ALB routes traffic
   ↓
ECS replaces unhealthy task
   ↓
CloudWatch monitors system
```

### Key distinction

**Liveness:** “Is the process alive?”

**Readiness:** “Can I receive traffic?”

**ALB health check:** “Should I send traffic here?”

**CloudWatch monitoring:** “What is happening in the system?”
