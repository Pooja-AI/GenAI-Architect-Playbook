## How does the Worker pass parameters?

The Worker passes parameters to the MCP tool as a **structured JSON object**. The parameters come from the input received from the Delegator and the Worker’s required tool schema.

### Simple flow

```text
Delegator
   ↓
Worker
   ↓
Build tool parameters
   ↓
MCP Client
   ↓
MCP Tool
   ↓
MCP Server
   ↓
Salesforce / ServiceNow
```

### Example: Salesforce

The Delegator sends:

```json
{
  "customer_id": "C123"
}
```

The Worker prepares the MCP tool call:

```python
result = await mcp_client.call_tool(
    "get_customer_profile",
    {
        "customer_id": "C123"
    }
)
```

The MCP Server receives:

```json
{
  "customer_id": "C123"
}
```

and uses it to call Salesforce.

### Example: ServiceNow

```python
result = await mcp_client.call_tool(
    "get_customer_incidents",
    {
        "customer_id": "C123",
        "status": "open"
    }
)
```

### Where does the parameter come from?

```text
User Request
     ↓
Coordinator extracts customer_id
     ↓
Delegator passes customer_id
     ↓
Worker builds tool input
     ↓
MCP Tool
```

The Worker should pass **only the parameters required by the tool**, not the entire conversation or unnecessary context.

### Important

The MCP tool has an **input schema**, for example:

```text
get_customer_profile
Required:
    customer_id: string
```

The Worker validates the parameters against that schema before calling the tool.

**Interview-ready:**

> “The Worker passes parameters to an MCP tool as structured JSON. For example, if the Delegator provides customer_id `C123`, the Worker validates it against the tool schema and calls `get_customer_profile` with that parameter. MCP then passes the validated request to the underlying enterprise system.”

**One-line memory:**
**Delegator provides context → Worker builds structured parameters → MCP tool executes.**
