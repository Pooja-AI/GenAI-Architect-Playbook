## MCP vs A2A

The easiest way to remember:

> **A2A = Agent ↔ Agent communication**
> **MCP = Agent/Worker ↔ Tool communication**

### In your CWD architecture

```text
                    Coordinator
                         │
                    A2A │
                         ▼
                     Delegator
                         │
                    A2A │
                         ▼
                       Worker
                         │
                    MCP  │
                         ▼
                    MCP Server
                    /    |     \
                   ▼     ▼      ▼
             Salesforce ServiceNow SharePoint
```

### Main difference

| Area                | MCP                       | A2A                                            |
| ------------------- | ------------------------- | ---------------------------------------------- |
| Full name           | Model Context Protocol    | Agent2Agent                                    |
| Main purpose        | Connect AI to tools/data  | Connect AI agents to other agents              |
| Communication       | Agent → Tool/System       | Agent → Agent                                  |
| Used for            | Tool execution            | Delegation/collaboration                       |
| Example             | Worker → Salesforce       | Coordinator → Sales Delegator                  |
| Typical interaction | `get_customer()`          | "Sales Delegator, handle customer information" |
| Focus               | Tools, resources, context | Agent tasks, messages, collaboration           |

### MCP example

Your **Customer Briefing Worker** needs Salesforce information:

```text
Worker
   │
   │ MCP: get_customer(customer_id="C123")
   ▼
Salesforce MCP Server
   │
   ▼
Salesforce
```

The Worker is asking an **external tool** to perform an operation.

---

### A2A example

Your Coordinator receives:

> "Give me a customer briefing for C123."

It determines that Sales and IT capabilities are required.

```text
Coordinator
     │
     │ A2A: Customer Briefing task
     ▼
Sales Delegator
     │
     │ A2A
     ▼
Sales Worker
```

Here, the communication is between **AI components/agents**, not between an agent and an enterprise tool.

---

## Why use both?

Because they solve **different problems**.

### A2A handles orchestration

```text
Coordinator
      ↓
Delegator
      ↓
Worker
```

It answers:

> **"Which agent should do this work, and how do agents exchange tasks/results?"**

### MCP handles tool access

```text
Worker
   ↓
MCP
   ↓
Salesforce / ServiceNow / SharePoint
```

It answers:

> **"How does the Worker securely and consistently use an external capability?"**

---

### Very important interview distinction

Don't say:

> "A2A and MCP are competing protocols."

A better answer is:

> **"They operate at different layers. In our CWD architecture, we used A2A for agent-to-agent communication between the Coordinator, Delegators, and Workers, while MCP was used by Workers to discover and invoke enterprise tools such as Salesforce and ServiceNow. A2A handled collaboration and task delegation; MCP handled tool and system access."**

### Memory trick

```text
A2A → Who should do the work?
MCP → How does the Worker access the tool?
```

Or simply:

> **A2A = Agent ↔ Agent**
> **MCP = Agent ↔ Tool**
