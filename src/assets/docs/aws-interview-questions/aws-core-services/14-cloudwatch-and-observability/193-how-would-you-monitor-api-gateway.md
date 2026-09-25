### Monitor API Gateway

Use **CloudWatch metrics + access logs**.

```text id="bq6m2v"
Client
  ↓
API Gateway
  ↓
CloudWatch
 ├── Requests
 ├── 4xx / 5xx
 ├── Latency
 ├── Integration Latency
 └── Throttling
```

Monitor:

* **Count** → request volume
* **4XXError** → client/auth/validation problems
* **5XXError** → API/backend failures
* **Latency** → total API response time
* **IntegrationLatency** → time spent communicating with backend
* **Count of throttled requests / throttling** → traffic exceeding limits

Also enable **access logs** with:

```text
requestId
correlation_id
status
latency
route
error
```

### Interview answer

> “I monitor API Gateway using CloudWatch metrics for request count, 4xx, 5xx, latency, integration latency, and throttling. I enable structured access logs with request and correlation IDs. I configure alarms for high 5xx, latency, and throttling, and use the correlation ID to trace the request into the CWD Coordinator and downstream services.”

**Memory:**
**Traffic → Errors → Latency → Throttling → Logs → Trace**
