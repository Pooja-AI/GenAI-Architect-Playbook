## What is distributed tracing?

**Distributed tracing is a way to follow one request as it travels across multiple services, agents, and systems.**

In CWD, one user request crosses:

```text
User
 ↓
Coordinator
 ↓ A2A
Delegator
 ↓
Worker
 ↓ MCP
Enterprise System
 ↓
LLM / Response
```

Distributed tracing lets me see **the complete execution path, timing, and failures**.

### CWD example

User asks:

> “Give me a Customer Briefing for C12345.”

I create a trace:

```text
Trace ID: TR-9001

TR-9001
│
├── Coordinator.process_request       500 ms
│
├── A2A → Sales Delegator             200 ms
│   ├── Customer Worker               900 ms
│   │   └── MCP → Salesforce          700 ms
│   └── Opportunity Worker           1200 ms
│       └── MCP → Salesforce          900 ms
│
├── A2A → IT Delegator                200 ms
│   └── Incident Worker
│       └── MCP → ServiceNow         1500 ms
│
└── Coordinator.aggregate             300 ms
```

Each operation is represented by a **span**.

```text
Trace
 ├── Coordinator span
 ├── Delegator span
 ├── Worker span
 ├── MCP span
 └── Salesforce/ServiceNow span
```

The spans are connected using the same trace context.

### Why is this useful?

Suppose total latency is **5 seconds**.

Without distributed tracing:

```text
Request = 5 sec
```

I know it is slow, but not why.

With distributed tracing:

```text
Coordinator       0.5 sec
Sales Delegator   0.2 sec
Customer Worker   0.9 sec
Salesforce MCP    0.7 sec
IT Worker         1.2 sec
ServiceNow MCP    1.5 sec  ← bottleneck
```

Now I can identify the problem.

It also helps answer:

* Which Delegator failed?
* Which Worker failed?
* Which MCP tool was slow?
* Which downstream system timed out?
* Where did retries happen?
* Where did the workflow spend most of its time?
* Which LLM call caused the latency?

### Correlation ID vs distributed tracing

**Correlation ID** is the identifier used to associate a business workflow.

**Distributed tracing** is the mechanism that shows the detailed execution path.

```text
Correlation ID
     ↓
CWD-5001
     ↓
Distributed Trace
     ↓
Coordinator
   → Delegator
      → Worker
         → MCP
            → Salesforce
```

### CWD implementation

I would use:

```text
CWD
 ↓
OpenTelemetry
 ↓
Trace + Spans
 ↓
Application Insights / Log Analytics
```

For GenAI-specific information:

```text
Langfuse
 ↓
LLM calls
Prompts/version
Tokens
Latency
Agent steps
Evaluation
```

I also propagate the trace context across **A2A and MCP boundaries** so the downstream operations remain connected to the original request.

### Important security point

I don't put sensitive prompts, secrets, access tokens, passwords, or unnecessary HR/customer data into traces.

I log safe metadata such as:

```text
trace_id
correlation_id
task_id
agent_name
tool_name
status
latency
error_type
```

### Interview-ready answer

> **“Distributed tracing allows me to follow one request across multiple distributed components using a trace ID and connected spans. In CWD, I trace the request from Coordinator → A2A → Delegator → Worker → MCP → Salesforce or ServiceNow and back to the Coordinator. Each operation creates a span containing timing, status, and safe metadata. I use OpenTelemetry with Application Insights and Log Analytics to visualize the complete request path and identify latency bottlenecks, failures, retries, and downstream issues.”**

### Strong interview line

> **“Distributed tracing gives me the complete story of one request, not just isolated logs from individual services.”**
