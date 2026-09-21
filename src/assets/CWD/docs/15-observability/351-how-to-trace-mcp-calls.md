## How do you trace MCP calls?

In CWD, I trace every MCP call as a **child span of the Worker execution**, so I can follow the request from the user all the way to Salesforce, ServiceNow, SharePoint, etc.

### CWD MCP trace flow

```text
User
 ↓
Coordinator
 ↓ A2A
Delegator
 ↓
Worker
 ↓
MCP Client
 ↓
MCP Server
 ↓
Enterprise Tool/API
 ↓
Salesforce / ServiceNow / SharePoint
```

For example, Customer Briefing:

```text
Trace ID: TR-9001
Correlation ID: CWD-5001

Coordinator
  └── Sales Delegator
       └── Customer Worker
            └── MCP Client
                 └── MCP Server
                      └── get_customer()
                           └── Salesforce
```

### What do I capture for each MCP call?

I create an MCP span with metadata such as:

```text
trace_id
correlation_id
task_id
worker_id
mcp_server
tool_name
tool_version
resource/customer reference
authorization_decision
request_id
start_time
latency
status
retry_count
error_type
```

Example:

```json id="7f3x2m"
{
  "trace_id": "TR-9001",
  "correlation_id": "CWD-5001",
  "task_id": "TASK-1002",
  "worker": "CustomerWorker",
  "mcp_server": "SalesforceMCP",
  "tool": "get_customer",
  "customer_id": "C12345",
  "authorization": "allowed",
  "status": "success",
  "latency_ms": 820,
  "retry_count": 0
}
```

### How does distributed tracing work?

The Worker creates a span:

```text
CustomerWorker
      │
      └── MCP.get_customer
             │
             └── Salesforce API
```

The same **trace context** is propagated through the MCP boundary where supported by the implementation.

So if Salesforce fails, I can search:

```text
TR-9001
   ↓
Coordinator
   ↓
Sales Delegator
   ↓
Customer Worker
   ↓
MCP get_customer
   ↓
Salesforce → 500
```

This lets me identify whether the failure was in:

* Worker logic
* MCP client
* MCP server
* authorization
* parameter validation
* Salesforce API
* network
* timeout

### What about MCP request parameters?

I **don't blindly log the complete MCP request**.

For example:

```text
❌ Don't log:
password
access_token
API key
full confidential Salesforce record
```

Instead:

```text
tool = get_customer
customer_id = C12345
status = success
latency = 820ms
```

Sensitive values are masked/redacted where necessary.

### How do you trace MCP failures?

Example:

```text
Worker
  ↓
MCP Server
  ↓
Salesforce
  ↓
Timeout
```

The trace shows:

```text
MCP status       = timeout
latency          = 5000 ms
retryable        = true
retry_count      = 1
```

Then the Worker can apply:

```text
Transient error → Retry with backoff
Repeated failure → Circuit breaker
Persistent failure → Partial failure / fallback
State-changing operation → Idempotency protection
```

### Tools I would use

For the Azure CWD implementation:

```text
OpenTelemetry
      ↓
Application Insights / Log Analytics
      ↓
Distributed trace

Langfuse
      ↓
LLM + Agent + MCP/tool observability
```

### Interview-ready answer

> **“I trace MCP calls as child spans of the Worker execution using OpenTelemetry. I propagate the trace ID, correlation ID and task ID through the CWD workflow and capture the MCP server, tool name, authorization decision, latency, status, retry count and error information. This allows me to trace a request from Coordinator → Delegator → Worker → MCP Client → MCP Server → Salesforce or ServiceNow and quickly identify where the failure or latency occurred. I don't log secrets or full sensitive tool payloads; I log safe metadata and apply masking or redaction.”**

### Strong interview line

> **“For MCP, I want to answer not only ‘Did the tool fail?’ but ‘Which Worker called which MCP tool, for which workflow, was it authorized, how long did it take, and what downstream dependency caused the failure?’”**

**Easy memory:**
**Worker → MCP Client → MCP Server → Tool → Trace ID + Tool + Auth + Latency + Status + Error**
