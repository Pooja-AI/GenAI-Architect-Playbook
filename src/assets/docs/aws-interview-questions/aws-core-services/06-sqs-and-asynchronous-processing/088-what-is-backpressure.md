# What is Backpressure?

**Backpressure means slowing down incoming work when the downstream system cannot process work fast enough.**

In simple words:

> **“Don't send more work than the system can handle.”**

### CWD example

Suppose CWD receives **1,000 requests/sec**, but Workers can process only **300 requests/sec**.

Without backpressure:

```text
1000 req/sec
     ↓
Workers
     ↓
Overload
     ↓
Timeouts / 429 / failures
```

With backpressure:

```text
1000 req/sec
     ↓
     SQS
     ↓
Queue builds gradually
     ↓
Workers process at safe rate
     ↓
Salesforce / ServiceNow protected
```

### How do you implement it?

Common mechanisms:

1. **SQS queue** → buffer incoming work
2. **Concurrency limits** → limit Worker parallelism
3. **Rate limiting** → control request rate
4. **ECS Auto Scaling** → add Workers when workload increases
5. **Circuit breaker** → stop calling an unhealthy downstream service
6. **Retries with backoff** → avoid retry storms
7. **Load shedding** → reject/defer non-critical work when overloaded

### CWD example

```text
Delegator
    ↓
   SQS
    ↓
Worker concurrency = 10
    ↓
ServiceNow
```

If ServiceNow starts returning **429**, don't increase Workers from 10 → 100.

Instead:

```text
429 detected
    ↓
Reduce concurrency
    ↓
Queue requests in SQS
    ↓
Retry with backoff + jitter
    ↓
Resume gradually
```

### 🎯 Strong interview answer

> **“Backpressure is a mechanism to prevent downstream overload when incoming traffic is higher than processing capacity. In CWD, I can use SQS to buffer work, control Worker concurrency, apply rate limits, and use retries with exponential backoff. If Salesforce, ServiceNow, or Bedrock becomes slow or throttled, I slow down processing instead of continuously sending more requests.”**

**Memory trick:**
**Too much work → Slow down → Buffer → Process safely**

**Key distinction:**
**Auto scaling increases capacity; backpressure controls the rate of work entering the system.**
