## MCP vs REST

The easiest way to remember it:

> **REST is a general-purpose API communication style. MCP is a standardized protocol designed specifically for AI applications to discover and use tools/context.**

### In your CWD architecture

```text
REST approach

Worker
   │
   │ HTTP GET /customers/C123
   ▼
Salesforce REST API
   │
   ▼
Salesforce
```

With MCP:

```text
Worker
   │
   │ MCP tool call: get_customer(C123)
   ▼
MCP Server
   │
   │ REST / SDK internally
   ▼
Salesforce
```

So **MCP can actually use REST internally**. They are not necessarily competing technologies.

### Key differences

| Area                   | REST                               | MCP                                                           |
| ---------------------- | ---------------------------------- | ------------------------------------------------------------- |
| Purpose                | General API communication          | AI-to-tool/context integration                                |
| Interface              | HTTP endpoints                     | Tools/resources/prompts                                       |
| Tool discovery         | Usually separate API documentation | Protocol supports capability/tool discovery                   |
| Input                  | HTTP parameters/body               | Structured tool arguments                                     |
| AI-oriented            | Not specifically                   | Yes                                                           |
| Enterprise APIs        | Excellent                          | Can wrap them                                                 |
| Reusability for agents | Requires integration work          | Designed around reusable tools                                |
| Authentication         | OAuth, API keys, JWT, etc.         | Can use appropriate auth mechanisms; implementation-dependent |
| Example                | `GET /customers/C123`              | `get_customer(customer_id="C123")`                            |

### The important distinction

REST exposes **technical endpoints**:

```text
GET    /customers/{id}
POST   /tickets
PUT    /customers/{id}
DELETE /customers/{id}
```

MCP exposes **AI-consumable capabilities**:

```text
get_customer
create_ticket
search_documents
get_incidents
```

The MCP server can translate:

```text
MCP tool call
      ↓
get_customer(customer_id="C123")
      ↓
Salesforce REST API
      ↓
Salesforce response
      ↓
MCP response
      ↓
Worker
```

### Why use MCP instead of having Workers directly call REST?

In CWD, if every Worker directly calls REST APIs:

```text
Worker 1 → Salesforce REST
Worker 2 → Salesforce REST
Worker 3 → ServiceNow REST
Worker 4 → SharePoint REST
```

each Worker becomes responsible for integration details.

With MCP:

```text
                  Worker
                    │
                    ▼
                MCP Client
                    │
                    ▼
                MCP Server
              /      |       \
             ▼       ▼        ▼
       Salesforce ServiceNow SharePoint
          REST        REST       REST
```

The **Worker focuses on business reasoning**, while the **MCP server handles tool integration and governance**.

### 🎯 Interview answer

> **"REST is a general-purpose API communication mechanism, whereas MCP provides a standardized way for AI agents to discover and invoke tools and access external context. In our CWD project, Workers used MCP for enterprise tool access, while the MCP servers could internally call REST APIs such as Salesforce or ServiceNow APIs. So MCP did not replace REST; it provided an AI-oriented abstraction and governance layer on top of our enterprise integrations."**

**One-line memory trick:**

> **REST = how systems expose APIs; MCP = how AI agents interact with tools in a standardized way.**
