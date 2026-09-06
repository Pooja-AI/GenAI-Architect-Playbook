# Understand Centralized Agent Registration, Discovery, Metadata, Capabilities, Ownership, Health, Access Control, and Dynamic Routing

In a production **CWD (Coordinator–Delegator–Worker)** architecture, the **Agent Registry** acts as the centralized source of truth for the agents that are available to the platform.

The core idea is:

> **The Agent Registry tells CWD which agents exist, what they can do, who owns them, whether they are healthy, what they are allowed to handle, and where/how to reach them.**

This allows the Coordinator and Delegators to perform **dynamic agent discovery and routing** instead of hardcoding agent endpoints.

---

# 1. Why Do We Need an Agent Registry?

Imagine an enterprise with:

```text
Customer Agent
Order Agent
Shipping Agent
Finance Agent
Inventory Agent
Quality Agent
Manufacturing Agent
Analytics Agent
Compliance Agent
Document Agent
```

Without a registry, the Coordinator might contain hardcoded mappings:

```python
AGENTS = {
    "customer": "http://customer-agent:8000",
    "orders": "http://order-agent:8001",
    "shipping": "http://shipping-agent:8002",
    "finance": "http://finance-agent:8003"
}
```

This becomes problematic when:

* agents are added
* agents are removed
* endpoints change
* versions change
* agents scale horizontally
* agents become unhealthy
* ownership changes
* capabilities change
* access policies change

Instead:

```text
Coordinator
     │
     │ "Who can handle shipment tracking?"
     ▼
 Agent Registry
     │
     ├── shipping-agent-v1
     ├── shipping-agent-v2
     └── logistics-agent
     │
     ▼
Eligible Agents
     │
     ▼
Dynamic Routing
```

The Coordinator does not need to know the infrastructure topology.

---

# 2. Agent Registry as a Control-Plane Component

A useful architecture is:

```text
                    CWD CONTROL PLANE
 ┌─────────────────────────────────────────────────┐
 │                                                 │
 │              ┌─────────────────┐                │
 │              │  Agent Registry │                │
 │              └────────┬────────┘                │
 │                       │                         │
 │       ┌───────────────┼───────────────┐         │
 │       ▼               ▼               ▼         │
 │   Metadata         Capability       Health      │
 │   Ownership        Access           Routing     │
 │                                                 │
 └──────────────────────┬──────────────────────────┘
                        │
                        ▼
              ┌──────────────────┐
              │    Coordinator   │
              └────────┬─────────┘
                       │
                       ▼
                  Delegators
                       │
                       ▼
                    Workers
```

The registry is therefore more than a simple database of URLs.

It becomes a **governed service-discovery and routing source**.

---

# 3. What Does the Registry Store?

A production Agent Registry should maintain several categories of information.

```text
Agent Registration
       │
       ├── Identity
       ├── Metadata
       ├── Capabilities
       ├── Ownership
       ├── Endpoint
       ├── Version
       ├── Health
       ├── Access Control
       ├── Policies
       └── Routing Attributes
```

Let's examine each.

---

# 4. Agent Identity

Every registered agent should have a unique logical identity.

Example:

```json
{
  "agent_id": "shipping-agent",
  "name": "Shipping Agent",
  "version": "2.4.1"
}
```

The important distinction is:

```text
Logical Agent
       │
       ├── shipping-agent-v1
       ├── shipping-agent-v2
       └── shipping-agent-v3
```

The Coordinator normally thinks in terms of:

```text
shipping-agent
```

rather than:

```text
10.24.18.31:8080
```

This provides infrastructure independence.

---

# 5. Agent Metadata

Metadata describes the agent and its operational characteristics.

Example:

```json
{
  "agent_id": "shipping-agent",
  "domain": "logistics",
  "description": "Handles shipment tracking and logistics analysis",
  "version": "2.4.1",
  "environment": "production",
  "protocols": ["A2A"],
  "endpoint": "https://shipping-agent.internal"
}
```

Metadata may include:

| Metadata    | Purpose                   |
| ----------- | ------------------------- |
| Agent ID    | Unique identity           |
| Name        | Human-readable name       |
| Domain      | Business/technical domain |
| Version     | Compatibility             |
| Environment | Dev/UAT/Prod              |
| Endpoint    | Communication location    |
| Protocol    | A2A/API/etc.              |
| Deployment  | AKS/Container Apps/etc.   |
| Region      | Geographic location       |
| Tenant      | Enterprise tenant         |
| Status      | Operational state         |
| Owner       | Responsible team          |

---

# 6. Capabilities

This is one of the most important registry functions.

The Coordinator should not ask:

> "Which URL should I call?"

It should ask:

> **"Which registered agent has the capability required for this task?"**

For example:

```json
{
  "agent_id": "shipping-agent",
  "capabilities": [
    "shipment_tracking",
    "delay_analysis",
    "carrier_analysis",
    "route_optimization"
  ]
}
```

Another agent:

```json
{
  "agent_id": "inventory-agent",
  "capabilities": [
    "inventory_lookup",
    "stock_analysis",
    "reorder_recommendation"
  ]
}
```

Then:

```text
Task:
"Analyze shipment delays"
          │
          ▼
Capability:
delay_analysis
          │
          ▼
Agent Registry
          │
          ├── shipping-agent ✓
          ├── inventory-agent ✗
          └── finance-agent ✗
          │
          ▼
shipping-agent
```

---

# 7. Capability ≠ Authorization

This distinction is extremely important.

Suppose:

```text
shipping-agent
```

has:

```text
shipment_tracking
```

capability.

That does **not** automatically mean the agent is authorized to access every shipment.

The decision is:

```text
Capability
     +
Identity
     +
Authorization
     +
Data Entitlement
     +
Policy
     =
Eligible Agent
```

Therefore:

> **The registry can identify capable agents, but capability discovery must not be treated as authorization.**

Authorization remains enforced by IAM/policy and the target system.

---

# 8. Ownership

Every enterprise agent should have an accountable owner.

Example:

```json
{
  "agent_id": "shipping-agent",
  "owner": {
    "team": "Supply Chain AI",
    "contact": "supply-chain-ai@company.com"
  }
}
```

Ownership is important for:

* support
* incident management
* security reviews
* lifecycle management
* deployment approval
* capability changes
* compliance
* retirement
* SLA/SLO accountability

Think of:

```text
Agent
 │
 ├── Technical Owner
 ├── Business Owner
 ├── Security Owner
 └── Platform Owner
```

The exact ownership model depends on enterprise governance.

---

# 9. Health

The registry should know whether an agent is currently eligible for routing.

For example:

```text
shipping-agent
      │
      ▼
Health Check
      │
 ┌────┼─────────────┐
 ▼    ▼             ▼
Healthy Degraded  Unhealthy
```

Possible states:

```text
healthy
degraded
unhealthy
starting
draining
maintenance
disabled
```

Why does this matter?

Suppose three agents support the same capability:

```text
shipment_tracking
```

but:

```text
Agent A → healthy
Agent B → unhealthy
Agent C → healthy
```

Dynamic routing should avoid Agent B.

```text
Capability Search
       │
       ▼
A ✓
B ✗
C ✓
       │
       ▼
Eligible Agents
       │
       ▼
Load/Policy/Latency selection
```

---

# 10. Health Is More Than "Is the Process Running?"

A production health model should consider:

```text
Process health
+
Dependency health
+
Model availability
+
Database connectivity
+
MCP/tool availability
+
Queue backlog
+
Resource utilization
+
Error rate
+
Latency
```

For example:

```text
Agent = technically alive
```

but:

```text
Database = unavailable
```

The agent may technically be "up" but not suitable for a task requiring database access.

Therefore, routing can use:

```text
Readiness
+
Capability health
+
Dependency health
```

rather than only a simple ping.

---

# 11. Access Control

Agent Registry data itself should be governed.

For example:

```text
Coordinator
    │
    │ Request capability discovery
    ▼
Agent Registry
    │
    ▼
Policy Check
    │
    ├── Allowed
    │
    └── Denied
```

Suppose:

```text
Finance Agent
```

handles:

```text
financial_analysis
```

A general customer-support agent may not be allowed to discover or invoke it.

Therefore:

```text
Agent Capability
        │
        ▼
Access Policy
        │
        ▼
Caller Identity
        │
        ▼
Entitlement
        │
        ▼
Allowed / Denied
```

---

# 12. Agent Registration

An agent should register itself or be registered by the platform.

Conceptually:

```text
Agent Deployment
      │
      ▼
Registration
      │
      ▼
Agent Registry
      │
      ├── Identity
      ├── Capabilities
      ├── Endpoint
      ├── Owner
      ├── Version
      ├── Policies
      └── Health
```

Example:

```json
{
  "agent_id": "shipping-agent",
  "version": "2.4.1",
  "domain": "logistics",
  "capabilities": [
    "shipment_tracking",
    "delay_analysis"
  ],
  "endpoint": "https://shipping-agent.internal",
  "protocol": "A2A",
  "owner": "supply-chain-ai",
  "environment": "production",
  "status": "healthy"
}
```

---

# 13. Registration Is Not a One-Time Event

A common mistake is:

```text
Deploy Agent
     ↓
Register Agent
     ↓
Done
```

In production, registration should be **lifecycle-aware**.

```text
Register
   │
   ▼
Active
   │
   ├── Health updates
   ├── Version updates
   ├── Capability changes
   ├── Ownership changes
   ├── Scaling
   └── Maintenance
   │
   ▼
Draining
   │
   ▼
Retired
```

This allows the platform to dynamically adapt.

---

# 14. Agent Discovery

Suppose the Coordinator receives:

> "Track shipment SHIP123 and determine why it is delayed."

Coordinator reasoning:

```text
Intent
   │
   ▼
Required capability
   │
   ▼
shipment_tracking
+
delay_analysis
```

It queries the registry:

```text
Registry.find(
    capability="shipment_tracking",
    environment="production"
)
```

The registry returns:

```json
[
  {
    "agent_id": "shipping-agent-v2",
    "version": "2.4.1",
    "status": "healthy"
  },
  {
    "agent_id": "logistics-agent",
    "version": "1.8.2",
    "status": "healthy"
  }
]
```

Now routing can evaluate the candidates.

---

# 15. Dynamic Routing

Dynamic routing means:

> **The platform selects the appropriate agent at runtime based on current execution information instead of using hardcoded routing.**

Conceptually:

```text
             Task
              │
              ▼
       Required Capability
              │
              ▼
       Agent Registry
              │
       Candidate Agents
              │
              ▼
       Policy Filtering
              │
              ▼
       Health Filtering
              │
              ▼
       Capability Match
              │
              ▼
       Load/Latency Check
              │
              ▼
       Version Compatibility
              │
              ▼
       Routing Decision
              │
              ▼
          Selected Agent
```

---

# 16. Dynamic Routing Function

A useful architectural model is:

```text
SelectedAgent =
f(
    capability,
    policy,
    identity,
    health,
    workload,
    latency,
    version,
    location,
    priority,
    deadline,
    cost
)
```

For example:

```python
def select_agent(candidates, task):
    eligible = [
        agent
        for agent in candidates
        if agent["status"] == "healthy"
        and task["capability"] in agent["capabilities"]
        and agent["version"] in task["supported_versions"]
    ]

    return min(
        eligible,
        key=lambda agent: agent["load"]
    )
```

This is conceptual; production routing should use centralized policy and service-discovery infrastructure rather than embedding all rules in application code.

---

# 17. Dynamic Routing Example

Suppose:

```text
Capability:
shipment_tracking
```

Registry:

| Agent      | Capability | Health    | Load | Version |
| ---------- | ---------- | --------- | ---: | ------- |
| Shipping A | Yes        | Healthy   |  80% | 2.1     |
| Shipping B | Yes        | Healthy   |  30% | 2.4     |
| Shipping C | Yes        | Unhealthy |  10% | 2.5     |

Routing:

```text
Candidate A ✓
Candidate B ✓
Candidate C ✗
       │
       ▼
Compare A vs B
       │
       ▼
B has lower load
       │
       ▼
Route → Shipping B
```

The Coordinator does not need to know which physical instance handled the request.

---

# 18. Registry + CWD

The full CWD flow becomes:

```text
User
 │
 ▼
Coordinator
 │
 │ Understand intent
 │
 ▼
LangGraph
 │
 │ Determine required capability
 ▼
Agent Registry
 │
 ├── Discover agents
 ├── Check capabilities
 ├── Check health
 ├── Check version
 └── Return candidates
 │
 ▼
Policy / IAM
 │
 │ Authorization
 ▼
Dynamic Routing
 │
 ▼
Delegator
 │
 ▼
Workers
 │
 ▼
MCP
 │
 ▼
Enterprise Systems
```

---

# 19. Where A2A Fits

Agent Registry and A2A solve different problems.

```text
Agent Registry
      │
      │ "Who can do this?"
      ▼
Candidate Agent
      │
      ▼
A2A
      │
      │ "Here is the task."
      ▼
Target Agent
```

So:

> **Registry = discovery**

> **A2A = communication**

For example:

```text
Coordinator
     │
     │ 1. Find capable agent
     ▼
Agent Registry
     │
     │ 2. Return shipping-agent
     ▼
Coordinator
     │
     │ 3. A2A task
     ▼
Shipping Agent
```

---

# 20. Registry + LangGraph

LangGraph controls the workflow around discovery.

Example:

```text
START
  │
  ▼
Understand Intent
  │
  ▼
Determine Capability
  │
  ▼
Discover Agent
  │
  ▼
Check Authorization
  │
  ▼
Select Agent
  │
  ▼
Delegate via A2A
  │
  ▼
Monitor
  │
  ├── Success → Aggregate
  │
  ├── Failure → Rediscover
  │
  └── No Agent → Escalate
```

Therefore:

> **Agent Registry provides discovery information; LangGraph determines how that discovery result affects workflow execution.**

---

# 21. Dynamic Routing After Failure

This is where centralized registration becomes especially powerful.

Suppose:

```text
Shipping Agent A
       │
       ▼
Execution
       │
       X
   Timeout
```

The Delegator can request another eligible agent:

```text
Failure
  │
  ▼
LangGraph
  │
  ▼
Retry policy
  │
  ▼
Agent Registry
  │
  ├── Agent A → unhealthy ✗
  ├── Agent B → healthy ✓
  └── Agent C → healthy ✓
  │
  ▼
Select Agent B
  │
  ▼
A2A
  │
  ▼
Agent B
```

This creates **dynamic failure redistribution**.

---

# 22. Version-Aware Routing

Suppose:

```text
shipping-agent-v1
shipping-agent-v2
shipping-agent-v3
```

A task may require:

```text
minimum_version = 2.0
```

Registry filtering:

```text
v1 → incompatible ✗
v2 → compatible ✓
v3 → compatible ✓
```

Then routing chooses between:

```text
v2
v3
```

based on:

```text
health
load
latency
policy
cost
```

This supports controlled upgrades and canary deployments.

---

# 23. Ownership + Lifecycle Governance

Central registration also creates enterprise governance.

For example:

```text
Agent Registry
      │
      ├── Who owns it?
      ├── What does it do?
      ├── Which version?
      ├── Where deployed?
      ├── Which data can it access?
      ├── What capabilities?
      ├── Is it healthy?
      ├── Who approved it?
      └── Is it production-approved?
```

This prevents the enterprise from becoming:

```text
                Agent Sprawl
                     │
       ┌─────────────┼─────────────┐
       ▼             ▼             ▼
    Unknown        Unknown       Unknown
     Agent          Agent         Agent
```

Instead:

```text
             Governed Agent Ecosystem
                       │
                Agent Registry
                       │
       ┌───────────────┼───────────────┐
       ▼               ▼               ▼
   Registered       Governed        Observable
```

---

# 24. Example Production Agent Record

A more complete conceptual record could look like:

```json
{
  "agent_id": "shipping-agent",
  "name": "Shipping Intelligence Agent",
  "domain": "logistics",
  "version": "2.4.1",

  "capabilities": [
    "shipment_tracking",
    "delay_analysis",
    "carrier_analysis"
  ],

  "endpoint": {
    "protocol": "A2A",
    "url": "https://shipping-agent.internal"
  },

  "ownership": {
    "team": "Supply Chain AI",
    "business_owner": "Logistics",
    "technical_owner": "AI Platform"
  },

  "deployment": {
    "environment": "production",
    "region": "us-east",
    "runtime": "container"
  },

  "health": {
    "status": "healthy",
    "last_check": "2026-09-06T18:00:00Z"
  },

  "access": {
    "allowed_callers": [
      "coordinator",
      "shipping-delegator"
    ]
  },

  "routing": {
    "priority": 10,
    "max_concurrency": 100,
    "supported_versions": [
      "2.x"
    ]
  }
}
```

This is a **conceptual schema**; production implementation should align with the enterprise's actual registry and A2A metadata contracts.

---

# 25. Security Architecture

The registry itself must be protected.

```text
Agent
  │
  │ Register / Update
  ▼
Authentication
  │
  ▼
Authorization
  │
  ▼
Agent Registry
  │
  ├── Metadata
  ├── Capabilities
  ├── Ownership
  ├── Health
  └── Routing
```

Important controls:

* authenticated registration
* authorized metadata updates
* least privilege
* ownership validation
* environment separation
* audit logging
* encrypted communication
* version governance
* approved capability registration
* protection against malicious registration
* controlled endpoint changes

A malicious agent must not be able to register:

```text
agent_id = "finance-agent"
endpoint = "malicious-service"
```

and then receive enterprise traffic.

---

# 26. Agent Registry vs Service Discovery

They overlap but are not necessarily identical.

### Infrastructure service discovery

Answers:

> "Where is the service running?"

Examples:

```text
DNS
Kubernetes Service
Service Mesh
Azure service discovery
```

### Agent Registry

Answers:

> "What agent is this, what can it do, who owns it, what protocol does it support, is it healthy, and is it eligible for this task?"

Therefore:

```text
Infrastructure Discovery
        │
        ▼
Endpoint/location

Agent Registry
        │
        ├── Identity
        ├── Capability
        ├── Ownership
        ├── Policy
        ├── Health
        ├── Version
        └── Routing
```

A production architecture can use both.

---

# 27. Agent Registry vs A2A Agent Card

These concepts can complement each other.

```text
Agent Registry
       │
       │ Enterprise governance/discovery
       ▼
Agent
       │
       │ A2A metadata / Agent Card
       ▼
External interoperability
```

The registry can maintain enterprise-specific information such as:

```text
owner
cost center
environment
health
internal policies
deployment metadata
approved callers
SLA/SLO
```

while an A2A-facing metadata mechanism can describe capabilities and interaction details needed by other agents.

The exact fields and interoperability behavior should follow the A2A version adopted by the enterprise.

---

# 28. Centralized vs Distributed Discovery

### Centralized

```text
              Agent Registry
               /    |    \
              /     |     \
        Agent A   Agent B   Agent C
```

Advantages:

* centralized governance
* consistent metadata
* easy auditing
* centralized access control
* easier dynamic routing

Potential downside:

* registry availability becomes important

Therefore production systems should use:

```text
Highly Available Registry
+
Caching
+
Health checks
+
Failover
```

---

# 29. Registry Caching

You generally don't want every task to require an expensive registry lookup.

A possible architecture:

```text
Coordinator
     │
     ▼
Registry Cache
     │
     ├── Fresh → Use
     │
     └── Stale/Missing
              │
              ▼
        Agent Registry
```

But health and security-sensitive information should have appropriate freshness requirements.

For example:

```text
Capability metadata → longer cache
Agent endpoint → moderate cache
Health → short cache
Authorization → don't rely blindly on stale cache
```

---

# 30. Dynamic Routing Formula

A useful conceptual model is:

```text
EligibleAgents =
Filter(
    RegisteredAgents,
    CapabilityMatch
    ∧ Authorization
    ∧ Healthy
    ∧ VersionCompatible
    ∧ EnvironmentCompatible
)
```

Then:

```text
SelectedAgent =
argmin(
    Load,
    Latency,
    Cost
)
```

subject to:

```text
Policy
+
Priority
+
Deadline
+
Location
+
Capacity
```

In practice, the routing policy can be much more sophisticated.

---

# 31. Failure Scenarios

### Agent unavailable

```text
Registry
   │
   └── Agent = unhealthy
             │
             ▼
       Exclude from routing
```

### Agent overloaded

```text
Agent A → 95% load
Agent B → 30% load

Route → Agent B
```

### Capability unavailable

```text
Required capability
        │
        ▼
No eligible agent
        │
        ▼
Recovery / Escalation
```

### Version incompatibility

```text
Task requires v2+
        │
        ├── v1 ✗
        ├── v2 ✓
        └── v3 ✓
```

---

# 32. Complete CWD Flow

The complete architecture becomes:

```text
                         USER
                           │
                           ▼
                    ┌─────────────┐
                    │ Coordinator │
                    └──────┬──────┘
                           │
                      Intent/Plan
                           │
                           ▼
                    Required Capability
                           │
                           ▼
                    ┌─────────────┐
                    │Agent Registry│
                    └──────┬──────┘
                           │
              ┌────────────┼─────────────┐
              ▼            ▼             ▼
          Capability     Health       Metadata
              │            │             │
              └────────────┼─────────────┘
                           ▼
                    Candidate Agents
                           │
                           ▼
                    Policy / IAM
                           │
                           ▼
                    Dynamic Routing
                           │
                           ▼
                       A2A Task
                           │
                           ▼
                      Delegator
                           │
                    ┌──────┼──────┐
                    ▼      ▼      ▼
                  Worker Worker Worker
                    │      │      │
                    └──────┼──────┘
                           ▼
                          MCP
                           │
                           ▼
                  Enterprise Systems
```

---

# 33. Responsibility Model

| Component          | Responsibility                                                                      |
| ------------------ | ----------------------------------------------------------------------------------- |
| **Agent Registry** | Registration, metadata, capability discovery, ownership, health, routing attributes |
| **Coordinator**    | Enterprise-level intent, planning, discovery, orchestration                         |
| **Delegator**      | Domain-level decomposition and Worker selection                                     |
| **LangGraph**      | Workflow state, transitions, conditional routing, retry/recovery                    |
| **A2A**            | Agent-to-agent communication                                                        |
| **Service Bus**    | Async message transport                                                             |
| **Policy/IAM**     | Authorization and access control                                                    |
| **Worker**         | Specialized execution                                                               |
| **MCP**            | Enterprise tool/resource integration                                                |
| **Observability**  | Metrics, logs, traces, audit                                                        |

---

# 34. Common Anti-Patterns

### ❌ Hardcoded agent endpoints

```python
shipping_url = "http://10.0.2.14:8080"
```

Avoid infrastructure coupling.

### ❌ Registry only stores URLs

A registry should provide meaningful agent metadata and capabilities.

### ❌ Capability = authorization

Being capable of performing an operation does not mean the caller is permitted to perform it.

### ❌ No health information

Routing traffic to unhealthy agents causes avoidable failures.

### ❌ No ownership

Unowned agents become operational and security risks.

### ❌ Stale registrations

Retired agents can continue receiving traffic.

### ❌ Every agent registers arbitrary capabilities

Capability registration should be governed and approved.

### ❌ Registry makes the final business authorization decision

Registry discovery and enterprise authorization should remain appropriately separated.

### ❌ Hardcode routing logic everywhere

Centralize routing policy where possible.

---

# 35. The Most Important Architectural Separation

Remember this sequence:

```text
1. What does the task require?
             ↓
       Capability

2. Who can perform it?
             ↓
       Agent Registry

3. Who is allowed to perform it?
             ↓
       Policy / IAM

4. Which eligible agent should receive it?
             ↓
       Dynamic Router

5. How do we communicate?
             ↓
       A2A

6. How is the workflow managed?
             ↓
       LangGraph

7. How does the agent access enterprise systems?
             ↓
       MCP
```

This separation prevents the Coordinator from becoming a giant hardcoded routing engine.

---

# 36. Interview-Ready Answer

> **In CWD, the Agent Registry acts as the centralized control-plane source of truth for registered agents. It maintains agent identity, metadata, capabilities, ownership, versions, endpoints, health, and routing attributes. When the Coordinator or Delegator receives a task, it determines the required capability and queries the registry to discover eligible agents. The platform then applies authorization, policy, health, version, workload, and other routing constraints to dynamically select the appropriate agent. A2A is used to communicate the task to the selected agent, while LangGraph manages the workflow and recovery around that interaction. This architecture eliminates hardcoded agent endpoints, supports independent agent deployment and scaling, enables failover and dynamic routing, and provides centralized governance and observability.**

### One-line interview version

> **The Agent Registry provides centralized agent discovery and governance, while dynamic routing uses capability, policy, health, version, workload, and other runtime attributes to select the right agent for each CWD task.**

---

# 37. Final Definition

> **Centralized agent registration and discovery is the CWD control-plane capability that maintains a governed catalog of agents, their metadata, capabilities, ownership, health, access attributes, versions, and endpoints, enabling the Coordinator and Delegators to discover eligible agents dynamically and route tasks without hardcoded dependencies.**

### Core Formula

```text
Centralized Agent Discovery
=
Registration
+ Metadata
+ Capabilities
+ Ownership
+ Health
+ Access Control
+ Versioning
+ Dynamic Routing
+ Governance
+ Observability
```

### Mental Model

```text
                 AGENT REGISTRY
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
   What exists?    What can it do?  Is it healthy?
        │              │              │
        └──────────────┼──────────────┘
                       ▼
                Who owns it?
                       │
                       ▼
                Who can use it?
                       │
                       ▼
             Which agent should run?
                       │
                       ▼
                 Dynamic Routing
                       │
                       ▼
                      A2A
                       │
                       ▼
                  Target Agent
```

**The fundamental principle is:**

> **The Registry answers “who can do this?”, Policy answers “who is allowed to do this?”, the Router answers “which eligible agent should handle it?”, A2A handles agent communication, and LangGraph manages what happens next.**
