## How would you use Azure Application Insights?

In the **Azure version of CWD**, I would use **Azure Application Insights as the main application-performance and distributed-tracing layer**.

It helps me answer:

> **Is CWD healthy, where is it slow, where is it failing, and which dependency caused the problem?**

### CWD flow

```text id="8d9j3m"
User
 ↓
APIM / FastAPI
 ↓
Coordinator
 ↓ A2A
Delegator
 ↓
Worker
 ├── RAG → Azure AI Search
 ├── LLM → Azure OpenAI
 └── MCP → Salesforce / ServiceNow
             ↓
      Application Insights
             ↓
      Logs + Metrics + Traces
             ↓
       Dashboard + Alerts
```

## 1. Track end-to-end requests

I instrument the CWD API and propagate:

```text id="4x6m2a"
trace_id
correlation_id
task_id
```

Example:

```text id="0s4f8k"
CWD-5001
   ↓
FastAPI
   ↓
Coordinator
   ↓
Sales Delegator
   ↓
Customer Worker
   ↓
MCP → Salesforce
```

Application Insights lets me follow that request across the application and its dependencies.

---

## 2. Monitor latency

I track:

```text id="9h7q2c"
API latency
Coordinator latency
A2A latency
Worker latency
RAG latency
LLM latency
MCP latency
Dependency latency
```

And especially:

```text id="5p8k1r"
P50
P95
P99
```

Example:

```text
Customer Worker       0.8 sec
Incident Worker       4.5 sec
MCP → ServiceNow      3.2 sec  ← bottleneck
```

So I can drill down instead of simply saying "CWD is slow."

---

## 3. Monitor errors

I track:

```text id="m2q8vx"
HTTP 4xx / 5xx
Exceptions
Timeouts
Dependency failures
A2A failures
Worker failures
MCP failures
Rate-limit errors
```

Example:

```text
ServiceNow MCP
   ↓
Timeout
   ↓
Worker failure
   ↓
Partial workflow
```

The trace and exception telemetry help identify the failure path.

---

## 4. Monitor dependencies

This is one of the most useful features for CWD.

I monitor dependencies such as:

```text id="r4n6pk"
Azure OpenAI
Azure AI Search
Cosmos DB
Redis
Service Bus
Key Vault
Salesforce
ServiceNow
SharePoint
```

For each dependency I care about:

```text
Request count
Success/failure
Latency
Timeouts
Dependency errors
```

For example:

```text id="v7c1mz"
CWD
 ↓
Incident Worker
 ↓
ServiceNow
 ├── Requests: 10,000
 ├── Failures: 320
 └── P95: 3.8 sec
```

That immediately identifies ServiceNow as a dependency to investigate.

---

## 5. Create custom CWD metrics

Application Insights isn't limited to infrastructure metrics.

I would publish custom business/agent metrics such as:

```text id="3k8z0w"
TaskCompletionRate
WorkerSuccessRate
A2AFailureRate
MCPFailureRate
RoutingFailureRate
RAGEmptyResultRate
LLMErrorRate
AgentLoopCount
```

For example:

```text id="q9v3yd"
Task Completion = 97.2%
MCP Success     = 98.8%
Worker Success  = 97.9%
```

---

## 6. Correlate logs with traces

I use structured logging with:

```text id="9g5t2w"
correlation_id
trace_id
task_id
worker
operation
status
latency
error_type
```

Example:

```json id="b4n8zc"
{
  "correlation_id": "CWD-5001",
  "trace_id": "TR-9001",
  "worker": "IncidentWorker",
  "operation": "MCP.get_incident",
  "status": "timeout",
  "latency_ms": 5000
}
```

Then I can search Application Insights/Log Analytics using `CWD-5001` and reconstruct the request.

---

## 7. Monitor Azure OpenAI calls

I track LLM-related telemetry such as:

```text id="2v5j8s"
Model
Model version
Token usage
Latency
Request count
Failures
Throttling
```

For deeper GenAI telemetry, I would complement Application Insights with **Langfuse**.

So:

```text
Application Insights
     ↓
Azure application + dependency health

Langfuse
     ↓
LLM + agent + evaluation details
```

---

## 8. Create alerts

For example:

```text id="7n1x4k"
IF
CWD P95 latency > SLA
       ↓
Application Insights Alert
       ↓
Notification / Incident response
```

Other alerts:

```text
Worker error rate > threshold
MCP failure rate > threshold
Azure OpenAI failures increase
Azure AI Search latency increases
Dependency timeout increases
Task completion rate decreases
```

---

## 9. Production troubleshooting example

Suppose users report:

> "Customer Briefing is taking too long."

I start with Application Insights:

```text id="s8y4rm"
End-to-end P95 = 8 sec
```

I open the distributed trace:

```text
FastAPI              0.2 sec
Coordinator          0.5 sec
Sales Delegator      0.2 sec
Customer Worker      1.2 sec
Incident Worker      5.5 sec
```

Then drill into Incident Worker:

```text
RAG                  0.4 sec
Azure OpenAI         0.8 sec
MCP                   4.3 sec
       ↓
ServiceNow            4.0 sec
```

Now I know the primary bottleneck is the **ServiceNow dependency**, rather than the LLM.

---

## Application Insights vs Log Analytics vs Langfuse

| Tool                     | Main purpose                                                        |
| ------------------------ | ------------------------------------------------------------------- |
| **Application Insights** | Application performance, requests, dependencies, exceptions, traces |
| **Log Analytics**        | Query and analyze centralized Azure logs/telemetry                  |
| **OpenTelemetry**        | Instrumentation and distributed trace standard                      |
| **Langfuse**             | LLM/agent traces, tokens, cost, prompts and evaluation              |
| **Azure Monitor**        | Broader Azure monitoring and alerting platform                      |

### Interview-ready answer

> **“In CWD, I use Azure Application Insights for application performance monitoring and distributed tracing. I instrument the API, Coordinator, Delegators, Workers and dependencies so I can track requests using correlation and trace IDs. I monitor P50/P95/P99 latency, exceptions, HTTP errors, dependency failures, Azure OpenAI calls, Azure AI Search, Cosmos DB, Service Bus and MCP-related operations. I also publish custom CWD metrics such as Worker success rate, MCP failure rate and task completion rate. When a request is slow or fails, I use the distributed trace to identify the exact bottleneck. For deeper LLM and agent evaluation, I complement Application Insights with Langfuse.”**

### Strong interview line

> **“Application Insights gives me the operational view of CWD—from API request to downstream dependency—while Langfuse gives me the deeper AI-specific view.”**

**Easy memory:**
**Application Insights = Requests + Dependencies + Exceptions + Latency + Traces + Alerts**
