## How do you trace LLM calls?

In CWD, I use **distributed tracing + LLM observability** so I can trace an LLM call back to the original business request.

### CWD flow

```text
User
 ↓
Coordinator
 ↓ A2A
Delegator
 ↓
Worker
 ↓
LLM Call
 ↓
Response
```

I propagate a common **trace ID / correlation ID** through every layer.

```text
Correlation ID: CWD-5001
Trace ID: TR-9001

Coordinator
   └── Sales Delegator
        └── Customer Worker
             ├── RAG Retrieval
             ├── LLM Call #1
             └── MCP → Salesforce
```

### What I capture for each LLM call

```text
trace_id
correlation_id
task_id
agent_name
worker_name
model
model_version
prompt_version
timestamp
input_tokens
output_tokens
latency
finish_reason
status
error_type
retry_count
```

For example:

```json
{
  "trace_id": "TR-9001",
  "correlation_id": "CWD-5001",
  "worker": "CustomerWorker",
  "model": "GPT-4.x",
  "prompt_version": "customer-summary-v3",
  "input_tokens": 2450,
  "output_tokens": 520,
  "latency_ms": 1850,
  "status": "success"
}
```

### What tools do I use?

For the Azure CWD architecture:

* **OpenTelemetry** → distributed traces
* **Application Insights / Log Analytics** → infrastructure and application telemetry
* **Langfuse** → LLM/agent traces, prompts/versioning, token usage, latency, cost and evaluation

The important point is that the LLM span becomes a **child span of the Worker operation**.

```text
Trace TR-9001
│
├── Coordinator
│
├── Sales Delegator
│
└── Customer Worker
     │
     ├── RAG Search
     │
     ├── LLM Call
     │    ├── model
     │    ├── tokens
     │    ├── latency
     │    └── status
     │
     └── MCP → Salesforce
```

### What about prompts and responses?

I **do not blindly log full prompts or responses**, because they may contain confidential enterprise data.

Instead, I log:

```text
prompt_version
model
token counts
latency
status
response validation status
```

If prompt/response capture is required for evaluation or debugging, I apply **redaction, access control, encryption, and retention policies**.

### Interview-ready answer

> **“I trace LLM calls as part of the distributed CWD trace. I propagate the trace ID and correlation ID from the Coordinator through the Delegator and Worker into the LLM call. For each LLM span, I capture the model and version, prompt version, token usage, latency, status, errors and retry information. We use OpenTelemetry with Application Insights for distributed tracing and Langfuse for LLM-specific observability and evaluation. I avoid logging sensitive prompts or responses and use redaction when they need to be captured.”**

**Easy memory:**
**Trace ID → Agent → Worker → LLM → Model + Tokens + Latency + Status → Response**
