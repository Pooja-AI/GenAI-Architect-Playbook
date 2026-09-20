In **CWD**, authorization determines **what an authenticated agent is allowed to do**.

### Simple flow

```text
Coordinator
    ↓ A2A + identity
Sales Delegator
    ↓
Authenticate → Who are you?
    ↓
Authorize → What are you allowed to do?
    ↓
Execute
```

### 1. Define permissions for each agent

For example:

| Agent           | Allowed                   |
| --------------- | ------------------------- |
| Coordinator     | Invoke Delegators         |
| Sales Delegator | Invoke Sales Workers      |
| IT Delegator    | Invoke IT Workers         |
| Customer Worker | Read customer information |
| Incident Worker | Read ServiceNow incidents |

So, for example:

```text
Customer Worker
   ✓ get_customer
   ✓ get_customer_history
   ✗ delete_customer
   ✗ update_customer
```

---

### 2. Use RBAC / scopes

In Azure CWD, we can use **Microsoft Entra ID roles/scopes**.

Conceptually:

```text
agent-sales-delegator
        ↓
Role: SalesAgent
        ↓
Permissions:
  customer.read
  opportunity.read
  account.read
```

The Worker can then invoke only operations covered by its permissions.

---

### 3. Check authorization before execution

Suppose the Sales Delegator receives:

```json
{
  "intent": "customer_briefing",
  "customer_id": "C12345"
}
```

Before executing a Worker:

```python
if not authz.is_allowed(
    agent_id="sales-delegator",
    action="customer.read",
    resource="customer:C12345"
):
    raise PermissionError("Not authorized")
```

Only after authorization succeeds:

```text
Sales Delegator
      ↓
Authorization check
      ↓ allowed
Customer Worker
      ↓
MCP
      ↓
Salesforce
```

---

### 4. Resource-level authorization

Authorization shouldn't only check **what operation** the agent can perform.

It can also check **which data** it can access.

For example:

```text
Action: customer.read
Resource: customer:C12345
Agent: sales-delegator
```

The authorization layer checks:

```text
✓ Agent has customer.read
✓ Agent belongs to correct tenant
✓ Customer is within agent's entitlement
✓ Request is allowed
```

Then the Worker proceeds.

---

### 5. MCP authorization is another layer

In CWD:

```text
Coordinator
   ↓ A2A
Sales Delegator
   ↓
Customer Worker
   ↓ MCP
Salesforce MCP Server
```

Even if the Worker is authorized to run, the **MCP Server independently checks** whether that Worker can call the requested tool.

```text
Customer Worker
      ↓
MCP: get_customer
      ↓
Tool authorization
      ↓ allowed
Salesforce API
```

This gives **defense in depth**.

---

### Authentication vs Authorization

|                            | Question                  | CWD example             |
| -------------------------- | ------------------------- | ----------------------- |
| **Authentication**         | Who are you?              | `agent-sales-delegator` |
| **Authorization**          | What can you do?          | `customer.read`         |
| **Resource authorization** | What data can you access? | `customer:C12345`       |

### Interview-ready answer

> **“In CWD, authorization is performed after agent authentication. Each Coordinator, Delegator, and Worker has defined roles or scopes that determine which agents, workers, tools, and resources they can access. For example, the Sales Delegator can invoke customer-related Workers, while a Customer Worker may have `customer.read` permission but not `customer.delete`. Before executing a task, we validate the agent's role, scope, tenant, resource entitlement, and required action. The MCP layer performs another authorization check before allowing access to enterprise tools such as Salesforce or ServiceNow. This gives us least-privilege and defense-in-depth security.”**

**Easy way to remember:**

> **Authentication = Who are you?**
> **Authorization = What are you allowed to do?**
> **Entitlement = Which data are you allowed to access?**
