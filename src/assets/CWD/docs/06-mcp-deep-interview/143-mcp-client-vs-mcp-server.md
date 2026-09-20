## MCP Client vs MCP Server

The easiest way to remember:

> **MCP Client = connects to and calls MCP tools.**
> **MCP Server = exposes and executes MCP tools.**

### In your CWD architecture

```text
Coordinator
     ↓
Delegator
     ↓
Worker
     │
     │
     ▼
 MCP Client
     │
     │ MCP protocol
     ▼
 MCP Server
     │
     ▼
Enterprise Tool
     │
     ├── Salesforce
     ├── ServiceNow
     └── SharePoint
```

### What does the MCP Client do?

The **MCP Client lives with the AI application/Worker side** and communicates with an MCP Server.

Its responsibilities include:

* Connect to MCP Server
* Discover available tools
* Read tool schemas
* Send tool requests
* Pass parameters
* Receive tool results
* Handle connection/timeouts/errors

For example, the Worker needs customer information:

```python
result = await mcp_client.call_tool(
    "get_customer",
    {
        "customer_id": "C123"
    }
)
```

The Client sends that request to the appropriate MCP Server.

---

### What does the MCP Server do?

The **MCP Server exposes capabilities as MCP tools**.

For example:

```text
Salesforce MCP Server

Tools:
  get_customer()
  get_opportunities()
  get_contacts()
```

The server receives:

```text
get_customer(customer_id="C123")
```

and performs the actual integration:

```text
MCP Server
    ↓
Validate parameters
    ↓
Check authorization
    ↓
Call Salesforce API
    ↓
Get response
    ↓
Return MCP result
```

---

## CWD example: Salesforce

Imagine your Sales Worker needs customer information.

### Step 1 — Worker decides what it needs

```text
Customer ID = C123

Need:
get_customer(C123)
```

### Step 2 — MCP Client sends request

```text
Worker
  ↓
MCP Client
  ↓
"Call get_customer with C123"
```

### Step 3 — MCP Server handles it

```text
MCP Server
  ↓
Validate C123
  ↓
Authorize Worker
  ↓
Salesforce API
```

### Step 4 — Response comes back

```text
Salesforce
  ↓
MCP Server
  ↓
MCP Client
  ↓
Worker
  ↓
Delegator
  ↓
Coordinator
```

---

## Side-by-side

| MCP Client                         | MCP Server                             |
| ---------------------------------- | -------------------------------------- |
| Runs on AI application/Worker side | Runs on tool/integration side          |
| Connects to server                 | Exposes tools                          |
| Discovers tools                    | Provides tool definitions              |
| Calls tools                        | Executes tools                         |
| Sends parameters                   | Validates/handles parameters           |
| Receives results                   | Returns results                        |
| Doesn't own Salesforce integration | Can encapsulate Salesforce integration |
| Example: Worker MCP client         | Example: Salesforce MCP server         |

### Very important distinction

The **MCP Server doesn't necessarily mean the enterprise system itself**.

For example:

```text
Worker
  ↓
MCP Client
  ↓
Salesforce MCP Server
  ↓
Salesforce REST API
  ↓
Salesforce
```

The MCP Server is an **adapter/tool server** that exposes Salesforce capabilities through MCP.

---

## 🎯 Strong interview answer

> **"The MCP Client is the component on the AI application side that connects to an MCP Server, discovers available tools, sends tool calls, and receives results. The MCP Server exposes the tools and handles the actual tool execution and integration with enterprise systems. In our CWD architecture, the Worker used an MCP Client to call tools exposed by MCP Servers for Salesforce, ServiceNow, and SharePoint. This separation kept the Worker decoupled from the underlying enterprise APIs."**

### One-line memory trick

> **Client calls → Server exposes and executes.**
