# Agent Capabilities in CWD

**Agent capability** defines **what an agent is able to do** in a standardized, machine-readable way.

In CWD, capabilities are the foundation for **intelligent agent discovery and dynamic routing**.

Instead of the Coordinator saying:

> “Send this task to `shipping-agent-02`.”

it should say:

> **“I need an agent capable of `delay_analysis` in the `logistics` domain.”**

The Agent Registry then finds eligible agents, and the routing layer selects the best one.

---

# 1. Capability Lifecycle

The complete lifecycle is:

```text
Capability Definition
        │
        ▼
Capability Registration
        │
        ▼
Capability Exposure
        │
        ▼
Capability Discovery
        │
        ▼
Capability Matching
        │
        ▼
Agent Eligibility Filtering
        │
        ▼
Intelligent Agent Selection
        │
        ▼
A2A Task Delegation
        │
        ▼
Agent Execution
```

This is one of the key mechanisms that makes CWD **dynamic rather than hardcoded**.

---

# 2. What Is an Agent Capability?

A capability describes a **business or technical ability that an agent can reliably perform**.

For example:

```text
Shipping Agent
 ├── shipment_tracking
 ├── delay_analysis
 ├── route_optimization
 └── rerouting_recommendation
```

A Finance Agent might expose:

```text
Finance Agent
 ├── invoice_analysis
 ├── payment_status
 ├── cost_analysis
 └── financial_forecasting
```

A Customer Agent:

```text
Customer Agent
 ├── customer_lookup
 ├── customer_profile_analysis
 ├── complaint_analysis
 └── customer_sentiment
```

The capability should describe **what the agent does**, rather than how it implements it.

For example:

```text
GOOD
delay_analysis

BAD
langgraph_node_7
```

The Coordinator should not need to know the internal LangGraph nodes, Python classes, prompts, models, or databases used by the agent.

---

# 3. Capability Definition

A capability should ideally have more information than just a name.

Conceptually:

```json
{
  "name": "delay_analysis",
  "description": "Analyze shipment delays and identify likely root causes",
  "domain": "logistics",
  "input_schema": {
    "shipment_id": "string"
  },
  "output_schema": {
    "delay_detected": "boolean",
    "root_cause": "string",
    "severity": "string"
  },
  "operations": [
    "analyze",
    "explain",
    "recommend"
  ]
}
```

This creates a **capability contract**.

It tells the platform:

```text
Capability:
    delay_analysis

Input:
    shipment_id

Output:
    delay_detected
    root_cause
    severity
```

---

# 4. Capability Should Be Machine-Readable

A production platform should avoid capabilities represented only as natural language.

For example:

```text
"This agent is pretty good at analyzing
shipping delays."
```

This is difficult to route reliably.

Instead:

```json
{
  "capability": "delay_analysis",
  "domain": "logistics",
  "version": "2.0",
  "input_schema": {
    "shipment_id": "string"
  }
}
```

Now the Registry and routing engine can perform deterministic matching.

---

# 5. Capability Registration

When an agent is deployed, it registers its capabilities with the centralized Agent Registry.

Conceptually:

```text
Shipping Agent
      │
      │ Register
      ▼
Agent Registry
      │
      ├── identity
      ├── endpoint
      ├── version
      ├── owner
      ├── domain
      ├── capabilities
      └── health
```

Example registration:

```python
agent_registry.register(
    agent_id="shipping-agent",
    domain="logistics",
    endpoint="https://shipping-agent.company.com/a2a",
    version="2.4.1",
    capabilities=[
        "shipment_tracking",
        "delay_analysis",
        "route_optimization"
    ]
)
```

In production, registration should be authenticated and authorized.

An arbitrary application should not be able to claim:

```text
capability = payment_approval
```

without governance.

---

# 6. Capability Metadata in the Registry

A registry record could contain:

```json
{
  "agent_id": "shipping-agent",
  "domain": "logistics",

  "capabilities": [
    {
      "name": "shipment_tracking",
      "version": "1.2",
      "description": "Retrieve shipment tracking information"
    },
    {
      "name": "delay_analysis",
      "version": "2.0",
      "description": "Analyze shipment delays",
      "input_schema": {
        "shipment_id": "string"
      },
      "output_schema": {
        "root_cause": "string",
        "severity": "string"
      }
    }
  ],

  "status": "healthy",
  "environment": "production"
}
```

This makes the registry more than a directory of URLs.

It becomes a **capability catalog**.

---

# 7. Capability Exposure

There are two related concepts:

### Registration

The agent tells the **Agent Registry** what capabilities it supports.

```text
Agent
   │
   │ "I support delay_analysis"
   ▼
Agent Registry
```

### Exposure

The agent makes those capabilities available through its communication interface.

```text
Coordinator
      │
      │ A2A task:
      │ capability = delay_analysis
      ▼
Shipping Agent
      │
      ▼
Internal LangGraph
      │
      ▼
Workers
```

So:

```text
Registration = "What can I do?"

Exposure = "How can another agent invoke that capability?"
```

The Agent Registry provides discovery metadata; A2A provides the agent-to-agent communication boundary.

---

# 8. Capability Discovery

Now suppose the Coordinator receives:

> “Analyze why shipment SHIP123 is delayed.”

The Coordinator determines:

```text
Required capability:
delay_analysis

Domain:
logistics
```

It queries the Agent Registry:

```python
candidates = registry.find(
    capability="delay_analysis",
    domain="logistics",
    environment="production"
)
```

The registry might return:

```text
Candidate Agents

Shipping Agent A
    capability = delay_analysis
    health = healthy
    load = 20%

Shipping Agent B
    capability = delay_analysis
    health = healthy
    load = 70%

Shipping Agent C
    capability = delay_analysis
    health = unhealthy
    load = 10%
```

---

# 9. Capability Matching

The first filtering stage is capability matching.

```text
Required Capability
        │
        ▼
delay_analysis
        │
        ▼
Agent Registry
        │
        ├── Finance Agent        ❌
        ├── Customer Agent      ❌
        ├── Shipping Agent A    ✅
        ├── Shipping Agent B    ✅
        └── Shipping Agent C    ✅
```

This answers:

> **Which agents are capable of doing the task?**

But this is **not yet the final selection**.

---

# 10. Capability Matching Is Not Enough

Suppose three agents support `delay_analysis`.

```text
Agent A → healthy, 20% load
Agent B → healthy, 95% load
Agent C → unhealthy
```

All three have the capability.

But only Agent A is an attractive candidate.

Therefore:

```text
Capability Match
       ↓
Eligibility Filtering
       ↓
Intelligent Routing
```

---

# 11. Eligibility Filtering

CWD can apply additional filters.

```text
Required capability
        +
Domain
        +
Environment
        +
Version compatibility
        +
Authorization
        +
Health
        +
Availability
        +
Policy
```

Conceptually:

```python
eligible = [
    agent
    for agent in candidates
    if agent.status == "healthy"
    and agent.accepting_tasks
    and version_compatible(agent, task)
    and policy.allows(task, agent)
]
```

Now:

```text
Agent A → eligible ✅
Agent B → overloaded ❌
Agent C → unhealthy ❌
```

---

# 12. Intelligent Agent Selection

After filtering, CWD can rank the remaining agents.

A conceptual scoring function might be:

```text
Agent Score =
    Capability Match
  + Domain Match
  + Health
  + Availability
  + Version Compatibility
  + Latency
  + Capacity
  + Priority
  + Region
  + Cost
```

For example:

```text
Agent A
Capability       100
Health            100
Capacity           90
Latency            95
Version           100
                 ----
Score             97
```

Agent B:

```text
Agent B
Capability       100
Health            100
Capacity           40
Latency            80
Version           100
                 ----
Score             84
```

The router selects:

```text
Agent A
```

---

# 13. Important Separation: LLM vs Router

This is especially important in an enterprise CWD architecture.

The LLM can reason:

> “This request appears to require shipment delay analysis.”

But it should not independently decide:

> “Call `https://some-agent.com`.”

Instead:

```text
                 LLM
                  │
                  │ Recommendation
                  ▼
          Required Capability
          = delay_analysis
                  │
                  ▼
           Agent Registry
                  │
                  ▼
         Policy / Authorization
                  │
                  ▼
             Router
                  │
                  ▼
          Selected Agent
```

Therefore:

> **LLM recommends; Registry discovers; Policy authorizes; Router selects; A2A communicates.**

This is a strong enterprise architecture principle.

---

# 14. Capability-Based Routing

Traditional routing:

```text
if task == "shipment":
    call shipping-agent-1
```

This is hardcoded.

Capability-based routing:

```python
required_capability = "delay_analysis"

agents = registry.find(
    capability=required_capability
)

selected = router.select(agents)
```

Now the architecture is dynamic.

If Agent A disappears:

```text
Agent A
   ↓
unhealthy
```

The registry/routing system can select:

```text
Agent B
```

without changing Coordinator code.

---

# 15. Capability Versioning

Capabilities themselves can evolve.

For example:

```text
delay_analysis:v1
delay_analysis:v2
```

Suppose the task requires:

```text
delay_analysis >= v2
```

The registry might contain:

```text
Agent A → v1 ❌
Agent B → v2 ✅
Agent C → v3 ✅
```

Then:

```text
Eligible:
Agent B
Agent C
```

Routing policy determines which one to use.

This supports:

* backward compatibility
* controlled migration
* canary releases
* version-aware routing
* rollback

---

# 16. Capability Dependencies

A capability can also require other capabilities.

For example:

```text
shipment_delay_resolution
        │
        ├── shipment_tracking
        ├── delay_analysis
        └── route_optimization
```

The Coordinator or Delegator can construct a plan:

```text
Task
 │
 ├── Get tracking information
 │
 ├── Analyze delay
 │
 └── Recommend route
```

Different agents may handle different capabilities.

```text
Tracking Agent
       │
       ▼
Delay Agent
       │
       ▼
Optimization Agent
```

LangGraph can manage the dependency and state transitions.

---

# 17. Capability Selection in CWD

A complete CWD flow looks like:

```text
                    User Request
                         │
                         ▼
                   Coordinator
                         │
                         ▼
                 Intent Analysis
                         │
                         ▼
              Required Capability
                = delay_analysis
                         │
                         ▼
                  Agent Registry
                         │
             ┌───────────┼───────────┐
             ▼           ▼           ▼
          Agent A     Agent B     Agent C
             │           │           │
             └───────────┼───────────┘
                         ▼
                Capability Filter
                         │
                         ▼
                Policy / IAM
                         │
                         ▼
               Health / Capacity
                         │
                         ▼
                  Dynamic Router
                         │
                         ▼
                  Selected Agent
                         │
                         ▼
                       A2A
                         │
                         ▼
                  Domain Agent
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
                Enterprise Systems
```

---

# 18. Example: Multiple Agents With Same Capability

Imagine an enterprise has:

```text
Agent A
Domain: Logistics
Capability: delay_analysis
Region: US
Health: Healthy

Agent B
Domain: Logistics
Capability: delay_analysis
Region: Europe
Health: Healthy

Agent C
Domain: Logistics
Capability: delay_analysis
Region: US
Health: Degraded
```

Request:

```text
Analyze shipment from Texas.
```

Required:

```text
Capability = delay_analysis
Domain = logistics
Region = US
```

Filtering:

```text
Agent A → capability ✅ domain ✅ region ✅ health ✅
Agent B → capability ✅ domain ✅ region ❌
Agent C → capability ✅ domain ✅ region ✅ health ⚠️
```

Selection:

```text
Agent A
```

This is **intelligent capability-based routing**.

---

# 19. Capability Registration During Deployment

A production deployment pipeline can automatically register an agent.

```text
Developer
    │
    ▼
Agent Code
    │
    ▼
CI/CD
    │
    ▼
Container Image
    │
    ▼
Deployment
    │
    ▼
Health Check
    │
    ▼
Capability Registration
    │
    ▼
Agent Registry
```

For example:

```python
agent_metadata = {
    "agent_id": "shipping-agent",
    "version": "2.4.1",
    "domain": "logistics",
    "capabilities": [
        "shipment_tracking",
        "delay_analysis",
        "route_optimization"
    ]
}

registry.register(agent_metadata)
```

The registry should validate the registration before making the agent discoverable.

---

# 20. Capability Health Lifecycle

Capability availability can also change dynamically.

For example:

```text
09:00
delay_analysis → available

10:00
delay_analysis → available

11:00
dependency failure
       ↓
delay_analysis → degraded

12:00
agent recovery
       ↓
delay_analysis → available
```

The registry or health system should reflect this.

This prevents the router from repeatedly sending work to an unavailable capability.

---

# 21. Capability vs Agent

An important distinction:

```text
Agent = Who performs the work

Capability = What the agent can perform
```

For example:

```text
Agent:
shipping-agent

Capabilities:
 ├── shipment_tracking
 ├── delay_analysis
 └── route_optimization
```

Therefore multiple agents can expose the same capability:

```text
delay_analysis
      │
      ├── Shipping Agent A
      ├── Shipping Agent B
      └── Shipping Agent C
```

This is what enables **pooling, failover, load balancing, and intelligent routing**.

---

# 22. Capability vs Tool

Another important distinction in your CWD architecture:

```text
Agent Capability
       │
       ▼
Agent executes capability
       │
       ▼
Worker
       │
       ▼
MCP Tool
       │
       ▼
Enterprise API/System
```

For example:

```text
Capability:
delay_analysis

Worker:
delay-analysis-worker

MCP tools:
 ├── get_shipment_events
 ├── get_carrier_status
 └── get_route_constraints
```

So:

> **Capability represents the higher-level agent ability; MCP tools represent the lower-level enterprise operations used to execute that ability.**

---

# 23. Capability + A2A + MCP + LangGraph

These four concepts have different responsibilities:

| Component          | Question answered                                  |
| ------------------ | -------------------------------------------------- |
| **Capability**     | What can this agent do?                            |
| **Agent Registry** | Which agents can do it?                            |
| **A2A**            | How do agents communicate?                         |
| **LangGraph**      | What happens next?                                 |
| **MCP**            | How does the agent access enterprise capabilities? |

The complete flow is:

```text
Capability
    ↓
Agent Registry
    ↓
Agent Selection
    ↓
A2A
    ↓
Agent
    ↓
LangGraph
    ↓
Worker
    ↓
MCP
    ↓
Enterprise System
```

---

# 24. Production Capability Selection Algorithm

Conceptually:

```python
def select_agent(task):

    # 1. Determine required capability
    capability = task.required_capability

    # 2. Discover candidates
    candidates = registry.find(
        capability=capability,
        domain=task.domain,
        environment=task.environment
    )

    # 3. Authorization
    candidates = [
        agent for agent in candidates
        if policy.is_allowed(task.caller, agent, task)
    ]

    # 4. Health and availability
    candidates = [
        agent for agent in candidates
        if agent.status == "healthy"
        and agent.accepting_tasks
    ]

    # 5. Version compatibility
    candidates = [
        agent for agent in candidates
        if version_compatible(
            agent,
            task.required_capability_version
        )
    ]

    # 6. Intelligent routing
    selected = router.rank(
        candidates,
        task=task
    )

    return selected
```

The important point is that the Coordinator doesn't contain:

```python
if capability == "delay_analysis":
    use_shipping_agent_2()
```

Instead, selection is **metadata-driven**.

---

# 25. What Happens When the Selected Agent Fails?

Suppose:

```text
Coordinator
     │
     ▼
Agent A selected
     │
     ▼
A2A task
     │
     X
Agent A unavailable
```

LangGraph can route to recovery:

```text
Task Failure
     │
     ▼
Classify failure
     │
     ▼
Retryable?
     │
    Yes
     │
     ▼
Rediscover capability
     │
     ▼
Agent Registry
     │
     ├── Agent A ❌
     ├── Agent B ✅
     └── Agent C ❌
            │
            ▼
         Agent B
            │
            ▼
           A2A
```

This provides **dynamic failover**.

---

# 26. Capability Metadata and Governance

Capabilities must be governed.

For example, an agent shouldn't simply register:

```text
delete_customer
approve_payment
execute_any_sql
```

without review.

Enterprise capability governance can include:

```text
Capability
    │
    ├── Risk classification
    ├── Data classification
    ├── Required permissions
    ├── Allowed environments
    ├── Approval requirement
    ├── Rate limits
    └── Allowed agents
```

Example:

```json
{
  "name": "payment_approval",
  "risk": "high",
  "requires_human_approval": true,
  "required_role": "finance_approver"
}
```

Then capability discovery does **not** automatically mean capability execution is permitted.

---

# 27. The Most Important Distinction

Remember this sequence:

```text
Capability Discovery
        ↓
Candidate Agents
        ↓
Authorization
        ↓
Health / Availability
        ↓
Routing
        ↓
A2A Task
        ↓
Execution
```

Therefore:

> **Discovery does not equal authorization.**

And:

> **Capability match does not equal agent selection.**

And:

> **Agent selection does not equal execution permission.**

These distinctions are very important in enterprise architecture.

---

# 28. Core Formula

The complete model is:

```text
Intelligent Agent Selection
=
Capability Definition
+
Capability Registration
+
Capability Discovery
+
Capability Matching
+
Domain Matching
+
Authorization
+
Version Compatibility
+
Health
+
Availability
+
Routing Policy
+
Dynamic Selection
```

---

# 29. Interview-Ready Answer

> **Agent capabilities define the business or technical abilities that an agent can perform. In CWD, capabilities are defined as structured, machine-readable contracts containing information such as capability name, description, domain, input/output schemas, and version. When an agent is deployed, these capabilities are registered with the centralized Agent Registry and exposed through the agent's communication interface, typically through A2A. During runtime, the Coordinator identifies the capability required for the task and queries the Registry to discover candidate agents. The candidates are then filtered based on domain, environment, authorization, version compatibility, health, availability, and policy. A routing component ranks the eligible agents using factors such as load, latency, capacity, region, priority, and cost, and selects the best agent. The task is then delegated through A2A. LangGraph manages the workflow and recovery around the interaction, while the selected agent can use Workers and MCP to execute the capability against enterprise systems.**

## Final Definition

> **Agent capability management is the lifecycle of defining, registering, exposing, discovering, validating, and routing agent abilities so that CWD can dynamically identify the most appropriate authorized agent for a task without relying on hardcoded agent endpoints or implementations.**

### Mental model

```text
                 WHAT?
              Capability
                  │
                  ▼
                 WHO?
           Agent Registry
                  │
                  ▼
              WHO IS
             ELIGIBLE?
        Policy + Health + Version
                  │
                  ▼
              WHICH ONE?
              Router
                  │
                  ▼
               HOW?
                 A2A
                  │
                  ▼
              EXECUTE
          Agent + LangGraph
                  │
                  ▼
              ENTERPRISE
            Worker + MCP
```

**Core principle:**

> **Capability tells CWD what is needed; the Registry finds who can do it; policy determines who is allowed; routing determines who should do it; A2A delegates the task; LangGraph manages execution; and MCP enables access to enterprise capabilities.**
