Yes. In the **CWD Agent Registry**, operational metadata is what allows the Coordinator and Delegators to determine not only **which agent can perform a task**, but also **whether that agent should receive the task right now**.

# Agent Health, Availability, Readiness, Version & Operational Status

## 1. Core principle

Agent Registry should maintain two different categories of information:

```text
                    Agent Registry
                         │
          ┌──────────────┴──────────────┐
          │                             │
   Static Metadata                 Runtime Metadata
          │                             │
   capabilities                  health
   owner                         readiness
   version                       availability
   domain                        workload
   endpoint                      operational status
   permissions                   capacity
```

The important distinction is:

> **Registration tells CWD what an agent is capable of; runtime status tells CWD whether that agent is currently suitable for execution.**

---

# 2. Why operational tracking is necessary

Imagine the registry contains three agents capable of `shipment_tracking`:

```text
Shipping Agent v2.1
    status = healthy
    load = 30%

Shipping Agent v2.2
    status = healthy
    load = 95%

Shipping Agent v2.3
    status = unhealthy
```

Capability discovery alone gives:

```text
All 3 agents can perform shipment_tracking
```

But runtime routing should select:

```text
Shipping Agent v2.1
```

because it is:

```text
healthy
+ ready
+ available
+ compatible
+ sufficient capacity
```

This is the foundation of **health-aware and availability-aware routing**.

---

# 3. Health vs readiness vs availability

These terms should not be treated as synonyms.

| Attribute              | Meaning                                                      |
| ---------------------- | ------------------------------------------------------------ |
| **Health**             | Is the agent functioning correctly?                          |
| **Readiness**          | Is the agent prepared to accept work?                        |
| **Availability**       | Can the agent accept work now under current capacity/policy? |
| **Version**            | Which implementation/version is running?                     |
| **Operational status** | What lifecycle state is the agent currently in?              |

A useful mental model:

```text
Health
  ↓
"Am I functioning?"

Readiness
  ↓
"Can I safely start work?"

Availability
  ↓
"Can I accept this work right now?"

Version
  ↓
"Which implementation should execute?"

Operational Status
  ↓
"What lifecycle state am I in?"
```

---

# 4. Health

Health indicates whether the agent and its critical dependencies are functioning.

For example:

```json id="h1lth01"
{
  "agent_id": "shipping-agent",
  "health": {
    "status": "healthy",
    "last_checked": "2026-09-06T16:30:00Z",
    "health_check": "passed"
  }
}
```

Health checks might verify:

```text
Agent process
    ↓
LLM availability
    ↓
Database connectivity
    ↓
MCP connectivity
    ↓
Required API connectivity
    ↓
Critical dependency health
```

For example:

```text
Shipping Agent
   │
   ├── Agent runtime       ✅
   ├── LLM                 ✅
   ├── Redis               ✅
   ├── Shipping MCP        ✅
   └── Shipping API        ❌
```

The overall agent may therefore be considered:

```text
DEGRADED
```

rather than healthy.

---

# 5. Liveness vs readiness

This distinction is extremely important in production Kubernetes/Azure environments.

### Liveness

Answers:

> **"Is the process alive?"**

```text
Process running?
      ↓
YES
```

An agent can be alive but unable to process tasks.

### Readiness

Answers:

> **"Can this agent safely receive work?"**

Example:

```text
Agent process       ✅
LLM                 ✅
MCP                 ❌
Database            ❌

Readiness:
NOT READY
```

Therefore:

```text
Alive ≠ Ready
```

This prevents traffic from being routed to an agent that is running but not operational.

---

# 6. Availability

Availability is more than health.

Consider:

```text
Agent:
    healthy = true
    ready = true
    concurrency_limit = 10
    active_tasks = 10
```

The agent is:

```text
Healthy ✅
Ready   technically ✅
Available for another task ❌
```

Therefore the registry or routing layer should track capacity-related information.

For example:

```json id="avl01"
{
  "availability": {
    "status": "available",
    "max_concurrency": 10,
    "active_tasks": 7,
    "available_slots": 3,
    "queue_depth": 2
  }
}
```

---

# 7. Version tracking

Every registered agent should have a version.

```json id="ver01"
{
  "agent_id": "shipping-agent",
  "version": "2.4.1"
}
```

Version information is important for:

* compatibility
* controlled rollout
* rollback
* A/B testing
* blue/green deployment
* canary deployment
* capability changes
* API compatibility
* prompt/model changes
* security patches

For example:

```text
shipping-agent
   │
   ├── v2.2.0
   ├── v2.3.0
   └── v2.4.1
```

The Coordinator may require:

```text
required_version >= 2.4
```

or:

```text
capability = shipment_tracking
protocol_version = compatible
```

---

# 8. Version is not capability

An important distinction:

```text
Version
    ↓
Which implementation?

Capability
    ↓
What can it do?
```

For example:

```text
Shipping Agent v2.4.1
    capabilities:
        shipment_tracking
        delay_analysis
        rerouting
```

A newer version doesn't automatically mean it should be selected.

Routing still evaluates:

```text
Capability
+
Compatibility
+
Health
+
Readiness
+
Availability
+
Policy
```

---

# 9. Operational status

Operational status represents the lifecycle state of the agent.

A useful state model is:

```text
REGISTERED
    ↓
STARTING
    ↓
READY
    ↓
ACTIVE
    ↓
DEGRADED
    ↓
DRAINING
    ↓
OFFLINE
```

You may also have:

```text
MAINTENANCE
DISABLED
SUSPENDED
FAILED
DECOMMISSIONED
```

Example:

```json id="ops01"
{
  "operational_status": "active"
}
```

---

# 10. Meaning of each status

### REGISTERED

Agent exists in the registry but may not yet be running.

```text
Registry:
    Agent exists ✅
Runtime:
    Not necessarily active
```

### STARTING

Agent runtime is initializing.

```text
Loading model
Connecting dependencies
Initializing MCP
Loading configuration
```

### READY

Agent has passed readiness checks and can accept work.

### ACTIVE

Agent is actively processing work.

### DEGRADED

Agent is functioning but some capabilities/dependencies are impaired.

Example:

```text
Tracking     ✅
Delay        ✅
Rerouting    ❌
```

### DRAINING

Agent is being removed from service.

New tasks:

```text
REJECT / REDIRECT
```

Existing tasks:

```text
COMPLETE
```

This is important during deployments.

### OFFLINE

Agent cannot currently receive work.

### MAINTENANCE

Intentionally unavailable.

### DISABLED

Administrative/security control prevents execution.

---

# 11. Registry record

A production-style Agent Registry record might look like:

```json id="agent01"
{
  "agent_id": "shipping-agent",

  "name": "Shipping Operations Agent",

  "domain": "logistics",

  "version": "2.4.1",

  "environment": "production",

  "endpoint": "a2a://shipping-agent",

  "capabilities": [
    "shipment_tracking",
    "delay_analysis",
    "rerouting"
  ],

  "health": {
    "status": "healthy",
    "last_checked": "2026-09-06T16:30:00Z"
  },

  "readiness": {
    "status": "ready",
    "last_checked": "2026-09-06T16:30:05Z"
  },

  "availability": {
    "status": "available",
    "max_concurrency": 20,
    "active_tasks": 8,
    "queue_depth": 2
  },

  "operational_status": "active",

  "owner": "Supply Chain AI"
}
```

---

# 12. How health information reaches the registry

There are several possible patterns.

### Pattern 1 — Agent heartbeat

The agent periodically sends a heartbeat.

```text
Shipping Agent
     │
     │ heartbeat
     ▼
Agent Registry
```

For example:

```json id="hb001"
{
  "agent_id": "shipping-agent",
  "status": "healthy",
  "timestamp": "2026-09-06T16:30:00Z"
}
```

If heartbeats stop:

```text
heartbeat timeout
       ↓
UNKNOWN
       ↓
UNHEALTHY / OFFLINE
```

---

# 13. Pattern 2 — Health endpoint

The runtime exposes:

```text
/health
/readiness
```

For example:

```text
GET /health

→ 200 OK
```

and:

```text
GET /readiness

→ 200 OK
```

The infrastructure or service-discovery layer can monitor these endpoints and update operational state.

---

# 14. Pattern 3 — Observability-driven status

Operational platforms can derive status from:

```text
Application Insights
Log Analytics
Prometheus
OpenTelemetry
Azure Monitor
```

For example:

```text
Error rate ↑
Latency ↑
Dependency failures ↑
Queue depth ↑
        ↓
Agent degraded
```

The registry can consume health signals or routing can consult an operational-health service.

---

# 15. Health should include dependency health

An agent may itself be healthy while a critical dependency is unavailable.

Example:

```text
Shipping Agent
      │
      ├── Runtime       ✅
      ├── LLM           ✅
      ├── RAG           ✅
      ├── MCP           ❌
      └── Shipping API  ❌
```

Therefore:

```text
Agent Health
=
Runtime Health
+
Dependency Health
+
Capability Health
```

You can even track health per capability:

```json id="caphealth"
{
  "capability_health": {
    "shipment_tracking": "healthy",
    "delay_analysis": "healthy",
    "rerouting": "degraded"
  }
}
```

This enables more precise routing.

---

# 16. Capability-level availability

This is particularly useful for CWD.

Suppose:

```text
Shipping Agent
```

supports:

```text
shipment_tracking
delay_analysis
rerouting
```

But the routing API is down.

Then:

```text
shipment_tracking → AVAILABLE
delay_analysis     → AVAILABLE
rerouting          → UNAVAILABLE
```

The entire agent does **not** need to be removed from the registry.

Instead:

```text
Agent = partially available
```

This is much better than simple:

```text
UP / DOWN
```

---

# 17. Dynamic agent selection

The Coordinator/Delegator can query the registry:

```python id="route01"
def discover_and_route(task):

    candidates = registry.find(
        capability=task.required_capability,
        domain=task.domain
    )

    candidates = [
        agent for agent in candidates
        if agent.health == "healthy"
    ]

    candidates = [
        agent for agent in candidates
        if agent.readiness == "ready"
    ]

    candidates = [
        agent for agent in candidates
        if agent.availability == "available"
    ]

    candidates = [
        agent for agent in candidates
        if version_compatible(
            agent.version,
            task.required_version
        )
    ]

    return router.select(candidates, task)
```

Conceptually:

```text
Required Capability
       ↓
Agent Registry
       ↓
Capability Filter
       ↓
Domain Filter
       ↓
Authorization Filter
       ↓
Health Filter
       ↓
Readiness Filter
       ↓
Availability Filter
       ↓
Version Filter
       ↓
Routing Policy
       ↓
Selected Agent
```

---

# 18. Health-aware routing

Suppose:

```text
             Shipment Tracking
                    │
       ┌────────────┼────────────┐
       ▼            ▼            ▼
    Agent A       Agent B      Agent C
    Healthy       Healthy      Failed
    Load 30%      Load 90%     Load 0%
```

A basic router should select:

```text
Agent A
```

rather than simply selecting the first registered agent.

The routing decision can consider:

```text
Score =
Capability
+
Health
+
Readiness
+
Capacity
+
Latency
+
Version
+
Priority
+
Policy
```

The exact scoring model is an architectural choice.

---

# 19. Failure and automatic failover

Suppose the Coordinator selects:

```text
Shipping Agent A
```

but execution fails because the agent becomes unavailable.

LangGraph can route to recovery:

```text
Execute Agent A
       ↓
Timeout
       ↓
Classify failure
       ↓
Rediscover agents
       ↓
Agent Registry
       ↓
Agent B
       ↓
A2A task
```

So:

```text
Agent A failure
      ↓
Registry health updated
      ↓
Agent A excluded
      ↓
Agent B selected
```

This provides **dynamic failover**.

---

# 20. Draining during deployment

Version changes are another important use case.

Suppose:

```text
v2.4.1 → v2.5.0
```

Before shutting down v2.4.1:

```text
v2.4.1
   ↓
DRAINING
```

The router stops assigning new work:

```text
New requests
     ↓
v2.5.0
```

Existing requests:

```text
v2.4.1
     ↓
complete
```

Then:

```text
v2.4.1 → OFFLINE
```

This prevents tasks from being abruptly terminated during deployments.

---

# 21. Canary deployment

The registry can also support version-aware routing.

```text
Shipping Agent

v2.4.1 → 90%
v2.5.0 → 10%
```

Then:

```text
Coordinator
     ↓
Registry
     ↓
Routing policy
     ↓
90% → v2.4.1
10% → v2.5.0
```

If v2.5.0 produces unacceptable errors:

```text
v2.5.0
   ↓
DEGRADED
   ↓
routing weight = 0
```

This enables controlled rollout.

---

# 22. Version compatibility

Imagine:

```text
Coordinator requires:

A2A protocol >= 1.0

Capability:
shipment_tracking
```

Registry contains:

```text
Agent A
version = 2.4
A2A = 1.0
tracking = YES

Agent B
version = 1.5
A2A = 0.8
tracking = YES
```

Agent B should be excluded:

```text
Capability       ✅
Version          ❌
Protocol         ❌

→ Do not route
```

---

# 23. Health data should have timestamps

Never treat health information as permanently valid.

Bad:

```json id="stale1"
{
  "health": "healthy"
}
```

Better:

```json id="fresh1"
{
  "health": "healthy",
  "last_checked": "2026-09-06T16:30:00Z"
}
```

Because:

```text
Healthy at 10:00
```

does not necessarily mean:

```text
Healthy at 16:00
```

You can define a health TTL.

For example:

```text
last_checked = 5 minutes ago
```

might result in:

```text
UNKNOWN
```

depending on your SLA.

---

# 24. UNKNOWN is useful

Do not force the registry into:

```text
HEALTHY / UNHEALTHY
```

A better state model is:

```text
HEALTHY
DEGRADED
UNHEALTHY
UNKNOWN
```

For example:

```text
Heartbeat missing
      ↓
UNKNOWN
      ↓
Do not route new critical work
```

This is safer than assuming:

```text
No health signal = healthy
```

---

# 25. CWD + Agent Registry + LangGraph

This is where the pieces come together.

```text
Coordinator LangGraph
        │
        │ Required capability
        ▼
   Agent Registry
        │
        ├── Capability
        ├── Health
        ├── Readiness
        ├── Availability
        ├── Version
        ├── Policy
        └── Environment
        │
        ▼
   Eligible Agents
        │
        ▼
   Dynamic Router
        │
        ▼
   A2A
        │
        ▼
   Selected Agent
```

If execution fails:

```text
Selected Agent
      ↓
Failure
      ↓
LangGraph Recovery Node
      ↓
Rediscovery
      ↓
Agent Registry
      ↓
Alternate Agent
```

So the registry provides the **runtime information**, while LangGraph decides **what to do with that information**.

---

# 26. Registry should not become the monitoring system

Another important architecture distinction:

```text
Agent Registry
    ≠
Full observability platform
```

The registry should maintain **routing-relevant operational state**.

Detailed telemetry belongs in:

```text
Azure Monitor
Application Insights
Log Analytics
OpenTelemetry
Metrics platform
Tracing platform
```

For example:

```text
Observability
    ↓
1000 metrics
10,000 logs
distributed traces
latency histograms
error rates

Agent Registry
    ↓
healthy
ready
available
load
version
operational status
last heartbeat
```

This prevents the registry from becoming an enormous telemetry database.

---

# 27. Example complete registry model

```json id="complete01"
{
  "agent_id": "shipping-agent",
  "domain": "logistics",

  "version": {
    "application": "2.4.1",
    "protocol": "1.0",
    "api_contract": "v3"
  },

  "capabilities": [
    "shipment_tracking",
    "delay_analysis",
    "rerouting"
  ],

  "health": {
    "status": "healthy",
    "last_checked": "2026-09-06T16:30:00Z"
  },

  "readiness": {
    "status": "ready",
    "last_checked": "2026-09-06T16:30:05Z"
  },

  "availability": {
    "status": "available",
    "max_concurrency": 20,
    "active_tasks": 8,
    "queue_depth": 2
  },

  "operational_status": "active",

  "capability_status": {
    "shipment_tracking": "available",
    "delay_analysis": "available",
    "rerouting": "degraded"
  },

  "environment": "production",

  "owner": "Supply Chain AI",

  "last_heartbeat": "2026-09-06T16:30:10Z"
}
```

---

# 28. What the Coordinator actually asks

The Coordinator should not simply ask:

```text
"Who can do shipment tracking?"
```

It should effectively ask:

```text
"Which authorized agent can perform shipment tracking,
in this environment,
for this data classification,
with a compatible version,
that is healthy,
ready,
available,
and has sufficient capacity?"
```

That is **production-grade agent discovery and routing**.

---

# 29. Responsibility separation

| Component              | Responsibility                                          |
| ---------------------- | ------------------------------------------------------- |
| Agent Registry         | Store agent metadata and routing-relevant runtime state |
| Agent                  | Report heartbeat/status                                 |
| Runtime/Kubernetes/ACA | Process lifecycle and health probes                     |
| Observability          | Detailed metrics/logs/traces                            |
| Coordinator            | Enterprise-level routing                                |
| Delegator              | Domain-level routing                                    |
| LangGraph              | State, conditional routing, recovery                    |
| A2A                    | Agent communication                                     |
| Service Bus            | Async transport                                         |
| Policy/IAM             | Authorization                                           |
| Router                 | Candidate ranking/selection                             |

---

# 30. Key architectural relationship

Remember this:

```text
Agent Registry
       │
       ├── WHAT can the agent do?
       ├── WHO owns it?
       ├── WHICH version?
       ├── WHERE is it deployed?
       ├── IS it healthy?
       ├── IS it ready?
       ├── IS it available?
       └── WHAT is its operational state?
                │
                ▼
          Routing Decision
                │
                ▼
             A2A
                │
                ▼
          Selected Agent
```

## Interview-ready answer

> **In CWD, the Agent Registry tracks both static agent metadata and runtime operational metadata so that agent discovery becomes health- and availability-aware. Each registered agent has information such as version, capabilities, environment, endpoint, ownership, health, readiness, availability, heartbeat, capacity, and operational status. Health indicates whether the agent and its critical dependencies are functioning, readiness indicates whether it is prepared to accept work, and availability considers whether it currently has capacity to process a new task. Version information supports compatibility, controlled rollout, canary deployment, and rollback, while operational states such as starting, ready, active, degraded, draining, maintenance, and offline control the agent lifecycle. At runtime, the Coordinator or Delegator queries the registry, filters candidates based on capability, authorization, health, readiness, availability, version, environment, and policy, and then dynamically routes the task through A2A. If the selected agent fails, LangGraph can trigger recovery and rediscovery, allowing CWD to select another eligible agent. Detailed telemetry remains in the observability platform, while the registry maintains the operational information required for discovery and routing.**

## Final definition

**Agent operational tracking** is the process of maintaining current health, readiness, availability, version, capacity, heartbeat, and lifecycle status for registered agents so that CWD can dynamically discover, route, fail over, deploy, and recover workloads using only agents that are operationally suitable.

### Core formula

```text
Agent Runtime Management
=
Health
+
Readiness
+
Availability
+
Capacity
+
Version
+
Operational Status
+
Heartbeat
+
Capability Health
```

### The mental model

```text
Capability → "Can it do the task?"
Health     → "Is it functioning?"
Readiness  → "Can it safely accept work?"
Availability → "Can it accept work now?"
Version    → "Is it compatible?"
Status     → "What lifecycle state is it in?"
Policy     → "Is it allowed?"
Routing    → "Which eligible agent should execute?"
```

This is what turns the **Agent Registry from a static directory into a runtime-aware control-plane component for CWD**.
