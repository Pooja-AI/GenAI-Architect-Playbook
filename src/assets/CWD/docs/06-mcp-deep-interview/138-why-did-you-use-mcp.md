## Why did you use MCP?

In our **CWD enterprise AI architecture**, we used MCP because Workers need to interact with multiple enterprise systems such as **Salesforce, ServiceNow, and SharePoint** in a **standardized, secure, and governed way**.

### Simple interview answer

> **"We used MCP to standardize how our Workers interact with enterprise tools and data sources. Instead of implementing separate integration logic for Salesforce, ServiceNow, and SharePoint inside every Worker, we exposed those capabilities as governed MCP tools. This gave us centralized authentication, authorization, parameter validation, auditing, timeout and error handling, and tool reuse."**

### Why MCP was useful in CWD

```text
                    CWD
                     │
                 Coordinator
                     │
                  Delegator
                     │
          ┌──────────┴──────────┐
          │                     │
     Sales Worker          IT Worker
          │                     │
        MCP                     MCP
          │                     │
   Salesforce MCP         ServiceNow MCP
      Server                  Server
          │                     │
     Salesforce             ServiceNow
```

### 1. Standardized integrations

Without MCP, each Worker could directly integrate with different systems:

```text
Worker → Salesforce SDK
Worker → ServiceNow SDK
Worker → SharePoint SDK
```

That creates duplicated integration code.

With MCP:

```text
Worker → MCP Client → MCP Server → Enterprise System
```

The Worker only needs to understand the **tool contract**, not the underlying API implementation.

---

### 2. Reusability

Suppose Salesforce exposes:

```text
get_customer()
get_opportunities()
get_contacts()
```

Multiple Workers can reuse those tools.

For example:

```text
Customer Briefing Worker ──┐
                           ├──→ Salesforce MCP Server
Sales Analysis Worker ─────┘
```

We don't need to implement the Salesforce integration separately in every Worker.

---

### 3. Security and governance

This was especially important for an **enterprise AI platform**.

The MCP server can enforce:

```text
Authentication
      ↓
Authorization
      ↓
Tool permission check
      ↓
Parameter validation
      ↓
Enterprise API call
      ↓
Audit logging
```

For example, a Worker may request:

```text
delete_customer()
```

but the MCP server can determine that the Worker does **not** have permission to execute that operation.

---

### 4. Centralized auditing

Instead of trying to audit every Worker individually, MCP provides a controlled point where tool calls can be logged:

```text
Worker
  ↓
MCP Server
  ↓
Audit Log

Who?
Which Worker?
Which Tool?
Which Customer ID?
When?
Success/Failure?
Latency?
```

This helps with enterprise **traceability and compliance**.

---

### 5. Loose coupling

The Worker doesn't need to know whether the underlying implementation uses:

```text
Salesforce REST API
Salesforce SDK
ServiceNow API
SharePoint API
Database
```

The Worker sees a tool contract such as:

```text
get_customer(customer_id)
```

So the underlying implementation can change without requiring major changes to the Worker.

---

### 6. Better failure handling

Because MCP becomes the controlled tool-access layer, we can implement consistent:

* timeout
* retry
* validation
* error handling
* logging
* circuit breaking
* rate limiting

This is useful when an enterprise system is temporarily unavailable.

---

## MCP vs A2A — important interview distinction

This is one of the most important points to remember:

```text
A2A
Agent ↔ Agent

MCP
Worker/Agent ↔ Tool/System
```

In CWD:

```text
Coordinator
      │
      │ A2A
      ↓
Delegator
      │
      │ A2A
      ↓
Worker
      │
      │ MCP
      ↓
MCP Server
      │
      ↓
Salesforce / ServiceNow / SharePoint
```

### Strong 30-second interview answer

> **"We used MCP because our Workers needed to interact with multiple enterprise systems in a standardized and governed way. MCP separated the agent logic from the underlying system integrations. It allowed us to expose Salesforce, ServiceNow, and SharePoint capabilities as reusable tools while centralizing authorization, parameter validation, auditing, timeout, and error handling. A2A handled communication between our agents, whereas MCP handled Worker-to-tool and Worker-to-enterprise-system communication."**
