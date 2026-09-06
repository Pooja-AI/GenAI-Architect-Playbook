# How a Delegator Selects the Most Appropriate Worker

In the CWD architecture, **Worker selection is a governed capability-matching process**, not simply a lookup by Worker name.

The Delegator receives a domain task, identifies the required capability, discovers eligible Workers, evaluates their capabilities and runtime conditions, and selects the Worker that can perform the task **correctly, securely, and efficiently**.

The overall decision is:

```text
Domain Task
     |
     v
Required Capabilities
     |
     v
Worker Discovery
     |
     v
Eligibility Filtering
     |
     +-- Domain Ownership
     +-- Capability
     +-- Tool Access
     +-- Permissions
     +-- Task Requirements
     |
     v
Runtime Evaluation
     |
     +-- Availability
     +-- Health
     +-- Workload
     |
     v
Policy / Routing Decision
     |
     v
Best Eligible Worker
     |
     v
Worker Execution
```

---

# 1. Start With the Task Requirements

The Delegator first understands exactly what the task requires.

For example:

> "Retrieve ABC Corp's open opportunities from Salesforce."

The task requirements may become:

```text
Domain:
Sales

Capability:
opportunity_retrieval

System:
Salesforce

Operation:
read

Input:
customer_id

Required Output:
opportunity_list
```

The Delegator should establish these requirements **before selecting a Worker**.

---

# 2. Identify the Required Capability

The Delegator maps the task to one or more capabilities.

For example:

```text
Task:
Retrieve customer opportunities

        ↓

Required Capability:
opportunity_retrieval
```

Another task might require:

```text
Task:
Calculate customer revenue

        ↓

Required Capability:
revenue_analysis
```

The Worker is selected based on its **declared capability**, rather than its name.

---

# 3. Check Domain Ownership

The Delegator first establishes whether a Worker belongs to the appropriate domain.

For example:

```text
Sales Delegator
      |
      +-- Sales Opportunity Worker       ✓
      +-- Sales Revenue Worker           ✓
      +-- Finance Revenue Worker         ?
      +-- HR Employee Worker             ✗
```

A Worker may technically have a capability that looks relevant, but the Delegator should respect **domain ownership**.

For example:

```text
Capability:
revenue_analysis

Possible Workers:
    Sales Revenue Worker
    Finance Revenue Worker
```

The appropriate Worker depends on the business context.

```text
Sales customer revenue
        ↓
Sales Revenue Worker

Corporate financial reporting
        ↓
Finance Revenue Worker
```

Domain ownership prevents accidental cross-domain routing.

---

# 4. Discover Workers Through the Agent Registry

The Delegator should use the **Agent Registry** as the authoritative source for available Worker metadata.

Conceptually:

```text
                 Agent Registry
                       |
        +--------------+--------------+
        |              |              |
        v              v              v
Worker A           Worker B        Worker C
Sales              Sales           Finance
```

Worker metadata can include:

```json id="6z6j80"
{
  "agent_id": "sales-opportunity-worker",
  "domain": "sales",
  "capabilities": [
    "opportunity_retrieval",
    "pipeline_analysis"
  ],
  "tools": [
    "salesforce_opportunity_api"
  ],
  "status": "healthy",
  "version": "2.1"
}
```

The Delegator uses this information to create the candidate Worker set.

---

# 5. Filter by Capability

The first major filtering stage is capability matching.

```text
Required:
opportunity_retrieval

Candidate Workers:

Worker A
  capability = opportunity_retrieval ✓

Worker B
  capability = revenue_analysis ✗

Worker C
  capability = customer_profile ✗
```

Only Workers that actually advertise the required capability should remain candidates.

```text
Task
  |
  v
Required Capability
  |
  v
Agent Registry
  |
  v
Capability-Matched Workers
```

---

# 6. Check Tool Access

Capability matching is still not enough.

The Worker must have access to the tools or enterprise systems required to perform the capability.

For example:

```text
Task:
Retrieve Salesforce Opportunities

Required:
Salesforce Opportunity API
```

Candidate evaluation:

```text
Worker A
    |
    +-- opportunity_retrieval ✓
    +-- Salesforce access ✓
    +-- Required API permission ✓
    |
    v
Eligible
```

Another Worker:

```text
Worker B
    |
    +-- opportunity_retrieval ✓
    +-- Salesforce access ✗
    |
    v
Not eligible
```

Therefore:

> **A Worker should only be selected if it has both the required capability and the required execution tools/access.**

---

# 7. Check Permissions

The Delegator also verifies that execution is authorized.

The decision can involve:

```text
User Identity
      |
      v
User Entitlements
      |
      v
Domain Policy
      |
      v
Worker Permissions
      |
      v
Tool Permissions
      |
      v
Data Access Policy
```

For example:

```text
User
 |
 +-- Sales role ✓
 +-- Customer ABC access ✓
 +-- Salesforce opportunity access ✓
 |
 v
Worker can execute
```

If authorization fails:

```text
Authorization = DENY
        |
        v
Worker is NOT selected
```

The Delegator should never select a Worker simply because it technically supports the capability.

---

# 8. Check Task-Specific Requirements

Different Workers may provide similar capabilities but support different requirements.

For example:

```text
Capability:
customer_revenue

Task Requirements:
    Region = North America
    Period = Q2
    Currency = USD
    Source = Snowflake
```

Candidate Workers:

```text
Worker A
  ✓ Revenue
  ✓ North America
  ✓ Q2
  ✓ USD
  ✓ Snowflake

Worker B
  ✓ Revenue
  ✗ North America
  ✓ Q2
  ✓ USD
  ✓ Snowflake
```

Worker A is the better match.

The Delegator therefore evaluates **task-to-capability compatibility**, not merely capability existence.

---

# 9. Check Worker Availability

A Worker may have the correct capability but currently be unavailable.

For example:

```text
Worker A
Capability = correct
Health = healthy
Availability = unavailable

Worker B
Capability = correct
Health = healthy
Availability = available
```

The Delegator should select Worker B.

Availability can reflect:

* Worker enabled/disabled state
* Maintenance
* Deployment status
* Capacity limits
* Routing configuration
* Service availability

---

# 10. Check Worker Health

The Delegator should consider runtime health.

For example:

```text
Worker A → Healthy
Worker B → Degraded
Worker C → Unhealthy
```

Even if all three support the capability:

```text
Worker A → Eligible
Worker B → Potentially eligible
Worker C → Exclude
```

Health information can come from:

* Agent Registry
* Health endpoints
* Runtime telemetry
* Service health information
* Recent execution history

This prevents routing new work to unhealthy Workers.

---

# 11. Check Current Workload

Suppose two Workers are equally capable:

```text
Worker A
    Active tasks = 2

Worker B
    Active tasks = 25
```

The Delegator can prefer Worker A if routing policy permits.

Conceptually:

```text
Capability Match
       +
Health
       +
Availability
       +
Current Workload
       |
       v
Worker Selection
```

This helps prevent a single Worker instance from becoming a bottleneck.

---

# 12. Check Worker Version

Worker versions can also influence routing.

For example:

```text
Opportunity Worker v1
Opportunity Worker v2
```

If the routing policy requires v2:

```text
Required Version = >= 2.0

v1 → Exclude
v2 → Eligible
```

This supports controlled rollout and version management.

It also enables scenarios such as:

```text
Production
    |
    +-- Worker v1
    +-- Worker v2

Routing Policy
    |
    v
90% → v1
10% → v2
```

where such controlled routing is explicitly configured.

---

# 13. Build the Eligible Worker Set

After filtering, the Delegator has a set of eligible Workers.

For example:

```text
Required Capability:
opportunity_retrieval

                Agent Registry
                      |
       +--------------+--------------+
       |              |              |
       v              v              v
 Worker A          Worker B        Worker C
 Sales             Sales           Finance
 ✓ Capability      ✓ Capability    ✓ Capability
 ✓ Salesforce      ✗ Salesforce    ✓ Salesforce
 ✓ Healthy         ✓ Healthy       ✓ Healthy
 ✓ Available       ✓ Available     ✓ Available
       |              |              |
       +--------------+              |
              |                      |
              v                      |
        Eligible Workers             |
              |                      |
              +----------------------+
                       |
                       v
                Selection Policy
```

Only eligible Workers participate in the final selection.

---

# 14. Rank Eligible Workers

If multiple Workers are eligible, the Delegator can apply a routing policy or scoring mechanism.

Conceptually:

```text
Worker Score =
    Capability Match
  + Domain Match
  + Tool Compatibility
  + Permission Compatibility
  + Health
  + Availability
  + Workload
  + Task Compatibility
  + Routing Priority
```

For example:

| Factor       | Worker A | Worker B | Worker C |
| ------------ | -------: | -------: | -------: |
| Capability   |        ✓ |        ✓ |        ✓ |
| Domain       |        ✓ |        ✓ |        ✗ |
| Tool Access  |        ✓ |        ✓ |        ✓ |
| Permission   |        ✓ |        ✓ |        ✓ |
| Health       |     High |     High |   Medium |
| Availability |        ✓ |        ✓ |        ✓ |
| Workload     |      Low |     High |      Low |
| Task Fit     |     High |   Medium |      Low |
| Result       | **Best** | Eligible |   Reject |

The exact scoring mechanism should be defined by CWD routing policy rather than being arbitrarily generated by the LLM.

---

# 15. Capability Matching vs Worker Selection

These are two different decisions.

### Capability Matching

Answers:

> **"Which Workers can perform this operation?"**

```text
Task
 ↓
Capability
 ↓
Candidate Workers
```

### Worker Selection

Answers:

> **"Which eligible Worker should perform it now?"**

```text
Candidate Workers
       |
       +-- Permissions
       +-- Tool access
       +-- Health
       +-- Availability
       +-- Workload
       +-- Task fit
       +-- Routing policy
       |
       v
Selected Worker
```

This separation is important for scalable CWD routing.

---

# 16. Example: Customer Briefing

Suppose the Sales Delegator receives:

> "Create a customer briefing for ABC Corp."

It determines:

```text
Required Capabilities:

customer_profile
revenue_analysis
opportunity_analysis
interaction_history
```

Worker discovery:

```text
Customer Profile
       ↓
Customer Profile Worker

Revenue Analysis
       ↓
Revenue Worker

Opportunity Analysis
       ↓
Opportunity Worker

Interaction History
       ↓
Interaction Worker
```

But the Delegator still evaluates each Worker.

Example:

```text
Revenue Worker A
    Capability       ✓
    Domain           ✓
    Snowflake access ✓
    Permission       ✓
    Health           ✓
    Availability     ✓
    Workload         Low

Revenue Worker B
    Capability       ✓
    Domain           ✓
    Snowflake access ✓
    Permission       ✓
    Health           ✓
    Availability     ✓
    Workload         High
```

The Delegator selects:

```text
Revenue Worker A
```

because it is an equally capable but less-loaded eligible Worker.

---

# 17. Multi-Worker Selection

A single domain task can require multiple Workers.

For example:

```text
Sales Delegator
       |
       +-- Customer Profile Worker
       |
       +-- Opportunity Worker
       |
       +-- Revenue Worker
       |
       +-- Interaction Worker
```

The Delegator performs Worker selection **independently for each atomic task**.

```text
Task 1 → Best Customer Worker
Task 2 → Best Opportunity Worker
Task 3 → Best Revenue Worker
Task 4 → Best Interaction Worker
```

This creates the final domain execution plan.

---

# 18. Worker Selection Is Dynamic

Worker selection should not necessarily be permanently fixed.

Consider:

```text
10:00 AM
Revenue Worker A → Healthy
Revenue Worker B → Healthy

Selected:
Worker A
```

Later:

```text
2:00 PM
Revenue Worker A → High workload
Revenue Worker B → Low workload
```

The Delegator can select:

```text
Worker B
```

provided that policy and capability requirements remain satisfied.

This allows the CWD platform to adapt to runtime conditions.

---

# 19. Worker Selection and Failure Handling

Worker selection also supports fallback.

Suppose:

```text
Primary Worker
    |
    v
Unavailable
```

The Delegator can query eligible alternatives:

```text
Agent Registry
      |
      +-- Primary Worker
      +-- Secondary Worker
      +-- Fallback Worker
```

Then:

```text
Primary
   |
Failure
   |
   v
Re-evaluate Eligible Workers
   |
   v
Secondary Worker
```

The Delegator should not blindly switch to any Worker.

The fallback Worker must still satisfy:

```text
Capability
Domain
Permission
Tool Access
Policy
Health
Availability
Task Requirements
```

---

# 20. Role of the LLM in Worker Selection

The Delegator's LLM can help interpret the task and recommend capabilities.

For example:

```text
User Request
      |
      v
Delegator LLM
      |
      v
Required Capability:
opportunity_analysis
```

But the LLM should not independently choose an arbitrary Worker endpoint.

The controlled process is:

```text
LLM
  |
  | Recommend capability
  v
Delegator
  |
  | Query Registry
  v
Candidate Workers
  |
  | Policy / Authorization / Health
  v
Selected Worker
```

The principle is:

> **LLM proposes; Delegator validates and controls.**

---

# 21. Worker Selection Decision Flow

The complete decision process is:

```text
                Domain Task
                     |
                     v
          Identify Task Requirements
                     |
                     v
           Identify Capabilities
                     |
                     v
              Agent Registry
                     |
                     v
             Candidate Workers
                     |
                     v
              Domain Ownership
                     |
                  Match?
                /       \
              No         Yes
              |           |
           Reject         v
                    Capability Match
                           |
                           v
                     Tool Access
                           |
                           v
                     Permissions
                           |
                           v
                    Task Compatibility
                           |
                           v
                       Health
                           |
                           v
                    Availability
                           |
                           v
                       Workload
                           |
                           v
                   Routing Policy
                           |
                           v
                    Best Worker
                           |
                           v
                       Execute
```

---

# 22. Example Worker Selection Algorithm

Conceptually, the Delegator can implement the decision as:

```python id="g8o3hd"
def select_worker(task, workers, user_context):

    candidates = []

    for worker in workers:

        # 1. Domain ownership
        if worker.domain != task.domain:
            continue

        # 2. Capability
        if task.capability not in worker.capabilities:
            continue

        # 3. Required tools
        if not task.required_tools.issubset(worker.tools):
            continue

        # 4. Authorization
        if not worker.is_authorized(user_context, task):
            continue

        # 5. Availability
        if not worker.available:
            continue

        # 6. Health
        if worker.health not in ["healthy", "degraded"]:
            continue

        # 7. Task requirements
        if not worker.supports(task.requirements):
            continue

        candidates.append(worker)

    if not candidates:
        raise RuntimeError(
            "No eligible Worker found"
        )

    # Routing policy can consider workload,
    # priority, latency, version, etc.
    return min(
        candidates,
        key=lambda worker: worker.current_workload
    )
```

This is a simplified reference implementation. In the production CWD architecture, these decisions should be integrated with the actual **Agent Registry, authorization/policy services, runtime health signals, and routing policies**.

---

# 23. Where Each CWD Component Fits

| CWD Component                    | Worker Selection Responsibility                          |
| -------------------------------- | -------------------------------------------------------- |
| **Coordinator**                  | Selects the appropriate Delegator/domain                 |
| **Delegator**                    | Selects Workers within the domain                        |
| **Agent Registry**               | Provides Worker metadata/capabilities/endpoints          |
| **Policy Service**               | Determines whether execution is permitted                |
| **Entra ID / RBAC**              | Provides identity and authorization context              |
| **Key Vault / Managed Identity** | Supports secure access to protected resources            |
| **LangGraph**                    | Manages workflow state and execution transitions         |
| **A2A**                          | Communicates between Coordinator, Delegator, and Workers |
| **MCP / Tools**                  | Allows Workers to access enterprise capabilities         |
| **Observability**                | Provides health/runtime/workload signals                 |

---

# 24. Complete CWD Routing Hierarchy

The complete routing model becomes:

```text
                         USER
                           |
                           v
                    +-------------+
                    | Coordinator |
                    +-------------+
                           |
                  Business Intent
                           |
                           v
                    Business Domain
                           |
                           v
                    +-------------+
                    |  Delegator  |
                    +-------------+
                           |
                  Domain Objective
                           |
                           v
                  Required Capability
                           |
                           v
                    Agent Registry
                           |
                           v
                  Candidate Workers
                           |
             +-------------+-------------+
             |             |             |
             v             v             v
          Worker A      Worker B      Worker C
             |             |             |
             +-------------+-------------+
                           |
                    Eligibility Filter
                           |
        +------------------+------------------+
        |         |          |        |       |
      Domain   Capability   Tools  Permission Health
        |         |          |        |       |
        +------------------+------------------+
                           |
                    Runtime Evaluation
                           |
                  +--------+--------+
                  |                 |
             Availability       Workload
                  |                 |
                  +--------+--------+
                           |
                           v
                    Routing Policy
                           |
                           v
                  Selected Worker
                           |
                           v
                    Worker Execution
```

# 25. The Key Architectural Principle

Worker selection is a **two-stage decision**:

```text
Stage 1 — Eligibility

"Can this Worker perform the task?"

        ↓

Stage 2 — Selection

"Which eligible Worker is the best choice right now?"
```

Eligibility considers:

```text
Domain
Capability
Tool Access
Permissions
Task Requirements
```

Selection considers:

```text
Health
Availability
Workload
Priority
Version
Routing Policy
```

This separation makes Worker routing predictable, secure, and scalable.

# Final Definition

> **The Delegator selects the most appropriate Worker by first translating the domain task into required capabilities and task constraints, discovering candidate Workers through the Agent Registry, filtering them based on domain ownership, capability, tool access, permissions, and task requirements, and then evaluating runtime factors such as health, availability, workload, version, and routing policy. The selected Worker is the best eligible Worker that can execute the task securely and efficiently.**

The complete decision can be remembered as:

```text id="j1l3y9"
Task Requirements
       +
Domain Ownership
       +
Capability
       +
Tool Access
       +
Permissions
       +
Task Fit
       +
Health
       +
Availability
       +
Workload
       +
Routing Policy
       ↓
Most Appropriate Worker
```

And the CWD responsibility boundary is:

```text
Coordinator
    ↓
Selects Delegator

Delegator
    ↓
Selects Worker

Worker
    ↓
Executes Capability

MCP / Tools
    ↓
Access Enterprise System
```

**Therefore, the Delegator is not merely routing to "a Worker that can do the job"; it is making a governed, capability-aware, security-aware, and runtime-aware decision about which Worker should execute the task.**
