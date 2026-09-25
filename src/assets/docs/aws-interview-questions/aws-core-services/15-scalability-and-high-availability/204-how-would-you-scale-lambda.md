# How would you scale Lambda?

## Short answer
Lambda scales by adding concurrent execution environments, within account and function limits.

## Key points
- Scaling rate per function; regional concurrency quota (raisable).
- Reserved concurrency to protect or cap; provisioned concurrency for predictable peaks.
- SQS maximum concurrency and batch sizes to protect downstream systems.

## CWD context
Cap Lambda so it cannot overwhelm MCP servers or Bedrock.
## How would you scale Lambda?

Lambda scales **automatically by increasing concurrent executions** as requests/events increase.

```text id="q9m4tx"
More Requests
     ↓
Lambda
     ↓
More Concurrent Executions
     ↓
Automatic Scaling
```

### In CWD

For example:

```text id="v6k2pa"
S3 / SQS / EventBridge
        ↓
      Lambda
        ↓
  Concurrent executions
```

Key controls:

* **Reserved Concurrency** → limits Lambda concurrency and protects downstream systems.
* **Provisioned Concurrency** → keeps execution environments warm and reduces cold-start latency.
* **SQS event-source scaling** → Lambda increases consumers as queue backlog grows.
* **Dead Letter Queue / SQS DLQ** → handles repeatedly failed events.
* **CloudWatch alarms** → monitor errors, throttles, duration, and concurrency.

### Interview answer

> “Lambda scales automatically by increasing concurrent executions. I use Reserved Concurrency to protect downstream systems and Provisioned Concurrency when low latency is important. For SQS-triggered Lambda, I scale consumers based on queue backlog while controlling concurrency. I monitor errors, throttles, duration, and concurrency through CloudWatch.”

**Memory:**
**Lambda = Automatic Concurrency → Limit → Warm → Monitor**
