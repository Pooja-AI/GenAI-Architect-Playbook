# How Does an Agent Discover Another Agent?

## Interview Question

**“How does one agent discover another agent in an Agentic AI / A2A architecture?”**

---

# 1. Strong Interview Answer

> **“An agent discovers another agent through an agent discovery mechanism, typically an Agent Registry or an Agent Card. The requesting agent first identifies the capability it needs, queries the registry for agents that provide that capability, retrieves their metadata such as skills, endpoint, protocol, and security requirements, and then applies policies like authorization, health, latency, and cost before selecting an agent. Once selected, the agents communicate using A2A.”**

The key idea is:

```text
Agent A
   |
   | "I need image_analysis"
   v
Agent Registry
   |
   v
Agent Cards
   |
   | Capability matching
   v
Vision Agent
   |
   | A2A
   v
Agent A
```

---

# 2. Why Do We Need Agent Discovery?

Imagine an enterprise has:

```text
100+ Agents
```

For example:

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
├── Invoice Agent
├── Cost Agent
└── Forecast Agent
```

We don't want the Coordinator to contain:

```python
if capability == "image_analysis":
    call("vision-agent-url")

elif capability == "invoice_analysis":
    call("invoice-agent-url")

elif capability == "inventory":
    call("inventory-agent-url")
```

That creates tight coupling.

Instead:

```text
Required Capability
       ↓
Agent Discovery
       ↓
Candidate Agents
       ↓
Agent Cards
       ↓
Capability Matching
       ↓
Policy Validation
       ↓
Agent Selection
       ↓
A2A Invocation
```

---

# 3. Main Components

There are three important concepts.

## Agent

The actual autonomous AI capability.

```text
Vision Agent
RCA Agent
Analytics Agent
```

## Agent Card

Describes the agent.

```text
Who are you?
What can you do?
Where are you?
How can I interact with you?
What security do you require?
```

## Agent Registry / Discovery Mechanism

Helps agents find available agents.

```text
Agent Registry
    |
    +── Vision Agent Card
    +── RAG Agent Card
    +── RCA Agent Card
    +── Analytics Agent Card
```

---

# 4. What Information Does an Agent Discover?

Suppose the registry returns a Vision Agent.

Conceptually:

```json
{
  "agent": "vision-agent",
  "version": "1.2.0",
  "description": "Manufacturing image analysis agent",

  "capabilities": [
    "image_analysis",
    "defect_detection",
    "visual_classification"
  ],

  "endpoint": "https://vision-agent.example.com",

  "protocol": "A2A",

  "authentication": "OAuth2",

  "status": "healthy"
}
```

The requesting agent can use this information to decide whether the agent is suitable.

---

# 5. Step-by-Step Discovery Process

## Step 1 — Identify Required Capability

The calling agent first determines:

```text
What do I need?
```

For example:

```text
Required capability:
image_analysis
```

---

## Step 2 — Query Discovery Mechanism

The agent queries the registry:

```text
Find agents capable of:
image_analysis
```

---

## Step 3 — Registry Returns Candidates

For example:

```text
Candidate 1 → Vision Agent
Candidate 2 → Image Analysis Agent
Candidate 3 → Defect Detection Agent
```

---

## Step 4 — Inspect Agent Cards

The requesting agent evaluates the metadata.

```text
Vision Agent
├── Capability: image_analysis
├── Version: 1.2
├── Endpoint: ...
├── Protocol: A2A
├── Auth: OAuth2
└── Status: Healthy
```

---

# 6. Capability Matching

The agent shouldn't select another agent merely because its name contains "Vision."

It should match **capabilities**.

Example:

```text
Required:
image_analysis

Agent A:
image_analysis ✓

Agent B:
invoice_processing ✗

Agent C:
inventory_analysis ✗
```

Therefore:

```text
Agent A → Candidate
```

This is called **capability-based discovery/selection**.

---

# 7. Step 5 — Apply Enterprise Policies

Finding an agent doesn't automatically mean we can invoke it.

The system can check:

```text
Capability
Authorization
Health
Availability
Latency
Cost
Version
Data residency
Security policy
```

For example:

```text
                Candidate Agents
                       |
            +----------+----------+
            |          |          |
            v          v          v
          Agent A    Agent B    Agent C
            |          |          |
         Healthy?    Healthy?   Healthy?
            |          |          |
         Authorized? Authorized? Authorized?
            |          |          |
            +----------+----------+
                       |
                       v
                 Select Agent A
```

---

# 8. Step 6 — Invoke Through A2A

After selection:

```text
Agent A
   |
   | A2A Task
   v
Vision Agent
```

The discovery process is complete.

Now A2A handles the actual agent-to-agent interaction.

---

# 9. CWD Example

This is especially important for your **CWD Multi-Agent Enterprise Assistant**.

Suppose the user asks:

> **“Analyze this manufacturing defect and identify the probable root cause.”**

The flow is:

```text
User
 ↓
Coordinator
 ↓
Manufacturing Delegator
```

The Manufacturing Delegator determines:

```text
Required capabilities:

1. image_analysis
2. historical_defect_search
3. telemetry_analysis
4. root_cause_analysis
```

---

# 10. Discover Vision Agent

For:

```text
image_analysis
```

the Delegator queries the registry.

```text
Manufacturing Delegator
          |
          | Required capability:
          | image_analysis
          v
     Agent Registry
          |
          v
     Agent Cards
          |
          v
      Vision Agent
```

The Vision Agent Card says:

```text
Vision Agent

Capabilities:
- image_analysis
- defect_detection
- visual_classification

Status:
healthy

Protocol:
A2A
```

Therefore:

```text
Vision Agent = selected
```

---

# 11. Then A2A Communication Happens

Now:

```text
Manufacturing Delegator
          |
         A2A
          |
          v
      Vision Agent
```

The Delegator sends:

```text
Task:
Analyze defect image

Context:
Machine ID
Defect context
Relevant metadata

Input:
Defect image
```

The Vision Agent processes it and returns:

```text
Defect:
Surface crack

Confidence:
93%

Evidence:
Linear crack pattern
```

---

# 12. Discovery vs Selection

This is a very important interview distinction.

### Discovery

Answers:

> **“What agents are available that could perform this capability?”**

```text
Registry
   ↓
Agent Cards
   ↓
Candidate Agents
```

### Selection

Answers:

> **“Which agent should I actually use?”**

```text
Candidates
    ↓
Capability
Authorization
Health
Latency
Cost
Policy
    ↓
Selected Agent
```

So:

```text
Discovery → Find candidates

Selection → Choose the best candidate
```

---

# 13. Discovery vs Agent Card vs A2A

Remember these three separately:

```text
Agent Card
    ↓
Describes an agent

Agent Discovery
    ↓
Finds available agents

A2A
    ↓
Communicates with the selected agent
```

Or:

```text
Agent Card → WHAT?

Registry    → WHERE?

A2A         → COMMUNICATE
```

---

# 14. Does Agent Discovery Have to Use a Central Registry?

**No.**

There can be different discovery approaches.

### Approach 1 — Static Discovery

The endpoint is already known.

```text
Coordinator
     |
     v
Known Vision Agent
```

Simple, but less dynamic.

---

### Approach 2 — Central Agent Registry

```text
             Agent Registry
             /      |      \
            /       |       \
      Vision       RAG      RCA
       Agent      Agent     Agent
```

Good for enterprise environments with many agents.

---

### Approach 3 — Well-Known Agent Card

An agent exposes its metadata at a known location.

```text
Client
  |
  v
Agent Card
  |
  v
Understand Agent
  |
  v
Communicate
```

This avoids requiring a central registry for every scenario.

---

### Approach 4 — Service Discovery Infrastructure

Enterprise platforms can integrate agent discovery with existing infrastructure such as:

```text
Service Registry
API Gateway
DNS
Kubernetes service discovery
Enterprise catalog
```

The exact mechanism depends on the deployment architecture.

---

# 15. How Does This Fit With LangGraph?

This is another common interview question.

```text
                 LangGraph
              Workflow/State
                    |
                    v
               Coordinator
                    |
                    v
                Delegator
                    |
                    | Discovery
                    v
              Agent Registry
                    |
                    v
                Agent Card
                    |
                    v
               Agent Selection
                    |
                    v
                   A2A
                    |
                    v
               Worker Agent
```

### LangGraph

Controls:

```text
Workflow
State
Routing
Retries
Conditional transitions
Parallel execution
```

### Agent Discovery

Determines:

```text
Which agents are available?
```

### Agent Card

Describes:

```text
What an agent can do
```

### A2A

Provides:

```text
Agent-to-agent communication
```

---

# 16. How Does This Fit With MCP?

Don't confuse MCP with agent discovery.

```text
A2A
Agent ↔ Agent

MCP
Agent ↔ Tool/Data

Agent Registry
Find Agent

Agent Card
Describe Agent
```

Example:

```text
Manufacturing Delegator
          |
         A2A
          |
          v
      Vision Agent
          |
         MCP
          |
          v
   Image Processing Tool
```

---

# 17. Security Flow

A strong enterprise architecture doesn't simply do:

```text
Discover → Invoke
```

Instead:

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
Apply Routing Policy
   ↓
Invoke
```

Important interview statement:

> **“Discovery does not imply authorization.”**

An agent can discover another agent but still be prohibited from invoking it.

---

# 18. Dynamic Agent Discovery

This becomes especially powerful in large systems.

Suppose:

```text
Vision Agent V1
```

is unhealthy.

The registry contains:

```text
Vision Agent V1 → Unhealthy
Vision Agent V2 → Healthy
Vision Agent V3 → Healthy
```

The Delegator can select:

```text
Vision Agent V2
```

without changing the business workflow.

This gives:

* Loose coupling
* Independent deployment
* Better availability
* Easier scaling
* Capability-based routing

---

# 19. What If Multiple Agents Have the Same Capability?

Suppose:

```text
Vision Agent A
Vision Agent B
Vision Agent C
```

all provide:

```text
image_analysis
```

Then selection can consider:

```text
Capability match
       ↓
Authorization
       ↓
Health
       ↓
Latency
       ↓
Cost
       ↓
Load
       ↓
Version
       ↓
Data locality
```

For example:

```text
Agent A → 100 ms → Healthy
Agent B → 500 ms → Healthy
Agent C → 200 ms → Unhealthy
```

The router may select Agent A.

This is why:

> **Discovery and selection are two separate responsibilities.**

---

# 20. Who Should Perform Discovery?

In your architecture, it could be:

```text
Coordinator
    ↓
Discover Delegators
```

and:

```text
Delegator
    ↓
Discover Workers
```

For example:

```text
                  Coordinator
                       |
                  Find Domain
                       |
                       v
              Manufacturing
                 Delegator
                       |
                Find Capability
                       |
                       v
                Agent Registry
                       |
             +---------+---------+
             |         |         |
           Vision      RAG      RCA
            Agent     Agent     Agent
```

This preserves your hierarchical responsibility.

---

# 21. Architect-Level Design Principle

I would explain it this way:

> **“I separate agent discovery from orchestration. The Coordinator or Delegator determines what capability is required, while the discovery mechanism finds candidate agents that advertise that capability. Agent Cards provide the metadata needed to evaluate those candidates. Selection is then constrained by authorization, health, version, latency, cost, and business policies. Once an agent is selected, A2A handles the actual communication. This prevents hardcoded agent dependencies and allows agents to evolve independently.”**

---

# 22. 30-Second Interview Answer

> **“An agent discovers another agent through an Agent Registry or Agent Card-based discovery mechanism. First, the calling agent identifies the capability it needs. It queries the registry and receives candidate agents along with their capabilities, endpoints, versions, and security metadata. It then applies policies such as authorization, health, latency, and cost to select the appropriate agent. Once selected, A2A is used for the actual communication. In my CWD architecture, the Manufacturing Delegator can discover a Vision Agent based on its `image_analysis` capability and then invoke it through A2A.”**

---

# 23. Golden Interview Line

> **“An agent doesn't need to know every other agent; it discovers agents through capabilities and metadata, selects one based on enterprise policies, and then communicates with it using A2A.”**

---

# Memory Trick

```text
DISCOVER → SELECT → INVOKE

Discover:
"What agents can do this?"

Agent Card:
"What can you do?"

Registry:
"Where can I find you?"

Selection:
"Which one should I use?"

Authorization:
"Am I allowed to use you?"

A2A:
"Let's communicate."
```

### Complete Mental Model

```text
                  WHAT DO I NEED?
                         ↓
                  Capability
                         ↓
                  DISCOVERY
                         ↓
                  Agent Registry
                         ↓
                   Agent Cards
                         ↓
                    SELECTION
                         ↓
             Auth + Health + Policy
                         ↓
                     A2A
                         ↓
                 Target Agent
                         ↓
                    Execution
```
