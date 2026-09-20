## MCP vs Function Calling

The easiest way to remember:

> **Function calling = the LLM decides to call a function.**
> **MCP = a standardized way to expose, discover, and invoke tools that an AI application can use.**

### In your CWD architecture

```text
Function Calling
────────────────────────

Worker / LLM
     │
     │ "Call get_customer()"
     ▼
Your application function
     │
     ▼
Salesforce API
```

With MCP:

```text
MCP
────────────────────────

Worker / LLM
     │
     │ MCP tool call
     ▼
MCP Client
     │
     ▼
MCP Server
     │
     ▼
Salesforce / ServiceNow / SharePoint
```

### Key differences

| Area                    | Function Calling                    | MCP                                    |
| ----------------------- | ----------------------------------- | -------------------------------------- |
| What is it?             | LLM/tool-calling capability         | Protocol for AI-to-tool integration    |
| Main purpose            | Let LLM request a function          | Standardize tool/context integration   |
| Tool definition         | Usually defined in application code | Exposed by MCP server                  |
| Tool discovery          | Application provides schemas        | MCP supports tool discovery            |
| Standard protocol       | No                                  | Yes                                    |
| Reusable across AI apps | Usually application-specific        | Designed for reuse                     |
| External systems        | You implement integration           | MCP server can encapsulate integration |
| Governance              | You build it                        | Can centralize it at MCP layer         |
| Example                 | `get_customer(customer_id)`         | MCP `get_customer` tool                |

### Important point

**MCP does not replace function calling.**

They can work together.

For example, your Worker may use an LLM that supports function/tool calling:

```python
response = llm.invoke(messages, tools=available_tools)
```

The LLM decides:

```text
I need customer information.
Call: get_customer
Arguments:
    customer_id = C123
```

Your application can then route that request through MCP:

```text
LLM
 │
 │ tool call
 ▼
Worker
 │
 │ MCP
 ▼
MCP Client
 │
 ▼
MCP Server
 │
 ▼
Salesforce
```

So **function calling can be the mechanism by which the model requests a tool**, while **MCP provides the standardized tool interface and protocol between the AI application and the tool server**.

### CWD example

Suppose the LLM receives:

> "Get the customer information for C123."

The model may produce a tool call:

```json
{
  "name": "get_customer",
  "arguments": {
    "customer_id": "C123"
  }
}
```

The Worker receives that tool request and invokes the corresponding MCP tool:

```python
result = await mcp_client.call_tool(
    "get_customer",
    {"customer_id": "C123"}
)
```

The MCP Server then handles the enterprise integration:

```text
get_customer(C123)
       ↓
MCP Server
       ↓
Authorization
       ↓
Parameter validation
       ↓
Salesforce API
       ↓
Normalized response
       ↓
Worker
       ↓
LLM
```

## 🎯 Strong interview answer

> **"Function calling is an LLM capability that allows the model to request execution of a predefined function or tool. MCP is a protocol that standardizes how AI applications discover and interact with external tools and context. In our CWD architecture, the LLM could use function calling to decide which capability it needs, while the Worker used MCP to invoke the corresponding enterprise tool. MCP gave us standardized tool discovery, reusable integrations, and a centralized point for authorization, validation, auditing, and error handling."**

### One-line memory trick

> **Function calling = the LLM says, "I want to use this tool."**
> **MCP = the standardized mechanism for connecting that tool to the AI application.**
