# MCP vs REST API

## Interview Question

**“What is the difference between MCP and REST API?”**

---

# 1. Strong Interview Answer

> **REST API is a general-purpose application-to-application communication mechanism used to expose business services over HTTP. MCP is a protocol designed specifically to standardize how AI applications and agents discover and interact with tools, resources, and prompts.**
>
> **In an enterprise Agentic AI architecture, I would not replace REST APIs with MCP. Instead, I would typically use MCP as the AI integration layer, where an MCP Server can encapsulate existing REST APIs, databases, and enterprise systems and expose them as AI-friendly tools and resources.**

### Simple difference

```text
REST
Application ↔ Service/API

MCP
AI Agent ↔ MCP Server ↔ Enterprise Systems
```

---

# 2. REST API

REST is a general API architectural style commonly used for application integration.

For example:

```text
GET /incidents/INC-12345
```

or:

```text
POST /incidents
```

A traditional application knows:

* API endpoint
* HTTP method
* Authentication
* Request format
* Response format

Example:

```text
Application
     |
     | HTTP GET
     v
Incident REST API
     |
     v
Incident Database
```

---

# 3. MCP

MCP provides a standardized protocol for AI applications to interact with external capabilities.

An MCP Server can expose:

```text
Tools
Resources
Prompts
```

For example:

```text
Incident MCP Server

Tools:
    search_incidents
    get_incident_logs
    create_incident

Resources:
    incident://INC-12345
    logs://INC-12345

Prompts:
    analyze_incident
    generate_rca
```

The AI application communicates through an MCP Client.

```text
AI Agent
    |
    v
MCP Client
    |
    v
MCP Server
    |
    +---- REST API
    +---- Database
    +---- SaaS API
    +---- Internal Service
```

---

# 4. Key Difference

| Area                   | REST API                                           | MCP                                  |
| ---------------------- | -------------------------------------------------- | ------------------------------------ |
| Primary purpose        | Application integration                            | AI/agent integration                 |
| Consumer               | Applications/services                              | AI applications/agents               |
| Communication          | HTTP-based API calls                               | MCP protocol                         |
| Discovery              | Usually API documentation/OpenAPI/service registry | Protocol-level capability discovery  |
| Tools                  | Not an MCP concept                                 | First-class concept                  |
| Resources              | Not an MCP concept                                 | First-class concept                  |
| Prompts                | Not a protocol primitive                           | First-class concept                  |
| Tool schema            | API-specific                                       | Standardized MCP tool definition     |
| Agent awareness        | Not inherently                                     | Designed for AI clients              |
| Reasoning              | No                                                 | Agent/LLM handles reasoning          |
| Security               | API auth/security                                  | MCP + underlying enterprise security |
| Reusability for agents | Requires custom integration                        | Standardized AI-facing interface     |

---

# 5. The Biggest Architectural Difference

With REST:

```text
Agent
   |
   | Custom REST integration
   v
Incident API
```

The agent/application needs to understand the API contract.

For example:

```text
Endpoint:
GET /api/v1/incidents/{id}

Headers:
Authorization: Bearer ...

Parameters:
incident_id

Response:
JSON
```

With MCP:

```text
Agent
   |
   v
MCP Client
   |
   v
MCP Server
   |
   v
Incident REST API
```

The agent sees an MCP capability such as:

```text
get_incident
```

The MCP Server handles the underlying API details.

---

# 6. CWD Example

Suppose CWD has an existing Incident Management REST API.

### Existing REST Architecture

```text
CWD Agent
     |
     | REST
     v
Incident API
     |
     v
Incident Database
```

The agent must be programmed to understand the API.

---

## With MCP

Introduce an Incident MCP Server:

```text
                     CWD Agent
                         |
                         v
                    MCP Client
                         |
                         v
               Incident MCP Server
                         |
                         v
                  Incident REST API
                         |
                         v
                  Incident Database
```

The MCP Server exposes:

```text
get_incident
search_incidents
get_incident_logs
get_incident_metrics
```

The agent doesn't need to know whether the backend uses:

* REST
* SQL
* GraphQL
* SOAP
* Internal SDK
* Database
* SaaS API

The MCP Server abstracts that integration.

---

# 7. Example

User asks:

```text
Show me details for INC-12345.
```

The agent decides it needs:

```text
get_incident
```

The MCP Client invokes the MCP tool.

Conceptually:

```text
tools/call
```

with:

```json
{
  "name": "get_incident",
  "arguments": {
    "incident_id": "INC-12345"
  }
}
```

The MCP Server might internally execute:

```text
GET /api/incidents/INC-12345
```

against the existing REST API.

So:

```text
Agent
  ↓
MCP Client
  ↓
MCP Server
  ↓
REST API
  ↓
Incident DB
```

---

# 8. MCP Does NOT Replace REST

This is an important interview point.

Don't say:

> "MCP is the replacement for REST."

Instead say:

> **"MCP complements REST. REST remains the underlying service integration mechanism, while MCP provides a standardized interface for AI applications to discover and use enterprise capabilities."**

For example:

```text
                AI Layer
                   |
                 MCP
                   |
          +--------+--------+
          |        |        |
         REST     SQL     GraphQL
          |        |        |
          v        v        v
       Systems  Databases  Services
```

---

# 9. Why Not Let the Agent Directly Call REST APIs?

This is where MCP becomes valuable.

Suppose your enterprise has:

```text
200 REST APIs
50 databases
30 SaaS systems
20 internal services
```

Without MCP:

```text
Agent
 ├── REST API integration
 ├── SQL integration
 ├── SaaS integration
 ├── Internal API integration
 └── Custom authentication
```

This creates significant integration complexity.

With MCP:

```text
                 Agent
                   |
               MCP Client
                   |
          +--------+--------+
          |        |        |
        MCP      MCP      MCP
       Server   Server   Server
          |        |        |
        REST      SQL     SaaS
```

Each MCP Server owns the integration details.

---

# 10. MCP Provides Capability Discovery

Traditional REST APIs generally require the client to know the API contract.

For example:

```text
GET /incidents/{id}
POST /incidents
GET /incidents/search
```

The client needs to know these endpoints.

With MCP, the client can discover available tools.

Conceptually:

```text
MCP Client
     |
     | tools/list
     v
MCP Server
     |
     +--> search_incidents
     +--> get_incident
     +--> get_incident_logs
```

Then the agent can select the appropriate capability.

---

# 11. MCP Is More Than Tools

Another major difference is that MCP provides multiple primitives.

```text
                 MCP
                  |
       +----------+----------+
       |          |          |
       v          v          v
     Tools    Resources   Prompts
       |          |          |
       v          v          v
    Actions      Data     Instructions
```

REST primarily exposes API operations.

MCP gives an AI application a standardized model for:

```text
Tools     → actions
Resources → contextual data
Prompts   → reusable instructions
```

---

# 12. REST vs MCP Request Flow

## REST

```text
Application
     |
     | HTTP Request
     v
REST API
     |
     v
Business Logic
     |
     v
Database
     |
     v
HTTP Response
```

---

## MCP

```text
User
  |
  v
Agent / LLM
  |
  | decides capability
  v
MCP Client
  |
  | MCP tool call
  v
MCP Server
  |
  | integration logic
  v
REST / SQL / SDK / SaaS
  |
  v
Enterprise System
  |
  v
MCP Result
  |
  v
Agent
```

---

# 13. Security Comparison

### REST

Security is typically handled through mechanisms such as:

```text
OAuth
JWT
API Keys
mTLS
RBAC
Gateway policies
```

### MCP

MCP should also operate within enterprise security controls.

For example:

```text
Agent Identity
      ↓
MCP Client
      ↓
Authentication
      ↓
Authorization
      ↓
Tool Policy
      ↓
MCP Server
      ↓
Enterprise API
```

The MCP layer should not bypass the security controls of the underlying system.

---

# 14. Enterprise Architecture Pattern

For your CWD project, I would explain it like this:

```text
                         User
                           |
                           v
                      Coordinator
                      LangGraph
                           |
                           | A2A
                           v
                   Specialized Agent
                           |
                           v
                      MCP Client
                           |
                           v
                     MCP Server
                           |
              +------------+------------+
              |            |            |
              v            v            v
            REST          SQL         SaaS
             API           DB           API
              |            |            |
              +------------+------------+
                           |
                           v
                   Enterprise Systems
```

### Responsibility boundaries

```text
Coordinator
    ↓
Orchestration

Agent
    ↓
Reasoning + decision making

MCP Client
    ↓
Protocol communication

MCP Server
    ↓
Enterprise capability abstraction

REST API
    ↓
Business service integration

Database
    ↓
Data persistence
```

This separation is important for enterprise architecture.

---

# 15. When Would I Use REST?

Use REST when:

* Application-to-application communication is required
* Building standard business services
* Exposing CRUD operations
* Integrating microservices
* Building external APIs
* Integrating frontend/backend applications

Example:

```text
React UI
   ↓
REST API
   ↓
Spring Boot Service
```

---

# 16. When Would I Use MCP?

Use MCP when:

* An AI agent needs access to enterprise capabilities
* You want standardized tool discovery
* Multiple AI applications need the same capabilities
* You want to abstract backend implementation details
* Agents need access to tools/resources/prompts
* You want a consistent AI integration layer

Example:

```text
AI Agent
   ↓
MCP
   ↓
Enterprise Systems
```

---

# 17. Can MCP and REST Coexist?

**Absolutely.**

In fact, this is the architecture I would prefer in an enterprise environment.

```text
             AI Applications
                    |
                   MCP
                    |
             MCP Servers
                    |
       +------------+------------+
       |            |            |
      REST          SQL         SDK
       |            |            |
       v            v            v
   Microservices  Databases   SaaS
```

MCP becomes the **AI-facing integration layer**, while REST remains the **service-to-service integration layer**.

---

# 18. MCP vs REST — Interview Cheat Sheet

```text
REST
→ General-purpose API architecture

MCP
→ AI/agent integration protocol

REST
→ Endpoint-oriented

MCP
→ Capability-oriented

REST
→ Client knows API contract

MCP
→ Client can discover capabilities

REST
→ API operations

MCP
→ Tools + Resources + Prompts

REST
→ Application ↔ Service

MCP
→ Agent ↔ Enterprise Capability
```

---

# 19. Strong 30-Second Interview Answer

> **"REST and MCP solve different problems. REST is a general-purpose API mechanism for application-to-application communication, while MCP is designed specifically for AI applications to interact with tools, resources, and prompts in a standardized way. In my enterprise CWD architecture, I wouldn't replace REST with MCP. I would put an MCP Server in front of existing enterprise systems. The agent communicates through an MCP Client, discovers capabilities such as `get_incident_logs`, and invokes them through MCP. The MCP Server can then call the existing REST API or database behind the scenes. This gives us a clean separation between AI reasoning and enterprise integration while preserving our existing APIs."**

---

# 20. One-Line Interview Answer

> **"REST connects applications to services; MCP connects AI agents to enterprise capabilities, often by abstracting existing REST APIs, databases, and other systems behind MCP Servers."**

---

# 21. Final Memory Trick

```text
             REST
               |
       Application ↔ API
               |
          Service Layer


              MCP
               |
         AI Agent ↔ MCP
               |
          MCP Server
               |
      +--------+--------+
      |        |        |
     REST     SQL      SaaS
```

### Remember:

> **REST = How applications communicate with services.**

> **MCP = How AI applications discover and interact with capabilities.**

> **MCP does not replace REST — it can sit above REST and make existing enterprise capabilities AI-accessible.**
