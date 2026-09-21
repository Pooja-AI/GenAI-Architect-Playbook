## How is authorization implemented in CWD?

In CWD, **authentication tells us who the caller is; authorization decides what that identity is allowed to do.**

I implement authorization at **multiple layers**, not just at the API gateway.

### CWD authorization flow

```text id="q4s8x2"
User
  ↓
Entra ID
  ↓
FastAPI / APIM
  ↓  Authorization
Coordinator
  ↓
A2A
  ↓  Agent-level authorization
Delegator
  ↓
Worker
  ↓
MCP Server
  ↓  Tool + Data authorization
Salesforce / ServiceNow / SharePoint
```

### 1. API-level authorization

After validating the user's Entra ID token, CWD checks the user's:

* Roles
* Scopes
* Groups/claims
* Tenant
* Required permissions

For example:

```text
User → Customer Briefing → allowed
User → Delete Customer Record → not allowed
```

APIM/FastAPI can reject unauthorized requests before they reach the Coordinator.

---

### 2. Coordinator authorization

The Coordinator determines whether the authenticated user is allowed to request the capability.

For example:

```text
Request: "Give me customer briefing for C12345"

User permissions:
    customer.read = YES
    incident.read = YES
```

Coordinator can route:

```text
Sales Delegator → Customer Worker
IT Delegator    → Incident Worker
```

But if the user doesn't have `incident.read`, CWD should not invoke the IT capability.

**Important:** routing and authorization are separate.

> Coordinator decides **which Delegator is needed**; authorization decides **whether the request is permitted**.

---

### 3. Delegator authorization

Each Delegator can have its own allowed capabilities.

Example:

```text
Sales Delegator
 ├── customer.read
 ├── opportunity.read
 └── sales_history.read

IT Delegator
 ├── incident.read
 ├── ticket.create
 └── knowledge.read
```

So the Sales Delegator cannot simply invoke an IT operation because the Coordinator asked it to.

---

### 4. Worker authorization

Workers have **least-privilege identities**.

For example:

```text
Customer Worker
    → customer.read

Incident Worker
    → incident.read

Ticket Worker
    → ticket.create
```

If the Incident Worker attempts:

```text
delete_customer()
```

the authorization layer rejects it.

---

### 5. MCP authorization

This is a particularly important CWD security boundary.

```text id="x8m1pr"
Worker
   ↓
MCP Client
   ↓
MCP Server
   ↓
Authorization Check
   ↓
Enterprise Tool
```

The MCP Server should independently verify:

1. Who is calling?
2. Is this Worker allowed to call this tool?
3. Are the parameters valid?
4. Is the user allowed to perform this operation?
5. Is the requested resource within the user's entitlement?

For example:

```text
Worker: incident-worker
Tool: get_incidents
customer_id: C12345

Worker allowed to call tool?       YES
User allowed to view incidents?    YES
User entitled to C12345?           YES

→ Execute
```

If any required check fails:

```text
→ DENY
→ Audit
→ Return authorization error
```

---

### 6. Data-level authorization

This is where **entitlement** becomes important.

Suppose the user is authorized to read customer information generally, but only for customers in their assigned region.

```text
User entitlement:
Region = North America

Request:
customer_id = C12345
Customer region = Europe
```

The user may be authenticated and have `customer.read`, but the request can still be denied because they don't have entitlement to that specific customer's data.

For RAG, I also apply **metadata/ACL filtering before returning documents**.

```text
User
 ↓
Query
 ↓
Azure AI Search
 ↓
ACL / entitlement filtering
 ↓
Only authorized documents
 ↓
LLM
```

The LLM should never receive documents the user isn't authorized to see.

---

### 7. Authorization for sensitive operations

For write/delete operations, I use stronger controls.

Example:

```text
Worker
 ↓
"Create ServiceNow ticket"
 ↓
Authorization
 ↓
Risk / Policy Check
 ↓
HITL approval if required
 ↓
MCP
 ↓
ServiceNow
```

**HITL is not a replacement for authorization.**

Even if a human approves something, the MCP/enterprise authorization layer should still enforce the actual permissions.

---

### Interview-ready answer

> **“In CWD, authorization is implemented as a layered, least-privilege model. After authenticating the user through Entra ID, we validate roles, scopes, and claims at the API and Coordinator layers. The Coordinator only routes requests to capabilities the user is authorized to access. Delegators and Workers have their own restricted identities and permissions. At the MCP boundary, the MCP Server independently authorizes the Worker, tool, operation, and resource before calling systems such as Salesforce or ServiceNow. For RAG, we enforce ACL and entitlement filtering before documents reach the LLM. For sensitive write operations, we can add policy checks and human approval. This gives us defense in depth rather than relying on a single authorization check.”**

### Easy memory

**Who are you? → Authentication**

**What can you do? → Authorization**

**Which data can you access? → Entitlement**

**Can this operation proceed? → Policy + authorization**
