## MCP vs A2A

The simplest way to remember it:

> **A2A = Agent talks to another Agent**
> **MCP = Agent/Worker talks to a Tool or Enterprise System**

### CWD example

```text
User
  |
  v
Coordinator
  |  A2A
  v
Sales Delegator
  |  A2A
  v
Customer Worker
  |  MCP
  v
MCP Server
  |
  +----> Salesforce
  |
  +----> ServiceNow
  |
  +----> SharePoint
```

### What does A2A solve?

A2A handles **communication and collaboration between agents**.

For example, the Coordinator may say:

```text
Coordinator
   |
   | "Get customer information"
   v
Sales Delegator
   |
   | "Get CRM details"
   v
Customer Worker
```

The agents exchange things like:

* task
* intent
* context
* instructions
* status
* results

So in CWD:

**Coordinator → Delegator → Worker = A2A**

---

### What does MCP solve?

MCP handles **access to tools and enterprise systems**.

For example, the Customer Worker needs Salesforce data:

```text
Customer Worker
      |
      | MCP
      v
MCP Client
      |
      v
Salesforce MCP Server
      |
      v
Salesforce API
      |
      v
Customer Data
```

The Worker doesn't need to know the detailed Salesforce API implementation.

It can call an MCP tool such as:

```python
result = await mcp_client.call_tool(
    "get_customer",
    {"customer_id": "C123"}
)
```

---

## Key differences

| Area           | A2A                          | MCP                                            |
| -------------- | ---------------------------- | ---------------------------------------------- |
| Full form      | Agent-to-Agent               | Model Context Protocol                         |
| Communication  | Agent ↔ Agent                | Agent/Worker ↔ Tool/System                     |
| Purpose        | Agent collaboration          | Tool/data access                               |
| CWD example    | Coordinator → Delegator      | Worker → Salesforce                            |
| Handles        | Tasks, context, results      | Tools, resources, prompts                      |
| Example        | "Please get CRM information" | `get_customer(C123)`                           |
| Enterprise API | Not directly                 | Yes, through MCP Server                        |
| Main question  | **Who should do the work?**  | **How does the Worker access the capability?** |

### Very important interview point

**A2A and MCP are not competitors. They operate at different layers.**

In your CWD architecture:

```text
Coordinator
    |
   A2A
    v
Delegator
    |
   A2A
    v
Worker
    |
   MCP
    v
MCP Server
    |
    +---- Salesforce
    +---- ServiceNow
    +---- SharePoint
```

### 🎯 Strong interview answer

> **“In CWD, we use A2A for agent-to-agent communication and MCP for agent-to-tool communication. A2A allows the Coordinator, Delegators, and Workers to exchange tasks, context, and results. MCP allows the Worker to securely discover and invoke enterprise capabilities such as Salesforce, ServiceNow, and SharePoint. So A2A handles agent collaboration, while MCP handles standardized tool and enterprise-system access.”**

### Easy memory trick

**A2A = Agent → Agent**
**MCP = Agent → Tool**

Or:

> **A2A decides WHO does the work. MCP provides HOW the Worker accesses the tool.**
