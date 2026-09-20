## How does a Worker know which enterprise system to access?

A Worker knows **which enterprise system to access because its capability and tool configuration are predefined**. The Worker does not randomly choose a system.

### Simple flow

```text
Delegator
   ↓
CustomerProfileWorker
   ↓
Worker configuration
   ↓
MCP Tool: get_customer_profile
   ↓
Salesforce MCP Server
   ↓
Salesforce
```

### Example

Suppose we have:

```text
CustomerProfileWorker
Capability: customer_profile
Tool: get_customer_profile
System: Salesforce
```

The Delegator sends:

```python
{
    "customer_id": "C123"
}
```

The Worker knows:

> “My responsibility is customer profile retrieval, and my configured tool for that capability is `get_customer_profile`.”

It calls the MCP tool, and the **MCP Server handles the connection to Salesforce**.

### Another example

```text
IncidentWorker
Capability: incident_information
Tool: get_incidents
System: ServiceNow
```

So:

```text
IncidentWorker
      ↓
MCP
      ↓
ServiceNow
```

### Where is this configuration maintained?

Typically in a **Worker Registry / Tool Registry**:

```python
{
    "CustomerProfileWorker": {
        "capability": "customer_profile",
        "tool": "get_customer_profile",
        "system": "Salesforce"
    },
    "IncidentWorker": {
        "capability": "incident_information",
        "tool": "get_incidents",
        "system": "ServiceNow"
    }
}
```

The **Worker Registry defines the capability-to-tool mapping**.

### Important distinction

* **Delegator** → decides *which Worker to execute*
* **Worker** → knows *which capability it performs*
* **MCP** → provides the tool interface
* **MCP Server** → connects to the enterprise system
* **Salesforce/ServiceNow** → actual enterprise system

**Interview-ready:**

> “A Worker doesn't dynamically guess which enterprise system to access. Its capability and approved MCP tools are configured in the Worker Registry. For example, CustomerProfileWorker is mapped to the Salesforce customer-profile tool, while IncidentWorker is mapped to the ServiceNow incident tool.”

**One-line memory:**
**Worker capability → configured MCP tool → enterprise system.**
