## Why might you return `202 Accepted`?

I return **`202 Accepted` when the request has been accepted successfully, but the actual work is still running asynchronously**.

### In CWD

For a long-running Customer Briefing:

```text
Client
   ↓
POST /customer-briefing
   ↓
FastAPI
   ↓
Create workflow_id
   ↓
Azure Service Bus
   ↓
Coordinator → Delegators → Workers
```

FastAPI doesn't make the client wait for all Workers to finish.

It immediately returns:

```json
{
  "workflow_id": "WF-1001",
  "status": "ACCEPTED"
}
```

with:

```http
HTTP/1.1 202 Accepted
```

The client can then check:

```http
GET /api/v1/workflows/WF-1001
```

and eventually receive:

```json
{
  "workflow_id": "WF-1001",
  "status": "COMPLETED",
  "result": {
    "customer": "...",
    "sales": "...",
    "incidents": "..."
  }
}
```

### Why not `200 OK`?

`200 OK` is generally used when the requested operation has **already completed successfully** and the response contains the completed result.

`202 Accepted` communicates:

> **“I received and accepted your request, but processing is not finished yet.”**

### Interview-ready answer

> **“I return 202 Accepted for long-running CWD workflows because the request has been accepted, but the Agentic workflow continues asynchronously. I return a workflow ID immediately, put the work onto a durable queue, and let the Coordinator execute the workflow in the background. The client can then poll the workflow status or receive a completion notification.”**

### Easy memory

**202 = Accepted, not finished.**

**Strong interview line:**

> **“202 separates API responsiveness from workflow execution.”**
