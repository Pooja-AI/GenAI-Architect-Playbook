## What is an MCP Tool?

An **MCP Tool** is a **specific executable capability exposed by an MCP Server** that an AI agent or Worker can invoke.

In simple terms:

> **An MCP Tool is a function that allows an AI Worker to perform an action or retrieve information from an external system.**

### In your CWD architecture

```text
Worker
   │
   │ MCP Client
   ▼
MCP Server
   │
   ├── get_customer()
   ├── get_opportunities()
   ├── get_incidents()
   └── search_documents()
```

Each item is an **MCP Tool**.

For example:

```text
Tool:
    get_customer

Input:
    customer_id = "C123"

Output:
    customer details
```

### CWD Salesforce example

Suppose the Sales Worker needs customer information.

The MCP Server exposes:

```text
get_customer(customer_id)
```

The Worker calls:

```python
result = await mcp_client.call_tool(
    "get_customer",
    {
        "customer_id": "C123"
    }
)
```

The flow becomes:

```text
Sales Worker
     ↓
MCP Client
     ↓
get_customer(C123)
     ↓
Salesforce MCP Server
     ↓
Salesforce API
     ↓
Customer data
     ↓
Worker
```

### What does an MCP Tool contain?

Conceptually, a tool has:

```text
Tool Name
Description
Input Schema
Execution Logic
Output
```

Example:

```json
{
  "name": "get_customer",
  "description": "Retrieve customer information from Salesforce",
  "inputSchema": {
    "type": "object",
    "properties": {
      "customer_id": {
        "type": "string"
      }
    },
    "required": ["customer_id"]
  }
}
```

The schema tells the AI application:

> **"This tool exists, this is what it does, and these are the parameters it accepts."**

### Tool vs MCP Server

This distinction is important in interviews:

```text
MCP Server
    │
    ├── Tool 1: get_customer()
    ├── Tool 2: get_opportunities()
    ├── Tool 3: get_contacts()
    └── Tool 4: create_ticket()
```

**MCP Server = container/provider of capabilities**

**MCP Tool = one specific capability**

### Tool vs Function

They can look very similar:

```text
Python function:
get_customer(customer_id)

MCP Tool:
get_customer(customer_id)
```

But the important difference is **how the capability is exposed and accessed**.

A normal Python function may only exist inside your application.

An MCP Tool is exposed through the **MCP protocol**, allowing an MCP client to discover its schema and invoke it through the MCP server.

### 🎯 Interview answer

> **"An MCP Tool is a specific executable capability exposed by an MCP Server. It has a name, description, input schema, and execution logic. In our CWD project, for example, the Salesforce MCP Server could expose tools such as `get_customer`, `get_opportunities`, and `get_contacts`. The Worker discovers the available tools through the MCP Client and invokes the required tool with validated parameters. The MCP Server then executes the underlying enterprise operation and returns the result."**

### Memory trick

> **MCP Server = toolbox**
> **MCP Tool = one tool inside the toolbox**
> **MCP Client = the Worker using the toolbox**
