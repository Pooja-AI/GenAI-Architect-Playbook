## How would you use CloudWatch?

For the **AWS version of CWD**, I would use **Amazon CloudWatch as the central monitoring and observability layer** for AWS infrastructure, application services, agents, MCP calls, LLM calls, and alerts.

### AWS CWD flow

```text
User
 ↓
API Gateway
 ↓
Coordinator
 ↓ A2A
Delegator
 ↓
Worker
 ├── RAG → OpenSearch
 ├── LLM → Amazon Bedrock
 └── MCP → Enterprise Systems
             ↓
        CloudWatch
             ↓
     Logs + Metrics + Traces
             ↓
      Dashboards + Alarms
```

### 1. Monitor infrastructure

I monitor:

```text
CPU
Memory
Lambda duration
Lambda errors
API Gateway latency
API Gateway 4xx/5xx
ECS/EKS health
DynamoDB throttling
SQS queue depth
OpenSearch health
```

For example:

```text
API Gateway P95 = 2.5 sec
Lambda Errors = 3%
SQS Queue Depth = 1,500
```

That immediately tells me whether there is an infrastructure or application problem.

---

### 2. Monitor CWD application metrics

I create custom CloudWatch metrics for Agentic AI:

```text
CoordinatorSuccessRate
DelegatorRoutingFailureRate
WorkerSuccessRate
A2AFailureRate
MCPFailureRate
TaskCompletionRate
AgentLoopCount
```

For example:

```text
Worker Success Rate
Customer Worker       99%
Opportunity Worker    96%
Incident Worker       91%  ← investigate
```

---

### 3. Monitor Bedrock / LLM usage

For Amazon Bedrock, I monitor the available model invocation telemetry and add application-level metrics for:

```text
LLM calls
Input tokens
Output tokens
Latency
Errors
Throttling
Model
Cost
```

Example:

```text
Customer Worker
 └── Bedrock
      ├── Input tokens: 8K
      ├── Output tokens: 1K
      ├── Latency: 1.2 sec
      └── Status: Success
```

This helps identify expensive or slow model calls.

---

### 4. Centralize application logs

For CWD services running on Lambda/ECS/EKS, I send structured logs to **CloudWatch Logs**.

Example:

```json id="0v7n3p"
{
  "timestamp": "...",
  "level": "ERROR",
  "correlation_id": "CWD-5001",
  "trace_id": "TR-9001",
  "worker": "IncidentWorker",
  "operation": "MCP.get_incident",
  "status": "timeout",
  "latency_ms": 5000
}
```

Then I can search logs using the correlation ID.

---

### 5. Distributed tracing

For request tracing, I use **AWS X-Ray / OpenTelemetry**, depending on the service and observability architecture.

Example:

```text
Trace TR-9001
│
├── API Gateway
├── Coordinator
├── A2A → Sales Delegator
│    └── Customer Worker
│         └── MCP → Salesforce
│
└── A2A → IT Delegator
     └── Incident Worker
          └── MCP → ServiceNow
```

This lets me identify:

> Which component caused the latency or failure?

---

### 6. Monitor MCP calls

I create custom metrics/logs for MCP:

```text
MCP call count
MCP success rate
MCP error rate
MCP latency
MCP timeout
MCP authorization denial
MCP retry count
```

Example:

```text
Salesforce MCP       98.5%
ServiceNow MCP       92.1%  ← investigate
SharePoint MCP       99.2%
```

Then I drill into the ServiceNow traces/logs.

---

### 7. Monitor A2A calls

For Coordinator → Delegator communication:

```text
A2A requests
A2A latency
A2A failures
A2A timeout
retry count
task completion
```

Example:

```text
Coordinator
    ↓ A2A
IT Delegator
    ↓
Timeout
```

CloudWatch alarm can trigger when A2A failures cross the defined threshold.

---

### 8. Create dashboards

I would create a CWD CloudWatch dashboard:

```text
┌──────────────────────────────────────┐
│ CWD Production Dashboard             │
├──────────────────────────────────────┤
│ Request Rate       │ Error Rate      │
│ P95 Latency        │ Task Completion │
├──────────────────────────────────────┤
│ Worker Success     │ A2A Failures    │
│ MCP Failures       │ MCP Latency     │
├──────────────────────────────────────┤
│ Bedrock Calls      │ Token Usage     │
│ LLM Latency        │ LLM Errors      │
├──────────────────────────────────────┤
│ SQS Queue Depth    │ Lambda Errors   │
│ DynamoDB Throttle  │ OpenSearch      │
└──────────────────────────────────────┘
```

---

### 9. Create alarms

For example:

```text
IF
Worker error rate > 5%
      ↓
CloudWatch Alarm
      ↓
SNS
      ↓
Notification / Incident workflow
```

Other alarms:

```text
P95 latency > SLA
Bedrock throttling increases
MCP failure rate increases
Lambda errors increase
SQS DLQ messages > 0
DynamoDB throttling detected
OpenSearch errors increase
```

---

### 10. Use CloudWatch for troubleshooting

Suppose CWD latency increases:

```text
End-to-end = 8 sec
```

I use the trace:

```text
Coordinator       0.5 sec
Sales Delegator   0.2 sec
Customer Worker   1.0 sec
Incident Worker   5.8 sec  ← bottleneck
```

Then:

```text
Incident Worker
 ↓
MCP
 ↓
ServiceNow
 ↓
Timeout
```

CloudWatch logs/metrics + distributed trace help me identify the root cause.

---

## CloudWatch vs Langfuse

This is important for an AWS interview.

| CloudWatch              | Langfuse            |
| ----------------------- | ------------------- |
| AWS monitoring          | GenAI observability |
| Infrastructure          | LLM/agent behavior  |
| Lambda/ECS/EKS          | LLM calls           |
| API Gateway             | Prompts             |
| SQS/DynamoDB/OpenSearch | Tokens              |
| Application logs        | LLM cost            |
| AWS alarms              | RAG/evaluation      |
| AWS service health      | Agent trajectory    |

I would **use both**, not replace one with the other.

### Interview-ready answer

> **“For the AWS version of CWD, I would use CloudWatch as the central AWS monitoring layer. I would collect application logs, infrastructure metrics, API Gateway and Lambda metrics, custom Agentic AI metrics such as Worker and MCP failure rates, task completion, latency and token usage, and create dashboards and alarms. For distributed tracing I would use AWS X-Ray or OpenTelemetry. I would use CloudWatch for the overall AWS platform and operational health, while Langfuse would provide deeper GenAI observability such as LLM traces, prompts, tokens, cost and evaluation.”**

### Strong interview line

> **“CloudWatch tells me whether my AWS platform and services are healthy; Langfuse helps me understand the behavior and quality of my GenAI system.”**

**Easy memory:**
**CloudWatch = Logs + Metrics + Alarms + AWS Health + Dashboards**
**X-Ray/OTel = Trace**
**Langfuse = LLM + Agent + Evaluation**
