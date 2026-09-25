# How would you scale ECS?

## Short answer
Scale ECS with Service Auto Scaling and fast, right-sized tasks.

## Key points
- Target tracking on CPU, memory, ALB requests per target, or SQS backlog per task; scheduled scaling for known peaks.
- Small images and warm minimum capacity to speed scale-out; check Fargate task quotas.
- Spread across AZs; Fargate Spot for non-critical work.

## CWD context
Scale Workers on backlog, the API on request count.
## How would you scale ECS?

ECS scales by **adding or removing tasks** based on workload.

```text id="r6k2wp"
Traffic
   ↓
ALB
   ↓
ECS Service
 ┌─────┬─────┬─────┐
 ↓     ↓     ↓
Task  Task  Task
 └─────┴─────┴─────┘
       ↑
   Auto Scaling
```

### How I would do it

* **ECS Service Auto Scaling** → adjusts desired task count.
* **CPU/Memory scaling** → add tasks when resource utilization is high.
* **ALB RequestCountPerTarget** → scale based on incoming traffic.
* **P95/P99 latency** → scale when response time increases.
* **SQS queue depth** → scale Workers based on backlog.
* **Min/Max task count** → prevent over/under-scaling.
* Deploy tasks across **multiple AZs** for availability.
* Use **Fargate** so AWS manages the underlying servers.

### CWD example

```text id="y4n8tc"
Coordinator → scale on request rate / latency
Delegator   → scale on workload
Worker      → scale on SQS queue depth
```

This is important: **don't scale every CWD component using the same metric.**

### Interview answer

> “I would use ECS Service Auto Scaling to increase or decrease Fargate task count. For Coordinators I would use request rate, CPU, and P95 latency. For Workers, I would primarily use SQS queue depth and message age. I would define minimum and maximum task counts and deploy across multiple AZs.”

**Memory:**
**Measure → Add Tasks → Load Balance → Monitor → Remove Tasks**
