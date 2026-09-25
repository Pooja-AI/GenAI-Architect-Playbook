## How would you implement SageMaker autoscaling?

I would use **SageMaker Endpoint Auto Scaling** to automatically increase or decrease the number of inference instances based on traffic and performance.

```text
              Traffic
                 ↓
        SageMaker Endpoint
          ↙           ↘
    Instance 1     Instance 2
          ↘           ↙
          Auto Scaling
               ↓
      Add / Remove instances
```

### Practical steps

1. Set **minimum and maximum instance count**.
2. Choose a scaling metric, such as:

   * `InvocationsPerInstance`
   * CPU/GPU utilization
   * Latency, where appropriate
3. Configure a **target value**.
4. High traffic → **scale out**.
5. Low traffic → **scale in**.
6. Monitor **P95/P99 latency, errors and throttling**.

### Example

```text
Min instances = 2
Max instances = 10
Target = 70% utilization

Traffic ↑
2 → 4 → 6 → 8 instances

Traffic ↓
8 → 6 → 4 → 2 instances
```

### Interview answer

> “I implement SageMaker autoscaling by configuring Application Auto Scaling with minimum and maximum capacity and a target metric such as invocations per instance. When traffic increases, SageMaker adds instances; when traffic decreases, it removes instances. I also monitor P95/P99 latency and errors to make sure scaling maintains the required SLA.”

**Memory:** `Set Min/Max → Choose Metric → Scale Out → Scale In → Monitor`
