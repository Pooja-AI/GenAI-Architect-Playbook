# How do you monitor API Gateway?

## Short answer

I monitor API Gateway using **CloudWatch metrics, access logs, dashboards, alarms, and distributed tracing**.

For CWD, I focus on **traffic, errors, throttling, latency, and integration health**, and correlate API Gateway requests with the downstream CWD workflow.

## Key points

1. **Traffic** – How many requests are coming in?
2. **Errors** – 4xx and 5xx rates
3. **Throttling** – 429 responses
4. **Latency** – P50/P95/P99
5. **Integration latency** – How long CWD backend takes
6. **Logs** – CloudWatch access/execution logs
7. **Alarms** – Alert when thresholds are exceeded
8. **Tracing** – Follow request into CWD

### CWD monitoring flow

```text
User
 ↓
API Gateway
 ↓
CloudWatch Metrics
 ↓
CloudWatch Logs
 ↓
CWD API
 ↓
Coordinator
 ↓
Delegator
 ↓
Worker
 ↓
MCP / Bedrock / RAG
```

---

## 1. Monitor request volume

I monitor the number of API requests.

```text
Requests
   ↓
CloudWatch
   ↓
Normal traffic?
   ↓
Sudden spike?
```

For example, if normal traffic is 100 requests/minute and suddenly becomes 10,000 requests/minute, I investigate possible abuse or an upstream application problem.

---

## 2. Monitor 4xx errors

4xx generally indicates a client-side/request problem.

Examples:

```text
400 → Bad request
401 → Authentication failure
403 → Authorization failure
429 → Too many requests
```

For CWD, a sudden increase in 401/403 could indicate authentication or authorization problems.

A spike in 429 indicates throttling.

---

## 3. Monitor 5xx errors

5xx indicates a server-side/integration problem.

For example:

```text
API Gateway
    ↓
CWD ECS service
    ↓
Service unavailable
    ↓
5xx
```

I investigate:

* ECS/Fargate health
* CWD application errors
* Network problems
* Downstream failures
* Configuration issues

---

## 4. Monitor throttling

I monitor **429 responses** and API Gateway throttling metrics.

```text
Traffic spike
     ↓
API Gateway rate limit
     ↓
429
     ↓
CloudWatch alarm
```

This helps prevent excessive traffic from reaching CWD and ultimately Bedrock/MCP.

---

## 5. Monitor latency

I monitor:

```text
P50
P95
P99
```

For example:

```text
P50 = 500 ms
P95 = 2 sec
P99 = 5 sec
```

If P99 suddenly increases, I investigate whether the bottleneck is:

```text
API Gateway
      ↓
CWD API
      ↓
Coordinator
      ↓
Worker
      ↓
MCP / Bedrock
```

---

## 6. Monitor integration latency

This is especially useful for CWD.

I separate:

```text
API Gateway latency
        +
Backend integration latency
```

For example:

```text
Total API latency       = 4 sec
Integration latency     = 3.7 sec
```

This tells me that most of the delay is probably in the CWD backend rather than the API Gateway layer.

---

## 7. Use CloudWatch dashboards

I create a dashboard containing:

```text
Request count
4xx
5xx
429
P50/P95/P99 latency
Integration latency
Error rate
```

For CWD I can correlate this with:

```text
Bedrock latency
MCP latency
Worker failures
LLM token usage
CWD workflow latency
```

---

## 8. Configure alarms

Examples:

```text
5xx > threshold
        ↓
CloudWatch Alarm
```

```text
429 > threshold
        ↓
CloudWatch Alarm
```

```text
P95 latency > SLA
        ↓
CloudWatch Alarm
```

```text
Request volume abnormal
        ↓
CloudWatch Alarm
```

This allows the team to investigate problems before they become widespread.

---

## 9. Distributed tracing

For deeper troubleshooting, I use **AWS X-Ray or OpenTelemetry**.

Example:

```text
API Gateway
   ↓ 200ms
CWD API
   ↓ 300ms
Coordinator
   ↓
Sales Worker
   ↓ 800ms
MCP
   ↓ 1.2s
Salesforce
```

Now I can identify which component is contributing most to latency.

---

## Example

Suppose users report:

> "Customer Briefing is slow."

I check:

```text
API Gateway
   ↓
P95 = 5 sec
```

Then tracing shows:

```text
API Gateway       = 100 ms
CWD API           = 200 ms
Coordinator       = 100 ms
Salesforce MCP    = 3 sec
Bedrock           = 1.5 sec
```

Now I know the problem isn't simply "API Gateway is slow." The major latency is downstream.

---

## 🎯 Strong interview answer

> **“I monitor API Gateway primarily through CloudWatch metrics, structured access logs, dashboards and alarms. I track request volume, 4xx and 5xx errors, 429 throttling, P50/P95/P99 latency and integration latency. For CWD, I propagate correlation IDs and use X-Ray or OpenTelemetry to trace the request from API Gateway through the Coordinator, Delegators, Workers, MCP and Bedrock. If latency or errors increase, this helps me determine whether the issue is at the API boundary or in a downstream dependency.”**

## Easy memory trick

**T → E → T → L → T → A**

* **T**raffic
* **E**rrors
* **T**hrottling
* **L**atency
* **T**racing
* **A**lerts

### Key distinction

| What I monitor          | Tool                       |
| ----------------------- | -------------------------- |
| Request count           | CloudWatch Metrics         |
| 4xx / 5xx / 429         | CloudWatch Metrics         |
| Request details         | CloudWatch Logs            |
| P50/P95/P99             | CloudWatch Metrics         |
| Alerts                  | CloudWatch Alarms          |
| End-to-end request path | X-Ray / OpenTelemetry      |
| CWD Worker/LLM details  | Application logs + tracing |

**Interview line:**

> **“CloudWatch tells me that there is a problem; distributed tracing helps me identify where the problem is.”**
