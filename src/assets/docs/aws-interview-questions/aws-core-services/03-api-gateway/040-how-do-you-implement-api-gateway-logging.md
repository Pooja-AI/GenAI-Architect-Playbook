# How do you implement API Gateway logging?

## Short answer

I enable **API Gateway access logs and execution logs**, send them to **Amazon CloudWatch Logs**, and use **correlation IDs** so I can trace a request across the entire CWD workflow.

```text
Client
   ↓
API Gateway
   ↓
CloudWatch Logs
   ↓
CWD API
   ↓
Coordinator → Delegator → Worker
   ↓
MCP / Bedrock / RAG
```

## Key points

1. **Enable access logging**
2. **Enable execution logging where appropriate**
3. Send logs to **CloudWatch Logs**
4. Add **request/correlation IDs**
5. Log HTTP method, route, status, latency, request ID
6. Don't log passwords, tokens, secrets, or sensitive customer data
7. Create CloudWatch metrics/alarms
8. Correlate API Gateway logs with CWD application logs

---

## 1. Enable API Gateway access logs

I configure an API Gateway **stage** with a CloudWatch Logs destination and structured JSON log format.

For example:

```json
{
  "requestId": "$context.requestId",
  "route": "$context.routeKey",
  "status": "$context.status",
  "latency": "$context.responseLatency",
  "integrationLatency": "$context.integrationLatency",
  "sourceIp": "$context.identity.sourceIp"
}
```

This gives me a searchable request record.

---

## 2. Track correlation ID

For CWD, this is extremely important.

```text
API Gateway
    ↓
request_id / correlation_id
    ↓
CWD API
    ↓
Coordinator
    ↓
Delegator
    ↓
Worker
    ↓
MCP / Bedrock
```

Example:

```text
correlation_id = abc-123
```

I use the same correlation ID throughout the workflow.

Then I can search CloudWatch and answer:

> What happened to request `abc-123`?

---

## 3. Don't log sensitive information

I **do not log**:

```text
Authorization headers
JWT tokens
API keys
Passwords
Secrets
Full sensitive customer data
```

For example, instead of:

```text
Authorization: Bearer eyJhbGci...
```

I log:

```text
auth_result: SUCCESS
user_id: masked/approved identifier
```

Sensitive request/response fields should be masked or excluded.

---

## 4. Monitor important metrics

From the logs and API Gateway metrics, I monitor:

| Metric              | Why                     |
| ------------------- | ----------------------- |
| Request count       | Traffic                 |
| 4xx                 | Client/request problems |
| 5xx                 | Server problems         |
| Latency             | Performance             |
| Integration latency | Backend performance     |
| 429                 | Throttling              |
| Error rate          | Reliability             |

I particularly monitor **P50/P95/P99 latency** for CWD APIs.

---

## 5. Create CloudWatch alarms

For example:

```text
429 rate ↑
     ↓
CloudWatch Alarm
     ↓
Investigate throttling
```

Or:

```text
5xx > threshold
     ↓
CloudWatch Alarm
     ↓
Check CWD / ECS / downstream services
```

---

## 6. Connect API Gateway logs with CWD logs

Example:

```text
API Gateway
correlation_id = ABC123
       ↓
FastAPI
correlation_id = ABC123
       ↓
Coordinator
run_id = R456
       ↓
Sales Delegator
       ↓
Salesforce Worker
       ↓
MCP call
```

Now I have end-to-end traceability:

```text
API request
 → CWD workflow
 → Worker
 → MCP
 → Enterprise system
```

For deeper tracing, I can use **AWS X-Ray or OpenTelemetry** alongside CloudWatch.

---

## Example

Suppose the user calls:

```text
POST /api/v1/customer-briefing
```

API Gateway logs:

```json
{
  "requestId": "req-123",
  "route": "POST /api/v1/customer-briefing",
  "status": 200,
  "latency": 4200
}
```

CWD logs:

```text
correlation_id=req-123
run_id=R789
coordinator=SUCCESS
sales_worker=SUCCESS
service_worker=SUCCESS
bedrock_latency=1800ms
```

Now I can identify where the 4.2-second request time was spent.

---

## 🎯 Strong interview answer

> **“I implement API Gateway logging by enabling access logs at the API stage and sending structured logs to CloudWatch Logs. I capture request ID, route, status code, latency, integration latency and source information, while making sure not to log tokens, secrets or sensitive customer data. I propagate a correlation ID from API Gateway through the CWD Coordinator, Delegators, Workers, MCP calls and Bedrock calls. I then use CloudWatch metrics, dashboards and alarms, with X-Ray or OpenTelemetry for distributed tracing, to troubleshoot latency, 4xx, 5xx and throttling issues.”**

## Easy memory trick

**L → C → M → A**

* **L**og → CloudWatch
* **C**orrelate → request/correlation ID
* **M**onitor → latency/errors/429
* **A**lert → CloudWatch alarms

### Key distinction

**API Gateway logs** → API boundary

**CloudWatch Logs** → centralized log storage/search

**CloudWatch Metrics** → monitoring and alarms

**X-Ray/OpenTelemetry** → distributed tracing

**Application logs** → Coordinator/Delegator/Worker details

**Interview line:**

> **“I don't just log API requests; I correlate them end-to-end so I can trace one CWD request from API Gateway to the final Worker and downstream tool call.”**
