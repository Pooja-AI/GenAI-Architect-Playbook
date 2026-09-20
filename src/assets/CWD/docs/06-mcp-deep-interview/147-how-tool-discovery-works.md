## How does MCP Tool Discovery work?

**Tool discovery is how the MCP Client learns what tools an MCP Server provides, what each tool does, and what parameters it accepts.**

In simple terms:

> **Client connects → asks what tools are available → Server returns tool definitions → Client/LLM can choose the appropriate tool.**

### In your CWD architecture

```text
Worker
   │
   │ 1. Connect
   ▼
MCP Client
   │
   │ 2. List available tools
   ▼
MCP Server
   │
   │ 3. Return tool definitions
   ▼
MCP Client
   │
   │
   ├── get_customer()
   ├── get_opportunities()
   ├── get_incidents()
   └── search_documents()
```

### Step-by-step

#### 1. Worker connects to MCP Server

The Worker has an MCP Client.

```text
Worker
   ↓
MCP Client
   ↓
Salesforce MCP Server
```

The client establishes the MCP connection and performs the protocol initialization/handshake.

---

#### 2. Client asks for available tools

The client can request the server's tool list.

Conceptually:

```text
tools/list
```

The request means:

> "Tell me which tools you expose."

---

#### 3. MCP Server returns tool definitions

For example:

```json
{
  "tools": [
    {
      "name": "get_customer",
      "description": "Retrieve customer information",
      "inputSchema": {
        "type": "object",
        "properties": {
          "customer_id": {
            "type": "string"
          }
        },
        "required": ["customer_id"]
      }
    },
    {
      "name": "get_opportunities",
      "description": "Retrieve customer opportunities",
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
  ]
}
```

Now the MCP Client knows:

```text
Tool name
Tool description
Input parameters
Parameter types
Required parameters
```

---

#### 4. Worker/LLM selects the appropriate tool

Suppose the request is:

> "Give me customer information for C123."

The LLM sees the available tool definitions and determines:

```text
Required capability:
get_customer

Arguments:
customer_id = C123
```

Then the Worker invokes:

```text
MCP Client
   ↓
tools/call
   ↓
get_customer
   ↓
customer_id = C123
```

---

#### 5. MCP Server executes the tool

```text
MCP Server
    ↓
Validate arguments
    ↓
Authorization
    ↓
Salesforce API
    ↓
Customer data
```

The result is returned to the Worker.

---

## Important: Discovery is NOT the same as tool selection

This is a good interview distinction.

### Tool discovery

Answers:

> **"What tools are available?"**

```text
get_customer
get_opportunities
get_contacts
```

### Tool selection

Answers:

> **"Which available tool should I use for this request?"**

For:

> "Show me customer C123's opportunities."

The LLM/Worker selects:

```text
get_opportunities(customer_id="C123")
```

So:

```text
Discovery
    ↓
Available tools
    ↓
Tool selection
    ↓
Parameter generation
    ↓
Tool invocation
    ↓
Result
```

---

## How this fits your CWD Worker

For example, your Sales Worker may connect to a Salesforce MCP Server.

```text
                Sales Worker
                     │
                     ▼
                MCP Client
                     │
             tools/list
                     │
                     ▼
          Salesforce MCP Server
                     │
                     ▼
      ┌─────────────────────────────┐
      │ get_customer                │
      │ get_opportunities            │
      │ get_contacts                 │
      │ search_accounts              │
      └─────────────────────────────┘
                     │
                     ▼
               Tool selection
                     │
                     ▼
             tools/call
                     │
                     ▼
              Salesforce
```

### Production consideration

You generally **shouldn't blindly expose every enterprise tool to every Worker**.

For example:

```text
Sales Worker
   → customer tools
   → opportunity tools

IT Worker
   → incident tools
   → knowledge-base tools
```

The MCP layer can be configured/governed so that a Worker only has access to the tools it is authorized to use.

That is particularly important for sensitive operations such as:

```text
delete_customer()
update_customer()
create_incident()
```

---

## 🎯 Strong interview answer

> **"MCP tool discovery happens when the MCP Client connects to an MCP Server and requests the list of available tools. The server returns each tool's name, description, and input schema. The Worker or LLM can then use those definitions to determine which tool is appropriate and generate the required arguments. It invokes the selected tool through the MCP Client, and the MCP Server executes the underlying enterprise operation. In production, we also restrict tool exposure based on the Worker's permissions rather than allowing every Worker to access every tool."**

### Memory trick

> **`tools/list` → Discover**
> **LLM/Worker → Select**
> **`tools/call` → Execute**
