## What APIs does CWD expose?

In CWD, **FastAPI exposes a small set of business-oriented APIs**. I don't expose individual Salesforce, ServiceNow, or Oracle APIs directly to the client.

The main API is the **Customer Briefing API**, with supporting APIs for workflow status, health, and potentially feedback/evaluation.

### 1. Customer Briefing API

```http
POST /api/v1/customer-briefing
```

Example request:

```json
{
  "customer_id": "C12345",
  "request": "Give me a complete customer briefing",
  "include_incidents": true,
  "include_sales": true
}
```

Flow:

```text
Client
  ↓
POST /customer-briefing
  ↓
APIM
  ↓
FastAPI
  ↓
Coordinator
  ↓
Delegators
  ↓
Workers
  ↓
MCP
  ↓
Salesforce / ServiceNow / Snowflake / SharePoint
```

The client gets a **business-level response**, not raw backend responses.

---

### 2. Workflow Status API

For long-running or asynchronous workflows:

```http
GET /api/v1/workflows/{workflow_id}
```

Example:

```json
{
  "workflow_id": "WF-1001",
  "status": "PARTIALLY_COMPLETED",
  "completed_tasks": [
    "customer_worker",
    "sales_worker"
  ],
  "pending_tasks": [
    "incident_worker"
  ]
}
```

This is useful when a workflow takes longer because of multiple enterprise calls or retries.

---

### 3. Health API

For platform health checks:

```http
GET /health
```

Example:

```json
{
  "status": "healthy"
}
```

I can also expose a readiness endpoint:

```http
GET /ready
```

which checks whether required dependencies/configuration are available.

---

### 4. Feedback / Evaluation API

If the platform captures user feedback:

```http
POST /api/v1/feedback
```

Example:

```json
{
  "workflow_id": "WF-1001",
  "rating": 4,
  "feedback": "Customer briefing was useful"
}
```

This can feed our **LLM evaluation and continuous-improvement pipeline**.

---

## What I would NOT expose

I would **not** expose APIs like:

```text
/client → Salesforce API
/client → ServiceNow API
/client → Snowflake
```

Instead:

```text
Client
  ↓
CWD API
  ↓
Coordinator
  ↓
Delegator
  ↓
Worker
  ↓
MCP
  ↓
Enterprise System
```

This keeps enterprise integrations behind the governed CWD boundary.

### Example FastAPI implementation

```python
from fastapi import FastAPI

app = FastAPI()

@app.post("/api/v1/customer-briefing")
async def customer_briefing(request: CustomerBriefingRequest):

    result = await coordinator.run(
        customer_id=request.customer_id,
        request=request.request
    )

    return result


@app.get("/api/v1/workflows/{workflow_id}")
async def workflow_status(workflow_id: str):

    return await workflow_store.get(workflow_id)


@app.get("/health")
async def health():

    return {"status": "healthy"}
```

### Interview-ready answer

> **“CWD exposes business-oriented APIs through FastAPI rather than exposing backend-specific APIs. The primary API is `POST /api/v1/customer-briefing`, which accepts the customer ID and requested capabilities and invokes the Coordinator workflow. We also expose workflow-status APIs for long-running executions and health/readiness endpoints. The client never directly accesses Salesforce, ServiceNow, Snowflake, or other enterprise systems; those integrations remain behind Workers and MCP.”**

### Easy memory

**Business API → Workflow API → Health API → Feedback API**

**Strong interview line:**

> **“CWD exposes capabilities, not enterprise-system APIs.”**
