## How do you validate tool parameters?

Tool parameters are validated **before the Worker calls the MCP tool**. We use the MCP tool's **input schema plus business/security validation**.

### Simple flow

```text
Delegator
   ↓
Worker receives parameters
   ↓
Schema validation
   ↓
Business validation
   ↓
Security/authorization validation
   ↓
MCP Client
   ↓
MCP Tool
```

### Example: Salesforce

Suppose the Worker receives:

```json
{
  "customer_id": "C123"
}
```

Before calling:

```python
mcp_client.call_tool(
    "get_customer_profile",
    {"customer_id": "C123"}
)
```

the Worker checks:

**1. Required field**

```text
customer_id exists?
```

**2. Data type**

```text
customer_id is a string?
```

**3. Format**

```text
Is C123 a valid customer ID format?
```

**4. Business validation**

```text
Does this customer exist?
Is this operation valid for this customer?
```

**5. Authorization**

```text
Is this Worker/user allowed to access this customer's data?
```

### Example of invalid input

```json
{
  "customer_id": ""
}
```

The Worker should **not call Salesforce**.

Instead:

```text
Validation failed
      ↓
Return structured error
      ↓
Delegator handles the failure
```

### Where validation happens?

There can be multiple layers:

```text
Worker
  ↓
Input/schema validation
  ↓
MCP Server
  ↓
Tool-level validation
  ↓
Enterprise API
  ↓
Final authorization/data validation
```

This is **defense in depth**. The Worker should not assume that validation at one layer is enough.

### Interview-ready

> “Before invoking an MCP tool, the Worker validates the parameters against the tool's input schema and applies business and security checks. The MCP Server should validate them again before accessing the enterprise system. This prevents malformed, unauthorized, or unsafe requests from reaching systems like Salesforce or ServiceNow.”

**One-line memory:**
**Schema validation → business validation → authorization → MCP tool call.**
