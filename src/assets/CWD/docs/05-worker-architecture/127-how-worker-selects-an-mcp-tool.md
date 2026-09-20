## How does the Worker select an MCP tool?

The Worker selects an MCP tool based on its **predefined capability-to-tool mapping**. It should not randomly choose tools.

### Simple flow

```text
Delegator
   ↓
CustomerProfileWorker
   ↓
Worker configuration / Tool Registry
   ↓
get_customer_profile
   ↓
MCP Client
   ↓
Salesforce MCP Server
```

### Example

Suppose the Worker needs to retrieve customer information.

Its configuration might say:

```text
Worker: CustomerProfileWorker

Capability:
customer_profile

Approved MCP Tool:
get_customer_profile
```

So the Worker invokes:

```python
result = await mcp_client.call_tool(
    "get_customer_profile",
    {"customer_id": "C123"}
)
```

### What if multiple tools exist?

For example:

```text
Salesforce MCP Server
 ├── get_customer_profile
 ├── get_customer_orders
 ├── get_customer_contract
 └── update_customer
```

`CustomerProfileWorker` should only have access to the tools required for its capability:

```text
CustomerProfileWorker
        ↓
Allowed:
get_customer_profile
```

It should **not** automatically have permission to call:

```text
update_customer
```

### Where does LLM fit?

If the Worker is an LLM-based Worker, the LLM can help determine **which approved tool matches the task**, but the available tools should be constrained by configuration and authorization.

```text
Worker task
   ↓
LLM proposes tool
   ↓
Tool Registry / Allowlist
   ↓
Authorization
   ↓
MCP Client
   ↓
MCP Server
```

So the LLM **proposes**, but policy **controls** what can actually execute.

### Interview-ready

> “The Worker selects an MCP tool based on its capability and approved tool configuration. For example, CustomerProfileWorker is mapped to `get_customer_profile`. If an LLM is involved, it can select from the Worker’s allowed tools, but authorization and tool policies validate the selection before execution.”

**One-line memory:**
**Worker capability → approved tool → authorization → MCP call.**
