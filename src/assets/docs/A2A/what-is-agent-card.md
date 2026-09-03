# What Is an Agent Card?

## Interview Question

**“What is an Agent Card in A2A?”**

---

# 1. Strong Interview Answer

> **“An Agent Card is a machine-readable metadata document that describes an agent’s identity, capabilities, skills, endpoint, supported communication protocols, input/output formats, and authentication requirements. It allows other agents or clients to discover what the agent can do and how to communicate with it without needing to know its internal implementation.”**

In simple terms:

```text
Agent Card = Agent's capability + identity + communication metadata
```

Think of it as a **digital business card for an AI agent**.

---

# 2. Why Do We Need an Agent Card?

Suppose we have:

```text
Manufacturing Delegator
        |
        | "I need image analysis"
        v
     ??? Agent
```

The Delegator needs to know:

* Which agents are available?
* Which agent supports image analysis?
* Where is the agent hosted?
* How do I communicate with it?
* What capabilities does it provide?
* What input does it accept?
* What authentication is required?

The Agent Card provides this information.

```text
                    Agent Registry
                          |
                          v
                    Agent Card
                          |
        +-----------------+----------------+
        |                 |                |
        v                 v                v
   Capabilities       Endpoint        Security
```

---

# 3. Conceptual Agent Card

A simplified Agent Card might look like:

```json
{
  "name": "vision-agent",
  "description": "Analyzes manufacturing defect images",
  "version": "1.0.0",

  "capabilities": [
    "image_analysis",
    "defect_detection",
    "visual_classification"
  ],

  "endpoint": "https://vision-agent.example.com",

  "protocol": "A2A",

  "input": [
    "image",
    "machine_id",
    "defect_context"
  ],

  "output": [
    "defect_type",
    "confidence",
    "evidence"
  ],

  "authentication": {
    "type": "OAuth2"
  }
}
```

**Note:** This is a simplified conceptual representation for interview understanding; an actual A2A Agent Card follows the protocol's defined schema.

---

# 4. Main Components of an Agent Card

## 4.1 Identity

Identifies the agent.

```json
{
  "name": "vision-agent",
  "version": "1.0.0"
}
```

It tells the caller:

> “Who are you?”

---

## 4.2 Description

Explains the agent's purpose.

```text
"Analyzes manufacturing defect images"
```

For example:

```text
Vision Agent
→ Manufacturing image analysis
```

---

## 4.3 Capabilities

Defines what the agent can do.

```text
image_analysis
defect_detection
visual_classification
```

This is one of the most important parts for discovery.

The Delegator can ask:

> “Which agent supports `image_analysis`?”

---

# 5. Skills

Capabilities can be further described through specific skills.

For example:

```text
Vision Agent

Skills:
├── Defect Detection
├── Image Classification
├── Object Detection
└── Visual Similarity Analysis
```

Conceptually:

```json
{
  "skills": [
    {
      "id": "defect-detection",
      "name": "Defect Detection",
      "description": "Detects defects in manufacturing images"
    }
  ]
}
```

---

# 6. Endpoint

The Agent Card tells the client where the agent can be reached.

```text
Agent:
Vision Agent

Endpoint:
https://vision-agent.example.com
```

So the caller doesn't need to hardcode the endpoint separately.

---

# 7. Supported Protocol / Interaction

The Agent Card can describe how the agent communicates and what interaction capabilities it supports.

Conceptually:

```text
Protocol:
A2A

Supported interaction:
Task-based communication
Streaming
Async updates
```

This allows the caller to understand how to interact with the agent.

---

# 8. Input and Output

The Agent Card can describe what the agent expects and what it produces.

For example:

```text
Input:
├── Image
├── Machine ID
└── Defect context

Output:
├── Defect type
├── Confidence
└── Evidence
```

This helps the calling agent construct a valid request.

---

# 9. Authentication

Enterprise agents need security.

The Agent Card can provide information about supported authentication mechanisms.

For example:

```text
Authentication:
OAuth 2.0
JWT
mTLS
```

The important architectural point is:

```text
Discovery ≠ Authorization
```

The Agent Card may describe the authentication requirements, but the actual authorization decision is enforced by the security infrastructure.

---

# 10. Agent Card in CWD Architecture

Let's use the CWD example.

We have:

```text
                    Coordinator
                         |
                         v
                Manufacturing
                   Delegator
                         |
                Agent Discovery
                         |
                         v
                  Agent Registry
                         |
              +----------+----------+
              |                     |
              v                     v
        Vision Agent          RAG Agent
        Agent Card            Agent Card
```

The Manufacturing Delegator needs:

```text
Capability:
image_analysis
```

It queries the registry.

The registry finds:

```text
Vision Agent
```

because its Agent Card advertises:

```text
image_analysis
defect_detection
visual_classification
```

The Delegator then selects the Vision Agent.

---

# 11. Complete Discovery Flow

```text
User Request
     |
     v
Coordinator
     |
     v
Manufacturing Delegator
     |
     | "I need image_analysis"
     v
Agent Registry
     |
     v
Search Agent Cards
     |
     v
Vision Agent Card
     |
     +---- Capability Match
     +---- Endpoint
     +---- Protocol
     +---- Authentication
     +---- Version
     |
     v
Policy / Authorization Check
     |
     v
Select Vision Agent
     |
     v
A2A Communication
     |
     v
Vision Agent
```

---

# 12. Agent Card vs Agent Registry

These are related but different.

### Agent Card

Describes **one agent**.

```text
Vision Agent
    |
    v
Agent Card
```

### Agent Registry

Maintains/discovers **multiple agents**.

```text
Agent Registry
    |
    +── Vision Agent Card
    +── RAG Agent Card
    +── Analytics Agent Card
    +── RCA Agent Card
```

Therefore:

> **Agent Card = description of an agent.**

> **Agent Registry = mechanism for discovering/managing agents.**

---

# 13. Agent Card vs Agent Discovery

Another important distinction:

```text
Agent Card
→ "What can this agent do?"

Agent Discovery
→ "Where can I find an agent that can do what I need?"

Agent Selection
→ "Which available agent should I choose?"
```

Example:

```text
Requirement:
image_analysis

       ↓

Discovery

       ↓

Candidate Agents

       ↓

Agent Cards

       ↓

Capability Matching

       ↓

Vision Agent Selected
```

---

# 14. Why Is This Better Than Hardcoding?

Without Agent Cards:

```python
if capability == "image_analysis":
    call("http://vision-agent:8000")
```

This creates tight coupling.

If the agent moves:

```text
vision-agent-v1
      ↓
vision-agent-v2
```

or another agent becomes available:

```text
Vision Agent A
Vision Agent B
Vision Agent C
```

the Coordinator/Delegator shouldn't need to be rewritten every time.

With discovery:

```text
Required Capability
        ↓
Agent Registry
        ↓
Agent Cards
        ↓
Select Suitable Agent
```

This supports more dynamic architectures.

---

# 15. Agent Card Enables Capability-Based Routing

This is especially important in your hierarchical CWD architecture.

### Coordinator

Determines:

```text
Which DOMAIN?
```

Example:

```text
Manufacturing
```

### Delegator

Determines:

```text
Which CAPABILITY?
```

Example:

```text
image_analysis
```

### Agent Registry

Finds:

```text
Which AGENT provides that capability?
```

### Agent Card

Describes:

```text
What that agent can do
```

### Worker Agent

Executes:

```text
The actual task
```

So:

```text
Coordinator
   ↓
Which Domain?
   ↓
Manufacturing Delegator
   ↓
Which Capability?
   ↓
Agent Registry
   ↓
Which Agent?
   ↓
Agent Card
   ↓
Vision Agent
   ↓
Execute
```

---

# 16. Agent Card and A2A

The relationship is:

```text
Agent Card
     ↓
Discovery
     ↓
Agent Selection
     ↓
A2A
     ↓
Agent Communication
```

Important:

> **The Agent Card does not perform the communication.**

It provides metadata that helps the caller understand and discover the agent.

A2A is then used for the actual agent-to-agent interaction.

---

# 17. Agent Card + A2A + MCP + LangGraph

This is a very important interview combination.

```text
                    LangGraph
                Workflow / State
                       |
                       v
                 Coordinator
                       |
                       v
                  Delegator
                       |
                Agent Discovery
                       |
                       v
                 Agent Card
                       |
                  Capability
                   Matching
                       |
                       v
                     A2A
                       |
                       v
                  Worker Agent
                       |
                      MCP
                       |
             +---------+---------+
             |         |         |
             v         v         v
           DB        API       Tools
```

### Responsibilities

| Component          | Responsibility                     |
| ------------------ | ---------------------------------- |
| **LangGraph**      | Workflow and state orchestration   |
| **Agent Card**     | Agent identity/capability metadata |
| **Agent Registry** | Agent discovery                    |
| **A2A**            | Agent-to-agent communication       |
| **MCP**            | Agent-to-tool/data communication   |

---

# 18. Enterprise-Level Example

Imagine there are 50 agents:

```text
Manufacturing
├── Vision Agent
├── Quality Agent
├── RCA Agent
└── Analytics Agent

Supply Chain
├── Inventory Agent
├── Procurement Agent
└── Logistics Agent

Finance
├── Cost Agent
├── Invoice Agent
└── Forecasting Agent
```

The Coordinator should not maintain detailed knowledge of all 50 agents.

Instead:

```text
Coordinator
      |
      v
Capability Registry
      |
      v
Agent Cards
      |
      v
Select appropriate agent
```

This provides **loose coupling and scalability**.

---

# 19. Security Consideration

Do not make the mistake of saying:

> “If the Agent Card says the agent supports something, we can call it.”

In an enterprise system:

```text
Discover
   ↓
Authenticate
   ↓
Authorize
   ↓
Validate capability
   ↓
Check health
   ↓
Invoke
```

For example:

```text
Manufacturing Delegator
        |
        v
Agent Card
        |
        v
"I can perform RCA"
        |
        v
Authorization Check
        |
        v
Allowed?
   /       \
 Yes        No
  |          |
 Invoke     Reject
```

---

# 20. Agent Card Is Similar To...

For interview memory:

### Traditional API

```text
OpenAPI Specification
```

describes:

```text
API endpoints
operations
request/response schemas
```

### Agent

```text
Agent Card
```

describes:

```text
Agent identity
capabilities
skills
endpoint
interaction details
authentication requirements
```

So you can think of:

> **“Agent Card is conceptually similar to a service/API metadata contract, but designed for agent discovery and agent-oriented interaction.”**

Don't say they are exactly the same thing.

---

# 21. Most Important Interview Distinction

### Agent Card

**What can you do?**

### Agent Registry

**Where can I find you?**

### A2A

**How do we communicate?**

### MCP

**How do you access tools/data?**

### LangGraph

**How is the workflow controlled?**

Memory:

```text
Agent Card  → WHAT?
Registry    → WHERE?
A2A         → AGENT ↔ AGENT
MCP         → AGENT ↔ TOOL/DATA
LangGraph   → WHAT NEXT?
```

---

# 22. Strong Architect-Level Answer

> **“I use Agent Cards as the metadata contract for agent discovery. Each independently managed agent publishes information such as its identity, capabilities, skills, endpoint, supported interaction mechanisms, and security requirements. The Coordinator or Delegator doesn't need to hardcode every agent. It identifies the capability it needs, discovers candidate agents through a registry or discovery mechanism, evaluates their Agent Cards, applies authorization and operational policies, and then selects the appropriate agent. A2A is used for the actual agent-to-agent interaction. This gives us capability-based routing, loose coupling, and the ability to independently evolve and deploy agents.”**

---

# 23. 30-Second Interview Answer

> **“An Agent Card is essentially a machine-readable profile of an AI agent. It describes who the agent is, what capabilities and skills it provides, where it can be reached, and how it can be interacted with. In my CWD architecture, when the Manufacturing Delegator needs image analysis, it can discover candidate agents through the registry, inspect their Agent Cards, select the Vision Agent based on capability and policy, and then communicate with it using A2A. So the Agent Card supports discovery and capability-based routing; A2A handles the actual communication.”**

---

# 24. One-Line Answer

> **“An Agent Card is a machine-readable metadata contract that tells other agents who an agent is, what it can do, and how to interact with it.”**

---

# Memory Trick

```text
                 AGENT CARD
                     |
       +-------------+-------------+
       |             |             |
     WHO?           WHAT?        WHERE?
       |             |             |
    Identity     Capabilities   Endpoint
       |
       +-------------------------+
                                 |
                              HOW?
                                 |
                       Interaction/Security
```

### Golden Architecture

```text
Agent Card
    ↓
Discovery
    ↓
Capability Matching
    ↓
Selection
    ↓
Authorization
    ↓
A2A Communication
    ↓
Agent Execution
```
