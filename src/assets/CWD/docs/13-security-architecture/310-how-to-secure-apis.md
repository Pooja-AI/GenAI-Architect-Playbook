## How do you secure APIs?

In CWD, APIs are the entry and communication layer between the **user, Coordinator, Delegators, Workers, and enterprise services**. I secure them using **defense in depth**.

### CWD API security flow

```text id="q8h4km"
User / Agent
     ↓
HTTPS / TLS
     ↓
API Gateway / APIM
     ↓
Authentication
     ↓
Authorization
     ↓
Input Validation
     ↓
Rate Limiting
     ↓
FastAPI / A2A API
     ↓
Coordinator / Delegator / Worker
     ↓
MCP
     ↓
Enterprise Systems
```

### 1. Use HTTPS/TLS

All API communication uses encrypted transport.

```text
Client ──HTTPS/TLS──> API
```

This protects credentials, tokens, customer IDs, and business data while in transit.

---

### 2. Authenticate callers

For CWD, I use **Microsoft Entra ID / OAuth 2.0**.

The API validates:

* token signature
* issuer
* audience
* expiration
* scopes
* claims

For example:

```text
User
 ↓
Entra ID
 ↓
OAuth access token
 ↓
API
 ↓
Validate token
```

For service-to-service APIs, I use workload identities/Managed Identity where appropriate.

---

### 3. Authorize every API operation

Authentication tells me **who you are**.

Authorization tells me **what you're allowed to do**.

For example:

```text
Sales User
   → customer.read       ✓
   → incident.read       maybe
   → customer.delete     ✗
```

Use RBAC, scopes, roles, and resource-level entitlements.

---

### 4. Validate API inputs

Never trust API input just because it came from another agent.

For example:

```json id="8h6k2p"
{
  "customer_id": "C12345",
  "intent": "customer_briefing"
}
```

Validate:

* required fields
* data types
* allowed values
* string length
* customer ID format
* payload size
* business rules

With FastAPI, Pydantic models can enforce schema validation.

```python id="v3r7na"
class CustomerRequest(BaseModel):
    customer_id: str
    intent: Literal["customer_briefing"]
```

---

### 5. Rate limiting and throttling

Protect APIs from excessive traffic.

```text id="m2x9pc"
Too many requests
       ↓
Rate limiter
       ↓
429 Too Many Requests
```

This protects the Coordinator and downstream systems from overload.

---

### 6. Prevent API abuse

I use controls such as:

* API Gateway/APIM
* rate limiting
* quotas
* request-size limits
* timeout limits
* IP/network restrictions where appropriate
* WAF for internet-facing APIs
* schema validation

---

### 7. Protect against injection attacks

API security also includes validating and safely handling:

* SQL injection
* command injection
* path traversal
* malicious payloads
* prompt injection
* oversized inputs

For GenAI APIs, I additionally treat user/RAG content as **untrusted input**.

---

### 8. Don't expose secrets

Never put:

```text id="c4x8fz"
API keys
Passwords
Client secrets
Access tokens
```

inside source code, prompts, or API payloads.

Use:

```text id="n7q2dw"
Application
   ↓
Managed Identity
   ↓
Entra ID / Key Vault
   ↓
Authorized service
```

---

### 9. Protect sensitive data

For CWD APIs:

* minimize returned fields
* enforce customer/data entitlement
* apply DLP
* mask PII when appropriate
* encrypt data at rest
* don't expose unnecessary enterprise data in API responses

For example, an API should not return an entire Salesforce customer record when the Worker only needs incident status.

---

### 10. Secure API-to-API communication

For CWD:

```text id="y8w4sq"
Coordinator
   ↓ authenticated API
Sales Delegator
   ↓ authenticated API
Sales Worker
   ↓ authenticated MCP
Salesforce
```

Each service verifies the calling identity and permissions.

I don't rely on a request field like:

```json id="q2z8wv"
{"from_agent": "coordinator"}
```

as proof of identity.

---

### 11. Audit and monitor

I capture:

```text id="r4m6vk"
request_id
correlation_id
authenticated_identity
API/endpoint
HTTP method
timestamp
status code
latency
authorization decision
error
```

Sensitive request/response bodies should be redacted.

This allows troubleshooting such as:

> "Why did the Customer Briefing request take 8 seconds?"

I can trace:

```text
API → Coordinator → Delegator → Worker → MCP → Salesforce
```

---

### 12. Secure errors

Don't expose internal implementation details.

Instead of:

```text
Database password xyz...
Salesforce token...
Internal stack trace...
```

return something like:

```json id="w7n3kd"
{
  "error": "Internal service error",
  "request_id": "REQ-1001"
}
```

Detailed information goes to protected logs.

---

## Interview-ready answer

> **“I secure APIs using defense in depth. All APIs use HTTPS/TLS, and I authenticate users and service-to-service callers using Entra ID/OAuth and workload identities. I enforce authorization using scopes, RBAC, and resource-level entitlements. I validate request schemas and business parameters, apply rate limiting, quotas, payload-size limits, and gateway/WAF controls where appropriate. I protect secrets using Managed Identity and Key Vault, minimize and redact sensitive data, and secure service-to-service communication. Finally, I audit and monitor every request using request and correlation IDs while keeping sensitive payloads out of logs.”**

### Easy memory

**TLS → Authenticate → Authorize → Validate → Rate Limit → Protect Data → Protect Secrets → Audit**

### Strong interview line

> **“API security is not just authentication. I need to control who can call the API, what they can do, what data they can access, how much traffic they can send, and what gets logged.”**
