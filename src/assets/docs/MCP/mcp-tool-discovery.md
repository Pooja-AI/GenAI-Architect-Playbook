# How Does an Agent Discover MCP Tools?

## Interview Question

**“How does an agent discover MCP tools?”**

---

## 1. Strong Interview Answer

> **An agent discovers MCP tools through its MCP Client. The client connects to an MCP Server, initializes the MCP session, and requests the server's available tools using the `tools/list` operation. The MCP Server returns the tool definitions, including the tool name, description, and input schema. The agent then uses these definitions to determine which tool is appropriate for the user's request and invokes it through the MCP Client using `tools/call`.**

In simple terms:

```text
Agent
  ↓
MCP Client
  ↓
Connect to MCP Server
  ↓
tools/list
  ↓
Tool definitions
  ↓
Agent selects appropriate tool
  ↓
tools/call
  ↓
MCP Server executes tool
```

---

# 2. Important Distinction

The **agent itself does not directly communicate with the MCP Server**.

The MCP Client handles the MCP protocol communication.

```text
+-----------------------+
|       AI Agent        |
|                       |
| Reasoning             |
| Planning              |
| Tool Selection        |
+-----------+-----------+
            |
            v
+-----------------------+
|      MCP Client       |
|                       |
| MCP Protocol          |
| Session Management    |
+-----------+-----------+
            |
            | MCP
            v
+-----------------------+
|      MCP Server       |
|                       |
| Tool Definitions      |
| Tool Execution        |
+-----------+-----------+
            |
            v
      Enterprise System
```

### Memory Trick

> **Agent decides → Client communicates → Server exposes → Tool executes**

---

# 3. Step-by-Step Tool Discovery

## Step 1 — Agent Needs a Capability

Suppose the user asks:

```text
Why did CWD incident INC-12345 happen?
```

The agent determines that it needs incident information.

It needs capabilities such as:

```text
Search incidents
Get incident details
Get incident logs
```

---

# 4. Step 2 — MCP Client Connects to MCP Server

The agent uses its MCP Client.

```text
Incident Analysis Agent
        |
        v
    MCP Client
        |
        v
 Incident MCP Server
```

The MCP Client establishes an MCP session with the server.

---

# 5. Step 3 — Client Requests Available Tools

The MCP Client asks the server for its available tools.

Conceptually:

```text
tools/list
```

The server responds with tool definitions.

For example:

```json
{
  "tools": [
    {
      "name": "search_incidents",
      "description": "Search CWD incidents",
      "inputSchema": {
        "type": "object",
        "properties": {
          "query": {
            "type": "string"
          }
        }
      }
    },
    {
      "name": "get_incident_logs",
      "description": "Retrieve logs for an incident",
      "inputSchema": {
        "type": "object",
        "properties": {
          "incident_id": {
            "type": "string"
          }
        }
      }
    }
  ]
}
```

The exact wire representation can vary with MCP version/SDK, but conceptually this is **tool discovery**.

---

# 6. What Information Does the Agent Receive?

The tool definition typically tells the client/agent:

### Tool Name

```text
search_incidents
```

### Description

```text
Search incidents based on keywords, application,
severity, or time range.
```

### Input Schema

```text
query
application
severity
start_time
end_time
```

The schema tells the agent/application what arguments the tool expects.

---

# 7. Step 4 — Agent Selects the Tool

Now the LLM sees the available tool descriptions.

For:

```text
Find incidents related to CWD database connection failures.
```

The agent may decide:

```text
Tool = search_incidents

Arguments:
{
   "query": "CWD database connection failure"
}
```

This is **tool selection**, not tool discovery.

That's an important interview distinction.

```text
Discovery
    ↓
What tools are available?

Selection
    ↓
Which available tool should I use?

Invocation
    ↓
Execute that tool.
```

---

# 8. Step 5 — Client Calls the Tool

Once the agent chooses the tool, the MCP Client sends a tool invocation.

Conceptually:

```text
tools/call
```

For example:

```json
{
  "name": "search_incidents",
  "arguments": {
    "query": "CWD database connection failure"
  }
}
```

The MCP Server receives the request.

---

# 9. Step 6 — MCP Server Executes the Tool

The MCP Server maps the tool to the underlying enterprise capability.

```text
MCP Server
    |
    v
search_incidents()
    |
    v
Incident Database
    |
    v
Search Results
```

The result comes back through the MCP Client to the agent.

```text
Incident DB
    ↓
MCP Server
    ↓
MCP Client
    ↓
Agent
    ↓
LLM reasoning
```

---

# 10. Complete CWD Example

Let's look at the complete flow.

User:

```text
Analyze INC-12345 and identify the root cause.
```

### Architecture

```text
                    User
                     |
                     v
                Coordinator
                     |
                     | A2A
                     v
          Incident Analysis Agent
                     |
                     v
                MCP Client
                     |
              tools/list
                     |
                     v
           Incident MCP Server
                     |
       +-------------+-------------+
       |             |             |
       v             v             v
 search_incidents  get_logs    get_metrics
```

The client discovers:

```text
1. search_incidents
2. get_incident
3. get_incident_logs
4. get_incident_metrics
5. get_deployment_details
```

The agent determines:

```text
User Intent:
Root-cause analysis

Required capabilities:
- Incident details
- Logs
- Deployment information
```

It selects:

```text
get_incident
get_incident_logs
get_deployment_details
```

Then calls them.

---

# 11. Discovery vs Selection vs Execution

This is a **very strong interview distinction**.

| Stage      | Question                     | Component                   |
| ---------- | ---------------------------- | --------------------------- |
| Discovery  | What tools exist?            | MCP Client + Server         |
| Selection  | Which tool should I use?     | Agent / LLM                 |
| Invocation | How do I call it?            | MCP Client                  |
| Execution  | How is the action performed? | MCP Server                  |
| Result     | What did the tool return?    | MCP Server → Client → Agent |

### Easy Memory

```text
Discover → Select → Call → Execute → Reason
```

---

# 12. Does the Agent Discover Every MCP Server?

Not necessarily.

In an enterprise architecture, you may have multiple MCP Servers:

```text
                    Agent
                      |
                  MCP Client
                      |
       +--------------+--------------+
       |              |              |
       v              v              v
 Knowledge        Incident       Monitoring
 MCP Server       MCP Server      MCP Server
```

Each server can expose different capabilities.

For example:

### Knowledge MCP Server

```text
search_documents
get_document
search_knowledge
```

### Incident MCP Server

```text
search_incidents
get_incident
get_incident_logs
```

### Monitoring MCP Server

```text
get_metrics
get_service_health
get_alerts
```

The enterprise application can determine which MCP servers are available and establish connections to the appropriate ones.

---

# 13. What If There Are 500 Tools?

This is an important enterprise architecture concern.

You generally don't want to expose 500 tools to the LLM at once.

Instead, use **domain-based or capability-based tool discovery/routing**.

```text
                 Coordinator
                      |
              Capability Router
                      |
       +--------------+--------------+
       |              |              |
       v              v              v
   Knowledge       Incident       Monitoring
       |              |              |
       v              v              v
   5 tools          6 tools        4 tools
```

For an incident question, only relevant tools might be exposed:

```text
search_incidents
get_incident
get_incident_logs
get_deployment_details
```

This reduces:

* Context size
* Tool-selection errors
* Latency
* Token cost
* Unnecessary tool calls

---

# 14. Security During Tool Discovery

Tool discovery should **not mean every agent gets every tool**.

In an enterprise environment:

```text
Agent Identity
      ↓
Authentication
      ↓
Authorization
      ↓
Policy Check
      ↓
Available Tools
```

For example:

```text
Knowledge Agent
    ↓
Can access:
- search_documents
- get_document

Cannot access:
- restart_service
- delete_incident
- modify_production
```

This follows the **least-privilege principle**.

A particularly important point:

> **Tool visibility and tool authorization are separate concerns.**

Even if an agent knows that a tool exists, the underlying MCP server and enterprise systems must enforce authorization.

---

# 15. What Happens If a Tool Is Added Later?

One benefit of MCP is that the server can expose new capabilities without requiring every client integration to be rewritten.

For example, initially:

```text
Incident MCP Server

search_incidents
get_incident
get_incident_logs
```

Later:

```text
search_incidents
get_incident
get_incident_logs
get_deployment_details
```

The client can discover the updated tool set.

In implementations that support capability-change notifications, clients can also be informed when available tools change rather than relying only on periodic rediscovery.

---

# 16. Tool Discovery Is Different from Agent Discovery

This is particularly important because you are also preparing for **A2A**.

### A2A Agent Discovery

Find another agent:

```text
Agent
  ↓
Agent Registry / Agent Card
  ↓
Find Analytics Agent
```

### MCP Tool Discovery

Find capabilities exposed by an MCP Server:

```text
MCP Client
  ↓
MCP Server
  ↓
tools/list
  ↓
Available Tools
```

So:

```text
A2A
→ Discover AGENTS

MCP
→ Discover TOOLS / RESOURCES / PROMPTS
```

---

# 17. A2A + MCP Together in CWD

This is a strong enterprise-level explanation.

```text
                         User
                           |
                           v
                      Coordinator
                      (LangGraph)
                           |
                           | A2A
                           v
                 Incident Analysis Agent
                           |
                           | MCP
                           v
                       MCP Client
                           |
                  +--------+--------+
                  |                 |
                  v                 v
          Incident MCP       Knowledge MCP
             Server              Server
                  |                 |
                  v                 v
           Incident DB         Vector DB
```

### A2A handles:

```text
Agent ↔ Agent
```

### MCP handles:

```text
Agent ↔ Tools/Data/Enterprise Systems
```

And tool discovery happens through the MCP layer.

---

# 18. Strong Interview Answer — 30 Seconds

> **“An agent discovers MCP tools through its MCP Client. When the client connects to an MCP Server, it initializes the MCP session and requests the server's available tools using the tool-listing operation. The server returns each tool's name, description, and input schema. The agent or LLM uses those definitions to select the appropriate tool, and the MCP Client invokes it using the tool-call operation. In our CWD architecture, for example, the Incident MCP Server can expose tools like search_incidents, get_incident_logs, and get_deployment_details, while authorization and least-privilege policies control which tools the agent is actually allowed to use.”**

---

# 19. One-Line Interview Answer

> **“The MCP Client discovers tools from an MCP Server through tool listing, typically `tools/list`; the agent then selects the appropriate tool based on its description and schema and invokes it through the MCP Client.”**

---

# 20. Final Memory Diagram

```text
             MCP TOOL DISCOVERY
                     |
                     v
              +-------------+
              | MCP Client  |
              +------+------+
                     |
                     | tools/list
                     v
              +-------------+
              | MCP Server  |
              +------+------+
                     |
                     v
             Tool Definitions
                     |
        +------------+------------+
        |            |            |
        v            v            v
     search       get_logs     metrics
        |
        v
   Agent / LLM
        |
        | Select
        v
    tools/call
        |
        v
   MCP Server
        |
        v
 Enterprise System
        |
        v
      Result
        |
        v
       Agent
```

## The Interview Formula

```text
tools/list
     ↓
Discover
     ↓
Tool Name + Description + Schema
     ↓
Agent selects
     ↓
tools/call
     ↓
MCP Server executes
     ↓
Result → Agent
```

**Remember:**

> **`tools/list` = Discover**
> **Agent/LLM = Select**
> **`tools/call` = Invoke**
> **MCP Server = Execute**
