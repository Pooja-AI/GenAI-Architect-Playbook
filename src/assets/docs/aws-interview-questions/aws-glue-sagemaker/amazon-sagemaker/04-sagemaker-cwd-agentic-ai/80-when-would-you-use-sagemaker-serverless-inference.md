## When would you use SageMaker Serverless Inference?

I would use it when **traffic is intermittent or unpredictable** and I don't want to keep dedicated endpoint instances running continuously.

```text
Request
   ↓
SageMaker Serverless
   ↓
Model
   ↓
Response
```

### Good use cases

* Low or irregular traffic
* Development/testing environments
* Infrequent ML predictions
* Cost-sensitive workloads
* Models that don't require consistently low latency

### Avoid it when

* High, steady traffic
* Strict low-latency SLA
* Frequent requests where cold-start latency matters

### CWD example

For an **infrequently used specialized ML Worker**, Serverless Inference could be appropriate. For a heavily used **real-time intent classifier**, I would generally use a provisioned/autoscaled endpoint instead.

### Interview answer

> “I use SageMaker Serverless Inference when traffic is intermittent and I want to avoid paying for continuously running endpoint instances. It is suitable for low-volume or unpredictable workloads, but I would avoid it for high-throughput or strict low-latency workloads because cold-start latency can be a concern.”

**Memory:** `Low/Irregular Traffic → Serverless | High/Consistent Traffic → Provisioned + Auto Scaling`
