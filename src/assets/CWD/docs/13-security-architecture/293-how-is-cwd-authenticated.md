## How is CWD authenticated?

In CWD, authentication happens at **multiple layers**. We don't rely on the LLM or an `agent_id` field to prove identity.

### CWD authentication flow

```text
User
 ↓
FastAPI / API Gateway
 ↓
Microsoft Entra ID
 ↓
Validate Access Token
 ↓
Coordinator
 ↓ A2A + authenticated identity
Delegator
 ↓
Worker
 ↓ MCP + authenticated identity
MCP Server
 ↓
Salesforce / ServiceNow / SharePoint
```

### 1. User authentication

The user authenticates through **Microsoft Entra ID** and receives an OAuth 2.0 access token.

CWD validates:

* Token signature
* Issuer
* Audience
* Expiration
* Required scopes/claims

For example:

```text
User → Entra ID → Access Token → CWD API
```

The API does **not** trust:

```json
{
  "user": "pooja",
  "role": "admin"
}
```

just because those values were sent in the request.

---

### 2. Agent-to-agent authentication

Each CWD component has its own enterprise identity.

```text
Coordinator Identity
        ↓
Sales Delegator Identity
        ↓
Customer Worker Identity
```

For example:

```text
coordinator-agent
sales-delegator
it-delegator
customer-worker
incident-worker
```

When Coordinator communicates with Sales Delegator through A2A, the request carries an authenticated credential/token.

The receiving Delegator validates that credential.

**Important:** I don't trust:

```json
"from_agent": "coordinator"
```

by itself.

The identity comes from the **validated credential**, not from a string supplied by the caller.

---

### 3. Worker → MCP authentication

The Worker also authenticates when calling an MCP Server.

```text
Customer Worker
      ↓
MCP Client
      ↓ authenticated request
MCP Server
      ↓
Salesforce
```

The MCP Server independently validates identity and authorization.

This gives us **defense in depth**.

---

### 4. Authentication vs authorization

This is a very common interview question.

**Authentication:**

> "Who are you?"

**Authorization:**

> "What are you allowed to do?"

**Entitlement:**

> "Which specific customer/data are you allowed to access?"

For example:

```text
Worker identity = customer-worker
        ↓
Is worker authenticated?       YES
        ↓
Can worker call get_customer?  YES
        ↓
Can worker access C12345?      YES
        ↓
Return Salesforce data
```

If the worker is authenticated but isn't authorized for `C12345`, the request is rejected.

---

### 5. Secrets are not passed through agents

I don't put Salesforce passwords, API keys, or client secrets into:

* LLM prompts
* A2A messages
* LangGraph state
* Worker payloads

Instead, credentials are managed using mechanisms such as **Managed Identity, OAuth, Entra ID, and Azure Key Vault**.

```text
Worker
 ↓
Managed Identity / OAuth
 ↓
MCP Server
 ↓
Enterprise API
```

---

### 6. CWD security is therefore layered

```text
Layer 1 → User authentication
Layer 2 → Coordinator authorization
Layer 3 → A2A agent authentication
Layer 4 → Delegator authorization
Layer 5 → Worker identity
Layer 6 → MCP authentication + authorization
Layer 7 → Enterprise-system authorization
Layer 8 → Data/ACL entitlement
```

This prevents a compromised or incorrectly behaving agent from automatically gaining access to everything.


### Interview-ready answer

> **“CWD uses layered authentication. At the entry point, users authenticate through Microsoft Entra ID and the API validates the OAuth access token. Internally, Coordinator, Delegators, and Workers have their own enterprise identities, and A2A communication is authenticated rather than trusting an agent name in the payload. Workers authenticate to MCP Servers, and MCP Servers independently authorize tool execution and downstream access to systems such as Salesforce and ServiceNow. We use least privilege, Managed Identity/OAuth, RBAC, and Key Vault for secrets. Authentication establishes identity, authorization controls capabilities, and entitlement controls access to specific enterprise data.”**

**Easy memory:**
**Authenticate → Authorize → Entitlement → Execute.**
