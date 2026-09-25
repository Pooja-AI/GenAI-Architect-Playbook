### Monitor Bedrock

Use **CloudWatch + application logs/traces**.

```text id="xj7p3k"
CWD Worker
    ↓
  Bedrock
    ↓
CloudWatch
 ├── Invocations
 ├── Errors
 ├── Throttling
 ├── Latency
 └── Token/Cost
```

Monitor:

* **Invocation count** → model usage
* **Invocation errors** → failed model calls
* **Throttling / 429s** → capacity or rate-limit problems
* **Latency** → model response time
* **Input/output tokens** → token consumption and cost
* **Model-specific usage** → which models are consuming traffic

Also log:

```text id="f7q2nc"
correlation_id
model_id
worker_id
latency
input_tokens
output_tokens
status
error
```

### Interview answer

> “I monitor Bedrock for invocation volume, errors, throttling, latency, and token consumption. I combine CloudWatch metrics with application logs and distributed tracing using the correlation ID. If I see throttling, I can reduce concurrency, queue requests, retry with backoff, or route to another model where appropriate.”

**Memory:**
**Usage → Errors → Throttling → Latency → Tokens → Cost**
