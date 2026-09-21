## How does the client retrieve workflow status?

In CWD, after returning `202 Accepted`, I give the client a **`workflow_id`**. The client uses that ID to query a workflow-status API.

### CWD flow

```text
Client
   ↓
POST /api/v1/customer-briefing
   ↓
202 Accepted
workflow_id = WF-1001
   ↓
Async workflow execution
   ↓
Coordinator → Delegators → Workers
```

Then the client calls:

```http
GET /api/v1/workflows/WF-1001
```

### Example response while running

```json
{
  "workflow_id": "WF-1001",
  "status": "RUNNING",
  "completed_tasks": [
    "customer_worker",
    "opportunity_worker"
  ],
  "pending_tasks": [
    "incident_worker"
  ]
}
```

When everything finishes:

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

If something fails:

```json
{
  "workflow_id": "WF-1001",
  "status": "FAILED",
  "failed_tasks": [
    "incident_worker"
  ],
  "error": {
    "code": "DEPENDENCY_UNAVAILABLE",
    "dependency": "ServiceNow"
  }
}
```

### Where does the status come from?

The status is stored in **durable workflow state**, for example Cosmos DB, alongside the LangGraph checkpoint.

```text
Client
   ↓
GET /workflows/WF-1001
   ↓
FastAPI
   ↓
Cosmos DB
   ↓
Workflow status/checkpoint
```

Redis can be used as a fast cache, but I would **not make Redis the only source of truth** for long-running workflow state.

### Typical lifecycle

```text
ACCEPTED
   ↓
QUEUED
   ↓
RUNNING
   ↓
PARTIALLY_COMPLETED
   ↓
COMPLETED
```

Or:

```text
RUNNING
   ↓
FAILED
   ↓
RETRYING
   ↓
COMPLETED
```

### Interview-ready answer

> **“After returning 202 Accepted, CWD provides a workflow ID. The client uses that ID with a GET workflow-status API. FastAPI retrieves the durable workflow state from Cosmos DB or the LangGraph checkpoint store and returns the current status, completed and pending tasks, errors, and eventually the final result. For long-running workflows, the client doesn't need to keep the original HTTP connection open.”**

### Easy memory

**POST → get `workflow_id` → GET status → poll until completed.**

**Strong interview line:**

> **“The workflow ID becomes the handle the client uses to track a durable Agentic workflow.”**
