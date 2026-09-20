## Where does MCP fit into the Worker architecture?

**MCP sits between the Worker and the enterprise systems/tools.**

The Worker uses MCP to access systems such as **Salesforce, ServiceNow, SharePoint, or databases** without directly embedding their integration logic.

### CWD architecture

```text
Coordinator
     ↓
Delegator
     ↓
Worker
     ↓
MCP Client
     ↓
MCP Server
     ↓
Enterprise System
(Salesforce / ServiceNow)
```

### Example: Salesforce

```text
CustomerProfileWorker
        ↓
MCP Client
        ↓
get_customer_profile()
        ↓
Salesforce MCP Server
        ↓
Salesforce API
```

### What does MCP provide?

The MCP layer provides standardized **tools** that Workers can invoke.

For example:

```text
get_customer_profile(customer_id)
get_customer_incidents(customer_id)
get_contract(customer_id)
```

The Worker doesn't need to know the underlying API implementation.

### Responsibilities

| Component             | Responsibility                        |
| --------------------- | ------------------------------------- |
| **Worker**            | Business capability                   |
| **MCP Client**        | Invokes the required tool             |
| **MCP Server**        | Exposes tools and handles integration |
| **Enterprise System** | Provides the actual data/service      |

### Important distinction

**MCP is not the Worker and does not decide which Worker runs.**

The **Delegator chooses the Worker**.

The **Worker chooses/invokes its approved tool**.

**MCP provides the standardized connection to the enterprise system.**

### Interview-ready

> “In our CWD architecture, MCP is the tool-integration layer between Workers and enterprise systems. A Worker invokes an approved MCP tool, and the MCP Server handles the underlying Salesforce or ServiceNow integration. This keeps Workers loosely coupled from enterprise APIs and makes the integration reusable and governed.”

**One-line memory:**
**Delegator selects Worker → Worker invokes MCP tool → MCP connects to enterprise system.**
