# How do you authenticate API Gateway requests?

## Short answer

For CWD, I would use **JWT/OIDC-based authentication**, typically with **Amazon Cognito or an enterprise identity provider such as Microsoft Entra ID**, depending on the organization's identity architecture.

API Gateway validates the token **before the request reaches the CWD application**.

```text id="3a8h7x"
User
  ↓
Identity Provider
  ↓
Access Token / JWT
  ↓
API Gateway
  ↓
Validate Token
  ↓
CWD FastAPI
  ↓
Coordinator
```

## Key points

### 1. User authenticates with Identity Provider

For example:

```text id="5y5w9g"
User
 ↓
Microsoft Entra ID / Cognito
 ↓
JWT access token
```

The token contains claims such as:

```text id="j1l1x4"
sub
issuer
audience
expiration
scopes / roles
```

---

### 2. Client sends the token to API Gateway

```http id="f4t9cj"
Authorization: Bearer <JWT>
```

API Gateway validates the token.

It checks things such as:

```text id="o5lyq3"
✓ Signature
✓ Issuer
✓ Audience
✓ Expiration
✓ Required scopes
```

If the token is invalid or expired:

```text id="o6b7f8"
API Gateway
    ↓
401 Unauthorized
    ↓
CWD is NOT called
```

---

## 3. Authentication vs authorization

This is an important interview distinction.

### Authentication

> **Who are you?**

Example:

```text id="k0o1q2"
User = Pooja
```

### Authorization

> **What are you allowed to do?**

Example:

```text id="q5h6j7"
User
 ↓
Sales role
 ↓
Allowed → Customer CRM data
Not allowed → HR data
```

API Gateway can perform the initial authentication and scope/claim checks, but **CWD must still enforce fine-grained authorization** for enterprise data and tools.

---

# 4. CWD authorization flow

For your CWD architecture:

```text id="8f7m1k"
User
 ↓
Entra ID
 ↓
JWT
 ↓
API Gateway
 ↓
JWT validation
 ↓
CWD FastAPI
 ↓
Authorization / entitlement check
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

For example, a Customer Briefing request:

```text id="s7k8m9"
User asks for Customer C12345
        ↓
API Gateway authenticates user
        ↓
CWD identifies user + roles
        ↓
Authorization check
        ↓
Sales Worker
        ↓
MCP
        ↓
Salesforce
```

The **LLM should never decide whether the user is authorized**.

---

# 5. Service-to-service authentication

For internal CWD services, I would use **IAM roles/credentials, workload identity, or another service-to-service identity mechanism**, rather than passing user passwords between services.

Example:

```text id="l4m5n6"
CWD Service
    ↓
IAM role
    ↓
AWS service
```

For MCP/enterprise integrations, the MCP server can independently validate the calling identity and enforce its own authorization policy.

---

# 6. What about API keys?

API keys can identify an application/client and support usage controls, but **they are not a replacement for user authentication**.

For an enterprise CWD application:

```text id="w7x8y9"
JWT/OIDC
→ User identity

API key
→ Application/client identification
```

If CWD requires strong user identity and enterprise authorization, I would use an identity provider and JWT/OIDC.

---

# 🎯 Strong interview answer

> **“For CWD, I would use JWT/OIDC authentication through an enterprise identity provider such as Microsoft Entra ID or Amazon Cognito, depending on the organization's identity architecture. The client sends a bearer token to API Gateway, and the gateway validates the token's signature, issuer, audience, expiration and required scopes before forwarding the request to CWD. Inside CWD, I perform fine-grained authorization based on the user's identity, roles and data entitlements before allowing Workers or MCP tools to access enterprise systems. So API Gateway handles the API authentication boundary, while CWD and downstream systems enforce authorization.”**

## Easy memory trick

**Identity → Token → Validate → Authorize → Execute**

### Key distinction

```text id="q1w2e3"
Identity Provider
→ Issues identity/token

API Gateway
→ Validates API request

CWD
→ Enforces business/data authorization

MCP / Enterprise system
→ Enforces downstream authorization
```

> **“Authenticate at the API boundary, authorize before accessing enterprise data.”**
