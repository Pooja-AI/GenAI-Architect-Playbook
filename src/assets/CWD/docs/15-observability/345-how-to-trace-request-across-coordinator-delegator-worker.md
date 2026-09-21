## How do you trace a request across Coordinator → Delegator → Worker?

I use **distributed tracing with OpenTelemetry**, plus a **correlation ID** and **task IDs** to follow one business request across the entire CWD workflow.

### 1. Start with a Trace ID

When the user sends:

> “Give me a Customer Briefing for C12345.”

I create:

```text
trace_id       = TR-9001
correlation_id = CWD-5001
```

The **trace ID** connects the technical operations, while the **correlation ID** identifies the business workflow.

---

### 2. Coordinator creates the first span

```text id="x6c3hj"
Trace: TR-9001
│
└── Coordinator.process_request
      │
      ├── intent = CustomerBriefing
      ├── customer_id = C12345
      └── correlation_id = CWD-5001
```

The Coordinator creates a span with metadata such as:

```text
trace_id
span_id
correlation_id
tenant_id
user_id
agent_name
intent
timestamp
```

Sensitive prompt/data should be **redacted or excluded** from telemetry.

---

### 3. Trace Coordinator → Delegator

Suppose the Coordinator selects the Sales Delegator.

```text id="j3o3c0"
Coordinator
     │
     └── A2A
          ↓
     Sales Delegator
```

I propagate the tracing context through the A2A request.

```text
task_id        = TASK-1001
parent_task_id = null
trace_id       = TR-9001
```

The Delegator creates its own span:

```text id="w9cb6r"
TR-9001
│
├── Coordinator
│
└── A2A → SalesDelegator
      └── SalesDelegator.execute_task
```

---

### 4. Trace Delegator → Worker

The Sales Delegator may invoke two Workers:

```text id="l5i5y9"
Sales Delegator
    ├── Customer Worker
    └── Opportunity Worker
```

Each gets a child span:

```text id="d7u3l2"
TR-9001
│
├── Coordinator
│
├── SalesDelegator
│
├── CustomerWorker
│
└── OpportunityWorker
```

For example:

```text
CustomerWorker
task_id = TASK-1002
parent_task_id = TASK-1001
```

---

### 5. Continue tracing into MCP

The Worker then calls MCP:

```text id="p9jv8n"
Customer Worker
      ↓
MCP Client
      ↓
MCP Server
      ↓
Salesforce
```

The trace continues:

```text id="2zq3xk"
TR-9001
│
├── Coordinator
├── Sales Delegator
├── Customer Worker
│    └── MCP.get_customer
│          └── Salesforce API
└── Opportunity Worker
     └── MCP.get_opportunities
```

This lets me determine whether the delay happened in the Worker, MCP, or Salesforce.

---

## 6. Example complete trace

For a CWD Customer Briefing:

```text id="k8z3pu"
Trace ID: TR-9001
Correlation ID: CWD-5001
│
├── Coordinator.process_request       500 ms
│
├── A2A → Sales Delegator             200 ms
│   └── SalesDelegator.execute_task
│       ├── Customer Worker           900 ms
│       │   └── MCP → Salesforce     700 ms
│       │
│       └── Opportunity Worker       1200 ms
│           └── MCP → Salesforce     900 ms
│
├── A2A → IT Delegator                200 ms
│   └── Incident Worker
│       └── MCP → ServiceNow         1.5 sec
│
└── Coordinator.aggregate             300 ms
```

Now I can answer:

> **Where did this request spend its time?**

Instead of simply seeing:

```text
Total latency = 4.8 sec
```

I can see the entire execution path.

---

## 7. What do I put in each span?

Typical attributes:

```python
span.set_attributes({
    "trace_id": trace_id,
    "correlation_id": correlation_id,
    "task_id": task_id,
    "agent_name": "CustomerWorker",
    "agent_type": "worker",
    "operation": "get_customer",
    "tenant_id": tenant_id,
    "status": "success"
})
```

I **do not put secrets, access tokens, passwords, or unnecessary confidential business data into traces**.

---

## 8. Tools

For CWD, I would use:

```text id="m9i7q0"
CWD
 ↓
OpenTelemetry
 ↓
Distributed Traces
 ↓
Application Insights / Log Analytics
```

And for GenAI-specific tracing:

```text id="u0b2w7"
CWD
 ↓
Langfuse
 ↓
LLM calls
Prompts/version
Tokens
Latency
Agent steps
Evaluations
```

---

## Trace ID vs Correlation ID vs Task ID

This is a good interview distinction:

| ID                 | Purpose                                      |
| ------------------ | -------------------------------------------- |
| **Trace ID**       | Connects technical spans across the request  |
| **Correlation ID** | Identifies the overall CWD business workflow |
| **Task ID**        | Identifies an individual agent task          |
| **Span ID**        | Identifies one operation                     |

Example:

```text id="q3a0z9"
Trace:        TR-9001
Correlation:  CWD-5001

Coordinator
   ↓
Task: TASK-1001 → Sales Delegator
   ↓
Task: TASK-1002 → Customer Worker
   ↓
Span: SPAN-301 → MCP.get_customer
```

### Interview-ready answer

> **“I use distributed tracing with OpenTelemetry. When a CWD request enters the Coordinator, I create a trace and correlation ID. The Coordinator creates spans for intent processing and propagates the trace context through A2A to the Delegator. The Delegator creates child spans for each Worker, and the Worker continues the same trace through MCP to Salesforce or ServiceNow. Each operation has its own span and task ID, while the overall trace ID connects everything. This gives me an end-to-end view of the request and lets me identify whether latency or failure occurred in the Coordinator, A2A, Delegator, Worker, MCP, downstream system, or LLM.”**

**Strong interview line:**

> **“One business request should produce one trace that lets me follow the complete agent trajectory from Coordinator to Delegator to Worker to enterprise tool.”**
