# Explain the complete AWS request flow from API Gateway to final response

## Short answer

In the AWS version of CWD, **API Gateway is the entry point**, then the request goes through the **CWD API → Coordinator → Delegator → Workers**. Workers use **MCP for enterprise tools**, **OpenSearch Serverless for RAG**, and **Amazon Bedrock for LLM reasoning**. The Coordinator aggregates the results and API Gateway returns the final response.

## Complete flow

```text
User / Client
      ↓
API Gateway
      ↓
Authentication / Authorization
      ↓
CWD API (FastAPI on ECS/Fargate)
      ↓
Coordinator
      ↓
Intent + Entity Detection
      ↓
Agent Registry / Planning
      ↓
Delegator(s)
      ↓
┌───────────────┬────────────────┐
↓               ↓                ↓
Sales Worker   IT Worker     Knowledge Worker
↓               ↓                ↓
MCP             MCP              RAG
↓               ↓                ↓
Salesforce    ServiceNow    OpenSearch Serverless
                                  ↓
                           Relevant Documents
                                  ↓
                         Bedrock / LLM
                                  ↓
                         Worker Results
          └───────────────┬───────────────┘
                          ↓
                    Delegator
                          ↓
                    Coordinator
                          ↓
                 Final Response
                          ↓
                     CWD API
                          ↓
                   API Gateway
                          ↓
                       User
```

# Step-by-step

### 1. User sends request

Example:

> "Give me a briefing for customer ABC, including recent incidents."

The request comes to:

```text
Client → API Gateway
```

---

### 2. API Gateway handles the API boundary

API Gateway performs things like:

* Authentication
* Authorization
* Request validation
* Throttling
* Rate limiting
* API logging
* Request routing

Then it forwards the request to the CWD backend.

```text
API Gateway
     ↓
Authenticated request
     ↓
CWD API
```

---

### 3. CWD API receives the request

The CWD API can be a **FastAPI application running on ECS/Fargate**.

It creates or propagates:

```text
request_id
correlation_id
user_id
session_id
```

Then it invokes the Coordinator.

---

# 4. Coordinator understands the request

The Coordinator determines:

```text
Intent:
Customer Briefing

Entity:
customer_id = ABC

Required capabilities:
Customer information
Incident information
Knowledge/document information
```

It checks the **Agent Registry** and creates the execution plan.

```text
Customer Briefing
       ↓
 ┌─────┴─────┐
 ↓           ↓
Sales      IT/Service
Delegator  Delegator
```

---

# 5. Delegators select Workers

This is important in CWD.

The **Coordinator does not directly call every Worker**.

Instead:

```text
Coordinator
     ↓
Delegator
     ↓
Workers
```

For example:

```text
Sales Delegator
   ├── Salesforce Worker
   └── Customer Data Worker

IT Delegator
   ├── ServiceNow Worker
   └── Knowledge Worker
```

The Delegator determines which Workers are required and can execute independent Workers in parallel.

---

# 6. Worker retrieves enterprise data

There are two major paths.

### Path A — Live enterprise data

For current information:

```text
Worker
   ↓
MCP Client
   ↓
MCP Server
   ↓
Salesforce / ServiceNow
```

For example:

```text
ServiceNow Worker
       ↓
    MCP Client
       ↓
    MCP Server
       ↓
ServiceNow API
       ↓
Open incidents
```

This is useful when the information must be current.

---

### Path B — RAG knowledge

For enterprise documents:

```text
Knowledge Worker
       ↓
OpenSearch Serverless
       ↓
Hybrid Search
(BM25 + Vector)
       ↓
Reranking
       ↓
Relevant chunks
```

S3 is typically the source of the documents:

```text
S3
 ↓
Extract
 ↓
Chunk
 ↓
Embedding
 ↓
OpenSearch
```

---

# 7. Workers can use Bedrock

When reasoning or summarization is required:

```text
Worker
   ↓
Model Router
   ↓
Amazon Bedrock
   ↓
Foundation Model
   ↓
Structured result
```

For example, the Worker might provide:

```text
Customer information
+
Recent incidents
+
Relevant knowledge articles
```

to the model.

The model produces a structured summary.

---

# 8. Results return to Delegator

Each Worker returns its result:

```text
Sales Worker
     ↓
Customer information

ServiceNow Worker
     ↓
Recent incidents

Knowledge Worker
     ↓
Relevant knowledge
```

The Delegator aggregates these results.

```text
Workers
   ↓
Delegator
   ↓
Aggregated result
```

If one Worker fails, the Delegator can apply the configured failure policy:

* Retry
* Timeout
* Continue with partial result
* Fallback
* Mark optional Worker as failed

---

# 9. Coordinator creates final response

The Coordinator receives the Delegator results:

```text
Sales result
+
Service result
+
Knowledge result
        ↓
Coordinator
        ↓
Final synthesis
```

It can use Bedrock again for final synthesis if required.

For example:

> Customer ABC has three recent incidents. Two are resolved and one remains open. The open incident is related to...

The response should include citations/evidence where appropriate.

---

# 10. Response goes back through API Gateway

Finally:

```text
Coordinator
     ↓
CWD API
     ↓
API Gateway
     ↓
User
```

API Gateway returns the HTTP response.

Example:

```json
{
  "request_id": "REQ123",
  "customer_id": "ABC",
  "status": "completed",
  "response": "Customer ABC has..."
}
```

---

# Observability throughout the flow

We don't wait until the end to monitor the system.

A correlation ID follows the entire request:

```text
API Gateway
     ↓
Coordinator
     ↓
Delegator
     ↓
Worker
     ↓
MCP / OpenSearch / Bedrock
```

We capture:

* Latency
* Token usage
* Model cost
* Worker success/failure
* MCP latency
* Retrieval quality
* LLM latency
* Errors
* Retries
* 429 responses
* Trace IDs

Typical AWS tools:

**CloudWatch + X-Ray/OpenTelemetry + application/LLM tracing such as Langfuse**

---

# Failure handling

Suppose ServiceNow is temporarily unavailable:

```text
ServiceNow Worker
       ↓
MCP Server
       ↓
ServiceNow
       X
    Timeout
       ↓
Retry + Backoff
       ↓
Still failing?
       ↓
Delegator
```

The Delegator can return:

```text
Sales information → Available
Knowledge → Available
ServiceNow → Temporarily unavailable
```

The Coordinator can then produce a **partial response** rather than failing the entire customer briefing, if that Worker is configured as optional.

---

# 🎯 Strong interview answer

> **“In our AWS CWD architecture, API Gateway is the secure entry point. It handles authentication, authorization, throttling and request validation, then routes the request to our FastAPI CWD service running on ECS or Fargate. The Coordinator interprets the intent and entities, checks the Agent Registry, and creates the execution plan. It then routes work to the appropriate Delegators, and each Delegator selects and orchestrates its Workers. Workers retrieve live enterprise data through MCP from systems such as Salesforce and ServiceNow, while knowledge-oriented Workers use OpenSearch Serverless for hybrid RAG retrieval. When reasoning or summarization is required, Workers call Amazon Bedrock. Worker results are aggregated by the Delegators and returned to the Coordinator, which performs the final synthesis and sends the response through the CWD API and API Gateway back to the user. Throughout the flow, we use correlation IDs, CloudWatch and tracing for observability, and retries, timeouts, DLQs and checkpointing for reliability.”**

## Easy memory trick

Remember:

**A → C → D → W → M/R → B → W → D → C → A**

```text
API Gateway
     ↓
Coordinator
     ↓
Delegator
     ↓
Worker
     ↓
MCP / RAG
     ↓
Bedrock
     ↓
Worker
     ↓
Delegator
     ↓
Coordinator
     ↓
API Gateway
```

### Key distinction

**API Gateway = API entry point**

**Coordinator = overall agent orchestration**

**Delegator = domain-level orchestration**

**Worker = performs specific capability**

**MCP = connects Workers to enterprise tools**

**OpenSearch = retrieves knowledge**

**Bedrock = model/reasoning**

**S3 = stores documents**

**DynamoDB = application/workflow state**

**Redis = fast cache**
