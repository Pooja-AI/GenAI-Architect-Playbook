# How does ECS Service Auto Scaling work?

## Short answer

**ECS Service Auto Scaling automatically increases or decreases the number of running ECS tasks based on workload.**

For CWD, if traffic increases, ECS can increase the number of **Coordinator, Delegator, or Worker containers**. When traffic decreases, it can reduce them.

```text
Low traffic
   ↓
2 ECS tasks

High traffic
   ↓
6 ECS tasks
```

## Key points

1. **CloudWatch metrics** measure workload.
2. **Scaling policy** decides when to scale.
3. **ECS Service** changes desired task count.
4. ECS/Fargate starts or stops tasks.
5. **ALB** distributes traffic across healthy tasks.
6. ECS maintains the desired number of healthy tasks.

---

## CWD flow

```text
Users
  ↓
API Gateway
  ↓
ALB
  ↓
ECS Service
  ↓
┌─────────────┐
│ Coordinator │
│ Task 1      │
│ Task 2      │
│ Task 3      │
└─────────────┘
       ↓
   Delegators
       ↓
    Workers
```

Suppose we start with:

```text
Desired tasks = 2
Minimum = 2
Maximum = 10
```

Traffic increases:

```text
CPU / Request Count / Latency
           ↓
      Scaling policy
           ↓
      ECS launches
       Task 3
       Task 4
       Task 5
```

Now:

```text
2 tasks → 5 tasks
```

When traffic falls:

```text
5 tasks → 3 tasks → 2 tasks
```

ECS doesn't go below the configured minimum.

---

# 1. What triggers scaling?

Common metrics include:

### CPU utilization

Example:

```text
CPU > 70%
   ↓
Scale out
```

If CPU stays low:

```text
CPU < 30%
   ↓
Scale in
```

### Memory utilization

```text
Memory > 75%
   ↓
Scale out
```

### ALB request count

For an API service, this can be more meaningful than CPU.

```text
Requests per target increasing
          ↓
      Scale out
```

### Custom CloudWatch metrics

For CWD, custom metrics can be particularly useful:

```text
Active requests
Worker queue depth
Agent workflow count
Requests per second
MCP queue depth
Bedrock queue depth
```

---

# 2. Target tracking

One common approach is **target tracking**.

Example:

```text
Target CPU = 60%
```

If average CPU goes significantly above the target:

```text
60% → 75% → scale out
```

If it stays below the target:

```text
60% → 35% → scale in
```

ECS adjusts the desired task count automatically.

---

# 3. Step scaling

You can also define explicit thresholds.

Example:

```text
CPU < 40%       → remove 1 task
CPU 40–70%      → no change
CPU 70–85%      → add 2 tasks
CPU > 85%       → add 3 tasks
```

This gives you more explicit control.

---

# 4. CWD example

Imagine Customer Briefing traffic increases.

```text
100 users
   ↓
Coordinator
   ↓
2 Fargate tasks
```

Traffic becomes:

```text
500 users
   ↓
CPU/request count increases
   ↓
CloudWatch
   ↓
ECS Auto Scaling
   ↓
5 Fargate tasks
```

Now:

```text
             ALB
              ↓
       ┌──────┼──────┐
       ↓      ↓      ↓
      C1     C2     C3 ...
```

The ALB distributes requests across healthy tasks.

---

# 5. Important: scaling Coordinator doesn't automatically scale Workers

This is a **very important CWD interview point**.

Suppose:

```text
Coordinator
    ↓
10 Workers
```

If Coordinator scales:

```text
2 Coordinators
```

that could potentially increase Worker traffic dramatically.

For example:

```text
2 users × 10 Workers = 20 operations

100 users × 10 Workers = 1,000 operations
```

So I would implement **independent scaling and concurrency controls** for different components.

```text
Coordinator
     ↓
Delegator
     ↓
Worker concurrency limit
     ↓
MCP / Salesforce / ServiceNow / Bedrock
```

Otherwise, scaling CWD could overwhelm downstream systems.

---

# 6. Protect downstream systems

For example, Salesforce can only handle a certain amount of traffic safely.

I might configure:

```text
Worker
  ↓
Concurrency limit = 20
  ↓
Queue
  ↓
Salesforce
```

Similarly, for Bedrock:

```text
Workers
   ↓
Concurrency control
   ↓
Bedrock
```

This prevents ECS scaling from creating uncontrolled downstream fan-out.

---

# 7. Health checks

ECS should only route traffic to healthy tasks.

```text
ALB
 ↓
Health check
 ↓
Task 1 → Healthy → receive traffic
Task 2 → Healthy → receive traffic
Task 3 → Unhealthy → no traffic
```

ECS can replace unhealthy tasks.

---

# 8. Scale-out vs scale-in

### Scale-out

```text
Traffic ↑
CPU/Memory ↑
Queue ↑
Request count ↑
       ↓
Launch more tasks
```

### Scale-in

```text
Traffic ↓
CPU/Memory ↓
Queue ↓
       ↓
Stop unnecessary tasks
```

I would configure **cooldown/stabilization behavior** so the service doesn't constantly oscillate:

```text
2 → 5 → 2 → 5 → 2
```

---

# 🎯 Strong interview answer

> **“ECS Service Auto Scaling changes the desired number of running tasks based on CloudWatch metrics and scaling policies. For CWD, I could scale the Coordinator or Worker services based on CPU, memory, ALB request count, or custom metrics such as active requests or queue depth. For example, if request volume increases and the target utilization is exceeded, ECS launches additional Fargate tasks and the ALB distributes traffic across them. When demand decreases, ECS scales in within the configured minimum and maximum limits. Importantly, I would scale Coordinator, Delegator and Worker services independently and use concurrency limits and queues to protect downstream systems like Salesforce, ServiceNow and Bedrock.”**

## Easy memory trick

**Measure → Decide → Add/Remove → Load Balance**

```text
CloudWatch
    ↓
Scaling Policy
    ↓
ECS Service
    ↓
Add / Remove Tasks
    ↓
ALB
    ↓
Healthy Tasks
```

### Key distinction

**ECS Auto Scaling = number of containers/tasks**

**Lambda concurrency = number of simultaneous function executions**

**Application concurrency = how many Workers you allow to execute simultaneously**

These are related, but **they are not the same thing**.
