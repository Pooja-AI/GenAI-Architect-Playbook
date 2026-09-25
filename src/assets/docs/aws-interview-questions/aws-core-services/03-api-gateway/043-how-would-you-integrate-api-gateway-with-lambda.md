# How would you integrate API Gateway with Lambda?

## Short answer

I would use **API Gateway as the API front door** and **Lambda as the serverless backend**.

```text id="c8s5kd"
Client
   ↓
API Gateway
   ↓
Authentication / Authorization
   ↓
Request Validation
   ↓
Lambda
   ↓
CWD logic / lightweight Worker
   ↓
Response
```

For CWD, I would use Lambda mainly for **short, event-driven operations**, not as the primary runtime for a long-running Coordinator workflow.

## Key points

1. API Gateway exposes the REST/HTTP endpoint.
2. API Gateway authenticates and authorizes requests.
3. API Gateway validates the request.
4. API Gateway invokes Lambda.
5. Lambda executes the business logic.
6. Lambda returns the response.
7. CloudWatch monitors API Gateway and Lambda.
8. For long-running CWD workflows, use asynchronous processing or ECS/Fargate instead.

---

## 1. Create the API endpoint

For example:

```text id="vsyh8e"
POST /api/v1/customer-briefing
```

Client sends:

```json id="2ov8fc"
{
  "customer_id": "C12345"
}
```

API Gateway receives the request.

---

## 2. API Gateway validates and authenticates

```text id="7n7t1x"
Client
  ↓
API Gateway
  ├── JWT validation
  ├── Authorization
  ├── Throttling
  └── Request validation
          ↓
       Lambda
```

If authentication fails:

```text
401 Unauthorized
```

If authorization fails:

```text
403 Forbidden
```

If the request is malformed:

```text
400 Bad Request
```

Lambda isn't invoked in these cases.

---

## 3. API Gateway invokes Lambda

API Gateway passes the request to Lambda.

Conceptually:

```python
def lambda_handler(event, context):
    body = event["body"]

    customer_id = body["customer_id"]

    # Process request
    result = process_customer_briefing(customer_id)

    return {
        "statusCode": 200,
        "body": result
    }
```

The exact event structure depends on whether you're using an HTTP API or REST API integration.

---

## 4. Lambda can call CWD components

For a lightweight CWD operation:

```text id="d0i3ts"
API Gateway
      ↓
Lambda
      ↓
Worker
      ↓
MCP
      ↓
Salesforce
```

Or:

```text id="21i7t9"
API Gateway
      ↓
Lambda
      ↓
Bedrock
      ↓
Response
```

For example, a small classification or preprocessing task could run in Lambda.

---

## 5. Asynchronous Lambda processing

For longer processing:

```text id="1j70ri"
Client
  ↓
API Gateway
  ↓
Lambda
  ↓
SQS
  ↓
Worker Lambda
  ↓
Bedrock / MCP / RAG
```

The first Lambda can immediately return:

```json id="08y7xq"
{
  "job_id": "JOB123",
  "status": "QUEUED"
}
```

This avoids keeping the API request open.

---

## 6. Monitor the integration

I monitor both sides:

```text id="q4rr0c"
API Gateway
 ├── Request count
 ├── 4xx
 ├── 5xx
 ├── 429
 └── Latency

Lambda
 ├── Invocations
 ├── Errors
 ├── Duration
 ├── Throttles
 └── Concurrent executions
```

Logs go to **CloudWatch Logs**.

I also propagate a **correlation ID**:

```text id="0k9m1m"
API Gateway
 correlation_id=ABC123
       ↓
Lambda
 correlation_id=ABC123
       ↓
Worker
 correlation_id=ABC123
```

---

## 7. Important CWD design decision

I would **not automatically put the entire CWD Coordinator/LangGraph workflow inside Lambda**.

If CWD requires:

* Long-running workflows
* Complex multi-agent orchestration
* Large dependencies
* Persistent service processes
* Advanced concurrency control
* Long-lived connections

then I would prefer:

```text id="xxcx75"
API Gateway
      ↓
ECS/Fargate
      ↓
CWD API
      ↓
Coordinator
      ↓
Delegators
      ↓
Workers
```

Lambda is better suited for **short, stateless, event-driven operations**.

---

## Example

Suppose I need a lightweight endpoint:

```text id="k3gqj8"
POST /api/v1/classify-intent
```

Architecture:

```text id="c5drb8"
User
 ↓
API Gateway
 ↓
JWT validation
 ↓
Request validation
 ↓
Lambda
 ↓
Bedrock
 ↓
Intent = Customer Briefing
 ↓
Response
```

But for the full CWD workflow:

```text id="x8c1sy"
User
 ↓
API Gateway
 ↓
ECS/Fargate
 ↓
Coordinator
 ↓
Sales Delegator ──→ Sales Workers
 ↓
IT Delegator ─────→ Service Workers
 ↓
MCP / RAG / Bedrock
 ↓
Final Response
```

---

## 🎯 Strong interview answer

> **“I integrate API Gateway with Lambda by using API Gateway as the secure API boundary and Lambda as the serverless compute layer. API Gateway handles authentication, authorization, throttling and request validation, then invokes Lambda with the request. Lambda performs a short-lived business operation and returns the response. For longer-running workloads, I use Lambda to place the job onto SQS and process it asynchronously. In CWD, I would use Lambda for lightweight event-driven functions, while the main long-running Coordinator and multi-agent workflow would typically run on ECS/Fargate.”**

## Easy memory trick

**A → V → L → P → R → M**

* **A**PI Gateway
* **V**alidate
* **L**ambda
* **P**rocess
* **R**esponse
* **M**onitor

### Key distinction

**API Gateway = API boundary**

**Lambda = serverless compute**

**ECS/Fargate = long-running CWD service**

**SQS = asynchronous buffering**

**Bedrock = foundation models**

**LangGraph = agent workflow orchestration**
