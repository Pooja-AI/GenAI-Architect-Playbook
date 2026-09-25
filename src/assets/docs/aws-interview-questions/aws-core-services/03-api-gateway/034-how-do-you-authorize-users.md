# How do you authorize users?

## Short answer

For CWD, I use **RBAC + fine-grained entitlement/ACL checks**.

Authentication tells me **who the user is**. Authorization determines **what that user is allowed to access or perform**.

```text id="0n5xw2"
User
 ↓
Entra ID / Cognito
 ↓
JWT claims
 ↓
API Gateway
 ↓
CWD Authorization Layer
 ↓
Role + Group + Resource Entitlement
 ↓
Coordinator
 ↓
Delegator
 ↓
Worker
 ↓
MCP / Enterprise System
```

## Key points

### 1. Get the user's identity

The identity provider provides claims such as:

```text id="1q5j6z"
User ID
Groups
Roles
Scopes
Tenant
```

Example:

```text id="w3r7p8"
User: pooja
Roles: Sales_User
Groups: Customer_Briefing
```

---

### 2. Check RBAC

I define roles and permissions.

Example:

```text id="4m8k2d"
Sales_User
    → Customer CRM data
    → Customer briefing

Service_User
    → ServiceNow incidents

Admin
    → Agent/configuration management
```

So when the user requests:

```text id="a7c9v2"
Customer Briefing
```

CWD checks whether the user has the required permission.

---

### 3. Use resource-level authorization

Role-based access alone may not be enough.

For example:

```text id="r2t6y8"
User can access Sales data
```

doesn't necessarily mean:

```text id="e1k4p7"
User can access EVERY customer
```

So I can apply:

```text id="c5d9h2"
User
 ↓
Role
 ↓
Customer entitlement
 ↓
Customer ID
 ↓
Allowed / Denied
```

For example:

```text id="m6q8s1"
User → Sales role
Customer → C12345
        ↓
Entitled?
   ├── Yes → Continue
   └── No  → 403 Forbidden
```

---

# 4. Authorization happens before tool execution

This is very important for CWD.

I don't let the LLM decide:

> "The user probably has access."

Instead:

```text id="b7v3n5"
User
 ↓
Authorization Policy
 ↓
Allowed?
 ↓
Worker
 ↓
MCP
 ↓
Salesforce / ServiceNow
```

The authorization decision is made by deterministic policy code/services.

---

# 5. MCP also enforces authorization

Even if CWD authorizes the request, the **MCP server should enforce its own authorization**.

```text id="z8x2c4"
CWD Authorization
       ↓
Worker
       ↓
MCP Server
       ↓
MCP Authorization
       ↓
Salesforce / ServiceNow
```

This provides **defense in depth**.

---

# 6. RAG authorization

For documents, I apply ACL filtering **before the LLM receives the content**.

Example:

```text id="h3j5k7"
User identity
    ↓
Groups / Entitlements
    ↓
Azure AI Search / OpenSearch
    ↓
ACL filter
    ↓
Only authorized documents
    ↓
RAG
    ↓
LLM
```

The LLM should never receive confidential documents and then be asked:

> "Please don't mention them."

The unauthorized data should be excluded **before retrieval/context construction**.

---

# 7. Example in CWD

Suppose the user asks:

> "Give me a briefing for customer C12345."

Flow:

```text id="p9r1t3"
User
 ↓
API Gateway
 ↓
JWT validation
 ↓
CWD Authorization
 ↓
Check Sales role
 ↓
Check C12345 entitlement
 ↓
Sales Delegator
 ↓
Customer Worker
 ↓
MCP
 ↓
Salesforce
```

If authorization fails:

```text id="v4n6b8"
Authorization failed
       ↓
403 Forbidden
       ↓
No Worker execution
       ↓
No Salesforce call
```

---

# 🎯 Strong interview answer

> **“I implement authorization using RBAC combined with fine-grained resource entitlements. After API Gateway authenticates the user, CWD extracts the user's roles, groups and identity from the token and checks whether the user is allowed to perform the requested operation and access the specific resource. For CWD, authorization is enforced before Worker and MCP execution, and downstream MCP servers also enforce their own policies. For RAG, I apply ACL and entitlement filters before retrieval so unauthorized documents never reach the LLM. The LLM never makes the authorization decision.”**

## Easy memory trick

**Who → Role → Resource → Permission → Execute**

### Key distinction

**Authentication:**

> Who are you?

**Authorization:**

> What are you allowed to access?

**ACL:**

> Which specific resources can you access?

**RBAC:**

> What can your role do?

**MCP authorization:**

> Is this specific tool operation allowed?

> **“Authenticate the user, authorize the action, filter the data, then execute.”**
