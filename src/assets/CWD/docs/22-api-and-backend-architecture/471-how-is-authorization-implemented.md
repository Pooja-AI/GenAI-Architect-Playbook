## How is authorization implemented in CWD?

In CWD, **authorization determines what an authenticated user or agent is allowed to access or execute**.

I implement it as **defense-in-depth**, not just at the API layer.

```text
User
 ↓
Entra ID Authentication
 ↓
APIM
 ↓
FastAPI Authorization
 ↓
Coordinator Policy Check
 ↓
Delegator / Worker Permission
 ↓
MCP Tool Authorization
 ↓
Enterprise System Authorization
```

### 1. User-level authorization

After Entra ID authenticates the user, I check their:

* roles
* groups
* scopes
* tenant
* business permissions

For example:

```text
User U123
   ↓
Role = Sales_Manager
   ↓
Allowed:
   Customer Worker
   Opportunity Worker

Not allowed:
   HR Worker
   Payroll Worker
```

---

### 2. Tenant-level authorization

CWD is designed for enterprise/possibly multi-tenant access, so I carry the trusted tenant context through the workflow.

```json
{
  "user_id": "U123",
  "tenant_id": "T001",
  "customer_id": "C12345"
}
```

Every downstream operation checks that the user and resource belong to the appropriate tenant.

```text
User tenant = T001
Customer tenant = T001
        ↓
       ALLOW
```

If:

```text
User tenant = T001
Customer tenant = T002
        ↓
       DENY
```

---

### 3. Resource-level authorization

This is important in the CWD Customer Briefing use case.

Being allowed to use the Customer Worker doesn't automatically mean the user can access **every customer**.

For example:

```text
User → Customer Worker → C12345
                       → C67890
                       → C99999
```

The authorization service checks whether the user is entitled to each customer.

```python
if not authz.can_access_customer(
    user_id=user_id,
    tenant_id=tenant_id,
    customer_id=customer_id
):
    raise PermissionError("Customer access denied")
```

---

### 4. Worker-level authorization

Each Worker has its own identity and permissions.

For example:

```text
Sales Delegator
   ├── Customer Worker ✓
   ├── Opportunity Worker ✓
   └── Incident Worker ✗
```

The Worker should only invoke capabilities it is authorized to use.

This prevents an agent from dynamically deciding:

> "I'll call this other sensitive tool."

The **policy layer decides**, not the LLM.

---

### 5. MCP tool-level authorization

This is another important security boundary.

Suppose the Customer Worker requests:

```python
await mcp_client.call_tool(
    "get_customer",
    {"customer_id": "C12345"}
)
```

The MCP server checks:

```text
Who is calling?
       ↓
Which Worker?
       ↓
Which tenant?
       ↓
Which tool?
       ↓
Which customer?
       ↓
Is this operation allowed?
```

Only after authorization succeeds does the MCP server call Salesforce.

```text
Worker
  ↓
MCP Server
  ↓
Authorization ✓
  ↓
Salesforce
```

---

### 6. Tool allowlisting

I don't give Workers unrestricted access to all MCP tools.

For example:

```python
WORKER_TOOLS = {
    "customer_worker": [
        "get_customer",
        "get_customer_contacts"
    ],
    "incident_worker": [
        "get_open_incidents",
        "get_incident_details"
    ]
}
```

So if an Incident Worker tries:

```text
delete_customer
```

the MCP authorization layer rejects it.

---

### 7. Read vs write authorization

I use stricter policies for write operations.

```text
READ
get_customer
get_incidents
get_sales_metrics
       ↓
Normal authorization

WRITE
create_order
update_customer
close_incident
       ↓
Stronger authorization
+ idempotency
+ potentially HITL
```

For sensitive operations, I can require human approval before execution.

---

### 8. Authorization is enforced outside the LLM

This is a critical interview point.

I don't rely on a prompt such as:

```text
"You are not allowed to access HR data."
```

The LLM could potentially generate an unauthorized tool call.

Instead:

```text
LLM decision
     ↓
Policy Enforcement
     ↓
MCP Authorization
     ↓
Enterprise System
```

The LLM can **request** a tool, but it cannot grant itself permission.

---

### 9. Example: Customer Briefing

Suppose the request is:

```text
"Give me a briefing for customer C12345."
```

The Coordinator identifies:

```text
Intent = Customer Briefing
Customer = C12345
```

Then:

```text
Authentication
      ↓
User authorized for Customer Briefing?
      ↓
Customer C12345 accessible?
      ↓
Sales Worker allowed?
      ↓
Salesforce tool allowed?
      ↓
ServiceNow tool allowed?
      ↓
Execute
```

If ServiceNow access is denied:

```json
{
  "status": "FORBIDDEN",
  "dependency": "ServiceNow",
  "operation": "get_open_incidents"
}
```

The system **does not bypass authorization** just because the Customer Briefing needs the information.

---

## Authentication vs Authorization

| Authentication   | Authorization                   |
| ---------------- | ------------------------------- |
| Who are you?     | What can you do?                |
| Entra ID         | RBAC/ABAC/policy                |
| Token validation | Permission checks               |
| Happens first    | Happens after identity          |
| User identity    | User + tenant + resource + tool |

### Interview-ready answer

> **“In CWD, authorization is implemented as defense-in-depth. After Entra ID authenticates the user, we enforce authorization based on roles, scopes, tenant, resource-level permissions, Worker identity, and MCP tool permissions. For example, a user may be authorized to use the Customer Worker but still not have access to a particular customer. The MCP server independently validates the Worker identity, user context, tenant, resource, and requested tool before calling Salesforce or ServiceNow. Read and write operations have different policies, with sensitive writes potentially requiring HITL. Most importantly, the LLM never grants itself permission; authorization is enforced deterministically outside the model.”**

### Easy memory

**User → Tenant → Resource → Worker → Tool → Action**

**Strong interview line:**

> **“Authentication establishes identity; authorization is enforced at every trust boundary to determine exactly what that identity can access or execute.”**
