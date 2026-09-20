## How do you prevent unauthorized tool execution?

We use **multiple authorization layers** so a Worker cannot call an MCP tool just because it discovered or requested it.

### Simple flow

```text
Worker
   ↓
Request MCP Tool
   ↓
Tool Allowlist / Registry
   ↓
Authorization Check
   ↓
MCP Server
   ↓
Enterprise System
```

### Example

Suppose:

```text
CustomerProfileWorker → get_customer_profile → Salesforce
```

But the Worker tries:

```text
CustomerProfileWorker → delete_customer
```

The request should be rejected because `delete_customer` is **not an approved tool for that Worker**.

### Main controls

**1. Tool allowlist**

The Worker Registry defines which tools a Worker can use:

```text
CustomerProfileWorker
  Allowed:
    ✓ get_customer_profile
    ✓ get_customer_orders

  Not allowed:
    ✗ delete_customer
    ✗ update_contract
```

**2. Identity-based authorization**

The Worker runs with a controlled identity, such as an **Entra ID Managed Identity/service identity**.

The MCP Server verifies:

```text
Who is calling?
Which Worker?
Which tool?
Which operation?
```

**3. RBAC / policy checks**

Policy verifies whether that Worker/service identity has permission to execute the requested operation.

**4. MCP Server enforcement**

Authorization should also be enforced at the **MCP Server**, not only in the Worker.

This is important because a malicious or compromised Worker should not be able to bypass the policy.

**5. Enterprise-system authorization**

Salesforce/ServiceNow should perform their own authorization as the final layer.

```text
Worker
 ↓
Worker Allowlist
 ↓
Identity / RBAC
 ↓
MCP Server Authorization
 ↓
Salesforce/ServiceNow Authorization
```

### Important point

**Tool discovery ≠ permission.**

Even if the MCP Server advertises:

```text
get_customer_profile
delete_customer
```

the Worker should only be allowed to execute tools explicitly authorized for its role and context.

### Interview-ready

> “We prevent unauthorized tool execution using defense-in-depth authorization. The Worker is restricted by a tool allowlist, its service identity is authenticated, RBAC and policy checks verify the operation, and the MCP Server enforces authorization before executing the tool. The downstream enterprise system also performs its own authorization. So tool discovery never automatically grants permission.”

**One-line memory:**
**Discover ≠ authorize → allowlist + identity + policy + MCP enforcement + enterprise authorization.**
