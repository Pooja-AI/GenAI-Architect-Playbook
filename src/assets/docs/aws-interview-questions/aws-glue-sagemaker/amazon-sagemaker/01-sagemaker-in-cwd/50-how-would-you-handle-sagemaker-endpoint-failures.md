## How would you handle SageMaker endpoint failures?

I would handle them with **retry, fallback, health checks, and rollback**.

```text
ML Worker
   ↓
SageMaker Endpoint
   ↓
Failure?
 ┌──────────────┐
 │              │
Retry        Persistent
 │              ↓
Backoff      Fallback
 │              ↓
Success?    Error/DLQ
                ↓
             Alert
```

### Practical approach

1. **Detect** – CloudWatch alarms on errors, latency, throttling.
2. **Retry** – transient failures with exponential backoff + jitter.
3. **Timeout** – don't let the Worker wait indefinitely.
4. **Fallback** – use another model/endpoint or rule-based classification if appropriate.
5. **Circuit breaker** – temporarily stop calling an unhealthy endpoint.
6. **Scale** – increase endpoint capacity if the problem is traffic-related.
7. **Rollback** – if a new model version caused failures, route traffic back to the previous version.
8. **Alert** – CloudWatch → SNS/incident system.

### CWD example

```text
Worker
  ↓
SageMaker v2
  ↓ failure
Retry → Retry
  ↓
Still failing
  ↓
SageMaker v1 / fallback
  ↓
Continue CWD workflow
```

### Interview answer

> “I would first detect the failure through CloudWatch, then distinguish transient failures from persistent failures. For transient errors, I use bounded retries with exponential backoff and jitter. For persistent failures, I use a circuit breaker and fallback model or endpoint where appropriate. If the issue is caused by a new model version, I roll back to the previous version and alert the operations team.”
