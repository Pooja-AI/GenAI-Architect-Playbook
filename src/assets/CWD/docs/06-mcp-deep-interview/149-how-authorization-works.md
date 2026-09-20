In your **CWD architecture**, authorization answers:

> **“The user/Worker is authenticated — but what exactly is it allowed to access or execute?”**

### 1. Authorization flow

```text
User
  ↓
Entra ID
  ↓
Access Token
  ↓
FastAPI / API Gateway
  ↓
Coordinator
  ↓ A2A
Delegator
  ↓ A2A
Worker
  ↓ MCP
MCP Server
  ↓
Authorization Check
  ↓
Allowed MCP Tool
  ↓
Salesforce / ServiceNow / SharePoint
```

### 2. Example from your Customer Briefing use case

User asks:

```text
"Give me a customer briefing for C123"
```

The Coordinator determines:

```text
Intent = Customer Briefing
customer_id = C123
```

Suppose the request needs:

```text
Sales Delegator
 ├── Customer Worker → get_customer()
 └── Opportunity Worker → get_opportunities()

IT Delegator
 └── Incident Worker → get_incidents()
```

Authorization checks whether each component is actually allowed to perform those operations.

For example:

| Caller             | Tool                | Permission |
| ------------------ | ------------------- | ---------- |
| Customer Worker    | `get_customer`      | ✅ Allowed  |
| Opportunity Worker | `get_opportunities` | ✅ Allowed  |
| Sales Worker       | `delete_customer`   | ❌ Denied   |
| Sales Worker       | `get_incidents`     | ❌ Denied   |
| IT Worker          | `get_incidents`     | ✅ Allowed  |

---

### 3. Where does authorization happen?

You should think of it as **defense in depth**, not one single check.

#### Layer 1 — API authorization

FastAPI checks the user's roles/scopes.

```python
if "customer.read" not in user_scopes:
    raise Forbidden()
```

---

#### Layer 2 — Agent/Worker authorization

The Worker should only receive tools it is permitted to use.

For example:

```python
sales_tools = [
    "get_customer",
    "get_opportunities"
]

it_tools = [
    "get_incidents",
    "search_knowledge"
]
```

The Sales Worker shouldn't even be exposed to sensitive IT tools if it doesn't need them.

---

#### Layer 3 — MCP Server authorization

This is a **critical security boundary**.

Even if the Worker asks:

```python
await mcp.call_tool(
    "delete_customer",
    {"customer_id": "C123"}
)
```

the MCP Server should independently check:

```python
if not authorized(caller, "delete_customer"):
    raise PermissionError("Tool not authorized")
```

So the Worker cannot bypass MCP security simply by constructing a tool call.

---

### 4. Data-level authorization

Authorization isn't only about tools.

Suppose the Worker is allowed to call:

```text
get_customer(C123)
```

It doesn't automatically mean it can access **every customer's data**.

You can enforce:

```text
User
 ↓
Role / entitlement
 ↓
Customer access
 ↓
Data filtering
 ↓
C123
```

For Azure AI Search, for example, you can use **metadata/ACL filters** so the search only returns documents the user is entitled to see.

---

### 5. Destructive operations need stronger authorization

For read operations:

```text
get_customer()
get_incidents()
search_documents()
```

normal authorization may be sufficient.

For sensitive operations:

```text
delete_customer()
update_customer()
close_incident()
send_email()
```

you can require additional controls such as:

```text
Authorization
    ↓
RBAC
    ↓
Policy check
    ↓
HITL approval
    ↓
Execute
```

This is especially important for **write/delete tools**.

---

### 6. Simple code example

A simplified MCP authorization layer could look like:

```python
POLICIES = {
    "SalesWorker": {
        "get_customer",
        "get_opportunities"
    },
    "ITWorker": {
        "get_incidents",
        "search_knowledge"
    }
}

def authorize(worker, tool):
    allowed_tools = POLICIES.get(worker, set())

    if tool not in allowed_tools:
        raise PermissionError(
            f"{worker} is not authorized to use {tool}"
        )

    return True
```

Then:

```python
async def call_mcp_tool(worker, tool, arguments):

    authorize(worker, tool)

    return await mcp_client.call_tool(
        tool,
        arguments
    )
```

In production, the policy would typically be backed by **Entra ID roles/scopes, RBAC/ABAC policies, service identity, entitlement data, and enterprise-system permissions**, rather than a hardcoded dictionary.

---

## Strong interview answer

> **“In CWD, authorization is enforced at multiple layers. First, we validate the user's scopes and roles at the API layer. Then we restrict which Delegators and Workers can access particular capabilities. At the MCP layer, the MCP Server performs an independent authorization check before executing a tool. We also enforce data-level permissions using user entitlements and ACL filtering, especially for enterprise search. For sensitive write or delete operations, we add stronger policy checks and, where required, human approval. This follows a defense-in-depth and least-privilege approach.”**

### Easy memory trick

**Authentication = Who are you?**

**Authorization = What can you access?**

**Tool authorization = Which MCP tool can you call?**

**Data authorization = Which records can you see?**

**HITL = Can you perform this sensitive action?**
