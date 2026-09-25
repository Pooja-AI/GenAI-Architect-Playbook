## How would you implement CWD monitoring using CloudWatch?

I would use **CloudWatch for infrastructure, application, and operational monitoring**, with correlation IDs to trace a CWD request.

```text
User
 ↓
API Gateway
 ↓
Coordinator → Delegator → Worker
 ↓
AWS Services
 ↓
CloudWatch
 ├── Metrics
 ├── Logs
 ├── Alarms
 └── Dashboards
```

### 1. Metrics

Monitor:

* **API** — request count, 4xx/5xx, latency
* **ECS** — CPU, memory, task count, restarts
* **SQS** — queue depth, message age, DLQ messages
* **Lambda** — errors, duration, throttles
* **DynamoDB** — throttling, latency, consumed capacity
* **OpenSearch** — search latency, indexing failures, throttling
* **Bedrock** — invocation errors, throttling, latency

### 2. Application logs

Each CWD service writes structured logs:

```text id="v6j8tr"
correlation_id
run_id
worker_id
status
latency
error
```

Example:

```text id="1xk5ms"
run_id=R123
worker=CustomerWorker
status=FAILED
error=ServiceNow timeout
```

### 3. Alarms

Create CloudWatch alarms for important conditions:

```text id="z4s8q1"
P95 latency > threshold
5xx errors > threshold
ECS CPU > threshold
SQS backlog > threshold
DLQ messages > 0
Worker failures > threshold
```

Then notify through SNS/on-call systems.

### 4. Dashboards

Create a CWD dashboard showing:

```text id="3jv5cp"
Request Rate
Error Rate
P50/P95/P99
ECS Health
Queue Depth
Worker Failures
Bedrock Latency
OpenSearch Latency
```

### 5. End-to-end tracing

For a request:

```text id="h2c8mz"
Correlation ID: C123

API Gateway
   ↓
Coordinator
   ↓
Sales Delegator
   ↓
Customer Worker
   ↓
Salesforce
```

Use **CloudWatch + X-Ray/OpenTelemetry** to understand where latency or failure occurred.

### 🎯 Strong interview answer

> **“I would use CloudWatch to monitor CWD at infrastructure and application levels. I would collect ECS, Lambda, SQS, DynamoDB, OpenSearch, and Bedrock metrics, centralize structured application logs with correlation IDs, create alarms for latency, errors, throttling, queue backlog and unhealthy tasks, and build dashboards for P50/P95/P99 latency, throughput and failures. For end-to-end troubleshooting, I would combine CloudWatch with distributed tracing.”**

**Memory:**
**Metrics → Logs → Alarms → Dashboard → Trace**
