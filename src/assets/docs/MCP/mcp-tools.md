# What Are MCP Tools?

## Interview Question

**"What are MCP Tools?"**

---

# 1. Strong Interview Answer

> **"MCP Tools are executable capabilities exposed by an MCP Server that an AI application or agent can invoke to perform an action or retrieve information from an external system. A tool has a name, description, and input schema, and the MCP Server implements the actual operation. For example, in my CWD project, an Incident MCP Server could expose tools such as `search_incidents`, `get_incident_logs`, and `create_incident`. The agent decides which tool is appropriate, while the MCP Server validates and executes the request."**

### Simple definition

> **MCP Tool = An executable capability exposed to an AI agent through an MCP Server.**

---

# 2. Why Do We Need MCP Tools?

An AI model by itself can generate text, but it cannot inherently:

```text
Query a database
Call ServiceNow
Read enterprise documents
Create a Jira ticket
Check monitoring systems
Execute a business operation
```

MCP Tools give the agent the ability to **take action or retrieve information from external systems**.

```text
LLM / Agent
     │
     ▼
MCP Tool
     │
     ▼
MCP Server
     │
     ▼
Enterprise System
```

---

# 3. Example

Suppose the user asks:

> **"Find all critical CWD incidents from last week."**

The agent may discover a tool:

```text
search_incidents
```

with an input schema:

```text
{
    "severity": "string",
    "start_date": "string",
    "end_date": "string"
}
```

The agent generates a tool request:

```text
search_incidents(
    severity="CRITICAL",
    start_date="2026-08-24",
    end_date="2026-08-30"
)
```

The MCP Server executes the operation against the incident system.

```text
Agent
  │
  │ search_incidents(...)
  ▼
MCP Client
  │
  ▼
MCP Server
  │
  ▼
Incident Database
```

The result comes back to the agent:

```text
[
    Incident-1001,
    Incident-1007,
    Incident-1012
]
```

The agent can then analyze the results and respond to the user.

---

# 4. What Does an MCP Tool Contain?

A tool generally has three important pieces of metadata:

```text
Tool
 ├── Name
 ├── Description
 └── Input Schema
```

For example:

```text
Name:
search_incidents

Description:
Search CWD incidents based on severity and date range.

Input Schema:
{
    severity: string,
    start_date: string,
    end_date: string
}
```

The schema tells the AI application what parameters are required and what types they should have.

---

# 5. MCP Tool Example

Conceptually:

```text
Tool:
    name: search_incidents

    description:
        Search incidents from the enterprise incident database.

    input:
        severity: string
        start_date: string
        end_date: string
```

Another tool:

```text
Tool:
    name: get_incident_logs

    description:
        Retrieve application logs associated with an incident.

    input:
        incident_id: string
```

Another:

```text
Tool:
    name: create_incident

    description:
        Create a new incident in the incident-management system.

    input:
        title: string
        description: string
        severity: string
```

---

# 6. Types of MCP Tools

MCP tools can represent different types of operations.

## Read Tools

Used to retrieve information.

```text
search_incidents()
get_incident()
get_incident_logs()
get_customer()
search_documents()
```

---

## Write Tools

Used to modify data.

```text
create_incident()
update_incident()
create_ticket()
update_ticket()
```

---

## Action Tools

Used to trigger an operation.

```text
restart_service()
deploy_application()
send_notification()
run_diagnostic()
```

---

# 7. MCP Tool vs Resource

This is an important interview distinction.

### Tool

A **tool performs an operation**.

```text
search_incidents()
create_ticket()
update_incident()
```

### Resource

A **resource provides data/context**.

```text
incident://12345
document://cwd/troubleshooting
```

Simple memory trick:

> **Tool = Do something**

> **Resource = Give me information**

---

# 8. MCP Tool vs Prompt

MCP also supports prompts.

### Tool

```text
search_incidents()
```

Means:

> Perform an operation.

### Resource

```text
incident://12345
```

Means:

> Provide/access information.

### Prompt

```text
analyze_incident
```

Means:

> Provide a reusable prompt/template for a particular interaction.

So:

```text
MCP
├── Tools
│   └── Execute operations
│
├── Resources
│   └── Provide context/data
│
└── Prompts
    └── Provide reusable prompt templates
```

---

# 9. Who Decides Which MCP Tool to Use?

This is a very common interview question.

The **AI application/agent typically decides which tool is appropriate** based on:

```text
User intent
     +
Tool description
     +
Input schema
     +
Current context
     +
Agent reasoning
```

For example:

User:

> "Show me the logs for incident 12345."

The agent determines:

```text
Required capability:
Get incident logs

Selected MCP Tool:
get_incident_logs
```

Then:

```text
Agent
  ↓
MCP Client
  ↓
get_incident_logs
  ↓
MCP Server
  ↓
Incident System
```

However, the application/platform should still enforce:

```text
Authorization
Policy
Input validation
Tool permissions
Rate limits
```

The LLM's choice should **not automatically mean the action is allowed**.

---

# 10. How Does Tool Discovery Work?

The MCP Client can discover tools exposed by an MCP Server.

Conceptually:

```text
MCP Client
     │
     │ tools/list
     ▼
MCP Server
     │
     ▼
Available Tools
```

The server may return:

```text
search_incidents
get_incident
get_incident_logs
create_incident
```

Each tool includes metadata describing what it does and what inputs it accepts.

The AI application can use that information when deciding what capability it needs.

---

# 11. How Is a Tool Called?

Conceptually, the flow is:

```text
1. Agent identifies required capability

2. MCP Client sends tool invocation

3. MCP Server receives request

4. MCP Server validates request

5. MCP Server executes operation

6. MCP Server returns result

7. Agent reasons over result
```

Architecture:

```text
User
 │
 ▼
Agent
 │
 │ Select tool
 ▼
MCP Client
 │
 │ Tool invocation
 ▼
MCP Server
 │
 │ Execute
 ▼
Enterprise System
 │
 │ Result
 ▼
MCP Server
 │
 ▼
MCP Client
 │
 ▼
Agent
 │
 ▼
User
```

---

# 12. CWD Example

Suppose the user asks:

> **"Why did incident INC-12345 happen?"**

The Coordinator may delegate the task to the Analytics Agent.

```text
User
  │
  ▼
Coordinator
  │
  │ A2A
  ▼
Analytics Agent
  │
  ▼
MCP Client
  │
  ▼
Incident MCP Server
```

The Incident MCP Server exposes:

```text
get_incident
get_incident_logs
get_incident_metrics
search_related_incidents
```

The Analytics Agent might call:

```text
get_incident(
    incident_id="INC-12345"
)
```

Then:

```text
get_incident_logs(
    incident_id="INC-12345"
)
```

Then:

```text
get_incident_metrics(
    incident_id="INC-12345"
)
```

The agent analyzes all three results and determines the probable root cause.

---

# 13. MCP Tools in Your CWD Architecture

Your architecture can be represented as:

```text
                         USER
                           │
                           ▼
                    ┌─────────────┐
                    │ Coordinator │
                    │    Agent    │
                    └──────┬──────┘
                           │
                          A2A
                           │
                  ┌────────┴────────┐
                  ▼                 ▼
          Knowledge Agent     Analytics Agent
                  │                 │
             MCP Client        MCP Client
                  │                 │
                  ▼                 ▼
          Knowledge MCP       Incident MCP
             Server              Server
                  │                 │
             ┌────┴────┐      ┌────┴─────┐
             ▼         ▼      ▼          ▼
          Search    Retrieve  SQL      Monitoring
           Docs      Docs      DB          API
```

---

# 14. Multiple Tools on One MCP Server

One MCP Server can expose multiple related tools.

For example:

```text
Incident MCP Server
│
├── search_incidents
├── get_incident
├── get_incident_logs
├── get_incident_metrics
├── search_related_incidents
└── update_incident
```

This is useful because the server can represent one **domain or integration boundary**.

For example:

```text
Knowledge MCP Server
Incident MCP Server
Monitoring MCP Server
ServiceNow MCP Server
```

---

# 15. Tool Permissions

Not every agent should have access to every tool.

For example:

```text
Knowledge Agent
├── search_documents       ✓
├── retrieve_documents     ✓
└── update_incident        ✗

Analytics Agent
├── search_incidents       ✓
├── get_incident_logs      ✓
└── create_ticket          ✗

Action Agent
├── create_ticket          ✓
├── update_incident        ✓
└── deploy_application     ✓
```

This follows the **least-privilege principle**.

---

# 16. Tool Selection with Many Tools

Suppose you have 50 MCP tools.

Don't expose all 50 tools to every agent.

Instead:

```text
User Request
     │
     ▼
Domain / Capability Router
     │
     ▼
Relevant Tool Group
     │
     ▼
Top 3–5 Tools
     │
     ▼
LLM / Agent
```

For example:

```text
User:
"Why did the service fail?"

        ↓

Domain:
Incident / Monitoring

        ↓

Relevant tools:

get_incident
get_incident_logs
get_incident_metrics
```

This improves:

* Tool-selection accuracy
* Latency
* Token usage
* Cost
* Security

---

# 17. Tool Calling vs MCP Tool

They are related but not exactly the same.

### Traditional LLM Function Calling

```text
Application
    │
    ├── function_1
    ├── function_2
    └── function_3
```

The application directly defines the functions.

### MCP

```text
AI Application
      │
   MCP Client
      │
      ▼
   MCP Server
      │
      ├── Tool 1
      ├── Tool 2
      └── Tool 3
```

MCP standardizes how capabilities can be exposed, discovered, and invoked across the client-server boundary.

---

# 18. What Happens When an MCP Tool Fails?

Tools can fail.

For example:

```text
Agent
  ↓
search_incidents
  ↓
MCP Server
  ↓
Incident DB
  X
Database timeout
```

The architecture should handle:

```text
Timeout
Retry
Error classification
Fallback
Circuit breaker
Graceful degradation
Observability
```

For example:

```text
Tool Result:

RETRYABLE_ERROR
"Incident database temporarily unavailable"
```

The agent/orchestrator can then decide whether to retry or use another source.

---

# 19. MCP Tool Security

For enterprise tools, especially write/action tools, we need strong controls.

```text
Agent
  ↓
MCP Client
  ↓
MCP Server
  │
  ├── Authentication
  ├── Authorization
  ├── Input validation
  ├── Policy validation
  ├── Rate limiting
  ├── Audit logging
  └── Secret management
  │
  ▼
Enterprise System
```

For high-risk tools:

```text
delete_record()
deploy_application()
update_production()
```

we may also require:

```text
Human Approval
```

before execution.

---

# 20. Important Interview Question

### "Does an MCP Tool contain the actual business logic?"

**Answer:**

> "The MCP Tool represents the capability exposed to the AI application, while the MCP Server implements the operation behind that capability. The implementation may call REST APIs, SQL databases, SDKs, or internal services. So the tool provides the AI-facing interface, while the server handles the underlying integration."

---

# 21. MCP Tool Lifecycle

```text
Define Tool
    ↓
Expose Tool
    ↓
Discover Tool
    ↓
Select Tool
    ↓
Authorize Tool
    ↓
Invoke Tool
    ↓
Execute Operation
    ↓
Return Result
    ↓
Agent Reasons Over Result
```

---

# 22. MCP Tools vs A2A

This distinction is extremely important.

| Concept       | MCP Tool                  | A2A                            |
| ------------- | ------------------------- | ------------------------------ |
| Purpose       | Execute/access capability | Communicate with another agent |
| Communication | Agent → Tool              | Agent → Agent                  |
| Example       | `search_incidents()`      | Coordinator → Analytics Agent  |
| Provider      | MCP Server                | Another Agent                  |
| Selection     | Agent chooses tool        | Coordinator/agent routes task  |
| Result        | Tool result               | Agent response/task result     |

### Memory trick

```text
A2A
Agent ↔ Agent

MCP
Agent → MCP Tool → Enterprise System
```

---

# 23. Strong CWD Interview Answer

### Interviewer:

**"Give me an example of an MCP Tool from your project."**

### Answer:

> **"In my CWD Enterprise Assistant, we have specialized agents such as Knowledge and Analytics Agents. For example, the Analytics Agent can use an Incident MCP Server that exposes tools such as `search_incidents`, `get_incident_logs`, and `get_incident_metrics`. When a user asks why an incident occurred, the agent determines which capabilities it needs, the MCP Client invokes the appropriate tools, and the MCP Server handles the integration with the incident database or monitoring APIs. The returned data is then passed back to the agent for analysis."**

---

# 24. 30-Second Interview Script

> **"MCP Tools are executable capabilities exposed by an MCP Server to an AI application or agent. Each tool typically has a name, description, and input schema. The agent uses the tool metadata and user intent to determine which tool is needed, while the MCP Client handles communication and the MCP Server validates and executes the operation against the underlying system. In CWD, examples would be `search_incidents`, `get_incident_logs`, and `get_incident_metrics`. So, tools provide the action capability, MCP provides the standardized communication, and the MCP Server handles the actual enterprise integration."**

---

# 25. One-Line Definition

> **"An MCP Tool is an executable capability exposed by an MCP Server that allows an AI agent to interact with an external system or perform an operation."**

---

# 26. Final Mental Model

```text
                 AI Agent
                    │
             Decides what to do
                    │
                    ▼
               MCP Client
                    │
              MCP Protocol
                    │
                    ▼
               MCP Server
                    │
              Exposes Tools
                    │
          ┌─────────┼─────────┐
          ▼         ▼         ▼
       Search     Retrieve   Update
        Tool        Tool      Tool
          │         │         │
          └─────────┼─────────┘
                    ▼
             Enterprise Systems
```

## Remember This

```text
MCP Server
    ↓
Exposes capabilities

MCP Tool
    ↓
Executable capability

MCP Client
    ↓
Connects and invokes capabilities

Agent
    ↓
Reasons and decides which capability to use
```

> **Agent thinks → MCP Client communicates → MCP Server exposes/executes → Tool performs the operation → Enterprise system provides the result.**
