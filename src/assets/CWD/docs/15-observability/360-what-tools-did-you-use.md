## What tools did you use?

For **CWD observability and error monitoring**, I used a combination of **Azure monitoring, distributed tracing, and GenAI-specific observability**.

### Main tools

| Area                | Tool                                 | What I used it for                                                      |
| ------------------- | ------------------------------------ | ----------------------------------------------------------------------- |
| Distributed tracing | **OpenTelemetry**                    | Trace Coordinator → Delegator → Worker → MCP → downstream               |
| Azure monitoring    | **Application Insights**             | Request, dependency, exception, latency and availability monitoring     |
| Logs                | **Azure Log Analytics**              | Centralized structured logs and troubleshooting                         |
| GenAI observability | **Langfuse**                         | LLM calls, tokens, latency, prompts, agent traces, cost and evaluations |
| API gateway         | **Azure APIM**                       | API latency, failures, throttling, request metrics                      |
| Workflow            | **LangGraph**                        | Agent/workflow state, retries, checkpoints and execution flow           |
| MCP                 | **MCP Server/Client telemetry**      | Tool calls, authorization, latency, failures                            |
| A2A                 | **OpenTelemetry + application logs** | Agent-to-agent task tracing and failures                                |

### How they work together

```text id="v1p6jd"
                   CWD
                    │
             OpenTelemetry
                    │
          Distributed Trace
                    │
      ┌─────────────┴─────────────┐
      ↓                           ↓
Application Insights          Langfuse
      ↓                           ↓
API / Worker / MCP          LLM / Agent
latency/errors              tokens/cost/quality
      │
      ↓
Log Analytics
      │
      ↓
Search + Dashboards + Alerts
```

### Example

Suppose a Customer Briefing request takes **8 seconds**.

I start with Application Insights:

```text id="0qz0cq"
Request = 8 sec
```

Then open the distributed trace:

```text id="u9w7pg"
Coordinator       0.5 sec
Sales Delegator   0.2 sec
Customer Worker   6.8 sec
MCP Salesforce    5.2 sec  ← bottleneck
LLM               1.0 sec
```

Then Langfuse helps me inspect the LLM portion:

```text id="r5z2ja"
Model: GPT-...
Input tokens: 8,200
Output tokens: 1,100
Latency: 1 sec
Cost: ...
```

So I can distinguish:

> **Is the problem the LLM, Worker, MCP, or Salesforce?**

### Interview-ready answer

> **“For CWD, I used OpenTelemetry for distributed tracing, Application Insights and Log Analytics for Azure application monitoring and troubleshooting, and Langfuse for GenAI-specific observability such as LLM traces, token usage, latency, cost and evaluations. Application Insights helps me understand the health and dependencies of the application, while Langfuse gives me deeper visibility into LLM and agent behavior. Together, they allow me to trace a request from Coordinator → Delegator → Worker → MCP → enterprise system and identify the actual failure or latency bottleneck.”**

### Easy memory

**OpenTelemetry = Trace**
**Application Insights = Monitor**
**Log Analytics = Investigate**
**Langfuse = LLM/Agent observability**
**APIM = API monitoring**
