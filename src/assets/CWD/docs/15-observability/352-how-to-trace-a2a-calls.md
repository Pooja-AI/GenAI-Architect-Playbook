## How do you trace A2A calls?

In CWD, I trace **A2A calls as distributed child spans** between the Coordinator and Delegators. This lets me follow one business request across multiple agents.

### CWD A2A flow

```text
User
 ↓
Coordinator
 ↓ A2A
Sales Delegator
 ↓
Workers

Coordinator
 ↓ A2A
IT Delegator
 ↓
Workers
```

For a Customer Briefing request:

```text
Trace ID: TR-9001
Correlation ID: CWD-5001

Coordinator
   │
   ├── A2A → Sales Delegator
   │           ├── Customer Worker
   │           └── Opportunity Worker
   │
   └── A2A → IT Delegator
               └── Incident Worker
```

### What do I capture for every A2A call?

I create an A2A span containing safe metadata:

```text
trace_id
correlation_id
task_id
parent_task_id
from_agent
to_agent
capability
timestamp
status
latency
retry_count
error_type
```

Example:

```json
{
  "trace_id": "TR-9001",
  "correlation_id": "CWD-5001",
  "task_id": "TASK-2001",
  "parent_task_id": "TASK-1000",
  "from_agent": "Coordinator",
  "to_agent": "SalesDelegator",
  "capability": "customer_briefing",
  "status": "completed",
  "latency_ms": 1250,
  "retry_count": 0
}
```

### How does distributed tracing work?

The Coordinator starts the trace:

```text
Coordinator
    │
    └── A2A span
          │
          ↓
    Sales Delegator
          │
          ├── Worker span
          └── MCP span
```

The **trace context is propagated with the A2A request**, so the Delegator continues the same distributed trace instead of creating an unrelated trace.

This gives me:

```text
TR-9001
│
├── Coordinator.process_request
│
├── A2A Coordinator → Sales Delegator
│    ├── Customer Worker
│    │    └── MCP → Salesforce
│    └── Opportunity Worker
│
├── A2A Coordinator → IT Delegator
│    └── Incident Worker
│         └── MCP → ServiceNow
│
└── Coordinator.aggregate
```

### What if an A2A call fails?

The trace tells me exactly where:

```text
Coordinator
    ↓
A2A
    ↓
Sales Delegator
    ↓
❌ Timeout
```

I capture:

```text
status       = timeout
latency_ms   = 5000
retry_count  = 2
error_type   = A2ATimeout
```

Then LangGraph can apply the appropriate workflow behavior:

```text
Transient failure
      ↓
Retry + backoff
      ↓
Still failing?
      ↓
Circuit breaker / partial result
      ↓
Checkpoint state
      ↓
Resume later if applicable
```

I **don't retry authorization failures** because they aren't transient.

### What should NOT be logged?

I don't log the entire A2A payload if it contains sensitive enterprise data.

For example:

```text
❌ access tokens
❌ passwords/secrets
❌ full confidential customer records
❌ unnecessary PII
❌ sensitive HR information
```

Instead, I log identifiers and metadata such as:

```text
task_id
customer_id/reference
capability
from_agent
to_agent
status
latency
authorization decision
```

### Tools

For the Azure CWD architecture:

```text
A2A
 ↓
OpenTelemetry
 ↓
Application Insights / Log Analytics

LLM/Agent details
 ↓
Langfuse
```

### Interview-ready answer

> **“I trace A2A calls using distributed tracing with OpenTelemetry. The Coordinator creates the initial trace, and when it sends a task to a Delegator through A2A, I propagate the trace context, correlation ID and task ID. I create an A2A span containing the source agent, destination agent, capability, status, latency, retries and errors. This allows me to trace Coordinator → A2A → Delegator → Worker → MCP → enterprise system as one end-to-end workflow. I also avoid logging sensitive A2A payloads and capture only the metadata needed for troubleshooting and auditing.”**

### Strong interview line

> **“A2A tracing lets me see the complete agent-to-agent journey—who called whom, for which task, how long it took, whether it succeeded, and where it failed.”**

**Easy memory:**
**From Agent → To Agent → Task ID → Trace ID → Status → Latency → Error**
