## Handle Bedrock rate limits

When Bedrock returns **429 / throttling**, don't immediately retry aggressively. Use **queueing + controlled concurrency + backoff**.

```text id="c7m2qx"
CWD Worker
    ↓
Concurrency Limit
    ↓
SQS Queue
    ↓
Bedrock
    ↓
429?
 ┌──┴─────────────┐
 ↓                ↓
Retry + Jitter   Model Fallback
```

### Approach

1. **Detect 429/throttling** from Bedrock.
2. **Limit concurrency** so Workers don't send too many requests simultaneously.
3. **Buffer requests in SQS** during traffic spikes.
4. **Retry with exponential backoff + jitter**.
5. **Use maximum retry limits** to avoid retry storms.
6. **DLQ failed messages** after retries are exhausted.
7. **Model routing** — route suitable workloads to another available model where appropriate.
8. Monitor **throttling, latency, queue depth, and invocation errors** in CloudWatch.
9. If sustained, review/request **higher Bedrock quotas**.

### Interview answer

> “For Bedrock rate limits, I first detect 429 throttling and control concurrency at the Worker layer. I use SQS to buffer traffic and exponential backoff with jitter for transient throttling. I limit retries to avoid a retry storm and send exhausted requests to a DLQ. For sustained demand, I can use model routing and request higher service quotas.”

**Memory:**
**Detect 429 → Limit → Queue → Backoff → Retry → Fallback → Monitor**
