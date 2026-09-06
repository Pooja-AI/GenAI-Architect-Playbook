# Agent Discovery Based on Capabilities, Domains, and Availability

In an enterprise **CWD (Coordinator–Delegator–Worker)** platform, agents should not discover each other by hardcoded URLs or agent names.

Instead, an agent should express:

> **“I need an agent that can perform capability X, belongs to domain Y, is available now, and is authorized for this task.”**

The **Agent Registry** then returns candidate agents, and the routing layer selects the best eligible one.

---

## 1. The Basic Concept

The discovery flow is:

```text id="x2q7ka"
Agent receives task
       │
       ▼
Understand required capability
       │
       ▼
Query Agent Registry
       │
       ├── Capability filter
       ├── Domain filter
       ├── Availability filter
       ├── Version filter
       └── Policy/access filter
       │
       ▼
Eligible agents
       │
       ▼
Dynamic routing
       │
       ▼
Selected agent
       │
       ▼
A2A task
```

The important distinction is:

```text id="v6j9s2"
Discovery ≠ Routing ≠ Authorization
```

They work together but have different responsibilities.

---

# 2. What Does "Discover an Agent" Mean?

Suppose the Coordinator receives:

> "Why is shipment SHIP123 delayed?"

The Coordinator determines that it needs:

```text id="rj5j5c"
Capabilities:
    shipment_tracking
    delay_analysis

Domain:
    logistics
```

It doesn't need to know:

```text id="h7h3cw"
shipping-agent-02.internal:8080
```

Instead, it queries the registry:

```text id="c0fk87"
Find agents where:

capability = "delay_analysis"
domain = "logistics"
status = "healthy"
environment = "production"
```

The registry might return:

```text id="e7m4xj"
Shipping Intelligence Agent
Logistics Agent
Carrier Analytics Agent
```

The routing layer then chooses the best candidate.

---

# 3. Capability-Based Discovery

**Capability** answers:

> **"What can this agent do?"**

Example registry:

```json id="v2j8kq"
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

Another:

```json id="x5xj9p"
{
  "agent_id": "inventory-agent",
  "capabilities": [
    "inventory_lookup",
    "stock_analysis",
    "reorder_recommendation"
  ]
}
```

For:

```text id="a4t5bz"
Required capability = "delay_analysis"
```

the registry returns:

```text id="7j8q3z"
shipping-agent ✓
inventory-agent ✗
```

This is **capability-based discovery**.

---

# 4. Domain-Based Discovery

Capability alone may not be sufficient.

Suppose multiple agents support:

```text id="8s6r0y"
data_analysis
```

You might have:

```text id="e7mtv0"
Finance Analytics Agent
Manufacturing Analytics Agent
Supply Chain Analytics Agent
```

If the task is:

> "Analyze manufacturing defects."

Then the domain should be:

```text id="9q6p6h"
domain = manufacturing
```

Discovery becomes:

```text id="37v3qa"
Capability:
data_analysis

Domain:
manufacturing
```

Result:

```text id="3v8j4u"
Manufacturing Analytics Agent
```

Therefore:

> **Capabilities describe what an agent can do; domains provide business or technical context for where it does it.**

---

# 5. Availability-Based Discovery

Finding a capable agent isn't enough.

Suppose:

```text id="4m6jds"
Shipping Agent A → capable + healthy
Shipping Agent B → capable + healthy
Shipping Agent C → capable + unhealthy
```

The registry or health/discovery subsystem can filter:

```text id="h8xj6d"
status = healthy
```

Result:

```text id="3h1q7a"
A ✓
B ✓
C ✗
```

Availability may consider:

```text id="tq8m4v"
Health
Capacity
Current workload
Queue depth
Concurrency
Dependency health
Maintenance state
Region
SLA
```

So:

> **Availability determines whether an otherwise capable agent is currently eligible to receive work.**

---

# 6. Capability + Domain + Availability

These three dimensions work together.

```text id="z4v6qk"
             Task
               │
               ▼
      Required Capability
               │
               ▼
       Agent Registry
               │
      ┌────────┼─────────┐
      ▼        ▼         ▼
 Capability  Domain   Availability
   Match      Match       Match
      │        │         │
      └────────┼─────────┘
               ▼
        Candidate Agents
```

For example:

```text id="4i0u1v"
Task:
"Analyze shipment delays"

Capability:
delay_analysis

Domain:
logistics

Availability:
healthy
```

Registry:

| Agent            | Capability | Domain    | Health    | Result |
| ---------------- | ---------- | --------- | --------- | ------ |
| Shipping Agent A | Yes        | Logistics | Healthy   | ✓      |
| Finance Agent    | Yes        | Finance   | Healthy   | ✗      |
| Shipping Agent B | Yes        | Logistics | Unhealthy | ✗      |
| Logistics Agent  | Yes        | Logistics | Healthy   | ✓      |

Candidates:

```text id="q4n6c4"
Shipping Agent A
Logistics Agent
```

---

# 7. Discovery Is Usually Multi-Stage

A production discovery process shouldn't immediately select an agent.

A better pattern is:

```text id="r4b1jk"
Task
 │
 ▼
Capability Match
 │
 ▼
Domain Match
 │
 ▼
Environment Match
 │
 ▼
Version Match
 │
 ▼
Authorization
 │
 ▼
Health
 │
 ▼
Capacity
 │
 ▼
Routing Policy
 │
 ▼
Selected Agent
```

This is essentially a filtering pipeline.

---

# 8. Example Agent Registry

Imagine the registry contains:

```json id="n8q7k1"
[
  {
    "agent_id": "shipping-agent-a",
    "domain": "logistics",
    "capabilities": [
      "shipment_tracking",
      "delay_analysis"
    ],
    "status": "healthy",
    "load": 0.25,
    "version": "2.4"
  },
  {
    "agent_id": "shipping-agent-b",
    "domain": "logistics",
    "capabilities": [
      "shipment_tracking",
      "delay_analysis"
    ],
    "status": "healthy",
    "load": 0.70,
    "version": "2.3"
  },
  {
    "agent_id": "finance-agent",
    "domain": "finance",
    "capabilities": [
      "delay_analysis"
    ],
    "status": "healthy",
    "load": 0.20,
    "version": "3.1"
  }
]
```

Task:

```json id="x9k9jr"
{
  "capability": "delay_analysis",
  "domain": "logistics"
}
```

First filter:

```text id="g6x9ik"
Capability:
A ✓
B ✓
Finance ✓
```

Then domain:

```text id="r1w6w4"
Logistics:
A ✓
B ✓
Finance ✗
```

Then health:

```text id="g5kn0f"
A ✓
B ✓
```

Then routing:

```text id="8w0f4k"
A load = 25%
B load = 70%

Select A
```

---

# 9. Discovery vs Dynamic Routing

This distinction is important for your CWD architecture.

### Discovery

Answers:

> **"Which agents are candidates?"**

```text id="u4c9p4"
Registry
   │
   ▼
A
B
C
```

### Routing

Answers:

> **"Which candidate should actually receive this task?"**

```text id="7n8jjm"
A → healthy, 90% load
B → healthy, 30% load
C → unhealthy

        ↓

Select B
```

Therefore:

```text id="s4evw4"
Discovery
     ↓
Candidate Set
     ↓
Routing Policy
     ↓
Selected Agent
```

---

# 10. Agent Discovery in CWD

The CWD flow is:

```text id="42mmbv"
                    User
                     │
                     ▼
                Coordinator
                     │
                     ▼
                 Intent
                     │
                     ▼
           Required Capability
                     │
                     ▼
              Agent Registry
                     │
       ┌─────────────┼──────────────┐
       ▼             ▼              ▼
   Capability      Domain       Availability
     Match          Match           Match
       │             │              │
       └─────────────┼──────────────┘
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
               Target Agent
```

---

# 11. Agent Discovery Through the Coordinator

The Coordinator is normally the enterprise-level decision maker.

Example:

```text id="8d3d3q"
User Request
     │
     ▼
Coordinator
     │
     ▼
"Need shipment delay analysis"
     │
     ▼
Registry Query
```

Conceptually:

```python id="p1y7mq"
candidates = registry.find_agents(
    capability="delay_analysis",
    domain="logistics",
    environment="production"
)
```

Then:

```python id="4q5t3k"
eligible = policy.filter(
    caller="coordinator",
    candidates=candidates
)
```

Then:

```python id="fx2yaf"
selected = router.select(
    eligible,
    priority="high"
)
```

Finally:

```python id="t7xwzj"
a2a.send_task(
    target=selected.agent_id,
    task=task
)
```

---

# 12. Delegator Can Also Discover Agents

Discovery isn't necessarily limited to the Coordinator.

For example:

```text id="98r2az"
Coordinator
      │
      ▼
Shipping Delegator
      │
      ▼
Need:
shipment_tracking
      │
      ▼
Agent Registry
      │
      ▼
Tracking Agents
```

The Delegator might use the registry to find specialized domain agents or Workers, depending on how your CWD architecture models those execution components.

The principle remains:

```text id="5fh0td"
Required capability
        ↓
Discovery
        ↓
Eligibility
        ↓
Routing
```

---

# 13. Availability Is Dynamic

Agent availability changes continuously.

At 10:00:

```text id="v5krjr"
Agent A → healthy
Agent B → healthy
```

At 10:05:

```text id="t6d0op"
Agent A → overloaded
Agent B → healthy
```

At 10:10:

```text id="2qmgsp"
Agent A → unhealthy
Agent B → healthy
```

The routing system should adapt without changing Coordinator code.

```text id="j5x4nj"
Same capability
      │
      ▼
Different runtime candidate
```

This is the primary advantage of dynamic discovery.

---

# 14. Health and Availability Are Different

An agent can be:

```text id="5wjjc5"
Healthy
```

but still not be a good routing candidate.

For example:

```text id="h4lqj0"
Agent A
Health = Healthy
Load = 99%
Queue = 10,000
```

versus:

```text id="p9v6xb"
Agent B
Health = Healthy
Load = 20%
Queue = 100
```

Both are healthy.

But:

```text id="q3m0s9"
Agent B
```

is the better candidate.

Therefore:

> **Health answers "Can it operate?" while availability/routing considers "Should it receive this task right now?"**

---

# 15. Availability Can Include Capacity

A useful model is:

```text id="9q5kro"
Availability =
Health
+
Capacity
+
Concurrency
+
Queue Depth
+
Dependency State
+
Maintenance State
```

For example:

```text id="l0d0u2"
max_concurrency = 100
active_tasks = 95
```

The agent is technically healthy but has only:

```text id="5wx4hl"
5 available execution slots
```

The router may prefer another agent.

---

# 16. Discovery with Version Compatibility

Suppose the task requires:

```text id="6w1ghc"
capability = delay_analysis
minimum_version = 2.0
```

Registry:

```text id="9w4gqy"
Agent A → v1.8
Agent B → v2.3
Agent C → v2.5
```

Filtering:

```text id="r0yp3m"
A ✗
B ✓
C ✓
```

Then dynamic routing chooses between B and C.

This is important for enterprise upgrades.

---

# 17. Discovery with Environment

The registry should distinguish:

```text id="c70y3e"
shipping-agent-dev
shipping-agent-uat
shipping-agent-prod
```

If the Coordinator operates in production:

```text id="5a1ub0"
environment = production
```

then:

```text id="3m8rjx"
dev  ✗
uat  ✗
prod ✓
```

This prevents accidental cross-environment routing.

---

# 18. Discovery with Access Control

Now introduce security.

Suppose:

```text id="4d7l0v"
Finance Agent
```

supports:

```text id="r6b8d0"
financial_analysis
```

The Coordinator might discover it, but the caller may not have permission.

Therefore:

```text id="0e9g9q"
Discovery
   │
   ▼
Capability Match
   │
   ▼
Authorization
   │
   ├── Allowed → Continue
   │
   └── Denied → Reject
```

This is why:

> **A registry should not be treated as the authorization engine.**

---

# 19. Discovery + A2A

Once the agent has been discovered:

```text id="c6n1cq"
Agent Registry
      │
      │ Candidate
      ▼
Coordinator
      │
      │ A2A Task
      ▼
Target Agent
```

The registry answers:

```text id="u5tj0f"
WHO?
```

A2A handles:

```text id="j8c0y1"
HOW DO WE COLLABORATE?
```

So:

```text id="v5w0gr"
Registry → Discovery
A2A      → Communication
```

---

# 20. Discovery + LangGraph

LangGraph can orchestrate the discovery process.

Example:

```text id="n2a1ud"
START
  │
  ▼
Analyze Request
  │
  ▼
Determine Capability
  │
  ▼
Discover Agents
  │
  ▼
Filter Candidates
  │
  ▼
Authorize
  │
  ▼
Select Agent
  │
  ▼
Delegate
  │
  ▼
Monitor Result
```

If the selected agent fails:

```text id="fjwz1q"
Agent Failure
     │
     ▼
LangGraph
     │
     ▼
Rediscover
     │
     ▼
Select alternate agent
```

This is where centralized discovery contributes to **resilience**.

---

# 21. Example: Dynamic Failover

Initial routing:

```text id="2h0f7q"
Task
 │
 ▼
Registry
 │
 ▼
Agent A
```

Agent A fails:

```text id="l8b4yy"
Agent A
   X
```

LangGraph recovery:

```text id="36b5eq"
Failure
   │
   ▼
Rediscover
   │
   ▼
Registry
   │
   ├── Agent A → unhealthy ✗
   ├── Agent B → healthy ✓
   └── Agent C → healthy ✓
   │
   ▼
Agent B
```

No Coordinator code change is required.

---

# 22. Long-Running Async Discovery

This also works with asynchronous tasks.

```text id="v7x3la"
Coordinator
    │
    ▼
Registry Discovery
    │
    ▼
Select Agent
    │
    ▼
A2A Task
    │
    ▼
Service Bus
    │
    ▼
Target Agent
    │
    │
    │ long-running
    ▼
Result Event
    │
    ▼
Coordinator
```

The agent can remain independently deployed and scaled.

---

# 23. What Metadata Is Needed?

A useful conceptual registry record is:

```json id="3f7k4q"
{
  "agent_id": "shipping-agent",
  "domain": "logistics",

  "capabilities": [
    "shipment_tracking",
    "delay_analysis"
  ],

  "version": "2.4.1",

  "environment": "production",

  "status": "healthy",

  "capacity": {
    "max_concurrency": 100,
    "active_tasks": 25
  },

  "endpoint": {
    "protocol": "A2A"
  },

  "ownership": {
    "team": "Supply Chain AI"
  }
}
```

This metadata allows discovery and routing to be intelligent rather than simply URL-based.

---

# 24. The Discovery Algorithm

Conceptually:

```python id="mb4g2p"
def discover_agents(task):

    candidates = registry.find(
        capability=task.required_capability,
        domain=task.domain,
        environment=task.environment
    )

    candidates = [
        agent
        for agent in candidates
        if agent.status == "healthy"
    ]

    candidates = [
        agent
        for agent in candidates
        if is_version_compatible(
            agent.version,
            task.required_version
        )
    ]

    candidates = policy.filter(
        task.caller,
        candidates
    )

    return router.rank(candidates, task)
```

The result might be:

```text id="0n6a0w"
[
    shipping-agent-b,
    shipping-agent-a
]
```

The first candidate becomes the preferred route.

---

# 25. Ranking Agents

After filtering, the router can rank candidates.

Conceptually:

```text id="4m8c0v"
Score =
Capability Match
+
Health
+
Capacity
+
Latency
+
Version Compatibility
+
Priority
+
Location
+
Cost
```

For example:

```text id="8l7a8e"
Agent A → Score 72
Agent B → Score 91
Agent C → Score 40
```

Then:

```text id="8et7pc"
Selected → Agent B
```

The exact scoring function should be governed and deterministic enough to be auditable.

---

# 26. Why This Matters in Enterprise CWD

Without dynamic discovery:

```text id="1y5j5q"
Coordinator
   │
   ├── hardcoded Agent A
   ├── hardcoded Agent B
   ├── hardcoded Agent C
   └── hardcoded Agent D
```

With centralized discovery:

```text id="c7a8o4"
Coordinator
     │
     ▼
Agent Registry
     │
     ▼
Capability + Domain + Availability
     │
     ▼
Policy
     │
     ▼
Dynamic Router
     │
     ▼
Best Eligible Agent
```

This provides:

* loose coupling
* scalability
* failover
* capability-based routing
* version awareness
* environment isolation
* centralized governance
* better observability
* independent deployment

---

# 27. Complete CWD Mental Model

```text id="9r4h4w"
                         TASK
                           │
                           ▼
                    ┌─────────────┐
                    │ Coordinator │
                    └──────┬──────┘
                           │
                     What capability?
                           │
                           ▼
                  ┌─────────────────┐
                  │  Agent Registry │
                  └────────┬────────┘
                           │
             ┌─────────────┼──────────────┐
             ▼             ▼              ▼
        Capability       Domain       Availability
           Match          Match           Match
             │             │              │
             └─────────────┼──────────────┘
                           ▼
                    Candidate Agents
                           │
                           ▼
                    Version / Environment
                           │
                           ▼
                      Policy / IAM
                           │
                           ▼
                    Dynamic Routing
                           │
                           ▼
                         A2A
                           │
                           ▼
                     Target Agent
                           │
                           ▼
                      LangGraph
                           │
                     ┌─────┴─────┐
                     ▼           ▼
                  Workers       MCP
                     │           │
                     └─────┬─────┘
                           ▼
                  Enterprise Systems
```

---

# 28. Interview-Ready Answer

> **Agents discover other agents in CWD through the centralized Agent Registry rather than using hardcoded endpoints. The requesting agent first determines the capabilities and domain required by the task. It queries the registry for agents matching those capabilities and domain, then filters the candidates based on availability, health, environment, version compatibility, capacity, and authorization. A dynamic routing layer selects the best eligible agent based on runtime factors such as workload, latency, priority, and policy. The selected agent is then contacted through A2A. LangGraph can orchestrate the discovery, routing, retry, and recovery workflow. This approach allows agents to be independently deployed, scaled, upgraded, or replaced without changing the Coordinator's routing logic.**

### One-line interview answer

> **Agent discovery is capability- and domain-based lookup through the Agent Registry, followed by health, availability, authorization, and compatibility filtering and dynamic selection of the best eligible agent.**

---

# 29. Final Definition

> **Agent discovery is the runtime process through which a CWD agent identifies other registered agents capable of performing a required task by querying centralized metadata for capabilities, domains, availability, health, versions, and routing attributes, then filtering and selecting an eligible agent before establishing agent-to-agent communication through A2A.**

### Core Formula

```text id="4h4c3f"
Agent Discovery
=
Capability Match
+
Domain Match
+
Availability
+
Health
+
Version Compatibility
+
Environment
+
Authorization
```

followed by:

```text id="s8q3bm"
Eligible Agents
       ↓
Dynamic Routing
       ↓
Selected Agent
       ↓
A2A Communication
```

### The key distinction to remember

```text id="7w4s7a"
Agent Registry → "Who can do this?"

Policy / IAM    → "Who is allowed to do this?"

Router          → "Which eligible agent should do this?"

A2A             → "How do the agents communicate?"

LangGraph       → "What happens next in the workflow?"
```

**That separation is what makes enterprise multi-agent discovery scalable, governed, and resilient.**
