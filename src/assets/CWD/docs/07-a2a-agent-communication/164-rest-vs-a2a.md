## REST vs A2A

The easiest way to remember:

> **REST = system/API-to-system communication**
> **A2A = agent-to-agent communication**

### CWD example

```text
User
  |
  v
Coordinator Agent
  |
  | A2A
  v
Sales Delegator Agent
  |
  | A2A
  v
Customer Worker Agent
  |
  | REST / MCP
  v
Enterprise System
```

### What does REST solve?

REST is a **general-purpose API communication style**.

For example, a Worker could directly call Salesforce:

```http
GET /services/data/vXX.X/sobjects/Account/C123
Authorization: Bearer <token>
```

REST is mainly concerned with:

* HTTP communication
* endpoints
* GET/POST/PUT/DELETE
* request/response
* authentication
* status codes
* JSON payloads

REST doesn't inherently understand that the caller is an AI agent.

---

### What does A2A solve?

A2A is designed for **communication between autonomous agents**.

For example:

```text
Coordinator
    |
    | A2A
    | Task: Create customer briefing
    v
Sales Delegator
    |
    | A2A
    | Task: Get CRM information
    v
Customer Worker
```

The agent interaction can carry:

* task
* context
* capabilities
* status
* progress
* result
* errors
* delegation information

The important point is that the receiving component is another **agent**, not simply an API endpoint.

---

## REST vs A2A

| Area                       | REST                        | A2A                            |
| -------------------------- | --------------------------- | ------------------------------ |
| Purpose                    | API/system communication    | Agent-to-agent collaboration   |
| Communication              | Client ↔ API                | Agent ↔ Agent                  |
| Typical interface          | HTTP endpoint               | Agent/task interface           |
| Understands agent concepts | No                          | Yes                            |
| Task delegation            | Not inherently              | Yes                            |
| Agent context              | Application-defined         | Designed for agent interaction |
| Example in CWD             | Worker → Salesforce API     | Coordinator → Delegator        |
| Main question              | **How do I call this API?** | **How do agents collaborate?** |

### Important: A2A can use HTTP

This is where interviewers sometimes try to confuse you.

A2A does **not** mean "instead of HTTP."

An A2A interaction can be transported over HTTP, while the **A2A protocol defines the agent-level communication semantics**.

For example:

```text
Coordinator
     |
     | HTTP + A2A protocol
     v
Sales Delegator
```

Whereas a normal REST call is:

```text
Worker
   |
   | HTTP REST
   v
Salesforce API
```

So:

> **HTTP is the transport. REST and A2A define different communication models/protocol semantics.**

### In your CWD architecture

```text
                 A2A
Coordinator --------------> Sales Delegator
                               |
                               | A2A
                               v
                         Customer Worker
                               |
                               | MCP
                               v
                         Salesforce MCP Server
                               |
                               | REST
                               v
                          Salesforce
```

Here you can explain the three layers clearly:

* **A2A** → agent-to-agent collaboration
* **MCP** → Worker-to-tool integration
* **REST** → MCP Server-to-enterprise API communication

### 🎯 Strong interview answer

> **“REST is a general API communication model used for client-to-service or system-to-system communication, while A2A is designed for communication between autonomous agents. In our CWD architecture, we use A2A between the Coordinator, Delegators, and Workers to exchange tasks, context, and results. We use MCP when a Worker needs to access enterprise tools, and the MCP Server can internally use REST APIs to communicate with systems like Salesforce or ServiceNow. So REST handles API integration, while A2A handles agent collaboration.”**

### Memory trick

**REST → API communication**
**A2A → Agent collaboration**
**MCP → Tool access**
