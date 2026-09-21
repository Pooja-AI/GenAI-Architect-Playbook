## How do you secure API endpoints?

In CWD, I use **defense-in-depth security**. I don't rely only on FastAPI authentication.

### CWD security flow

```text
Client
  ↓
Azure API Management
  ↓
Microsoft Entra ID
  ↓
FastAPI
  ↓
Authentication + Authorization
  ↓
Coordinator
  ↓
Delegator
  ↓
Worker
  ↓
MCP Authorization
  ↓
Enterprise Systems
```

### 1. Authentication

The client authenticates with **Microsoft Entra ID** and receives an access token.

```http
Authorization: Bearer <access_token>
```

APIM validates the token before allowing the request to reach FastAPI.

---

### 2. Authorization

Authentication only tells me **who the user is**.

I then check **what the user is allowed to do**.

For example:

```text
User
 ├── Tenant = T001
 ├── Role = Sales_Manager
 └── Customer access = C12345
```

The user may be allowed to:

```text
GET customer information       ✓
GET sales information         ✓
GET HR information            ✗
Delete customer data          ✗
```

Authorization can be enforced at multiple layers:

```text
APIM
 ↓
FastAPI
 ↓
Coordinator policy
 ↓
Worker permissions
 ↓
MCP tool authorization
 ↓
Enterprise system
```

---

### 3. Validate API requests

I use **Pydantic** models in FastAPI.

```python
class CustomerBriefingRequest(BaseModel):
    customer_id: str = Field(min_length=1)
    request: str = Field(min_length=1)
    include_sales: bool = True
    include_incidents: bool = True
```

This prevents malformed or unexpected input from reaching the agent workflow.

---

### 4. Rate limiting

At APIM I can apply:

```text
Per user
Per client
Per tenant
Per API
```

For example:

```text
Client
  ↓
APIM
  ├── Authentication
  ├── Rate limiting
  ├── Request-size limits
  └── API policy
```

This protects CWD from abuse and traffic spikes.

---

### 5. Don't trust user-supplied security context

A user shouldn't be able to simply send:

```json
{
  "user_id": "admin",
  "tenant_id": "T001"
}
```

and gain access.

The trusted identity and tenant information should come from the validated identity/token context.

---

### 6. Protect secrets

I never put Salesforce, ServiceNow, database credentials, API keys, or access tokens in:

* Source code
* Prompts
* LLM context
* A2A messages
* Logs

In Azure, I use **Key Vault + Managed Identity**.

```text
FastAPI / MCP Server
       ↓
Managed Identity
       ↓
Azure Key Vault
       ↓
Secrets / certificates
```

---

### 7. Secure MCP access

Even if a Worker is authenticated, I don't automatically allow every tool.

For example:

```text
Customer Worker
   ├── get_customer       ✓
   ├── get_contacts       ✓
   └── delete_customer    ✗
```

The MCP Server independently validates:

```text
Worker identity
User identity
Tenant
Tool permission
Customer authorization
Input schema
```

So the **LLM itself never decides whether an operation is authorized**.

---

### 8. Network security

For enterprise systems, I would use controls such as:

* HTTPS/TLS
* Private endpoints/private networking where supported
* Network segmentation
* Firewall rules
* Restricted outbound access
* API allowlists

---

### 9. Audit and monitoring

Every important API request gets a correlation/request ID.

```text
request_id
workflow_id
user/identity
tenant
API
timestamp
status
latency
```

I can then trace:

```text
API
 ↓
Coordinator
 ↓
Delegator
 ↓
Worker
 ↓
MCP
 ↓
Salesforce / ServiceNow
```

I avoid logging secrets, tokens, and unnecessary sensitive payloads.

---

## Interview-ready answer

> **“I secure CWD APIs using defense-in-depth. At the API boundary, Azure API Management handles controls such as authentication, rate limiting, request-size policies, and token validation with Microsoft Entra ID. FastAPI performs schema and business validation, and authorization checks determine whether the user can access the requested tenant, customer, and capability. Downstream, Workers have limited permissions and MCP servers independently enforce tool-level authorization before accessing Salesforce, ServiceNow, Snowflake, or other enterprise systems. Secrets are stored in Key Vault and accessed using Managed Identity. I also use TLS, private networking, audit logging, and distributed tracing. Most importantly, I never treat the LLM as a security boundary—the authorization decision is deterministic and enforced outside the model.”**

### Easy memory

**Secure API =**

**Authenticate → Authorize → Validate → Rate-limit → Protect secrets → Secure network → Audit**

### Strong interview line

> **“Authentication establishes identity; authorization determines access, and I enforce authorization again at the MCP and enterprise boundaries.”**
