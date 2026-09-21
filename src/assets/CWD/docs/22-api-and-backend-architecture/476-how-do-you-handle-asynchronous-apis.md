## How do you handle asynchronous APIs in CWD?

In CWD, I use **asynchronous APIs for long-running or multi-step Agentic AI workflows**, especially when the Coordinator needs to execute multiple Workers, MCP calls, or enterprise-system calls.

The key idea is: **don't keep the HTTP request open while a long workflow runs.**

### CWD flow

```text
Client
  ↓
POST /api/v1/customer-briefing
  ↓
FastAPI
  ↓
Create workflow
  ↓
Queue / Background execution
  ↓
Return 202 Accepted
       +
workflow_id
       
Client
  ↓
GET /api/v1/workflows/{workflow_id}
  ↓
Workflow Status
```

---

## 1. Synchronous vs asynchronous

### Synchronous

The client waits for the entire workflow:

```text
Request
  ↓
Coordinator
  ↓
Workers
  ↓
MCP
  ↓
Enterprise systems
  ↓
Final response
  ↓
Client
```

This is fine for short operations.

### Asynchronous

For longer workflows:

```text
Request
  ↓
Create workflow
  ↓
202 Accepted
  ↓
workflow_id returned

Background
  ↓
Coordinator
  ↓
Delegators
  ↓
Workers
  ↓
MCP
  ↓
Enterprise systems
```

The client doesn't need to wait.

---

## 2. Return `202 Accepted`

For example:

```http
POST /api/v1/customer-briefing
```

Response:

```json
{
  "workflow_id": "WF-1001",
  "status": "QUEUED"
}
```

HTTP status:

```text
202 Accepted
```

This means:

> "I accepted your request, but processing is still in progress."

---

## 3. Use a queue for durable execution

For CWD on Azure, I can use **Azure Service Bus**.

```text
FastAPI
   ↓
Service Bus
   ↓
Coordinator Worker
   ↓
LangGraph
   ↓
Delegators
   ↓
Workers
```

The queue gives me:

* buffering during traffic spikes
* retries
* dead-letter queues
* durable message delivery
* backpressure
* decoupling between API and workflow execution

---

## 4. Persist workflow state

Because the API request has already returned, I need durable workflow state.

For example:

```json
{
  "workflow_id": "WF-1001",
  "status": "RUNNING",
  "customer_id": "C12345",
  "completed_tasks": [
    "customer_worker"
  ],
  "pending_tasks": [
    "incident_worker",
    "sales_worker"
  ]
}
```

LangGraph checkpointing can persist the workflow state in a durable store such as Cosmos DB.

Redis can be used for fast temporary/cache data, but I wouldn't make Redis the only source of truth for workflow recovery.

---

## 5. Execute independent Workers asynchronously

For Customer Briefing:

```text
                Coordinator
                     ↓
          ┌──────────┼──────────┐
          ↓          ↓          ↓
       Customer   Incident    Sales
       Worker      Worker     Worker
          ↓          ↓          ↓
      Salesforce ServiceNow Snowflake
```

If they don't depend on each other, I execute them concurrently.

Conceptually:

```python
results = await asyncio.gather(
    customer_worker.run(),
    incident_worker.run(),
    sales_worker.run()
)
```

This reduces overall latency because I don't unnecessarily wait for one Worker before starting another.

---

## 6. Handle dependent operations sequentially

Not everything should be parallel.

For example:

```text
Create incident
      ↓
Get incident ID
      ↓
Update incident
```

The second operation depends on the first, so it remains sequential.

**Rule:**

```text
No dependency → parallel
Dependency → sequential
Side effect → controlled + idempotent
```

---

## 7. Client checks workflow status

The client can call:

```http
GET /api/v1/workflows/WF-1001
```

While processing:

```json
{
  "workflow_id": "WF-1001",
  "status": "RUNNING",
  "progress": {
    "completed": 2,
    "total": 3
  }
}
```

After completion:

```json
{
  "workflow_id": "WF-1001",
  "status": "COMPLETED",
  "result": {
    "customer": {},
    "incidents": [],
    "sales": {}
  }
}
```

---

## 8. Handle failures and resume

Suppose:

```text
Customer Worker ✓
Sales Worker    ✓
Incident Worker ✗
```

I persist the checkpoint:

```json
{
  "workflow_id": "WF-1001",
  "completed_tasks": [
    "customer_worker",
    "sales_worker"
  ],
  "failed_tasks": [
    "incident_worker"
  ]
}
```

After ServiceNow recovers:

```text
Load checkpoint
      ↓
Skip completed Workers
      ↓
Retry Incident Worker
      ↓
Aggregate results
      ↓
Complete workflow
```

This is one of the major reasons durable workflow state is important.

---

## 9. Don't confuse FastAPI async with asynchronous architecture

This is a **very good interview distinction**.

`async def` in FastAPI:

```python
@app.get("/...")
async def endpoint():
    ...
```

mainly helps with **concurrent I/O within the application**.

It doesn't automatically make a long-running workflow durable.

For durable asynchronous processing, I use:

```text
FastAPI async
     +
Queue
     +
Background Worker
     +
Durable workflow state
```

So:

> **Async programming ≠ durable asynchronous architecture.**

---

## Interview-ready answer

> **“For short CWD operations, FastAPI can handle asynchronous I/O using async/await. For long-running Agentic AI workflows, I use a durable asynchronous pattern: FastAPI accepts the request, creates a workflow ID, places the work on Azure Service Bus, and returns HTTP 202 with the workflow ID. A background worker executes the LangGraph workflow, and state is checkpointed in durable storage such as Cosmos DB. Independent Workers and MCP calls can execute concurrently, while dependent operations remain sequential. The client can query the workflow-status API, and if a Worker fails, we resume from the checkpoint rather than restarting the entire workflow.”**

### Easy memory

**Accept → Queue → 202 → Process → Checkpoint → Status → Resume**

**Strong interview line:**

> **“For long-running Agentic AI workflows, I decouple API availability from workflow execution using a queue and durable state; the client gets a workflow ID instead of waiting for the entire workflow.”**
