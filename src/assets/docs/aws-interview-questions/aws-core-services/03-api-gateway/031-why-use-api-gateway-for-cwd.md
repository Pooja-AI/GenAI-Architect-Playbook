# Why use API Gateway for CWD?

## Short answer

I use **Amazon API Gateway as the secure API entry point for CWD**.

It sits between the client and the CWD backend and handles common API concerns such as **authentication, authorization, throttling, request validation, logging, and monitoring**, so the Coordinator doesn't need to implement all of these concerns.

## Key points

### 1. Secure entry point

Instead of exposing the CWD service directly:

```text
User → CWD Backend
```

I use:

```text
User
 ↓
API Gateway
 ↓
CWD API
 ↓
Coordinator
```

API Gateway can integrate with authentication/authorization mechanisms such as IAM or JWT-based authorizers.

---

### 2. Protect CWD from traffic spikes

CWD can have many users and multiple agent workflows.

API Gateway can apply **throttling and quotas** at the API boundary.

```text
1000 requests
      ↓
API Gateway
      ↓
Controlled traffic
      ↓
CWD
```

This prevents uncontrolled traffic from reaching the Coordinator and downstream Workers.

---

### 3. Request validation

I can validate things such as:

```text
customer_id
request format
required fields
payload structure
```

before the request reaches CWD.

For example:

```json
{
  "intent": "customer_briefing",
  "customer_id": "C12345"
}
```

Invalid requests can be rejected early.

---

### 4. Monitoring and logging

API Gateway provides API-level metrics and logs that help monitor:

* Request count
* Errors
* Latency
* 4xx/5xx responses
* Throttling

I can then correlate the API request with the CWD `correlation_id`.

---

# CWD flow

```text
                    User / Application
                           ↓
                    Amazon API Gateway
                           ↓
                 Authentication/AuthZ
                           ↓
                  Request Validation
                           ↓
                    CWD FastAPI API
                           ↓
                      Coordinator
                           ↓
                      Delegator
                           ↓
                       Workers
                     ↙    ↓     ↘
                  MCP    RAG    Bedrock
```

---

## Why not put these responsibilities in the Coordinator?

The **Coordinator's job is agent orchestration**, not API infrastructure.

```text
API Gateway
   ↓
API security + throttling + validation
```

while:

```text
Coordinator
   ↓
Intent + planning + orchestration
```

This separation keeps the architecture cleaner.

---

# Example

A user sends:

```text
"Give me a customer briefing for C12345"
```

The request goes:

```text
User
 ↓
API Gateway
 ↓
Authenticate user
 ↓
Validate request
 ↓
CWD FastAPI
 ↓
Coordinator
 ↓
Sales Delegator
 ↓
Customer Worker
 ↓
MCP → Salesforce
```

The response travels back:

```text
Salesforce
 ↓
Worker
 ↓
Delegator
 ↓
Coordinator
 ↓
CWD API
 ↓
API Gateway
 ↓
User
```

---

# 🎯 Strong interview answer

> **“I use API Gateway as the secure API boundary for CWD. It provides authentication and authorization integration, throttling, request validation, logging and API-level monitoring before traffic reaches the CWD backend. This protects the Coordinator and downstream Workers from uncontrolled traffic and keeps API infrastructure concerns separate from agent orchestration. The Coordinator focuses on intent, planning and multi-agent execution, while API Gateway manages the external API boundary.”**

## Easy memory trick

**API Gateway = Secure → Control → Validate → Monitor**

### Key distinction

**API Gateway** → API boundary

**Coordinator** → Agent orchestration

**Delegator** → Domain/workload orchestration

**Worker** → Specific capability

**Bedrock** → Model inference

**MCP** → Enterprise tool connectivity
