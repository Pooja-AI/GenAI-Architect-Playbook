## How does a Worker call ServiceNow?

In CWD, the **Worker calls ServiceNow through an MCP tool**, similar to Salesforce.

### Step-by-step

```text
IT/Service Delegator
        ↓
IncidentWorker
        ↓
MCP Client
        ↓
MCP Server
        ↓
ServiceNow API
        ↓
Incident/Ticket Data
        ↓
IncidentWorker
```

### Example

Suppose the user asks for a customer briefing for `customer_id = C123`.

The Delegator sends the ID to the `IncidentWorker`:

```python
{
    "customer_id": "C123"
}
```

The Worker calls the MCP tool:

```python
result = await mcp_client.call_tool(
    "get_customer_incidents",
    {
        "customer_id": "C123"
    }
)
```

The **ServiceNow MCP Server** then handles the actual ServiceNow integration:

```text
MCP Server
    ↓
ServiceNow REST API / Table API
    ↓
Find incidents for C123
    ↓
Return incident data
```

The result comes back:

```text
ServiceNow
    ↓
MCP Server
    ↓
MCP Client
    ↓
IncidentWorker
    ↓
IT/Service Delegator
```

### Example result

```python
{
    "customer_id": "C123",
    "incidents": [
        {
            "incident_id": "INC001234",
            "status": "Open",
            "priority": "High",
            "summary": "Network connectivity issue"
        }
    ]
}
```

### Important distinction

The Worker **does not need to know all ServiceNow API details**.

```text
Worker
  → "Get incidents for customer C123"

MCP Server
  → Authentication
  → ServiceNow API call
  → Response mapping
```

This keeps the Worker focused on its **business capability**, while MCP handles the **system integration**.

**Interview-ready:**

> “In CWD, the IncidentWorker calls ServiceNow through an MCP tool. It passes the customer ID to the MCP Client, which invokes the ServiceNow MCP Server. The MCP Server handles authentication and the ServiceNow API call, retrieves the incidents, and returns the structured result to the Worker.”

**One-line memory:**
**IncidentWorker → MCP Client → ServiceNow MCP Server → ServiceNow → result.**
