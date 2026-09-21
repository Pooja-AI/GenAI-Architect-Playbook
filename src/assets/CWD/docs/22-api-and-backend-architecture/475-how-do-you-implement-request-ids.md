## How do you implement Request IDs in CWD?

In CWD, I generate a **unique `request_id` for every incoming API request** and propagate it through the entire workflow.

This gives me **end-to-end traceability** when debugging an Agentic AI workflow.

### CWD flow

```text
Client
  ↓
APIM
  ↓
FastAPI
  ↓
request_id = REQ-12345
  ↓
Coordinator
  ↓
Delegator
  ↓
Worker
  ↓
MCP
  ↓
Salesforce / ServiceNow / Snowflake
```

Every component logs the same request ID.

---

## 1. Generate the Request ID

At the FastAPI boundary, I either:

* accept a trusted incoming request ID, or
* generate a new UUID if one isn't provided.

For example:

```python
import uuid

request_id = str(uuid.uuid4())
```

Example:

```text
REQ = 7f8a9c21-...
```

For security, I don't treat an arbitrary client-supplied ID as proof of identity. It is only a **correlation value**.

---

## 2. Add it to the request context

I attach it to the workflow context:

```python
context = {
    "request_id": request_id,
    "user_id": user.id,
    "tenant_id": user.tenant_id
}
```

Then the Coordinator receives it.

```python
result = await coordinator.run(
    request=request,
    context=context
)
```

---

## 3. Propagate it through CWD

The same ID flows through:

```text
Coordinator
    ↓
Delegator
    ↓
Worker
    ↓
MCP Client
    ↓
MCP Server
    ↓
Enterprise API
```

For example:

```json
{
  "request_id": "REQ-12345",
  "workflow_id": "WF-1001",
  "task_id": "TASK-2001",
  "worker_id": "customer_worker"
}
```

---

## 4. Don't use only one ID

For a production Agentic AI system, I prefer **multiple levels of identifiers**.

```text
request_id
   ↓
workflow_id
   ↓
task_id
   ↓
run_id
   ↓
step_id
```

Example:

```text
Request
REQ-12345

Workflow
WF-1001

Sales Task
TASK-2001

Worker Run
RUN-3001

MCP Step
STEP-4001
```

This gives me both **business-level correlation** and **fine-grained debugging**.

---

## 5. Example Customer Briefing

User requests:

> "Give me a briefing for C12345."

FastAPI creates:

```text
request_id = REQ-100
workflow_id = WF-500
```

Coordinator creates:

```text
Sales task    = TASK-1
Incident task = TASK-2
```

Then:

```text
TASK-1
 ↓
Customer Worker
 ↓
MCP
 ↓
Salesforce
```

and:

```text
TASK-2
 ↓
Incident Worker
 ↓
MCP
 ↓
ServiceNow
```

All of them contain:

```text
request_id = REQ-100
workflow_id = WF-500
```

So if ServiceNow fails, I can search:

```text
request_id = REQ-100
```

and reconstruct the complete workflow.

---

## 6. Add IDs to logs

For example:

```python
logger.info(
    "MCP call started",
    extra={
        "request_id": request_id,
        "workflow_id": workflow_id,
        "task_id": task_id,
        "worker_id": "incident_worker",
        "tool": "get_open_incidents"
    }
)
```

Then my observability platform can correlate the events.

```text
REQ-100
 ├── Coordinator started
 ├── Sales Delegator started
 ├── Customer Worker started
 ├── Salesforce MCP call
 ├── Incident Worker started
 ├── ServiceNow MCP call
 ├── ServiceNow timeout
 └── Partial result returned
```

---

## 7. Use distributed tracing as well

Request IDs are useful, but for production troubleshooting I also use **distributed tracing / OpenTelemetry**.

```text
request_id
     +
trace_id
     +
span_id
```

For example:

```text
Trace
 └── Coordinator span
      ├── A2A span
      ├── Sales Worker span
      │    └── MCP span
      │         └── Salesforce span
      └── Incident Worker span
           └── MCP span
                └── ServiceNow span
```

This allows me to identify **where latency or failure occurred**, not just which request failed.

---

## 8. Don't put sensitive information in the ID

I would **not** create IDs like:

```text
REQ-C12345-POOJA-USER123
```

Instead:

```text
REQ-7f8a9c21-...
```

The ID should be opaque and non-sensitive.

I also don't put tokens, passwords, or confidential payloads into logs.

---

## Interview-ready answer

> **“I generate a unique request ID at the API boundary and propagate it through the entire CWD workflow—from FastAPI to Coordinator, Delegator, Worker, MCP, and downstream enterprise systems. For deeper traceability, I use hierarchical identifiers such as request ID, workflow ID, task ID, run ID, and step ID, and correlate them with OpenTelemetry trace and span IDs. Every component logs these IDs so that if a workflow fails or becomes slow, I can reconstruct the complete execution path. The IDs are opaque and contain no sensitive information.”**

### Easy memory

**Generate → Propagate → Log → Trace → Debug**

```text
Request
  ↓
Workflow
  ↓
Task
  ↓
Run
  ↓
Step
```

**Strong interview line:**

> **“A request ID tells me which business request an event belongs to; distributed tracing tells me where that request spent time or failed.”**
