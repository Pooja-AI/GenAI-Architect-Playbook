# What Are MCP Resources?

## Interview Question

**"What are MCP Resources?"**

---

# 1. Strong Interview Answer

> **"MCP Resources are data or context exposed by an MCP Server that an AI application can access and use for reasoning. Unlike MCP Tools, which perform actions, Resources primarily provide information. For example, a CWD MCP Server could expose incident details, application logs, documents, configuration files, or knowledge-base content as resources. The agent can read that information and use it as context to generate a response."**

### Simple definition

> **MCP Resource = Data or context that an MCP Server makes available to an AI application.**

### Easy memory trick

```text
Tool     → Do something
Resource → Give me information
Prompt   → Tell me how to interact
```

---

# 2. Why Do We Need MCP Resources?

An AI agent often needs external context to answer a question accurately.

For example:

```text
User:
"Why did incident INC-12345 happen?"
```

The LLM by itself may not know:

```text
Incident details
Application logs
Deployment information
Configuration
Historical incidents
Internal documentation
```

An MCP Resource can provide that information.

```text
Agent
  │
  ▼
MCP Client
  │
  ▼
MCP Server
  │
  ▼
Resource
  │
  ▼
Enterprise Data
```

The agent can then reason over that context.

---

# 3. What Can Be an MCP Resource?

Resources can represent many kinds of enterprise information.

Examples:

```text
Documents
Incident records
Application logs
Database records
Configuration files
Knowledge-base articles
Reports
API data
System metadata
Source code
```

For your CWD example:

```text
Incident Resource
Log Resource
Troubleshooting Document
Deployment Record
Historical Incident Data
```

---

# 4. Example MCP Resources

An MCP server might expose resources such as:

```text
incident://INC-12345

logs://CWD/INC-12345

document://CWD/troubleshooting-guide

deployment://CWD/release-2026-08-30

incident-history://CWD
```

These identifiers allow the client/application to refer to specific pieces of information.

Conceptually:

```text
Resource URI
      │
      ▼
MCP Server
      │
      ▼
Underlying Enterprise Data
```

---

# 5. Resource vs Tool

This is one of the **most important MCP interview questions**.

## MCP Tool

A tool performs an operation.

```text
search_incidents()
get_incident_logs()
create_ticket()
update_incident()
```

Think:

> **"Do something for me."**

---

## MCP Resource

A resource provides information.

```text
incident://INC-12345
logs://INC-12345
document://CWD/troubleshooting
```

Think:

> **"Give me this information."**

---

# 6. Simple Comparison

| MCP Tool                      | MCP Resource                               |
| ----------------------------- | ------------------------------------------ |
| Performs an operation         | Provides data/context                      |
| Action-oriented               | Information-oriented                       |
| Can have side effects         | Primarily represents/readable context      |
| Example: `create_ticket()`    | Example: `incident://12345`                |
| Example: `search_incidents()` | Example: `document://guide`                |
| Agent invokes the operation   | Client/application reads/accesses resource |

### Memory trick

```text
Tool     = Verb
Resource = Noun
```

For example:

```text
Tool:
get_incident()

Resource:
incident://INC-12345
```

---

# 7. CWD Example

Suppose the user asks:

> **"Give me the details of incident INC-12345."**

The MCP Server could expose:

```text
incident://INC-12345
```

The flow is:

```text
User
  │
  ▼
Agent
  │
  ▼
MCP Client
  │
  ▼
MCP Server
  │
  ▼
incident://INC-12345
  │
  ▼
Incident Database
```

The resource returns information such as:

```text
Incident ID:
INC-12345

Severity:
Critical

Application:
CWD

Created:
2026-08-30

Status:
Resolved

Root Cause:
Database connection failure
```

The agent can use this information to answer the user.

---

# 8. Resource With Documents

Consider a CWD troubleshooting guide.

The MCP Server can expose:

```text
document://CWD/troubleshooting-guide
```

The agent can access it as contextual information.

```text
Agent
  │
  ▼
MCP Client
  │
  ▼
Knowledge MCP Server
  │
  ▼
document://CWD/troubleshooting-guide
  │
  ▼
Knowledge Repository
```

The agent can then use the retrieved content during reasoning.

---

# 9. Resource With Logs

Suppose an incident has application logs.

A resource could conceptually represent:

```text
logs://CWD/INC-12345
```

The flow:

```text
Agent
  │
  ▼
MCP Client
  │
  ▼
MCP Server
  │
  ▼
logs://CWD/INC-12345
  │
  ▼
Logging Platform
```

The agent receives the relevant log information and can analyze it.

---

# 10. Resource vs RAG

This is another important interview distinction.

**MCP Resources and RAG are not the same thing.**

### RAG

RAG is a retrieval architecture:

```text
Documents
   ↓
Chunking
   ↓
Embeddings
   ↓
Vector Database
   ↓
Similarity Search
   ↓
Relevant Context
   ↓
LLM
```

### MCP Resource

An MCP Resource is a standardized way for an MCP server to expose information/context to an AI application.

```text
AI Application
      ↓
MCP Client
      ↓
MCP Server
      ↓
Resource
      ↓
Enterprise Data
```

They can work together.

For example:

```text
Agent
  ↓
MCP Client
  ↓
Knowledge MCP Server
  ↓
Resource
  ↓
Vector Database
  ↓
Relevant Documents
```

So MCP can provide a standardized interface to a retrieval system, but **MCP itself is not a RAG framework**.

---

# 11. Resources Can Be Dynamic

Resources don't have to represent static files.

They can represent dynamic information.

For example:

```text
system://CWD/health
metrics://CWD/current
incident://INC-12345
logs://CWD/latest
```

The underlying data may change.

For example:

```text
metrics://CWD/current
```

could return current system metrics when accessed.

Therefore, a resource can represent information that is dynamically obtained from an underlying system.

---

# 12. Static vs Dynamic Resources

## Static Resource

Example:

```text
document://CWD/runbook
```

It may represent a relatively stable document.

```text
MCP Server
    ↓
Document Repository
    ↓
Runbook
```

---

## Dynamic Resource

Example:

```text
metrics://CWD/current
```

The MCP Server may retrieve the latest information from a monitoring system.

```text
MCP Server
    ↓
Monitoring API
    ↓
Current Metrics
```

---

# 13. How Does a Client Access Resources?

Conceptually, MCP provides mechanisms for discovering and reading resources.

A client can discover available resources.

```text
Client
  │
  │ resources/list
  ▼
MCP Server
```

The server returns resource metadata.

For example:

```text
incident://INC-12345
document://CWD/runbook
logs://CWD/INC-12345
```

The client can then request/read the required resource.

Conceptually:

```text
Client
  │
  │ resources/read
  ▼
MCP Server
  │
  ▼
Resource Data
```

---

# 14. Resource Metadata

A resource can have metadata describing it.

Conceptually:

```text
Resource

URI:
incident://INC-12345

Name:
CWD Incident INC-12345

Description:
Incident details for CWD production incident.

MIME Type:
application/json
```

This helps the AI application understand what the resource represents.

---

# 15. MCP Resources in Your CWD Architecture

Your architecture could look like this:

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
              ┌────────────┴────────────┐
              ▼                         ▼
       Knowledge Agent            Analytics Agent
              │                         │
         MCP Client                MCP Client
              │                         │
              ▼                         ▼
       Knowledge MCP             Incident MCP
          Server                    Server
              │                         │
       ┌──────┴──────┐          ┌──────┴──────┐
       ▼             ▼          ▼             ▼
   Documents      Vector DB  Incidents      Logs
       │             │          │             │
       └─────────────┴──────────┴─────────────┘
                         │
                      Resources
```

---

# 16. MCP Tools + Resources Together

Tools and resources often work together.

Suppose the user asks:

> **"Find similar incidents and analyze their root causes."**

The agent might use a **Tool** to search:

```text
search_incidents()
```

Then access the resulting incident information as resources:

```text
incident://INC-1001
incident://INC-1007
incident://INC-1012
```

Conceptually:

```text
                 Agent
                   │
             ┌─────┴─────┐
             ▼           ▼
           Tool       Resource
             │           │
             ▼           ▼
        Search Data   Read Context
             │           │
             └─────┬─────┘
                   ▼
                Agent
                   │
                   ▼
               Reasoning
```

---

# 17. Example: Tool + Resource

Imagine an Incident MCP Server exposes:

```text
Tools:
    search_incidents
    update_incident

Resources:
    incident://{incident_id}
    logs://{incident_id}
```

The agent can do:

### Step 1 — Search

```text
search_incidents(
    application="CWD",
    severity="CRITICAL"
)
```

### Step 2 — Get incident resource

```text
incident://INC-12345
```

### Step 3 — Get logs

```text
logs://CWD/INC-12345
```

### Step 4 — Analyze

```text
Incident Data
     +
Logs
     +
Historical Information
     ↓
Agent Reasoning
     ↓
Root Cause Analysis
```

---

# 18. MCP Resources vs Traditional API

Without MCP:

```text
Agent
  ↓
Custom REST API
  ↓
Enterprise System
```

With MCP:

```text
Agent
  ↓
MCP Client
  ↓
MCP Server
  ↓
Resource
  ↓
Enterprise System
```

The MCP Server can hide the underlying implementation.

The backend might be:

```text
REST
SQL
GraphQL
SDK
File system
Cloud service
```

The AI application interacts through the standardized MCP interface.

---

# 19. Security for Resources

Resources also need access control.

For example:

```text
Agent
  │
  ▼
MCP Server
  │
  ├── Authentication
  ├── Authorization
  ├── Resource permissions
  ├── Data filtering
  ├── Audit logging
  └── Policy enforcement
  │
  ▼
Enterprise Data
```

For example, one agent may be allowed to access:

```text
incident://INC-12345
```

while another agent may not have permission.

Sensitive resources should not simply be exposed to every agent.

---

# 20. Resource Templates

In some cases, you don't want to manually define every resource.

Instead, a server can expose a **resource template**.

For example:

```text
incident://{incident_id}
```

This represents a pattern for accessing individual incident resources.

For:

```text
INC-12345
```

it becomes:

```text
incident://INC-12345
```

For:

```text
INC-12346
```

it becomes:

```text
incident://INC-12346
```

This is useful for systems with many dynamic resources.

---

# 21. Tool vs Resource vs Prompt

You should know this table for interviews.

| MCP Concept  | Purpose                       | Example                |
| ------------ | ----------------------------- | ---------------------- |
| **Tool**     | Execute an operation          | `search_incidents()`   |
| **Resource** | Provide data/context          | `incident://INC-12345` |
| **Prompt**   | Reusable interaction template | `analyze_incident`     |

### Easy memory

```text
Tool
→ DO

Resource
→ READ

Prompt
→ GUIDE
```

---

# 22. CWD Interview Example

### Interviewer:

**"Give me an example of an MCP Resource from your project."**

### Answer:

> **"In my CWD Enterprise Assistant, an MCP Server could expose incident information, logs, troubleshooting documents, and deployment information as resources. For example, `incident://INC-12345` could represent the structured details of an incident, while `logs://CWD/INC-12345` could represent the associated application logs. The agent can access those resources through the MCP Client and use the information as context for root-cause analysis."**

---

# 23. Important Interview Follow-Up

### "Are resources always files?"

**No.**

Resources can represent:

```text
Files
Documents
Database records
API responses
Logs
Configuration
Knowledge
Dynamic application data
```

The important idea is that they represent **information/context exposed through the MCP server**.

---

### "Do resources execute actions?"

Generally, **no**.

Resources primarily provide/read information.

If you need to perform an action such as:

```text
create_ticket()
update_incident()
restart_service()
```

that is a **Tool** use case.

---

### "Can MCP Tools and Resources work together?"

**Yes.**

For example:

```text
Tool:
search_incidents()

        ↓

Results:
INC-12345
INC-12346

        ↓

Resources:
incident://INC-12345
incident://INC-12346

        ↓

Agent analyzes the context
```

---

# 24. 30-Second Interview Script

> **"MCP Resources represent data or context exposed by an MCP Server that an AI application can access for reasoning. Unlike MCP Tools, which execute operations, resources primarily provide information such as documents, incident records, logs, configuration, or knowledge-base content. In CWD, for example, `incident://INC-12345` could represent incident details and `logs://CWD/INC-12345` could represent associated logs. The agent accesses those resources through the MCP Client and uses them as context for its reasoning."**

---

# 25. One-Line Definition

> **"An MCP Resource is a piece of data or contextual information exposed by an MCP Server that an AI application can access and use for reasoning."**

---

# 26. Final Mental Model

```text
                       MCP
                        │
          ┌─────────────┼─────────────┐
          │             │             │
          ▼             ▼             ▼
        Tools       Resources       Prompts
          │             │             │
          ▼             ▼             ▼
        DO            READ           GUIDE
          │             │
          ▼             ▼
     Enterprise     Enterprise
      Actions          Data
```

### For your CWD project:

```text
A2A
Coordinator ↔ Specialized Agents

MCP
Agents ↔ MCP Servers

MCP Tools
Agents → Perform operations

MCP Resources
Agents → Access information/context

MCP Prompts
Agents → Use reusable interaction templates
```

## Final Interview Statement

> **"MCP Tools give the agent the ability to do something, while MCP Resources give the agent access to information it can reason over."**
