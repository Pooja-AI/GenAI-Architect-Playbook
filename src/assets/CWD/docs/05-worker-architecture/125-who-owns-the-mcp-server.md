## Who owns the MCP Server?

In an enterprise CWD architecture, the **MCP Server is typically owned by the platform/integration team or the team responsible for that enterprise system**.

For example:

```text id="6qk2n8"
Salesforce MCP Server
        ↓
Owned/managed by
CRM / Integration Platform Team

ServiceNow MCP Server
        ↓
Owned/managed by
ITSM / Integration Platform Team
```

### In CWD

The **Worker does not own the MCP Server**.

```text
CWD Platform
   ↓
Worker
   ↓
MCP Client
   ↓
MCP Server        ← managed by integration/platform team
   ↓
Salesforce / ServiceNow
```

### What does the MCP Server owner manage?

Typically:

* MCP tool definitions
* Enterprise API integration
* Authentication and authorization
* Secrets/configuration
* Rate limits
* Input validation
* Logging and auditing
* Error handling
* API version changes
* Security controls

### Example

For `CustomerProfileWorker`:

```text
Worker
  ↓
get_customer_profile(customer_id)
  ↓
Salesforce MCP Server
  ↓
Salesforce
```

The Worker team owns the **Worker capability**.

The MCP/integration team owns the **Salesforce integration**.

**Interview-ready:**

> “In our enterprise architecture, MCP Servers are typically owned and operated by the platform or integration team, sometimes aligned with the system owner. The Worker team owns the business capability, while the MCP Server team owns the secure integration with systems like Salesforce or ServiceNow.”

**One-line memory:**
**Worker team owns the capability; integration/platform team owns the MCP Server.**
