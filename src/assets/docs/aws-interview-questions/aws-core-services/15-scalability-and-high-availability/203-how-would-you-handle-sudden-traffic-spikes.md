## Handle sudden traffic spikes

Use **buffering + autoscaling + backpressure**.

```text id="s8v3kd"
Traffic Spike
     ↓
API Gateway
     ↓
Rate Limit / Throttle
     ↓
ECS Auto Scaling
     ↓
SQS Buffer
     ↓
Controlled Workers
     ↓
Bedrock / MCP / Enterprise Systems
```

### What I would do

1. **API Gateway throttling** — prevent uncontrolled traffic.
2. **ECS Auto Scaling** — add Coordinator/Delegator/Worker tasks.
3. **SQS** — buffer asynchronous requests instead of overwhelming Workers.
4. **Concurrency limits** — protect Bedrock, Salesforce, ServiceNow, etc.
5. **Retry with exponential backoff + jitter** for transient failures.
6. **Circuit breaker** — temporarily stop calls to an unhealthy downstream service.
7. **Redis caching** — serve repeated requests without unnecessary LLM/RAG calls.
8. **CloudWatch alarms** — monitor queue depth, P95/P99 latency, 429s, errors, and CPU/memory.

### Interview answer

> “For sudden traffic spikes, I would use API throttling, ECS horizontal autoscaling, and SQS buffering. I would control Worker concurrency so downstream systems aren't overwhelmed. For transient failures I would use exponential backoff with jitter, and circuit breakers for unhealthy dependencies. CloudWatch would monitor queue depth, latency, errors, throttling, and resource utilization.”

**Memory:**
**Throttle → Scale → Buffer → Control → Retry → Protect**
