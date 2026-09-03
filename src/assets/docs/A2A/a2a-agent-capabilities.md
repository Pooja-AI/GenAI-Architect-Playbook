## How do you manage agent capabilities?

### Strong Interview Answer

> **“I manage agent capabilities by defining each agent with a clear responsibility, a controlled set of skills, tools, and permissions. The coordinator does not blindly send tasks to every agent. It uses the agent's capability metadata to determine which agent is qualified to handle a particular task. This gives us clear boundaries, better security, and easier scalability.”**

### In my CWD Multi-Agent Architecture

```text
                         User Request
                              ↓
                     ┌─────────────────┐
                     │   Coordinator   │
                     └────────┬────────┘
                              ↓
                     Capability Matching
                              ↓
          ┌───────────────────┼───────────────────┐
          ↓                   ↓                   ↓
   Knowledge Agent      Analytics Agent     Action Agent
          ↓                   ↓                   ↓
      RAG / MCP          SQL / Python       Enterprise APIs
```

### 1. Define capabilities explicitly

Each agent has metadata describing what it can do.

```yaml
agent:
  name: KnowledgeAgent

capabilities:
  - document_search
  - semantic_search
  - knowledge_retrieval
  - summarization

tools:
  - vector_database
  - document_mcp_server

permissions:
  - read_documents
```

So the **Knowledge Agent should not execute database updates or HR actions**.

---

### 2. Separate skills from tools

I distinguish between:

**Capability / Skill**

```text
What the agent can do
```

**Tool**

```text
What the agent can use to perform it
```

For example:

```text
Knowledge Agent
   │
   ├── Skill: Document Search
   │       └── Tool: Vector DB
   │
   ├── Skill: Summarization
   │       └── Tool: LLM
   │
   └── Skill: Metadata Search
           └── Tool: MCP
```

This separation makes the architecture easier to govern.

---

### 3. Capability-based routing

The coordinator looks at the user's intent and matches it with agent capabilities.

For example:

```text
User:
"Find the CWD troubleshooting procedure"
             ↓
Coordinator
             ↓
Required capability:
document_search
             ↓
Knowledge Agent
```

Whereas:

```text
User:
"Show me the failure statistics"
             ↓
Required capability:
analytics
             ↓
Analytics Agent
```

---

### 4. Use Agent Cards for discoverability

For **A2A-based communication**, an agent can expose an **Agent Card** describing its identity, capabilities, skills, supported interfaces, and authentication information.

Conceptually:

```json
{
  "name": "KnowledgeAgent",
  "description": "Enterprise knowledge retrieval agent",
  "skills": [
    "document_search",
    "semantic_search",
    "summarization"
  ],
  "protocol": "A2A"
}
```

The coordinator can use this information when deciding where to delegate work.

---

### 5. Enforce capability boundaries

Capability management is also a **security mechanism**.

For example:

```text
Knowledge Agent
    ✓ Read documents
    ✓ Search knowledge
    ✗ Modify production data
    ✗ Approve requests
    ✗ Access payroll
```

I follow the **principle of least privilege** so that an agent receives only the tools, data, and permissions required for its responsibility.

---

### 6. Capability registry

In a larger enterprise system, I would maintain an **agent/capability registry**.

```text
Agent Registry
│
├── Knowledge Agent
│    ├── document_search
│    └── summarization
│
├── Analytics Agent
│    ├── SQL_analysis
│    └── visualization
│
├── Action Agent
│    ├── ticket_creation
│    └── workflow_execution
│
└── Monitoring Agent
     ├── log_analysis
     └── incident_detection
```

The registry can also maintain:

* Agent status
* Version
* Capabilities
* Skills
* Tools
* Permissions
* Endpoint
* Health status
* Authentication information

---

## How it works end-to-end

```text
              User
                ↓
        ┌──────────────┐
        │ Coordinator  │
        └──────┬───────┘
               ↓
       Understand Intent
               ↓
       Identify Required
          Capability
               ↓
       Query Agent Registry
               ↓
       Find Matching Agent
               ↓
       Check Permissions
               ↓
          Delegate Task
               ↓
          Agent Executes
               ↓
       Return Result
               ↓
         Coordinator
               ↓
         Final Response
```

### Interview-ready 30-second version

> **“I manage agent capabilities through explicit capability and skill definitions. Each agent has a well-defined responsibility, a controlled set of tools, and specific permissions. The coordinator uses these capabilities for intelligent routing instead of sending every request to every agent. In an A2A architecture, Agent Cards can advertise the agent's capabilities and skills, while an enterprise agent registry maintains metadata, health, versions, and endpoints. I also enforce least-privilege access so an agent can only use the tools and data required for its job.”**
