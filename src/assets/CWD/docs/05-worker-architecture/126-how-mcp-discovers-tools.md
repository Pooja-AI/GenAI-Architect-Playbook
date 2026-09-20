## How does MCP discover tools?

MCP uses a **tool discovery mechanism** where the **MCP Client asks the MCP Server what tools it provides**.

### Step-by-step

```text
Worker
  ↓
MCP Client
  ↓
"List available tools"
  ↓
MCP Server
  ↓
Tool definitions
  ↓
MCP Client
```

For example, a Salesforce MCP Server might expose:

```text
get_customer_profile
get_customer_orders
get_customer_contract
```

The server also provides information such as:

```text
Tool name
Description
Input parameters
Input schema
```

Example:

```json
{
  "name": "get_customer_profile",
  "description": "Retrieve customer information",
  "inputSchema": {
    "customer_id": "string"
  }
}
```

### Then how does the Worker use it?

```text
1. MCP Client connects to MCP Server
2. MCP Client discovers available tools
3. Worker/application selects an approved tool
4. MCP Client sends tool call
5. MCP Server executes the tool
6. Result returns to Worker
```

For CWD:

```text
CustomerProfileWorker
        ↓
MCP Client
        ↓
Discover tools
        ↓
get_customer_profile
        ↓
Salesforce MCP Server
        ↓
Salesforce
```

### Important security point

**Tool discovery does not mean every discovered tool is automatically allowed.**

CWD should apply **authorization and tool allowlisting** before execution.

```text
Discovered tool
      ↓
Is it registered?
      ↓
Is Worker authorized?
      ↓
Is operation allowed?
      ↓
Execute
```

So the MCP server says **“these tools are available,”** while CWD policy decides **“this Worker is allowed to use this tool.”**

**Interview-ready:**

> “MCP tool discovery happens when the MCP Client queries the MCP Server for its available tools and their schemas. The client receives the tool names, descriptions, and input schemas. In CWD, we still validate those tools against our registry and authorization policies before allowing a Worker to execute them.”

**One-line memory:**
**MCP Server advertises tools → MCP Client discovers them → CWD policy authorizes → Worker executes.**
