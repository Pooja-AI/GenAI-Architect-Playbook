## How would you reduce ECS costs?

Main idea: **don't run more compute than the workload needs.**

```text
Traffic
   ↓
ECS Auto Scaling
   ↓
Right-size CPU/Memory
   ↓
Scale down when demand drops
```

### Practical techniques

1. **Right-size CPU and memory** → don't over-provision Fargate tasks.
2. **Auto Scaling** → increase tasks during traffic and scale down during low traffic.
3. **Use Fargate Spot** → for interruptible/non-critical workloads.
4. **Optimize container startup and runtime** → reduce wasted compute.
5. **Separate workloads** → scale Coordinator, Delegator, and Workers independently.
6. **Use SQS for asynchronous Workers** → scale Workers based on queue depth.
7. **Monitor utilization** → CPU, memory, task count, and request latency.
8. **Avoid always-on services where unnecessary** → use Lambda for suitable short/event-driven workloads.

### Interview answer

> “I reduce ECS costs through right-sizing, autoscaling, workload separation, and using Spot capacity where appropriate. In CWD, I would independently scale Coordinators, Delegators, and Workers based on their workload, and use SQS queue depth for asynchronous Worker scaling. I would continuously monitor CPU, memory, task count, and latency to avoid over-provisioning.”

**Memory:**
**Right-size → Auto-scale → Separate → Spot → Monitor**
