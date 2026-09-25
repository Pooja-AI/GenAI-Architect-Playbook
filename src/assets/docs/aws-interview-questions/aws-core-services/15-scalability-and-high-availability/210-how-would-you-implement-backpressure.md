## How would you implement backpressure?

**Backpressure means controlling incoming work when downstream systems cannot process it fast enough.**

```text id="v4m8qa"
Traffic Spike
     ↓
API Gateway
     ↓
SQS Queue  ← Buffer
     ↓
Worker Pool
     ↓
Bedrock / Salesforce / ServiceNow
     ↑
Concurrency Limit
```

### In CWD

1. **SQS** buffers incoming work.
2. **Limit Worker concurrency** so downstream systems aren't overwhelmed.
3. **ECS Auto Scaling** adds Workers when queue depth increases.
4. **Rate limiting** controls requests entering the system.
5. **Retry + exponential backoff + jitter** for transient failures.
6. **Circuit breaker** stops calls to an unhealthy downstream service.
7. **DLQ** captures messages that repeatedly fail.
8. **CloudWatch alarms** monitor queue depth and oldest message age.

### Example

If Bedrock can currently handle only a certain request rate:

```text id="s2k6wp"
10,000 requests
      ↓
     SQS
      ↓
Controlled Workers
      ↓
Bedrock
```

Instead of sending all 10,000 requests to Bedrock immediately, SQS absorbs the spike and Workers process them at a controlled rate.

### Interview answer

> “I would implement backpressure using SQS as a buffer, controlled Worker concurrency, API throttling, and autoscaling based on queue depth. If downstream services start throttling, I would reduce concurrency and use exponential backoff with jitter. Circuit breakers and DLQs would protect the system from sustained downstream failures.”

**Memory:**
**Buffer → Limit → Queue → Scale → Backoff → Protect**
