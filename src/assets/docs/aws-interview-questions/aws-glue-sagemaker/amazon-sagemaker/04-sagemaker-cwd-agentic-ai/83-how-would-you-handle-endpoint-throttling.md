## How would you handle SageMaker endpoint throttling?

Throttling means the endpoint **cannot accept/process requests at the current rate**.

```text
Worker
  ↓
SageMaker Endpoint
  ↓
Throttling
  ↓
Rate Limit / Queue
  ↓
Retry with Backoff
  ↓
Scale Endpoint
```

### Practical approach

1. **Detect throttling** using CloudWatch metrics/errors.
2. **Limit concurrency** from Workers so we don't overload the endpoint.
3. Use **exponential backoff + jitter** for transient failures.
4. **Autoscale** the endpoint when sustained traffic increases.
5. Put requests into **SQS** when asynchronous processing is acceptable.
6. Use **timeouts + bounded retries**.
7. Send persistent failures to a **DLQ**.
8. If sustained capacity is insufficient, review **endpoint instance capacity/service quotas**.

### Interview answer

> “I handle SageMaker throttling by first detecting it through CloudWatch. I control Worker concurrency, use bounded retries with exponential backoff and jitter, and autoscale the endpoint based on traffic. For workloads that don't require synchronous responses, I use SQS to buffer requests. Persistent failures go to a DLQ rather than continuously retrying.”

**Memory:** `Detect → Limit → Backoff → Scale → Queue → DLQ`
