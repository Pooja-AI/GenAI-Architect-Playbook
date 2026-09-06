# Agent Registry Metadata in CWD

The **Agent Registry metadata** is the structured information maintained for every registered agent in the enterprise multi-agent platform. It allows the CWD Coordinator and Delegators to answer:

> **“What agent is this, what can it do, where is it running, who owns it, which version is active, and is it currently available?”**

This metadata is critical for **agent discovery, authorization, dynamic routing, health-aware execution, version management, governance, and observability**.

---

## 1. Agent Registry Metadata Model

A typical registered agent can be represented as:

```text
                    Agent Registry
                          │
          ┌───────────────┼────────────────┐
          ▼               ▼                ▼
       Identity       Capabilities       Status
          │               │                │
          ▼               ▼                ▼
       Endpoint         Domain           Health
       Version          Skills           Load
       Owner            Actions          Availability
       Environment
```

Conceptually:

```json
{
  "agent_id": "shipping-agent",
  "name": "Shipping Analysis Agent",
  "domain": "logistics",
  "endpoint": "https://shipping-agent.company.com/a2a",
  "protocol": "A2A",
  "version": "2.4.1",
  "owner": {
    "team": "Supply Chain AI",
    "contact": "supply-chain-ai@company.com"
  },
  "capabilities": [
    {
      "name": "shipment_tracking",
      "description": "Track shipment status and events"
    },
    {
      "name": "delay_analysis",
      "description": "Analyze shipment delays"
    },
    {
      "name": "rerouting_recommendation",
      "description": "Recommend alternative shipment routes"
    }
  ],
  "status": "healthy",
  "environment": "production",
  "region": "us-central",
  "metadata": {
    "framework": "LangGraph",
    "model": "enterprise-llm",
    "supported_input": ["json"],
    "supported_output": ["json"]
  }
}
```

---

# 2. Identity

### Purpose

Identity uniquely identifies the agent within the enterprise platform.

Example:

```json
{
  "agent_id": "shipping-agent",
  "name": "Shipping Analysis Agent"
}
```

Identity should be **stable and unique**.

It answers:

> **“Which agent am I communicating with?”**

Typical identity fields:

| Metadata      | Purpose                              |
| ------------- | ------------------------------------ |
| `agent_id`    | Unique machine-readable identifier   |
| `name`        | Human-readable name                  |
| `domain`      | Business/technical domain            |
| `environment` | dev/UAT/prod                         |
| `tenant`      | Enterprise tenant if applicable      |
| `agent_type`  | Domain agent, specialist agent, etc. |

### Why identity matters

Without a stable identity:

```text
Coordinator
     │
     └── "Call some shipping service"
```

With registry identity:

```text
Coordinator
     │
     ▼
Agent Registry
     │
     ▼
shipping-agent:v2.4.1
```

Identity also supports:

* authentication
* authorization
* auditing
* tracing
* ownership
* version management
* incident investigation

---

# 3. Endpoint

The **endpoint** tells CWD where and how the agent can be reached.

Example:

```json
{
  "endpoint": "https://shipping-agent.company.com/a2a"
}
```

The endpoint could represent an A2A-compatible communication interface.

Conceptually:

```text
Agent Registry
      │
      │ endpoint
      ▼
https://shipping-agent.company.com/a2a
      │
      ▼
Shipping Agent
```

The Coordinator should **not hardcode** this endpoint:

```python
# Bad
SHIPPING_AGENT_URL = "https://shipping-agent.company.com/a2a"
```

Instead:

```python
agent = registry.get_agent("shipping-agent")

endpoint = agent.endpoint

a2a_client.send(
    endpoint=endpoint,
    task=task
)
```

This allows infrastructure to change without modifying Coordinator logic.

For example:

```text
Old endpoint
https://shipping-agent-v1.company.com

              ↓

Registry update

              ↓

New endpoint
https://shipping-agent-v2.company.com
```

The Coordinator doesn't need to change.

---

# 4. Version

Version metadata identifies the deployed agent version.

Example:

```json
{
  "version": "2.4.1"
}
```

Versioning is important because multiple versions may exist:

```text
shipping-agent
     │
     ├── v1.8.0
     ├── v2.3.0
     └── v2.4.1
```

The Registry can help route requests according to compatibility.

For example:

```text
Task requires:
delay_analysis >= 2.3

Registry
    │
    ├── v1.8 ❌
    ├── v2.3 ✅
    └── v2.4 ✅
```

Then routing policy can select:

```text
v2.4.1
```

Version metadata supports:

* backward compatibility
* controlled rollout
* blue/green deployment
* canary deployment
* rollback
* capability evolution
* A/B testing
* migration

---

# 5. Owner

Every enterprise agent should have an accountable owner.

Example:

```json
{
  "owner": {
    "team": "Supply Chain AI",
    "contact": "supply-chain-ai@company.com"
  }
}
```

Ownership answers:

> **“Who is responsible for this agent?”**

Ownership can include:

```text
Owner
 ├── Business owner
 ├── Technical owner
 ├── Support team
 ├── Cost center
 └── Escalation contact
```

This is important for enterprise governance.

For example:

```text
Agent fails
    │
    ▼
Observability
    │
    ▼
Agent Registry
    │
    ▼
Owner = Supply Chain AI
    │
    ▼
Incident / escalation
```

It also prevents **orphaned agents** that nobody maintains.

---

# 6. Capabilities

Capabilities are arguably the most important metadata for **dynamic agent discovery**.

They describe **what the agent can do**.

Example:

```json
{
  "capabilities": [
    "shipment_tracking",
    "delay_analysis",
    "rerouting_recommendation"
  ]
}
```

The Coordinator should not ask:

> “Where is the shipping agent?”

Instead it should ask:

> **“Which registered agent can perform delay analysis?”**

Example:

```text
Coordinator
     │
     │ Required capability:
     │ delay_analysis
     ▼
Agent Registry
     │
     ├── Customer Agent       ❌
     ├── Finance Agent       ❌
     ├── Shipping Agent      ✅
     └── Manufacturing Agent ❌
```

Then:

```text
Shipping Agent
       │
       ▼
A2A communication
```

### Capability metadata can be richer

```json
{
  "name": "delay_analysis",
  "description": "Analyze shipment delays",
  "input_schema": {
    "shipment_id": "string"
  },
  "output_schema": {
    "root_cause": "string",
    "severity": "string"
  }
}
```

This enables capability-aware routing.

---

# 7. Domain

Although not explicitly in your list, **domain** is an important registry attribute.

Example:

```json
{
  "domain": "logistics"
}
```

Suppose several agents provide `data_analysis`:

```text
Data Analysis
    │
    ├── Finance Analytics Agent
    ├── Manufacturing Analytics Agent
    ├── Supply Chain Analytics Agent
    └── Customer Analytics Agent
```

Capability alone isn't sufficient.

The Coordinator can combine:

```text
Capability = data_analysis
Domain = logistics
```

Result:

```text
Supply Chain Analytics Agent
```

So:

```text
Capability → What can it do?
Domain      → Where does it operate?
```

---

# 8. Status

Status represents the current operational state of the agent.

Example:

```json
{
  "status": "healthy"
}
```

Typical states:

```text
registered
    │
    ▼
starting
    │
    ▼
healthy
    │
    ├── degraded
    │
    ├── overloaded
    │
    ├── unhealthy
    │
    └── maintenance
```

Example:

```json
{
  "status": "healthy",
  "last_health_check": "2026-09-06T15:20:00Z"
}
```

But **health and availability are not identical**.

An agent could be:

```text
Health = healthy
Load   = 98%
Queue  = 1,500 tasks
```

Technically healthy, but not a good routing candidate.

Therefore production routing can consider:

```text
Health
+
Load
+
Queue depth
+
Concurrency
+
Dependency health
+
Latency
```

---

# 9. Availability

Availability metadata helps determine whether an agent should receive new work.

Example:

```json
{
  "status": "healthy",
  "availability": {
    "accepting_tasks": true,
    "active_tasks": 12,
    "max_concurrency": 50,
    "queue_depth": 3
  }
}
```

Now the router can distinguish:

```text
Agent A
healthy
queue = 2
     ↓
GOOD CANDIDATE

Agent B
healthy
queue = 900
     ↓
LOW PRIORITY

Agent C
unhealthy
     ↓
REJECT
```

---

# 10. Environment

Enterprise platforms normally register agents separately by environment.

```text
Agent Registry
     │
     ├── Development
     │     └── shipping-agent:v2.5-dev
     │
     ├── UAT
     │     └── shipping-agent:v2.5-uat
     │
     └── Production
           └── shipping-agent:v2.4.1
```

Example:

```json
{
  "environment": "production"
}
```

The production Coordinator should never accidentally route to a development agent.

Environment becomes part of the routing filter:

```text
Capability
      +
Domain
      +
Environment
      +
Version
      +
Authorization
      +
Health
```

---

# 11. Protocol Information

Because CWD can use multiple communication mechanisms, registry metadata can identify the supported protocol.

Example:

```json
{
  "protocols": [
    {
      "type": "A2A",
      "version": "1.x"
    }
  ]
}
```

This helps the Coordinator know:

```text
How should I communicate with this agent?
```

For example:

```text
Agent Registry
      │
      ├── Agent A → A2A
      ├── Agent B → A2A
      └── Agent C → internal API
```

The registry describes the integration contract, while the communication layer actually performs communication.

---

# 12. Complete Agent Metadata

A production-oriented registry record could look like:

```json
{
  "agent_id": "shipping-agent",
  "name": "Shipping Analysis Agent",

  "identity": {
    "domain": "logistics",
    "environment": "production"
  },

  "endpoint": {
    "protocol": "A2A",
    "url": "https://shipping-agent.company.com/a2a"
  },

  "version": {
    "current": "2.4.1",
    "supported": ["2.3", "2.4"]
  },

  "owner": {
    "team": "Supply Chain AI",
    "technical_owner": "Supply Chain AI Platform"
  },

  "capabilities": [
    "shipment_tracking",
    "delay_analysis",
    "rerouting_recommendation"
  ],

  "status": {
    "state": "healthy",
    "accepting_tasks": true,
    "queue_depth": 3,
    "active_tasks": 12
  },

  "routing": {
    "priority": "high",
    "region": "us-central",
    "max_concurrency": 50
  }
}
```

---

# 13. How CWD Uses This Metadata

The metadata becomes useful during **runtime agent discovery**.

Suppose the user asks:

> “Why is shipment SHIP123 delayed?”

### Step 1 — Coordinator understands intent

```text
Intent = shipment_delay_analysis
```

### Step 2 — Coordinator determines required capability

```text
Required capability =
delay_analysis
```

### Step 3 — Query Agent Registry

```python
candidates = registry.find(
    capability="delay_analysis",
    domain="logistics",
    environment="production"
)
```

### Step 4 — Filter candidates

```text
Capability match       ✅
Domain match            ✅
Production              ✅
Version compatible      ✅
Authorized              ✅
Healthy                 ✅
Accepting tasks         ✅
```

### Step 5 — Dynamic routing

```text
Candidate Agents
       │
       ├── Shipping Agent A
       ├── Shipping Agent B
       └── Shipping Agent C
              │
              ▼
        Routing policy
              │
              ▼
       Shipping Agent B
```

### Step 6 — A2A communication

```text
Coordinator
     │
     │ A2A task
     ▼
Shipping Agent B
```

### Step 7 — Agent executes

```text
Shipping Agent
      │
      ▼
LangGraph
      │
      ▼
Workers
      │
      ▼
MCP
      │
      ▼
Enterprise Shipping Systems
```

### Step 8 — Result returns

```text
Enterprise System
       ↓
MCP
       ↓
Worker
       ↓
LangGraph
       ↓
Shipping Agent
       ↓
A2A
       ↓
Coordinator
```

---

# 14. Metadata vs Responsibility

A very important architectural distinction is:

| Component          | Responsibility                                    |
| ------------------ | ------------------------------------------------- |
| **Agent Registry** | What agents exist and what they can do            |
| **Policy/IAM**     | Whether the caller is allowed                     |
| **Router**         | Which eligible agent should receive work          |
| **A2A**            | How agents communicate                            |
| **LangGraph**      | What happens next in the workflow                 |
| **Service Bus**    | How asynchronous messages are transported         |
| **MCP**            | How agents/workers access enterprise capabilities |
| **Observability**  | What happened during execution                    |

So:

```text
Agent Registry
      │
      │ "Who can do this?"
      ▼
Candidate Agents
      │
      ▼
Policy / IAM
      │
      │ "Who is allowed?"
      ▼
Eligible Agents
      │
      ▼
Router
      │
      │ "Which one should execute?"
      ▼
Selected Agent
      │
      ▼
A2A
```

---

# 15. Why This Metadata Is Critical

Without metadata:

```text
Coordinator
    │
    ├── hardcoded endpoint
    ├── hardcoded agent
    ├── hardcoded version
    └── hardcoded capability mapping
```

This creates:

* tight coupling
* difficult scaling
* poor failover
* difficult version upgrades
* poor governance
* agent sprawl
* difficult ownership tracking

With centralized metadata:

```text
                  Agent Registry
                       │
       ┌───────────────┼────────────────┐
       ▼               ▼                ▼
    Identity       Capability         Status
       │               │                │
       └───────────────┼────────────────┘
                       ▼
                Dynamic Routing
                       │
                       ▼
                 Selected Agent
                       │
                       ▼
                      A2A
```

This gives CWD **dynamic, metadata-driven orchestration**.

---

# 16. Core Discovery Formula

The registry metadata enables:

```text
Eligible Agents
=
Capability Match
∩ Domain Match
∩ Environment Match
∩ Version Compatibility
∩ Authorization
∩ Health
∩ Availability
```

Then:

```text
Selected Agent
=
f(
    capability,
    domain,
    health,
    load,
    latency,
    version,
    priority,
    region,
    deadline,
    policy
)
```

---

# 17. Key Architectural Principle

The most important principle is:

> **The Coordinator should select agents based on capabilities and governed metadata, not hardcoded agent endpoints.**

For example:

```text
BAD

"Send this to shipping-agent-02"
```

Better:

```text
GOOD

"Find an authorized production agent
with delay_analysis capability in
the logistics domain."
```

Then the Registry and routing layer determine the actual agent.

---

# Interview-Ready Answer

> **Agent Registry metadata is the structured information maintained for every registered agent in the enterprise multi-agent platform. It typically includes a stable agent identity, communication endpoint, version, ownership, business domain, capabilities, environment, protocol information, health, availability, and routing attributes. CWD uses this metadata during runtime discovery to identify candidate agents based on the required capability and domain, then filters them using environment, version compatibility, authorization, health, and availability before dynamically routing the task. This removes hardcoded agent dependencies and enables scalable, version-aware, health-aware, and governed multi-agent orchestration.**

### One-line definition

> **Agent metadata is the governed runtime description of an agent's identity, location, version, ownership, capabilities, and operational state that enables CWD to discover, authorize, select, route, monitor, and manage agents dynamically.**

### Mental model

```text
Identity     → Who is the agent?
Endpoint     → Where/how do I reach it?
Version      → Which implementation?
Owner        → Who is responsible?
Capabilities → What can it do?
Domain       → Where does it operate?
Status       → Is it healthy?
Availability → Can it accept work?
Environment  → Where is it deployed?
```

**Together:**

```text
Agent Metadata
      ↓
Discovery
      ↓
Eligibility
      ↓
Dynamic Routing
      ↓
A2A Communication
      ↓
Independent Agent Execution
```
