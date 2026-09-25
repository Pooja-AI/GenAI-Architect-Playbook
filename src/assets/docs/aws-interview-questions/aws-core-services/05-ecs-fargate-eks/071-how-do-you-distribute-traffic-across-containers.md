# How do you distribute traffic across containers?

## Short answer

For CWD on **ECS/Fargate**, I would use an **Application Load Balancer (ALB)** to distribute incoming traffic across healthy ECS tasks.

```text
User
 ↓
API Gateway
 ↓
ALB
 ↓
┌────────────┬────────────┬────────────┐
↓            ↓            ↓
CWD Task 1   CWD Task 2   CWD Task 3
```

The ALB continuously checks task health and sends traffic only to **healthy containers**.

---

## CWD flow

```text
                    Users
                      ↓
                 API Gateway
                      ↓
                     ALB
                      ↓
          ┌───────────┼───────────┐
          ↓           ↓           ↓
      Fargate-1   Fargate-2   Fargate-3
          ↓           ↓           ↓
      Coordinator  Coordinator  Coordinator
          ↓           ↓           ↓
       Delegators  Delegators  Delegators
```

All three containers can run the same CWD application version.

---

# 1. Register ECS tasks with ALB

When ECS starts a task, it registers the task's IP/port with the ALB target group.

For example:

```text
Target Group

10.0.1.10:8000 → Healthy
10.0.1.11:8000 → Healthy
10.0.1.12:8000 → Healthy
```

The ALB can then route requests to these targets.

---

# 2. ALB performs health checks

For example:

```text
GET /health/ready
```

Suppose:

```text
Task 1 → 200 → Healthy
Task 2 → 200 → Healthy
Task 3 → 503 → Unhealthy
```

The ALB stops sending normal traffic to Task 3.

```text
             ALB
              ↓
       ┌──────┴──────┐
       ↓             ↓
    Task 1         Task 2
    Healthy        Healthy

    Task 3
    Unhealthy
       ✗
```

---

# 3. How does ALB choose a container?

For a typical ALB target group, traffic is distributed among healthy targets using the configured load-balancing behavior, commonly **round robin**.

Conceptually:

```text
Request 1 → Task 1
Request 2 → Task 2
Request 3 → Task 3
Request 4 → Task 1
...
```

But the important point is that **only healthy registered targets are eligible**.

---

# 4. ECS Auto Scaling adds/removes containers

Suppose we initially have:

```text
2 tasks
```

Traffic increases:

```text
CloudWatch
    ↓
ECS Auto Scaling
    ↓
4 tasks
```

The new tasks become healthy and are registered with the ALB.

```text
ALB
 ↓
┌────┬────┬────┬────┐
T1   T2   T3   T4
```

Traffic is then distributed across the healthy tasks.

---

# 5. What happens when a container fails?

Suppose:

```text
Task 2 → crashes
```

The ALB health check detects the failure.

```text
Task 2 → unhealthy
          ↓
ALB stops traffic
          ↓
ECS replaces task
          ↓
New Task 5
          ↓
Health check passes
          ↓
ALB adds Task 5
```

So users don't need to know that an individual container failed.

---

# 6. CWD-specific consideration: don't blindly distribute everything

This is important for your CWD architecture.

If Coordinator containers are stateless:

```text
Request
   ↓
ALB
   ↓
Coordinator 1 / 2 / 3
```

that's straightforward.

But **workflow state should not depend on a particular container**.

Instead:

```text
Coordinator 1 ─┐
Coordinator 2 ─┼──→ DynamoDB
Coordinator 3 ─┘
```

And:

```text
Coordinator 1 ─┐
Coordinator 2 ─┼──→ Redis
Coordinator 3 ─┘
```

This means another container can continue processing when necessary.

---

# 7. What about Delegators and Workers?

They can also be independently load balanced.

For example:

```text
Sales Delegator
       ↓
   ALB / Service
       ↓
┌──────┼──────┐
↓      ↓      ↓
W1     W2     W3
```

If Workers are exposed as internal services, I would use **internal load balancing/service discovery** rather than exposing them publicly.

For example:

```text
Coordinator
    ↓
Sales Delegator
    ↓
Internal service
    ↓
Customer Worker
    ↓
MCP
    ↓
Salesforce
```

---

# 8. Don't use load balancing to solve downstream overload

Suppose I have:

```text
10 CWD containers
   ↓
100 Workers
   ↓
Salesforce
```

Adding more containers can actually increase downstream pressure.

So I also need:

```text
CWD
 ↓
Concurrency limits
 ↓
Queue / backpressure
 ↓
Salesforce
```

Similarly:

```text
Workers
 ↓
Concurrency control
 ↓
Bedrock
```

This protects downstream systems from uncontrolled agent fan-out.

---

# 9. Monitor traffic distribution

I would monitor:

* ALB request count
* Target response time
* Healthy/unhealthy targets
* HTTP 4xx/5xx
* Connection errors
* ECS task count
* CPU/memory
* P50/P95/P99 latency
* Request distribution
* Downstream MCP/Bedrock latency

For troubleshooting:

```text
ALB = 100 ms
CWD = 200 ms
MCP = 2 seconds
Salesforce = 3 seconds
```

The bottleneck is likely downstream rather than the ALB.

---

# 🎯 Strong interview answer

> **“For CWD running on ECS/Fargate, I would place an Application Load Balancer in front of the ECS service. ECS registers healthy tasks with the ALB target group, and the ALB distributes requests across those healthy containers. Health checks remove unhealthy tasks from rotation, while ECS Service Auto Scaling adds or removes tasks based on workload. I would keep the Coordinator stateless and store workflow state in DynamoDB or Redis so any healthy container can process a request. For Delegators and Workers, I can use internal load balancing or service discovery, while concurrency controls protect downstream systems such as Salesforce, ServiceNow and Bedrock.”**

## Easy memory trick

**Register → Health Check → Route → Scale → Replace**

```text
ECS Tasks
   ↓
Target Group
   ↓
ALB
   ↓
Healthy containers
   ↓
Traffic
```

### Key distinction

**ALB → distributes traffic**

**ECS Auto Scaling → changes number of containers**

**Health checks → decide which containers can receive traffic**

**DynamoDB/Redis → keep state outside containers**

**Concurrency limits/queues → protect downstream systems**
