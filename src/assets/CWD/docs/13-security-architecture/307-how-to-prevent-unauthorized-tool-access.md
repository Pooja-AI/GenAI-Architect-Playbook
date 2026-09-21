## How do you prevent unauthorized tool access?

**Unauthorized tool access** means an Agent/Worker tries to call an MCP tool that it, the user, or the current task is **not allowed to use**.

In CWD, I use **layered authorization** rather than trusting the LLM.

### CWD flow

```text
User
 ↓
Entra ID
 ↓
Coordinator
 ↓
Delegator
 ↓
Worker Identity
 ↓
MCP Client
 ↓
MCP Server
 ↓
Tool Authorization
 ├── Agent identity
 ├── User permission
 ├── Tool permission
 ├── Customer/data entitlement
 └── Business policy
 ↓
Allow / Block
 ↓
Salesforce / ServiceNow
```

### 1. Give each Worker a separate identity

For example:

```text
Customer Worker  → customer-worker
Incident Worker  → incident-worker
Ticket Worker    → ticket-worker
```

Don't give every Worker a shared `admin` identity.

---

### 2. Use least-privilege permissions

Example:

```text
Customer Worker
   → customer.read

Incident Worker
   → incident.read

Ticket Worker
   → ticket.create
```

The Customer Worker should **not** have:

```text
customer.delete
ticket.create
admin.*
```

---

### 3. Maintain a tool allowlist

For example:

```python
WORKER_TOOLS = {
    "customer_worker": [
        "get_customer"
    ],
    "incident_worker": [
        "get_incidents"
    ],
    "ticket_worker": [
        "get_incidents",
        "create_ticket"
    ]
}
```

If `customer_worker` tries:

```text
create_ticket()
```

the application blocks it.

---

### 4. Validate the user AND Worker

There are two separate questions:

```text
Is the user allowed?
        AND
Is this Worker allowed?
        ↓
Can the tool execute?
```

For example, a Worker may have permission to read incidents, but the **specific user may not be entitled to customer C12345**.

Both checks must pass.

---

### 5. MCP Server performs independent authorization

Don't rely only on the Worker.

```text
Worker
 ↓
MCP Client
 ↓
MCP Server
 ↓
Authenticate identity
 ↓
Check tool permission
 ↓
Validate parameters
 ↓
Check data entitlement
 ↓
Business policy
 ↓
Execute / BLOCK
```

This gives **defense in depth**.

---

### 6. Validate tool parameters

Suppose the Worker calls:

```json
{
  "tool": "get_incidents",
  "arguments": {
    "customer_id": "C12345"
  }
}
```

Before execution, validate:

* Is `get_incidents` allowed?
* Is `customer_id` valid?
* Is the Worker allowed to access this customer?
* Is the requested operation permitted?

---

### 7. Don't let the LLM authorize itself

This is very important in interviews.

If an LLM says:

> "Call `delete_customer` because the user requested it."

that **does not mean the tool should execute**.

The LLM can **suggest** a tool call.

The application/MCP security layer decides whether it is authorized.

---

### 8. Add stronger controls for sensitive tools

For tools such as:

```text
delete_customer()
create_purchase_order()
close_incident()
send_external_email()
```

I would add stronger policy controls, potentially including human approval.

```text
LLM
 ↓
Worker
 ↓
Policy Check
 ↓
HITL Approval if required
 ↓
MCP Authorization
 ↓
Tool
```

HITL is an additional control; it does **not replace authorization**.

---

### Interview-ready answer

> **“I prevent unauthorized tool access through layered, least-privilege authorization. Each Worker has its own identity and an allowlist of MCP tools it can use. Before execution, I validate the user identity, Worker identity, tool permission, parameters, and data entitlement. The MCP Server independently authenticates and authorizes every tool call, so we don't trust the LLM or the `tool_name` requested by the model. Sensitive write or delete operations can also require policy checks or human approval. Every allowed or blocked tool call is audited with the correlation ID and task ID.”**

### Easy memory

**Identity → Allowlist → Permission → Parameters → Entitlement → Policy → Execute → Audit**

**Strong interview line:**

> **“The LLM can choose a tool, but only the authorization layer can allow the tool to execute.”**
