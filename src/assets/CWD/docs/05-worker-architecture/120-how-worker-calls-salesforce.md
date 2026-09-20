## How does a Worker call Salesforce?

In CWD, the **Worker normally does not call Salesforce directly**. It calls an **MCP tool**, and the MCP Server handles the Salesforce integration.

### Step-by-step

```text
Sales Delegator
      ↓
CustomerProfileWorker
      ↓
MCP Client
      ↓
MCP Server
      ↓
Salesforce API
      ↓
Customer Data
      ↓
Worker
```

### Example

The Delegator sends:

```python
{
    "customer_id": "C123"
}
```

The Worker calls an MCP tool:

```python
result = await mcp_client.call_tool(
    "get_customer_profile",
    {
        "customer_id": "C123"
    }
)
```

The MCP Server receives this request and internally calls Salesforce:

```text
MCP Server
   ↓
Salesforce REST API / SOQL
   ↓
Customer C123
```

The Salesforce response comes back:

```text
Salesforce
    ↓
MCP Server
    ↓
MCP Client
    ↓
CustomerProfileWorker
    ↓
Sales Delegator
```

### Why use MCP?

MCP separates the **Worker's business capability** from the **Salesforce integration details**.

The Worker only knows:

> “I need customer profile information.”

It doesn't need to know Salesforce authentication, API endpoints, connection management, etc. Those are handled by the MCP integration layer.

### CWD example

```text
CustomerProfileWorker
        |
        | customer_id = C123
        ↓
MCP Tool: get_customer_profile
        ↓
Salesforce MCP Server
        ↓
Salesforce
        ↓
Customer profile
```

**Interview-ready:**

> “In CWD, the Worker calls Salesforce through an MCP tool. The Worker sends the customer ID to the MCP Client, which invokes the Salesforce MCP Server. The MCP Server handles Salesforce authentication and API interaction, retrieves the data, and returns the structured result to the Worker.”

**One-line memory:**
**Worker → MCP Client → MCP Server → Salesforce → result back to Worker.**
