## How would you optimize inference latency?

I would first identify **where the latency is coming from**, then optimize that layer.

```text id="8m48q4"
Worker
  ↓
Network
  ↓
SageMaker Endpoint
  ↓
Model Inference
  ↓
Response
```

### Practical techniques

* Measure **P50/P95/P99 latency**.
* Use the right **instance type** and GPU when beneficial.
* **Optimize the model** — smaller model, quantization, optimized inference.
* Keep Worker and SageMaker endpoint in the **same AWS Region/VPC**.
* Use **warm/provisioned capacity** to reduce cold starts where applicable.
* Enable **autoscaling** for traffic spikes.
* Use **connection reuse/keep-alive** from the Worker.
* Avoid unnecessary preprocessing/postprocessing.
* Set appropriate **timeouts**.

### Interview answer

> “I first break down P50, P95, and P99 latency into network, preprocessing, model inference, and postprocessing. Then I optimize the bottleneck by right-sizing the instance, using GPU or model optimization where appropriate, keeping services close to each other, maintaining warm capacity, and using autoscaling. I continuously monitor P95 and P99 to verify the improvement.”

**Memory:** `Measure → Find Bottleneck → Optimize Model → Right-size → Warm → Scale → Monitor`
