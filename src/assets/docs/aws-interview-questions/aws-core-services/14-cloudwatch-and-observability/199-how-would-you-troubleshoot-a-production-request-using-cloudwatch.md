### Troubleshoot a production request using CloudWatch

I would start with the **correlation ID** and trace the request end-to-end.

```text id="v2k7pa"
Correlation ID
      ↓
CloudWatch Logs
      ↓
Find ERROR / latency
      ↓
CloudWatch Metrics
      ↓
X-Ray / OpenTelemetry Trace
      ↓
Identify failing service
      ↓
Fix / Rollback / Retry
```

### Step-by-step

1. **Get the `correlation_id`** from the failed request.
2. Search **CloudWatch Logs** for that ID.
3. Check the request path:

   ```text
   API Gateway
      → Coordinator
      → Delegator
      → Worker
      → MCP
      → Bedrock / OpenSearch / DynamoDB
   ```
4. Check **P95/P99 latency, 4xx/5xx, throttling, CPU/memory, queue depth**.
5. Use **X-Ray/OpenTelemetry** to find which service or downstream call is slow/failing.
6. Check the specific service logs and error stack trace.
7. Apply the appropriate action: **retry, scale, fix configuration, or rollback**.

### Interview answer

> “For a production issue, I first get the correlation ID and search CloudWatch Logs to reconstruct the request path. Then I check CloudWatch metrics for errors, latency, throttling, and resource utilization. I use X-Ray or OpenTelemetry to identify the slow or failing component. Finally, I inspect that service's logs and take the appropriate action such as retry, scaling, configuration correction, or rollback.”

**Memory:**
**Correlation ID → Logs → Metrics → Trace → Root Cause → Action**
