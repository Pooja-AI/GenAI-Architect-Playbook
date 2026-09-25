# Why did you choose API Gateway?

## Short answer
API Gateway is the managed front door that offloads authentication, throttling, validation and logging from the CWD backend.

## Key points
- Cognito or JWT authorisers, Lambda authorisers, IAM (SigV4).
- Throttling, usage plans, request validation and WAF integration (REST APIs).
- Custom domains, stages, access logs and metrics.
- Private integrations to ECS through VPC Link.


For the **AWS version of CWD**, I chose Amazon Web Services **API Gateway** as the **secure API entry point** between external clients and our CWD backend.

### CWD flow

```text
User / Application
       ↓
   API Gateway
       ↓
 Authentication / Authorization
       ↓
     CWD API
       ↓
   Coordinator
       ↓
    Delegator
       ↓
     Workers
       ↓
 MCP / RAG / Enterprise Systems
```

### Why API Gateway?

**1. Secure entry point**

It provides a controlled front door for CWD APIs instead of exposing backend services directly.

**2. Authentication & authorization**

We can integrate with AWS identity mechanisms and enforce who can call which APIs.

**3. Throttling**

API Gateway can control request rates.

```text
Too many requests
       ↓
 API Gateway
       ↓
 Throttle
       ↓
 Protect CWD backend
```

This is particularly useful when many users are calling CWD simultaneously.

**4. Request validation**

We can validate API requests before they reach the Coordinator—for example, required fields and request structure.

**5. Monitoring**

We can capture API-level metrics such as:

* Request count
* Error rate
* Latency
* 4xx/5xx responses
* Throttling

These can be integrated with CloudWatch.

**6. Decoupling**

The client doesn't need to know whether CWD is running on Lambda, ECS, EKS, or another backend.

```text
Client
  ↓
API Gateway
  ↓
CWD backend
```

The backend can evolve without changing the public API contract.

**7. Protection of backend services**

API Gateway acts as a controlled boundary before requests reach the Coordinator and downstream services.

---

### Example

A user requests:

> "Create a customer briefing for customer C123."

The request might enter through:

```text
POST /customer-briefing

{
  "customer_id": "C123"
}
```

Then:

```text
API Gateway
   ↓
Validate + Authenticate
   ↓
CWD API
   ↓
Coordinator
   ↓
Sales Delegator + IT Delegator
   ↓
Workers
```

---

### 🎯 Strong interview answer

> **“We chose Amazon API Gateway as the secure API entry point for CWD. It provides authentication and authorization integration, throttling, request validation, monitoring, and a controlled boundary between clients and our backend services. It also decouples the public API from the underlying implementation, so the CWD backend can evolve independently. From an operational perspective, API Gateway metrics integrate with CloudWatch, allowing us to monitor traffic, errors, latency, and throttling.”**

### Easy memory trick

**Secure → Validate → Throttle → Monitor → Decouple**

### Key distinction

Don't say **“API Gateway manages my agents.”**

Instead:

> **“API Gateway manages the API boundary; LangGraph manages the agent workflow.”**

