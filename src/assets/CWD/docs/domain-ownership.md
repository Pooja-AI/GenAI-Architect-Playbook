# Mapping Business Domains and Responsibilities to Agents and Owners

In an enterprise CWD platform, **business-domain mapping** establishes a clear relationship between:

```text
Business Domain
      ↓
Business Responsibilities
      ↓
Agent
      ↓
Capabilities
      ↓
Agent Owner
```

The goal is to make every agent **purposeful, discoverable, governable, and accountable**.

A simple principle is:

> **A business domain defines where an agent operates, responsibilities define what it is accountable for, capabilities define what it can execute, and ownership defines who is accountable for the agent.**

---

# 1. Why Domain Mapping Is Needed

Imagine an enterprise has these business areas:

```text
Enterprise
│
├── Supply Chain
├── Manufacturing
├── Finance
├── Customer Service
├── Sales
└── IT Operations
```

Without domain mapping, the platform could become:

```text
Agent-1
Agent-2
Agent-3
Agent-4
Agent-5
...
```

The Coordinator would have difficulty determining:

* Which agent owns a particular responsibility?
* Which agent should handle a business problem?
* Who maintains the agent?
* Which capabilities belong to which domain?
* Who should be contacted when an agent fails?
* Which team approves changes?
* Which agent is authorized to access particular data?

Domain mapping provides structure.

---

# 2. Business Domain → Agent Mapping

Consider a logistics domain.

```text
Supply Chain
     │
     ├── Shipment Management
     ├── Inventory Management
     ├── Supplier Management
     └── Demand Planning
```

These responsibilities can map to specialized agents:

```text
Supply Chain
     │
     ├── Shipment Management
     │       └── Shipping Agent
     │
     ├── Inventory Management
     │       └── Inventory Agent
     │
     ├── Supplier Management
     │       └── Supplier Agent
     │
     └── Demand Planning
             └── Forecasting Agent
```

Now the enterprise has a meaningful organizational model.

---

# 3. Domain vs Responsibility vs Capability

These three concepts should not be confused.

| Concept            | Meaning                         | Example              |
| ------------------ | ------------------------------- | -------------------- |
| **Domain**         | Business area                   | Logistics            |
| **Responsibility** | Area of accountability          | Shipment Management  |
| **Capability**     | Specific operation              | Delay Analysis       |
| **Agent**          | Software entity performing work | Shipping Agent       |
| **Owner**          | Accountable team/person         | Supply Chain AI Team |

For example:

```text
Domain
  Logistics
     │
     ▼
Responsibility
  Shipment Management
     │
     ▼
Agent
  Shipping Agent
     │
     ├── shipment_tracking
     ├── delay_analysis
     └── route_optimization
```

---

# 4. Responsibility Mapping

A responsibility should represent a meaningful business function.

For example:

```text
Domain: Logistics

Responsibilities:
    1. Shipment Tracking
    2. Delay Management
    3. Route Optimization
    4. Carrier Management
```

These responsibilities can be mapped to agents.

```text
Logistics
│
├── Shipment Tracking
│       └── Tracking Agent
│
├── Delay Management
│       └── Delay Analysis Agent
│
├── Route Optimization
│       └── Route Optimization Agent
│
└── Carrier Management
        └── Carrier Agent
```

This is better than creating one giant agent:

```text
LogisticsSuperAgent
```

with hundreds of unrelated responsibilities.

---

# 5. Agent Ownership

Every production agent should have an accountable owner.

Example:

```json id="n0s4x7"
{
  "agent_id": "shipping-agent",

  "domain": "logistics",

  "responsibilities": [
    "shipment_tracking",
    "delay_analysis",
    "rerouting_recommendation"
  ],

  "owner": {
    "organization": "Supply Chain AI",
    "team": "Logistics Intelligence",
    "technical_owner": "Logistics AI Platform",
    "business_owner": "Supply Chain Operations"
  }
}
```

This answers:

> **Who is responsible for this agent's operation, behavior, security, data access, and lifecycle?**

---

# 6. Business Owner vs Technical Owner

Enterprise architecture should distinguish these.

### Business owner

Responsible for:

* business outcome
* business rules
* process requirements
* acceptance criteria
* business risk

### Technical owner

Responsible for:

* application implementation
* deployment
* availability
* performance
* security
* upgrades
* incident response

Example:

```text
Shipping Agent
      │
      ├── Business Owner
      │      Supply Chain Operations
      │
      └── Technical Owner
             AI Platform Team
```

This prevents ambiguity.

---

# 7. Complete Domain Hierarchy

A mature CWD registry can represent:

```text
Enterprise
│
├── Domain
│    │
│    ├── Responsibility
│    │     │
│    │     └── Agent
│    │            │
│    │            ├── Capabilities
│    │            ├── Version
│    │            ├── Endpoint
│    │            └── Owner
│    │
│    └── Responsibility
│
└── Domain
```

For example:

```text
Supply Chain
│
├── Shipment Management
│      │
│      └── Shipping Agent
│             ├── tracking
│             ├── delay_analysis
│             └── rerouting
│
├── Inventory Management
│      │
│      └── Inventory Agent
│             ├── stock_analysis
│             └── replenishment
│
└── Demand Planning
       │
       └── Forecasting Agent
              ├── demand_forecasting
              └── demand_anomaly_detection
```

---

# 8. Agent Registry Representation

The centralized Agent Registry can maintain this mapping.

Example:

```json id="yapqu8"
{
  "agent_id": "shipping-agent",
  "domain": "supply_chain",

  "responsibilities": [
    "shipment_management",
    "delay_management"
  ],

  "capabilities": [
    "shipment_tracking",
    "delay_analysis",
    "rerouting_recommendation"
  ],

  "owner": {
    "business": "Supply Chain Operations",
    "technical": "Logistics AI Team"
  },

  "environment": "production",
  "version": "2.4.1",
  "status": "healthy"
}
```

The Registry therefore becomes the relationship between:

```text
Domain
  ↕
Responsibility
  ↕
Agent
  ↕
Capability
  ↕
Owner
```

---

# 9. How Coordinator Uses Domain Mapping

Suppose the user asks:

> "Why is shipment SHIP123 delayed?"

The Coordinator first determines:

```text
Intent:
shipment_delay_analysis
```

Then:

```text
Domain:
Supply Chain
```

Then:

```text
Responsibility:
Shipment / Delay Management
```

Then:

```text
Required capability:
delay_analysis
```

Now the Coordinator queries the Registry.

```text id="n5z2h7"
User Request
     │
     ▼
Coordinator
     │
     ▼
Intent
     │
     ▼
Business Domain
Supply Chain
     │
     ▼
Responsibility
Delay Management
     │
     ▼
Capability
delay_analysis
     │
     ▼
Agent Registry
     │
     ▼
Shipping Agent
```

This provides **business-aware agent discovery**.

---

# 10. Domain Mapping Improves Agent Discovery

Instead of searching globally:

```python id="y0ypsa"
registry.find(
    capability="analysis"
)
```

CWD can make the search more precise:

```python id="v2ap4q"
registry.find(
    domain="supply_chain",
    responsibility="delay_management",
    capability="delay_analysis"
)
```

This dramatically reduces irrelevant candidates.

For example:

```text
delay_analysis
│
├── Manufacturing Delay Agent
├── Supply Chain Delay Agent
├── Customer Service Delay Agent
└── IT Incident Delay Agent
```

Domain + responsibility allows the Coordinator to select the correct business context.

---

# 11. Agent Ownership Enables Accountability

Suppose the Shipping Agent produces incorrect results.

Without ownership:

```text
Agent failure
     │
     ▼
???
```

With ownership:

```text
Agent failure
     │
     ▼
Agent Registry
     │
     ▼
Owner
     │
     ├── Business Owner
     │      Supply Chain Operations
     │
     └── Technical Owner
            Logistics AI Team
```

This enables:

* incident escalation
* SLA management
* operational support
* security review
* compliance review
* lifecycle management
* model/prompt governance

---

# 12. Ownership Should Follow Responsibility

A useful enterprise principle is:

> **The team responsible for the business outcome should have clear ownership of the corresponding agent behavior, while technical ownership should cover the platform implementation.**

For example:

```text
Business Responsibility
       │
       ▼
Shipment Management
       │
       ▼
Business Owner
Supply Chain Operations
       │
       ▼
Shipping Agent
       │
       ▼
Technical Owner
Logistics AI Team
```

This creates accountability across business and technology.

---

# 13. One Agent Can Have Multiple Capabilities

An agent does not necessarily map one-to-one with one responsibility.

For example:

```text
Shipping Agent
│
├── shipment_tracking
├── delay_analysis
├── carrier_analysis
└── rerouting_recommendation
```

All can belong to:

```text
Domain:
Supply Chain

Responsibility:
Shipment Management
```

So the mapping is often:

```text
1 Domain
   ↓
Many Responsibilities
   ↓
Many Agents
   ↓
Many Capabilities
```

---

# 14. Multiple Agents Can Support One Responsibility

Enterprise platforms may also have multiple agents for the same responsibility.

```text
Shipment Management
       │
       ├── Shipping Agent US
       ├── Shipping Agent EU
       └── Shipping Agent APAC
```

They might differ by:

* region
* data access
* workload
* specialization
* model
* version
* latency
* regulatory constraints

The Registry allows the Coordinator to discover all candidates.

---

# 15. Domain + Capability + Policy

Domain mapping should not bypass authorization.

For example:

```text
Domain:
Finance

Capability:
payment_approval
```

Even if the Finance Agent supports it:

```text
Capability Match       ✅
Domain Match           ✅
```

the request still needs:

```text
Authorization           ?
User entitlement        ?
Agent permission        ?
Risk policy             ?
Human approval          ?
```

Therefore:

```text
Domain
  +
Responsibility
  +
Capability
  +
Authorization
  +
Policy
```

determines whether execution can occur.

---

# 16. Domain Mapping and Data Boundaries

Business domains often correspond to data boundaries.

For example:

```text
Finance Agent
     │
     └── Finance data

Customer Agent
     │
     └── Customer data

Supply Chain Agent
     │
     └── Supply Chain data
```

This helps enforce least privilege.

The fact that an agent can perform:

```text
customer_analysis
```

does not mean it should access:

```text
finance_database
```

Domain ownership can therefore contribute to:

* data access policy
* data classification
* network segmentation
* tool permissions
* RAG index permissions
* MCP resource authorization

---

# 17. Domain Mapping + CWD Layers

This mapping fits naturally into CWD:

```text
                    Enterprise
                        │
                        ▼
                   Coordinator
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
        Business Domain       Business Domain
        Supply Chain            Finance
              │                   │
              ▼                   ▼
          Delegator            Delegator
              │                   │
       ┌──────┼──────┐       ┌────┼─────┐
       ▼      ▼      ▼       ▼    ▼     ▼
    Shipping Inventory  Forecasting  Invoice  Payment
      Agent     Agent      Agent      Agent   Agent
```

The Coordinator operates at the enterprise level.

Delegators operate within business domains.

Agents execute domain responsibilities.

Workers execute specialized tasks.

---

# 18. CWD Responsibility Model

A clean mapping is:

| Layer               | Responsibility                           |
| ------------------- | ---------------------------------------- |
| **Coordinator**     | Enterprise-wide intent and orchestration |
| **Business Domain** | Business context                         |
| **Delegator**       | Domain-level orchestration               |
| **Agent**           | Domain/business responsibility           |
| **Capability**      | Specific executable ability              |
| **Worker**          | Specialized execution                    |
| **MCP Tool**        | Enterprise system operation              |
| **Owner**           | Business/technical accountability        |

For example:

```text
Coordinator
     │
     ▼
Supply Chain Domain
     │
     ▼
Shipping Delegator
     │
     ▼
Shipping Agent
     │
     ├── shipment_tracking
     ├── delay_analysis
     └── rerouting
            │
            ▼
        Worker
            │
            ▼
           MCP
            │
            ▼
    Enterprise Shipping API
```

---

# 19. Domain Mapping Enables Better Routing

The routing decision can be thought of as:

```text
Selected Agent =
f(
    domain,
    responsibility,
    capability,
    authorization,
    environment,
    version,
    health,
    availability,
    workload,
    policy
)
```

For example:

```text
Request
  │
  ▼
Domain = Supply Chain
  │
  ▼
Responsibility = Shipment Management
  │
  ▼
Capability = delay_analysis
  │
  ▼
Authorized candidates
  │
  ▼
Healthy candidates
  │
  ▼
Available candidates
  │
  ▼
Best Agent
```

---

# 20. Agent Ownership Metadata

A production registry can maintain richer ownership information:

```json id="1q3m3w"
{
  "owner": {
    "business_unit": "Supply Chain",
    "business_owner": "Supply Chain Operations",
    "technical_owner": "AI Platform - Logistics",
    "support_team": "AI Operations",
    "security_owner": "Enterprise AI Security",
    "cost_center": "SC-AI-001",
    "escalation_group": "LOGISTICS-AI-SUPPORT"
  }
}
```

This supports enterprise operational processes.

---

# 21. Lifecycle Management

Ownership also controls the agent lifecycle.

```text
Design
  │
  ▼
Development
  │
  ▼
Testing
  │
  ▼
Approval
  │
  ▼
Production
  │
  ▼
Monitoring
  │
  ▼
Upgrade
  │
  ▼
Retirement
```

The owner is accountable for ensuring the agent remains:

* supported
* secure
* compliant
* available
* version-controlled
* within approved scope

---

# 22. Anti-Pattern: Technical Naming Instead of Business Mapping

Bad:

```text
Agent-001
Agent-002
Agent-003
```

Better:

```text
shipping-agent
inventory-agent
forecasting-agent
customer-service-agent
```

Even better:

```text
Domain:
Supply Chain

Responsibility:
Shipment Management

Agent:
Shipping Analysis Agent

Capabilities:
shipment_tracking
delay_analysis
rerouting
```

The second model is much easier to govern.

---

# 23. Anti-Pattern: One Agent Owns Everything

Avoid:

```text
EnterpriseSuperAgent
│
├── Finance
├── HR
├── Sales
├── Supply Chain
├── Manufacturing
├── Customer Service
└── IT
```

This creates:

* excessive permissions
* huge prompts/context
* complex workflows
* poor ownership
* difficult testing
* difficult scaling
* larger failure blast radius

Prefer:

```text
Enterprise
│
├── Finance Agent
├── Supply Chain Agent
├── Manufacturing Agent
├── Sales Agent
└── Customer Agent
```

with specialized responsibilities.

---

# 24. Anti-Pattern: Missing Ownership

Another dangerous pattern:

```text
Agent
 ├── capabilities
 ├── endpoint
 └── version

Owner = NULL
```

This creates an **orphaned production component**.

Every production agent should have an accountable owner.

---

# 25. End-to-End Example

Consider:

> “Find the reason for shipment SHIP123's delay and recommend whether it should be rerouted.”

### Business classification

```text
Domain:
Supply Chain

Responsibility:
Shipment Management
```

### Required capabilities

```text
shipment_tracking
delay_analysis
rerouting_recommendation
```

### Registry discovery

```text
Agent Registry
       │
       ├── Shipping Agent
       │      ├── tracking       ✅
       │      ├── delay_analysis ✅
       │      └── rerouting      ✅
       │
       ├── Inventory Agent       ❌
       └── Finance Agent         ❌
```

### Selection

```text
Shipping Agent
       │
       ▼
Authorization
       │
       ▼
Health
       │
       ▼
Availability
       │
       ▼
Version compatibility
```

### Execution

```text
Coordinator
    │
    ▼
Shipping Delegator
    │
    ▼
Shipping Agent
    │
    ▼
LangGraph
    │
    ├── Tracking Worker
    ├── Delay Analysis Worker
    └── Routing Worker
            │
            ▼
           MCP
            │
            ▼
     Shipping Systems
```

### Ownership

```text
Business Owner:
Supply Chain Operations

Technical Owner:
Logistics AI Team
```

Now the entire execution has both **technical routing context and business accountability**.

---

# 26. The Key Architecture Model

The most useful mental model is:

```text
              BUSINESS
                 │
                 ▼
              DOMAIN
                 │
                 ▼
           RESPONSIBILITY
                 │
                 ▼
               AGENT
                 │
          ┌──────┴──────┐
          ▼             ▼
     CAPABILITIES     OWNER
          │             │
          ▼             ▼
      EXECUTION     ACCOUNTABILITY
```

And at runtime:

```text
User Request
     │
     ▼
Coordinator
     │
     ▼
Identify Domain
     │
     ▼
Identify Responsibility
     │
     ▼
Identify Required Capability
     │
     ▼
Agent Registry
     │
     ▼
Find Candidate Agents
     │
     ▼
Policy + Authorization
     │
     ▼
Health + Availability
     │
     ▼
Dynamic Routing
     │
     ▼
Selected Agent
     │
     ▼
A2A
     │
     ▼
Domain Execution
```

---

# Interview-Ready Answer

> **In CWD, business domains and responsibilities provide the organizational model for mapping enterprise processes to specialized agents. A domain represents a business area such as Supply Chain, Finance, or Manufacturing, while responsibilities represent specific areas of accountability within that domain. Agents are mapped to those responsibilities and expose capabilities that implement the required business functions. The centralized Agent Registry maintains this relationship along with agent identity, endpoint, version, health, capabilities, and ownership information. During runtime, the Coordinator identifies the business domain, responsibility, and required capability from the user request, queries the Registry for suitable agents, and then applies authorization, policy, version, health, and availability checks before routing the task. Each agent has both business and technical ownership, providing accountability for business behavior, security, operations, lifecycle management, and incident response.**

## Final Definition

> **Business-domain and responsibility mapping is the governed relationship between enterprise business areas, their accountable responsibilities, the agents that execute those responsibilities, the capabilities those agents expose, and the owners responsible for their operation and lifecycle.**

### Core Formula

```text
Enterprise Agent Governance
=
Domain Mapping
+
Responsibility Mapping
+
Agent Mapping
+
Capability Mapping
+
Business Ownership
+
Technical Ownership
+
Policy
+
Lifecycle Management
```

### The one sentence to remember

> **Domain tells CWD where the problem belongs, responsibility tells it what business function is accountable, capability tells it what needs to be performed, the Agent Registry identifies the appropriate agent, and ownership tells the enterprise who is accountable for that agent.**
