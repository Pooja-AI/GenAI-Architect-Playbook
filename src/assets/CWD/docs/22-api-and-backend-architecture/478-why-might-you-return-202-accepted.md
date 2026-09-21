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

## Common HTTP Status Codes — Interview Cheat Sheet

For your **CWD / FastAPI / Agentic AI** interviews, focus on these:

| Code    | Meaning               | CWD Example                                               |
| ------- | --------------------- | --------------------------------------------------------- |
| **200** | OK                    | Customer briefing completed successfully                  |
| **201** | Created               | New workflow/resource created                             |
| **202** | Accepted              | Long-running workflow accepted and running asynchronously |
| **204** | No Content            | Successful delete/update with no response body            |
| **400** | Bad Request           | Invalid request format or parameters                      |
| **401** | Unauthorized          | Missing/invalid/expired authentication token              |
| **403** | Forbidden             | User authenticated but doesn't have permission            |
| **404** | Not Found             | Workflow/customer/resource doesn't exist                  |
| **409** | Conflict              | Duplicate/idempotency conflict or state conflict          |
| **422** | Unprocessable Entity  | FastAPI/Pydantic validation failure                       |
| **429** | Too Many Requests     | Rate limit exceeded                                       |
| **500** | Internal Server Error | Unexpected CWD application error                          |
| **502** | Bad Gateway           | Invalid response from downstream gateway/service          |
| **503** | Service Unavailable   | Salesforce/ServiceNow/MCP/service temporarily unavailable |
| **504** | Gateway Timeout       | Downstream service didn't respond in time                 |

### Most important distinction

```text
401 → Who are you?
403 → I know who you are, but you're not allowed.
```

Example:

```text
No/invalid Entra token
        ↓
       401

Valid Entra token
        ↓
User doesn't have access to customer C12345
        ↓
       403
```

### CWD example

If the client submits:

```http
POST /api/v1/customer-briefing
```

and the workflow is long-running:

```http
202 Accepted
```

If the request is malformed:

```http
400 Bad Request
```

If Pydantic validation fails:

```http
422 Unprocessable Entity
```

If the user isn't authenticated:

```http
401 Unauthorized
```

If authenticated but lacks customer access:

```http
403 Forbidden
```

If ServiceNow is temporarily down:

```http
503 Service Unavailable
```

If the downstream call times out:

```http
504 Gateway Timeout
```

If the client exceeds API limits:

```http
429 Too Many Requests
```

### Easy memory

**2xx = Success**
**4xx = Client/request problem**
**5xx = Server/dependency problem**

For interviews, remember especially:

**200, 201, 202, 400, 401, 403, 404, 409, 422, 429, 500, 502, 503, 504.**
Yes. In your **CWD FastAPI implementation**, you can use Python/FastAPI libraries for HTTP status codes.

### 1. FastAPI `status` — most common

```python
from fastapi import FastAPI, status

app = FastAPI()

@app.post("/api/v1/customer-briefing",
           status_code=status.HTTP_202_ACCEPTED)
async def customer_briefing():
    return {
        "workflow_id": "WF-1001",
        "status": "ACCEPTED"
    }
```

Instead of remembering numbers:

```python
status.HTTP_202_ACCEPTED   # 202
status.HTTP_200_OK         # 200
status.HTTP_201_CREATED    # 201
status.HTTP_400_BAD_REQUEST # 400
status.HTTP_401_UNAUTHORIZED # 401
status.HTTP_403_FORBIDDEN  # 403
status.HTTP_404_NOT_FOUND  # 404
status.HTTP_409_CONFLICT   # 409
status.HTTP_422_UNPROCESSABLE_ENTITY # 422
status.HTTP_429_TOO_MANY_REQUESTS    # 429
status.HTTP_500_INTERNAL_SERVER_ERROR # 500
status.HTTP_503_SERVICE_UNAVAILABLE   # 503
status.HTTP_504_GATEWAY_TIMEOUT       # 504
```

### 2. `HTTPException`

For errors:

```python
from fastapi import HTTPException, status

if not authorized:
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="User is not authorized for this customer"
    )
```

### 3. `JSONResponse` — when you need custom response

```python
from fastapi.responses import JSONResponse
from fastapi import status

return JSONResponse(
    status_code=status.HTTP_202_ACCEPTED,
    content={
        "workflow_id": "WF-1001",
        "status": "ACCEPTED"
    }
)
```

### Interview answer

> **“In FastAPI, I use the built-in `fastapi.status` module rather than hard-coding HTTP numbers. For errors, I typically use `HTTPException`, and when I need a custom response body or headers, I use `JSONResponse`.”**

**Easy memory:**
`status` → codes
`HTTPException` → errors
`JSONResponse` → custom response
