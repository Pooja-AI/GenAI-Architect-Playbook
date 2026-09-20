## What problem does MCP solve?

The main problem MCP solves is **the lack of a standard way for AI agents to interact with external tools and enterprise systems**.

### Without MCP

Imagine your CWD has 20 Workers:

```text
Worker 1 ──→ Salesforce API
Worker 2 ──→ Salesforce API
Worker 3 ──→ ServiceNow API
Worker 4 ──→ SharePoint API
Worker 5 ──→ Database
...
```

Each Worker may need to handle its own:

* API integration
* authentication
* parameter validation
* error handling
* retries/timeouts
* logging
* permissions
* API-specific code

This creates **duplicated code, tight coupling, and difficult maintenance**.

---

### With MCP

MCP introduces a **standard tool-access layer**:

```text
                     Workers
                        │
                        ▼
                   MCP Client
                        │
                        ▼
                   MCP Server
                  /     |      \
                 /      |       \
                ▼       ▼        ▼
          Salesforce ServiceNow SharePoint
```

Now the Worker interacts with a standardized tool interface rather than implementing every enterprise integration itself.

### The problems MCP addresses

| Problem                        | MCP solution                            |
| ------------------------------ | --------------------------------------- |
| Different integration patterns | Standardized tool protocol              |
| Duplicate integration code     | Reusable MCP tools                      |
| Tight coupling to APIs         | Worker depends on tool contract         |
| Uncontrolled tool access       | Centralized authorization/governance    |
| Invalid parameters             | Tool/input validation                   |
| Difficult auditing             | Centralized tool-call logging           |
| Different error handling       | Consistent error handling               |
| Changing backend APIs          | MCP server hides implementation details |
| Tool discovery                 | MCP servers expose available tools      |

### CWD example

Suppose your Worker needs customer information.

Instead of:

```python
# Worker directly knows Salesforce API
salesforce_client.get(
    "/services/data/vXX.X/query",
    params={"q": "..."}
)
```

The Worker can work with a business-level tool:

```python
result = await mcp_client.call_tool(
    "get_customer",
    {"customer_id": "C123"}
)
```

The MCP Server handles the underlying Salesforce integration:

```text
Worker
  │
  │ get_customer(C123)
  ▼
MCP Server
  │
  ├── Authenticate
  ├── Authorize
  ├── Validate parameters
  ├── Call Salesforce API
  ├── Log/audit
  └── Return normalized result
  │
  ▼
Worker
```

### The key interview point

**MCP doesn't replace Salesforce, ServiceNow, or APIs.**

It provides a **standardized interface for AI applications to access those tools and systems**.

### 🎯 Short interview answer

> **"MCP solves the integration and governance problem between AI agents and external tools. In our CWD architecture, instead of every Worker directly integrating with Salesforce, ServiceNow, or SharePoint, we exposed those capabilities through MCP tools. This gave us standardized tool invocation, reusable integrations, centralized authorization, validation, auditing, and consistent error handling, while keeping the Worker decoupled from the underlying enterprise APIs."**
