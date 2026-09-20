In **CWD**, we authenticate agents using **enterprise workload identity**, not by trusting the agent name in the A2A message.

### CWD flow

```text
Coordinator
    |
    | A2A request + authentication token
    ↓
Sales Delegator
    |
    | Validate token
    ↓
Authorization
    ↓
Execute task
```

### 1. Give each agent a service identity

For Azure CWD, I would use **Microsoft Entra ID** with managed/workload identities.

```text
Coordinator       → coordinator-agent identity
Sales Delegator   → sales-delegator identity
IT Delegator      → it-delegator identity
Customer Worker   → customer-worker identity
```

Each identity has its own permissions.

---

### 2. Coordinator gets an access token

Before calling the Sales Delegator, the Coordinator obtains an OAuth 2.0 access token for the target service.

Conceptually:

```python
token = credential.get_token(
    "api://sales-delegator/.default"
)
```

Then the Coordinator sends:

```http
Authorization: Bearer <access_token>
```

with the A2A request.

---

### 3. Sales Delegator validates the token

The Sales Delegator validates:

```text
✓ Token signature
✓ Issuer
✓ Audience
✓ Expiration
✓ Agent/service identity
✓ Required claims/scopes
```

For example:

```text
iss  → trusted Entra ID tenant
aud  → sales-delegator API
exp  → token not expired
scp  → required scope
```

If validation fails:

```text
401 Unauthorized
```

---

### 4. Authentication is different from authorization

This is an important interview point.

**Authentication:**

> "Who is calling me?"

```text
Coordinator → authenticated as coordinator-agent
```

**Authorization:**

> "Is coordinator-agent allowed to call me?"

```text
coordinator-agent
       ↓
sales-delegator
       ↓
Allowed
```

Even if the Coordinator is authenticated, it may not automatically have permission to execute every operation.

---

### 5. Don't trust this field

For example, this:

```json
{
  "from_agent": "coordinator"
}
```

is only **metadata**.

We don't say:

> "`from_agent=coordinator`, therefore I trust it."

Instead:

```text
A2A request
    +
Bearer token
    ↓
Identity validation
    ↓
Authenticated agent
    ↓
RBAC / scope validation
```

The trusted identity comes from the validated credential.

---

### 6. Worker authentication to MCP

The same principle applies when a Worker calls an MCP Server.

```text
Customer Worker
      ↓
MCP Client
      ↓ OAuth / workload identity
Salesforce MCP Server
      ↓
Salesforce
```

The MCP Server authenticates the Worker and then checks whether that Worker is allowed to call:

```text
get_customer
```

but perhaps not:

```text
delete_customer
```

---

### Interview-ready answer

> **“In CWD, we authenticate agents using enterprise workload identity. In Azure, we use Microsoft Entra ID with managed or workload identities. Each Coordinator and Delegator has its own service identity. When the Coordinator sends an A2A request, it obtains an OAuth access token for the target agent and sends it with the request. The receiving Delegator validates the token's issuer, audience, signature, expiration, and required scopes. After authentication, RBAC or scope-based authorization determines whether that agent is allowed to perform the requested operation. We apply the same identity and authorization model when Workers access MCP tools.”**

**Easy interview line:**

> **“We don't authenticate an agent by its name; we authenticate its workload identity and then authorize its permissions.”**
