## How would you scale SageMaker endpoints?

I would use **horizontal scaling + autoscaling** based on traffic and latency.

```text
Workers
   ↓
SageMaker Endpoint
   ↓
Multiple Instances
 ┌─────┬─────┬─────┐
 │  1  │  2  │  3  │
 └─────┴─────┴─────┘
        ↓
   Auto Scaling
```

### Practical approach

* Set **min/max instance count**.
* Configure **target tracking** based on invocation rate or utilization.
* During traffic increase → SageMaker adds instances.
* During low traffic → removes instances.
* Monitor **P95/P99 latency, invocation count, CPU/GPU utilization, errors and throttling**.
* For sudden spikes, use appropriate capacity/warm instances to avoid scaling delay.
* For expensive models, use **multiple model variants/endpoints** when different models have different traffic patterns.

### Interview answer

> “I scale SageMaker endpoints horizontally using multiple instances behind the endpoint and configure autoscaling with minimum and maximum capacity. I use metrics such as invocation rate, instance utilization and P95 latency to trigger scaling. During high traffic, additional instances are added; during low traffic, capacity is reduced. I continuously monitor latency, errors and throttling to make sure scaling meets the SLA.”

**Memory:** `Traffic ↑ → Instances ↑ → Latency Controlled → Traffic ↓ → Instances ↓`
