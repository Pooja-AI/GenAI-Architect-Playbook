## How would you handle SageMaker inference latency?

I would first **measure P50/P95/P99 latency**, then optimize based on the bottleneck.

```text
Worker
  ↓
SageMaker Endpoint
  ↓
Monitor P50/P95/P99
  ↓
High latency?
  ↓
Optimize
```

### Practical techniques

* **Right-size the instance** based on benchmarking.
* Use **GPU instances** when the model benefits from GPU acceleration.
* Enable **autoscaling** for traffic spikes.
* Use **Provisioned Concurrency / warm capacity** where applicable to reduce cold-start effects.
* Keep the Worker and SageMaker endpoint in the **same AWS Region/VPC** to reduce network latency.
* Optimize the model: quantization, smaller model, batching where appropriate.
* Set **timeouts** and use bounded retries for transient failures.
* Monitor with **CloudWatch**.

### Interview answer

> “I first measure P50, P95 and P99 inference latency. If latency is high, I check whether the bottleneck is model execution, instance capacity, cold starts, or network overhead. Then I right-size or scale the endpoint, optimize the model, keep the Worker and endpoint close geographically, and use appropriate warm capacity. I continuously monitor P95/P99 and set latency-based alarms.”

**Memory:** `Measure → Find Bottleneck → Optimize Model → Right-size → Scale → Monitor`
