# How Does an Agent Discover Another Agent?

## Interview Question

**“How does an agent discover another agent?”**

---

## Strong Interview Answer

An agent typically discovers another agent through an **agent discovery mechanism or agent registry**.

The key idea is that an agent should not need to hardcode the URL, capabilities, or implementation details of every other agent.

Instead, agents publish metadata describing:

* Agent identity
* Endpoint
* Capabilities
* Supported skills
* Input/output formats
* Authentication requirements
* Supported protocols
* Version
* Availability/health information

The requesting agent queries the registry or discovery service, finds an agent that supports the required capability, validates authorization and availability, and then communicates with that agent.

In an A2A-based architecture, this metadata can be represented through an **Agent Card**, which describes what an agent can do and how another agent can interact with it.

The basic flow is:

```text
Agent A
   ↓
"What capability do I need?"
   ↓
Agent Registry / Discovery
   ↓
Find matching Agent
   ↓
Read Agent Card / Metadata
   ↓
Validate capability + security + availability
   ↓
Invoke Agent B
   ↓
A2A Communication
```

---

# Functional Explanation

Suppose the **Manufacturing Delegator** needs image analysis.

It does not necessarily need to know:

```text
Vision Agent URL = http://...
Vision Agent implementation = Python
Vision model = ...
Deployment = Kubernetes
```

Instead, it asks the discovery mechanism:

> “I need an agent capable of semiconductor defect image analysis.”

The registry might return:

```text
Vision Agent

Capabilities:
    image_analysis
    defect_detection
    visual_classification

Endpoint:
    /vision-agent

Protocol:
    A2A

Status:
    Healthy
```

The Delegator can then invoke the Vision Agent.

---

# Agent Discovery Architecture

```text
                 ┌──────────────────────┐
                 │    Agent Registry     │
                 │                      │
                 │ Manufacturing Agent  │
                 │ Vision Agent         │
                 │ RAG Agent            │
                 │ Analytics Agent      │
                 │ RCA Agent            │
                 └──────────┬───────────┘
                            │
                       Discovery
                            │
             ┌──────────────┴──────────────┐
             ↓                             ↓
      Coordinator                    Delegator
             │                             │
             │                             │
             └────────── A2A ─────────────┘
                                           │
                                           ↓
                                      Worker Agent
```

---

# What Information Is Registered?

A typical Agent Registry entry could contain:

```json
{
  "agent_id": "vision-agent",
  "name": "Manufacturing Vision Agent",
  "description": "Analyzes semiconductor defect images",
  "capabilities": [
    "image_analysis",
    "defect_detection",
    "visual_classification"
  ],
  "endpoint": "https://agent.example.com/vision",
  "protocol": "A2A",
  "version": "1.0",
  "authentication": "OAuth2",
  "status": "healthy"
}
```

The exact metadata depends on the implementation, but architecturally the purpose is the same:

> **Describe what the agent can do and how to communicate with it.**

---

# Agent Discovery vs Agent Selection

These are related but **not the same thing**.

### Agent Discovery

Answers:

> **“What agents are available?”**

Example:

```text
Registry
   ↓
Vision Agent
RAG Agent
Analytics Agent
RCA Agent
```

### Agent Selection

Answers:

> **“Which available agent should I use?”**

Example:

```text
Required capability:
    defect_detection

Candidates:
    Vision Agent ✓
    RAG Agent    ✗
    Analytics    ✗

Selection:
    Vision Agent
```

So:

```text
Discovery → Find candidates

Selection → Choose the best candidate
```

This distinction is important at architect level.

---

# How Does Capability-Based Discovery Work?

Suppose the Delegator needs:

```text
Capability = root_cause_analysis
```

The registry might contain:

```text
Agent A
Capabilities:
    image_analysis
    defect_detection

Agent B
Capabilities:
    document_search
    knowledge_retrieval

Agent C
Capabilities:
    root_cause_analysis
    manufacturing_analysis
```

The discovery process performs capability matching:

```text
Required Capability
        ↓
root_cause_analysis
        ↓
Agent Registry
        ↓
       Match
        ↓
Agent C
```

---

# Where Does the Agent Card Fit?

In A2A architectures, an **Agent Card** provides machine-readable information about an agent's identity, capabilities, endpoint, and interaction requirements.

Conceptually:

```text
Agent Card
     │
     ├── Identity
     ├── Description
     ├── Capabilities
     ├── Skills
     ├── Endpoint
     ├── Authentication
     └── Supported interaction details
```

The consuming agent can inspect this information before deciding whether and how to interact with the target agent.

---

# Where Can the Agent Card Come From?

There are several possible discovery models.

### 1. Well-Known / Endpoint-Based Discovery

An agent exposes its Agent Card at a known location.

```text
Client
  ↓
Known Agent URL
  ↓
Agent Card
  ↓
Capabilities
```

This works well when the agent endpoint is already known.

---

### 2. Central Agent Registry

Enterprise environments may maintain a registry:

```text
                  Agent Registry
                       │
       ┌───────────────┼───────────────┐
       ↓               ↓               ↓
  Vision Agent    RAG Agent       Analytics Agent
```

The requesting agent searches the registry based on capabilities.

This is useful when there are many independently deployed agents.

---

### 3. Service Discovery Infrastructure

An enterprise may integrate agent discovery with existing service-discovery infrastructure.

For example:

```text
Agent
  ↓
Service Discovery
  ↓
Agent Endpoint
  ↓
Agent Card / Metadata
```

This can help with:

* Dynamic endpoints
* Health checks
* Load balancing
* Service registration
* Availability

---

# Discovery in Your Architecture

For your **Coordinator → Delegator → Worker** architecture, I would describe it like this:

```text
                         Agent Registry
                              │
             ┌────────────────┼────────────────┐
             ↓                ↓                ↓
       Manufacturing       Quality          Finance
        Delegator           Agent            Agent
             │
       Capability Registry
             │
       ┌─────┼─────────┐
       ↓     ↓         ↓
    Vision  RAG       RCA
    Worker  Worker    Worker
```

The Coordinator first discovers/selects the appropriate **Delegator** based on domain and capability.

Then the Delegator discovers/selects the appropriate **Worker** based on the required specialized capability.

---

# Example End-to-End Flow

User asks:

> “Analyze this defect image and identify the root cause.”

### Step 1 — Coordinator

Determines:

```text
Domain = Manufacturing
```

### Step 2 — Delegator Discovery

Coordinator searches for an agent capable of:

```text
manufacturing_analysis
```

It finds:

```text
Manufacturing Delegator
```

### Step 3 — Delegator

The Manufacturing Delegator decomposes the task:

```text
image_analysis
historical_search
root_cause_analysis
```

### Step 4 — Worker Discovery

It searches the Worker/Agent Registry.

```text
image_analysis
      ↓
Vision Worker

historical_search
      ↓
RAG Worker

root_cause_analysis
      ↓
RCA Worker
```

### Step 5 — Communication

If these are independently deployed agents:

```text
Delegator
    │
    ├── A2A → Vision Worker
    │
    ├── A2A → RAG Worker
    │
    └── A2A → RCA Worker
```

---

# What About MCP?

This is another common interview follow-up.

**MCP is not primarily an agent-discovery protocol.**

The architectural distinction is:

```text
A2A
Agent ↔ Agent

MCP
Agent ↔ Tool / Data / Resource

Agent Registry / Discovery
Agent → Find another Agent
```

For example:

```text
Manufacturing Delegator
        │
        │ A2A
        ↓
Vision Agent
        │
        │ MCP
        ↓
Vision Model / Tool / Enterprise Resource
```

So:

> **A2A helps agents communicate; MCP helps agents access tools and resources; discovery helps agents find other agents.**

---

# Is Discovery Always Dynamic?

No.

There are three common approaches.

### Static Discovery

The endpoint is configured in application configuration.

```text
Manufacturing Agent → fixed Vision Agent endpoint
```

Good for:

* Small systems
* Stable deployments
* Simple architectures

---

### Registry-Based Discovery

The agent queries a registry.

```text
Agent
 ↓
Registry
 ↓
Capability Match
 ↓
Target Agent
```

Good for:

* Many agents
* Independently deployed agents
* Dynamic environments

---

### Dynamic / Capability-Based Discovery

The requesting agent determines what capability it needs and dynamically finds an appropriate agent.

```text
Task
 ↓
Required Capability
 ↓
Discovery
 ↓
Candidate Agents
 ↓
Policy + Health + Cost + Latency
 ↓
Best Agent
```

This is more flexible but also more complex.

---

# Security Is Critical

In an enterprise environment, **discovering an agent does not automatically mean you are authorized to invoke it**.

I would perform:

```text
Discover
   ↓
Authenticate
   ↓
Authorize
   ↓
Validate Capability
   ↓
Check Health
   ↓
Invoke
```

For example, an agent may advertise:

```text
Capability:
financial_analysis
```

but the requesting user or agent may not have permission to access it.

Therefore:

> **Discovery is not authorization.**

The registry tells us **what exists and what it can do**; the security layer determines **whether we are allowed to use it**.

---

# Architect-Level Answer

> “I treat agent discovery as a separate capability from orchestration. Agents publish metadata describing their identity, capabilities, skills, endpoint, protocol, and security requirements through an Agent Card or enterprise agent registry. When a Coordinator or Delegator needs another agent, it discovers candidates based on the required capability, then applies authorization, health, policy, and potentially latency or cost constraints before selecting one. If the agents are independently deployed, they can communicate using A2A. This allows us to avoid hardcoding every agent endpoint and makes the architecture more scalable and loosely coupled.”

---

# 30-Second Interview Answer

> “An agent discovers another agent through an agent discovery mechanism, typically an Agent Registry or Agent Card. The requesting agent first identifies the capability it needs, queries the registry, and gets candidate agents along with their capabilities and endpoints. It then validates authorization, health, and routing policies before selecting the appropriate agent. Once selected, A2A can be used for agent-to-agent communication. So discovery answers ‘what agents are available,’ while selection answers ‘which agent should I use.’”

---

# Important Interview Distinction

| Concept             | Responsibility                                 |
| ------------------- | ---------------------------------------------- |
| **Agent Registry**  | Stores/discovers agents                        |
| **Agent Card**      | Describes an agent's identity and capabilities |
| **Capability**      | Describes what an agent can do                 |
| **Coordinator**     | Selects the appropriate domain                 |
| **Delegator**       | Selects required Workers/capabilities          |
| **LangGraph**       | Orchestrates workflow/state                    |
| **A2A**             | Agent-to-agent communication                   |
| **MCP**             | Agent-to-tool/data communication               |
| **Policy/Security** | Determines whether invocation is allowed       |

---

# Golden Line

> **“An agent doesn't need to know every other agent; it discovers agents through their capabilities and metadata, then selects one based on policy and runtime conditions.”**

### Memory Trick

```text
DISCOVER
   ↓
Who are you?
   ↓
What can you do?
   ↓
Where are you?
   ↓
How do I communicate with you?
   ↓
Am I authorized?
   ↓
SELECT
   ↓
A2A INVOKE
```

**Discovery → Capability Match → Policy → Selection → A2A Communication**
