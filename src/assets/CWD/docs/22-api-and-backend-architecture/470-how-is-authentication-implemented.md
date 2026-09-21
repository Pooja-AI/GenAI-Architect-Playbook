## How is authentication implemented in CWD?

In CWD, I use **Microsoft Entra ID for user authentication**, with **APIM + FastAPI** at the API boundary. For service-to-service communication, I use **managed/workload identities**, and the MCP layer performs its own authorization before accessing enterprise systems.

### End-to-end flow

```text
User / Client
     ↓
Microsoft Entra ID
     ↓  Access Token
Azure API Management
     ↓
FastAPI
     ↓
Coordinator
     ↓ A2A
Delegator
     ↓
Worker
     ↓ MCP
MCP Server
     ↓
Salesforce / ServiceNow / Snowflake / SharePoint
```

### 1. User authentication

The user authenticates through **Microsoft Entra ID**.

The client receives an OAuth 2.0/OIDC access token and sends it with the API request:

```http
Authorization: Bearer <access_token>
```

The token contains trusted identity information such as:

```text
user_id
tenant_id
roles / scopes
```

I don't ask the LLM to determine who the user is.

---

### 2. APIM validates the token

The request first reaches **Azure API Management**.

```text
Client
  ↓
APIM
  ↓
Validate Entra token
  ↓
FastAPI
```

APIM can enforce:

* JWT validation
* API subscription/policies
* rate limiting
* request size limits
* IP/network policies
* throttling

Invalid or expired tokens are rejected before reaching the application.

---

### 3. FastAPI receives trusted identity context

FastAPI extracts the authenticated identity and passes the relevant context into the Coordinator.

For example:

```python
context = {
    "user_id": user.user_id,
    "tenant_id": user.tenant_id,
    "roles": user.roles
}

result = await coordinator.run(
    request=request,
    context=context
)
```

The important point is that **identity comes from the trusted authentication layer**, not from the user's prompt.

---

### 4. Authorization is separate from authentication

Authentication answers:

> **Who are you?**

Authorization answers:

> **What are you allowed to access?**

For example:

```text
User U123
   ↓
Tenant T001
   ↓
Can access customer C12345?
   ↓
Can invoke Customer Worker?
   ↓
Can invoke Salesforce MCP tool?
   ↓
Salesforce data
```

Even if the user is authenticated, they may not be authorized to access a particular customer or tool.

---

### 5. Service-to-service authentication

For internal CWD services, I don't pass the user's password or raw credentials.

For Azure-hosted components, I prefer **Managed Identity / workload identity**.

```text
Coordinator
    ↓
Managed Identity
    ↓
MCP / internal service
```

This avoids hard-coded credentials.

---

### 6. MCP performs another authorization check

The Worker calls the MCP tool:

```python
result = await mcp_client.call_tool(
    "get_customer",
    {"customer_id": "C12345"}
)
```

The MCP server validates:

```text
✓ Worker identity
✓ User identity/context
✓ Tenant
✓ Tool permission
✓ Customer authorization
✓ Input schema
```

Only then does it call Salesforce.

```text
Worker
  ↓
MCP Server
  ↓
Authorization
  ↓
Salesforce
```

This is important because **authentication at the API gateway alone is not sufficient**.

---

### 7. Enterprise-system authentication

Each MCP server uses the appropriate authentication mechanism for its backend.

```text
Salesforce MCP
    → OAuth / approved integration identity

ServiceNow MCP
    → OAuth / approved service identity

SharePoint / Graph MCP
    → Entra ID / OAuth

Snowflake MCP
    → approved workload identity / OAuth

Oracle MCP
    → approved enterprise identity / secure credential
```

Secrets, certificates, or keys are stored in **Azure Key Vault**, not in code, prompts, or agent state.

---

### 8. Example: unauthorized Customer Briefing

Suppose:

```text
User = U123
Customer = C99999
```

The user is authenticated, but doesn't have access to `C99999`.

The request can therefore be:

```text
Authentication ✓
Authorization ✗
```

The MCP layer returns something like:

```json
{
  "status": "FORBIDDEN",
  "error_code": "CUSTOMER_ACCESS_DENIED"
}
```

The Worker does **not** attempt another customer or ask the LLM to bypass the restriction.

---

## Interview-ready answer

> **“In CWD, user authentication is implemented using Microsoft Entra ID with OAuth/OIDC. The client obtains an access token, APIM validates the token, and FastAPI receives the trusted identity context before invoking the Coordinator. Authentication and authorization are separate: authorization is enforced at the application and MCP boundaries using user identity, tenant, roles, Worker permissions, and resource-level access such as customer ID. For service-to-service communication, I use managed or workload identities, and enterprise credentials are kept in Key Vault. The LLM never handles raw credentials and is never treated as the security boundary.”**

### Easy memory

**Entra ID → APIM → FastAPI → Coordinator → Worker → MCP → Enterprise**

And remember:

**Authentication = Who are you?**
**Authorization = What can you access?**

**Strong interview line:**

> **“I use defense-in-depth authentication and authorization; validating the user's token at the API gateway is only the first security layer.”**
