# How do you protect APIs from abuse?

## Short answer

I protect APIs using **authentication, authorization, throttling, validation, WAF protection, rate limits, monitoring, and abuse detection**.

For CWD, I protect the API at multiple layers rather than relying on a single control.

## Key points

1. **Authentication** – Verify who is calling the API.
2. **Authorization** – Verify what they are allowed to do.
3. **Rate limiting** – Limit requests per user/app/tenant.
4. **Throttling** – Control sudden traffic spikes.
5. **Request validation** – Reject malformed or dangerous requests.
6. **WAF** – Block common web attacks and suspicious traffic.
7. **Input limits** – Limit request size, file size, tokens, etc.
8. **Timeouts** – Prevent long-running requests from consuming resources.
9. **Monitoring** – Detect unusual traffic and repeated failures.
10. **Audit logging** – Track who called what and when.

### CWD flow

```text
User / Application
        ↓
   API Gateway
        ↓
 Authentication
        ↓
 Authorization
        ↓
 WAF / Rate Limit / Throttling
        ↓
 Request Validation
        ↓
     CWD API
        ↓
   Coordinator
        ↓
   Delegator
        ↓
     Worker
        ↓
 MCP / Bedrock / RAG / Enterprise APIs
```

## 1. Authentication

Use **JWT/OIDC** with an enterprise identity provider such as Microsoft Entra ID or Amazon Cognito.

```text
Client → Identity Provider → JWT Token → API Gateway
```

API Gateway validates:

* Signature
* Issuer
* Audience
* Expiration
* Required scopes

Invalid token → **401 Unauthorized**.

---

## 2. Authorization

Authentication tells me **who the user is**.

Authorization tells me **what the user can access**.

For example:

```text
Sales User
    ↓
Customer Briefing
    ↓
Check customer entitlement
    ↓
Allowed → Salesforce Worker
Not allowed → 403
```

I use **RBAC + resource-level entitlements**.

The LLM should **never decide authorization**.

---

## 3. Rate limiting

Suppose one user sends:

```text
10,000 requests/minute
```

I can enforce:

```text
User       → 100 requests/min
Application → 1,000 requests/min
Tenant      → 5,000 requests/min
```

Requests exceeding the limit receive **429 Too Many Requests**.

---

## 4. WAF protection

For internet-facing APIs, I can place **AWS WAF** in front of the API layer.

It can help protect against common web attacks such as:

* SQL injection
* XSS
* Malicious patterns
* Bot traffic
* IP-based abuse

---

## 5. Request validation

Don't allow arbitrary payloads.

For example:

```json
{
  "customer_id": "C12345"
}
```

Validate:

* Required fields
* Data types
* String length
* Allowed values
* Request size
* Schema

Malformed request → reject before it reaches the Coordinator.

---

## 6. Protect expensive LLM APIs

This is especially important for CWD.

One user request can become:

```text
1 User Request
      ↓
Coordinator
      ↓
2 Delegators
      ↓
10 Workers
      ↓
10 Bedrock calls
```

So I also control **internal concurrency and LLM usage**.

```text
API Gateway
      ↓
CWD
      ↓
Concurrency Limit
      ↓
Queue if necessary
      ↓
Bedrock
```

This prevents API abuse from becoming an expensive LLM-cost problem.

---

## 7. Monitor abnormal behavior

I monitor:

* Requests/minute
* 401/403/429 rates
* P50/P95/P99 latency
* Request size
* Error rate
* Bedrock token usage
* Cost/request
* User/tenant activity
* IP patterns

For example:

```text
Normal:
100 requests/hour

Suddenly:
20,000 requests/hour
        ↓
Abuse detection
        ↓
Throttle / Block / Alert
```

---

## 8. Audit everything important

I maintain a correlation ID:

```text
request_id
   ↓
session_id
   ↓
run_id
   ↓
worker_id
   ↓
tool_call
```

This lets me investigate:

> Who called the API → what they requested → which Worker ran → which MCP tool was called → how much it cost.

## Example

Suppose an attacker repeatedly calls:

```text
POST /customer-briefing
```

thousands of times.

Protection:

```text
Attacker
   ↓
API Gateway
   ↓
Rate limit exceeded
   ↓
429
```

If they try different IPs:

```text
WAF / Bot detection
        ↓
API Gateway
        ↓
Per-user / tenant limits
        ↓
CWD concurrency control
        ↓
Bedrock protection
```

So the abuse doesn't directly reach expensive downstream services.

## 🎯 Strong interview answer

> **“I protect APIs using defense in depth. At the API Gateway layer, I use authentication, authorization, rate limiting, throttling and request validation, and I can use WAF for common web attacks. Inside CWD, I control concurrency and downstream limits so one API request cannot create uncontrolled Worker, MCP or Bedrock calls. I also use timeouts, retries with backoff, monitoring and audit logs. This protects both the API and the expensive downstream AI and enterprise systems.”**

## Easy memory trick

**A → A → R → W → V → C → M**

* **A**uthentication
* **A**uthorization
* **R**ate limiting
* **W**AF
* **V**alidation
* **C**oncurrency control
* **M**onitoring

### Key distinction

**API protection = prevent unauthorized or excessive traffic.**

**Throttling = control how much traffic is allowed.**

**Authorization = control what the caller is allowed to access.**

**WAF = protect against common web-layer attacks.**

**Concurrency control = prevent one request from exploding into too many downstream/LLM calls.**
