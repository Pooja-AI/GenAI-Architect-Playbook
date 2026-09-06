# How Delegators Identify the Domain and Route Tasks to the Correct Workers

In the CWD architecture, the **Delegator is responsible for domain-level routing**.

The Coordinator has already determined the overall business intent and selected the appropriate Delegator. Once the task reaches the Delegator, the Delegator determines:

1. **What business/technical capability is required?**
2. **Which domain-specific workflow should handle it?**
3. **What subtasks are required?**
4. **Which Worker has the required capability?**
5. **How should the Workers execute the task?**

The important principle is:

> **Coordinator selects the domain-level Delegator; Delegator selects the capability and Worker agents within that domain.**

---

# 1. Where Domain Routing Happens

The routing hierarchy in CWD is:

```text
User Request
      |
      v
+----------------+
|  Coordinator   |
+----------------+
      |
      | Enterprise-level routing
      | "This is a Sales request"
      v
+----------------+
| Sales Delegator|
+----------------+
      |
      | Domain-level routing
      | "I need customer + revenue + opportunity capabilities"
      v
+-----------------------------+
| Worker Discovery / Selection|
+-----------------------------+
      |
      +--------+---------+----------+
      |        |         |
      v        v         v
 Customer   Revenue   Opportunity
 Worker     Worker      Worker
```

So there are **two levels of routing**:

```text
Coordinator
    ↓
Business Domain
    ↓
Delegator

Delegator
    ↓
Capability
    ↓
Worker
```

This prevents the Coordinator from needing to understand every Worker in the enterprise.

---

# 2. Step 1 — Receive the Structured Task

The Delegator receives a structured task from the Coordinator, normally through the approved agent-to-agent communication path.

Example:

```json
{
  "task_id": "TASK-1001",
  "correlation_id": "CORR-5001",
  "domain": "sales",
  "intent": "customer_briefing",
  "description": "Create a customer briefing for ABC Corp",
  "required_capabilities": [
    "customer_profile",
    "opportunity_analysis",
    "revenue_analysis",
    "interaction_history"
  ]
}
```

The Delegator should not treat this as an arbitrary text request.

It should convert the request into a **controlled domain execution context**.

---

# 3. Step 2 — Validate the Domain

The Delegator first confirms that the task belongs to its domain.

For example:

```text
Sales Delegator
    |
    +-- Customer information       ✓
    +-- Opportunities              ✓
    +-- Sales revenue              ✓
    +-- Customer interactions      ✓
    +-- Employee payroll           ✗
```

If the task belongs to another domain, the Delegator should not attempt to execute it.

For example:

```text
Task:
"Show me the employee's compensation."

Sales Delegator
       |
       v
Domain validation
       |
       v
Not Sales capability
       |
       v
Reject / route through approved mechanism
```

This provides **domain isolation**.

---

# 4. Step 3 — Identify the Required Capabilities

The Delegator determines what capabilities are required to complete the task.

For:

> "Create a customer briefing for ABC Corp."

The Delegator may identify:

```text
Customer Briefing
       |
       +-- Customer Profile
       |
       +-- Opportunity Analysis
       |
       +-- Revenue Analysis
       |
       +-- Interaction History
       |
       +-- Briefing Generation
```

These are **capabilities**, not necessarily Worker names.

This distinction is important.

The Delegator should think:

```text
"I need opportunity analysis."
```

rather than:

```text
"I must call OpportunityWorkerV2."
```

The actual Worker can then be discovered dynamically.

---

# 5. Step 4 — Use the Agent Registry

The Delegator uses the **Agent Registry** to discover Workers that provide the required capabilities.

Conceptually:

```text
Required Capability
        |
        v
   Agent Registry
        |
        +----------------------+
        |                      |
        v                      v
Opportunity Worker       Revenue Worker
        |                      |
        +---- Capability ------+
```

Worker metadata can contain information such as:

```json
{
  "agent_id": "sales-opportunity-worker",
  "domain": "sales",
  "capabilities": [
    "opportunity_analysis",
    "pipeline_analysis"
  ],
  "endpoint": "...",
  "version": "2.1",
  "status": "healthy"
}
```

Another Worker might advertise:

```json
{
  "agent_id": "sales-revenue-worker",
  "domain": "sales",
  "capabilities": [
    "revenue_analysis"
  ],
  "endpoint": "...",
  "version": "1.4",
  "status": "healthy"
}
```

The Delegator uses these capabilities to determine the correct Worker.

---

# 6. Step 5 — Match Capability to Worker

The Delegator performs capability matching.

For example:

```text
Task
 |
 +-- customer_profile
 +-- opportunity_analysis
 +-- revenue_analysis
 +-- interaction_history

              |
              v

        Agent Registry

              |
      +-------+-------+-------+
      |       |       |       |
      v       v       v       v
 Customer Opportunity Revenue Interaction
 Worker     Worker    Worker     Worker
```

The Worker is selected because it supports the **required capability**, not simply because its name looks relevant.

This enables capability-based routing.

---

# 7. Step 6 — Apply Routing Policies

Capability matching alone is not enough.

The Delegator also evaluates routing policies.

A conceptual decision can be:

```text
Worker Selection
       |
       +-- Domain Match
       +-- Capability Match
       +-- Authorization
       +-- Data Access
       +-- Health
       +-- Availability
       +-- Version
       +-- Policy
       +-- Execution Constraints
       |
       v
Selected Worker
```

For example:

```text
Required Capability:
revenue_analysis

Candidate Workers:
    Revenue Worker A
    Revenue Worker B

Evaluation:

Domain Match          ✓
Capability Match      ✓
User Authorization    ✓
Worker Health         ✓
Data Policy           ✓
Version Policy        ✓

                    ↓

Selected Worker
```

This is where the Delegator becomes more than a simple router.

It is a **governed routing decision point**.

---

# 8. Step 7 — Check Authorization Before Execution

Before the Delegator sends a task to a Worker, authorization and policy checks must be applied.

For example:

```text
User Identity
      |
      v
User Roles / Entitlements
      |
      v
Domain Policy
      |
      v
Required Capability
      |
      v
Data Classification
      |
      v
Worker Access
      |
      v
ALLOW / DENY / REDACT / ESCALATE
```

Suppose the Revenue Worker requires access to sensitive financial information.

The Delegator must verify that the requested execution is permitted.

```text
Revenue Analysis
      |
      v
Authorization Check
      |
   +--+--+
   |     |
 ALLOW  DENY
   |     |
   v     v
Worker  Stop
```

The LLM cannot override this decision.

---

# 9. Step 8 — Determine Execution Strategy

Once Workers are selected, the Delegator determines how they should execute.

For example:

```text
Customer Briefing
       |
       +-- Customer Profile
       |
       +-- Opportunities
       |
       +-- Revenue
       |
       +-- Interactions
```

These tasks may be independent.

Therefore:

```text
                +-- Customer Worker
                |
                +-- Opportunity Worker
Delegator ------+
                +-- Revenue Worker
                |
                +-- Interaction Worker
```

They can potentially execute in parallel.

Then:

```text
Customer Worker
Opportunity Worker
Revenue Worker
Interaction Worker
        |
        v
Delegator
        |
        v
Aggregate Domain Result
```

If a dependency exists:

```text
Retrieve Customer
       |
       v
Resolve Customer ID
       |
       +------------------+
       |                  |
       v                  v
Opportunity Worker    Revenue Worker
```

The Delegator controls this dependency.

---

# 10. Step 9 — Route the Task to the Worker

After selecting the Worker, the Delegator creates a structured execution request.

Conceptually:

```json
{
  "task_id": "TASK-1001",
  "step_id": "STEP-002",
  "correlation_id": "CORR-5001",
  "source_agent": "sales-delegator",
  "target_agent": "sales-opportunity-worker",
  "capability": "opportunity_analysis",
  "input": {
    "customer_id": "ABC123"
  },
  "context": {
    "domain": "sales"
  }
}
```

The Delegator then invokes the Worker using the approved CWD communication mechanism.

```text
Sales Delegator
       |
       | A2A / approved agent communication
       v
Opportunity Worker
```

---

# 11. Step 10 — Worker Executes the Capability

The Worker is responsible for the actual operation.

For example:

```text
Opportunity Worker
       |
       v
MCP / Tool
       |
       v
Salesforce
       |
       v
Opportunity Data
```

Or:

```text
Revenue Worker
       |
       v
MCP / Data Tool
       |
       v
Snowflake
       |
       v
Revenue Data
```

The Delegator does **not** need to know the internal implementation of the Worker.

It only needs to know:

```text
Capability
Input Contract
Output Contract
Worker Identity
Execution Status
```

This is an important abstraction boundary.

---

# 12. Step 11 — Monitor Worker Execution

The Delegator tracks Worker execution using the CWD execution identifiers.

```text
session_id
task_id
run_id
turn_id
step_id
correlation_id
```

For example:

```text
Task: Customer Briefing
        |
        +-- Step 1 → Customer Worker → COMPLETED
        |
        +-- Step 2 → Opportunity Worker → COMPLETED
        |
        +-- Step 3 → Revenue Worker → RUNNING
        |
        +-- Step 4 → Interaction Worker → COMPLETED
```

This allows the Delegator to know exactly where the domain workflow stands.

---

# 13. Step 12 — Handle Worker Failure

Suppose:

```text
Revenue Worker
      |
      v
Timeout
```

The Delegator evaluates the failure.

```text
Failure
   |
   +-- Retry?
   |
   +-- Fallback Worker?
   |
   +-- Partial Result?
   |
   +-- Escalation?
   |
   +-- Controlled Failure?
```

For example:

```text
Revenue Worker
     |
   Timeout
     |
     v
Retry
     |
   Failed
     |
     v
Fallback Revenue Worker
     |
   Success
```

The Delegator should use the Agent Registry and routing policies to determine whether a fallback Worker is valid.

---

# 14. Step 13 — Validate Worker Results

The Delegator should not blindly trust Worker output.

It validates:

```text
Worker Result
     |
     +-- Status
     +-- Schema
     +-- Required Fields
     +-- Authorization
     +-- Data Policy
     +-- Completeness
     +-- Error Information
     |
     v
Valid Result
```

For example:

```json
{
  "worker": "revenue-worker",
  "status": "completed",
  "data": {
    "annual_revenue": 12500000
  },
  "source": "approved-enterprise-source"
}
```

The Delegator can then use this result in domain-level aggregation.

---

# 15. Step 14 — Aggregate Domain Results

After all required Workers finish:

```text
Customer Worker       ──┐
Opportunity Worker     ──┤
Revenue Worker         ──┼──> Sales Delegator
Interaction Worker     ──┤
                         |
                         v
                 Domain Result
```

The Delegator creates a structured domain result.

Example:

```json
{
  "domain": "sales",
  "task_id": "TASK-1001",
  "status": "completed",
  "results": {
    "customer_profile": {},
    "opportunities": [],
    "revenue": {},
    "interactions": []
  }
}
```

The result is then returned to the Coordinator.

```text
Sales Delegator
       |
       | A2A
       v
Coordinator
```

---

# 16. Complete Routing Flow

The complete Delegator routing process is:

```text
                Coordinator
                     |
                     | Structured Domain Task
                     v
              +-------------+
              |  Delegator  |
              +-------------+
                     |
                     v
             Validate Domain
                     |
                     v
          Understand Domain Task
                     |
                     v
          Identify Capabilities
                     |
                     v
            Decompose Task
                     |
                     v
             Agent Registry
                     |
                     v
           Discover Workers
                     |
                     v
          Capability Matching
                     |
                     v
        Authorization / Policies
                     |
                     v
          Select Best Workers
                     |
                     v
        Determine Dependencies
                     |
                     v
        Sequential / Parallel
                     |
                     v
            Invoke Workers
                     |
                     v
        Monitor Execution
                     |
              +------+------+
              |             |
           Success        Failure
              |             |
              |       Retry/Fallback/
              |       Partial/Escalate
              |             |
              +------+------+
                     |
                     v
           Validate Results
                     |
                     v
          Aggregate Domain Data
                     |
                     v
                Coordinator
```

# 17. Example: Customer Briefing

Consider this request:

> **"Create a customer briefing for ABC Corp with revenue, opportunities, and recent interactions."**

The routing process becomes:

```text
Coordinator
     |
     | Business Domain = Sales
     v
Sales Delegator
     |
     +-- Capability: Customer Profile
     |       |
     |       v
     |   Customer Worker
     |
     +-- Capability: Revenue Analysis
     |       |
     |       v
     |   Revenue Worker
     |
     +-- Capability: Opportunity Analysis
     |       |
     |       v
     |   Opportunity Worker
     |
     +-- Capability: Interaction History
             |
             v
         Interaction Worker
```

The Delegator then coordinates:

```text
Customer Worker       ──┐
Revenue Worker          │
Opportunity Worker      ├──> Sales Delegator
Interaction Worker    ──┘
                              |
                              v
                     Validate + Aggregate
                              |
                              v
                         Coordinator
```

The Coordinator can then combine the Sales domain result with other domain results if required and generate the final response.

---

# 18. Business Domain vs Technical Capability

An important distinction in CWD is:

```text
Business Domain
      ↓
Sales
Finance
HR
Supply Chain
Quality
Customer Experience
      ↓
Technical / Business Capabilities
      ↓
Revenue Analysis
Opportunity Analysis
Customer Lookup
Invoice Retrieval
Employee Lookup
Inventory Analysis
```

The **Delegator primarily operates within the business domain**, while Workers expose the detailed capabilities.

For example:

```text
Sales Delegator
      |
      +-- Customer Worker
      +-- Opportunity Worker
      +-- Revenue Worker
      +-- Pricing Worker
      +-- Quote Worker
```

This gives the domain a clean orchestration boundary.

---

# 19. How the LLM Participates

The Delegator can use an LLM for domain reasoning.

For example:

```text
User Task
    |
    v
Delegator LLM
    |
    | Understand domain task
    | Identify required capabilities
    | Suggest decomposition
    |
    v
Structured Domain Plan
    |
    v
Delegator Policy Engine
    |
    | Validate
    | Authorize
    | Select
    | Enforce
    |
    v
Workers
```

The critical principle is:

> **The LLM recommends the domain execution strategy; the Delegator controls and enforces the actual execution.**

The LLM should not directly decide:

* Which unauthorized Worker can be called
* Which restricted data can be retrieved
* Whether a security policy can be bypassed
* Whether an unregistered Worker can execute
* Whether a restricted enterprise system can be accessed

Those decisions belong to the controlled CWD execution layer.

---

# 20. Coordinator vs Delegator Routing

The routing responsibility can be summarized as:

| Decision                          | Coordinator | Delegator    |
| --------------------------------- | ----------- | ------------ |
| Understand overall request        | ✓           |              |
| Identify enterprise intent        | ✓           |              |
| Identify business domain          | ✓           | ✓ Validate   |
| Select Delegator                  | ✓           |              |
| Decompose domain task             |             | ✓            |
| Identify required capabilities    |             | ✓            |
| Discover Workers                  |             | ✓            |
| Select Workers                    |             | ✓            |
| Determine Worker dependencies     |             | ✓            |
| Execute Workers                   |             | ✓ Coordinate |
| Domain policy enforcement         |             | ✓            |
| Worker failure recovery           |             | ✓            |
| Aggregate domain results          |             | ✓            |
| Enterprise-level result synthesis | ✓           |              |

This creates a clean hierarchy:

```text
                    Coordinator
                         |
                Enterprise Routing
                         |
                         v
                    Delegator
                         |
                   Domain Routing
                         |
                         v
                     Workers
                         |
                  Capability Execution
                         |
                         v
               Enterprise Systems
```

# 21. Why Capability-Based Routing Matters

A hard-coded approach would look like:

```python
if task == "revenue":
    call_revenue_worker()
elif task == "opportunity":
    call_opportunity_worker()
```

This becomes difficult to maintain as the number of Workers grows.

A capability-based approach is:

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
Available Workers
  |
  v
Policy Evaluation
  |
  v
Selected Worker
```

This allows Workers to be:

* Added
* Removed
* Replaced
* Versioned
* Scaled
* Disabled
* Moved to different runtime infrastructure

without requiring major changes to the Delegator.

---

# 22. Final Architecture Principle

The Delegator should **not be a simple forwarding component**.

It is the **domain intelligence and control layer** responsible for translating a domain objective into governed Worker execution.

The complete responsibility is:

```text
Delegator
    |
    +-- Identify Domain
    +-- Understand Domain Task
    +-- Identify Capabilities
    +-- Decompose Task
    +-- Discover Workers
    +-- Match Capabilities
    +-- Apply Authorization
    +-- Apply Domain Policies
    +-- Select Workers
    +-- Determine Dependencies
    +-- Coordinate Execution
    +-- Propagate Context
    +-- Monitor Workers
    +-- Handle Failures
    +-- Validate Results
    +-- Aggregate Results
    +-- Return Domain Result
```

## Final Definition

> **A Delegator identifies the domain-specific meaning of a task, maps that task to required business or technical capabilities, discovers eligible Workers through the Agent Registry, applies authorization and routing policies, selects the appropriate Workers, coordinates their execution and dependencies, handles failures and recovery, validates and aggregates their results, and returns a governed domain-level result to the Coordinator.**

In one line:

```text
Delegator =
Domain Understanding
+ Capability Mapping
+ Worker Discovery
+ Worker Selection
+ Policy Enforcement
+ Execution Coordination
+ Recovery
+ Result Aggregation
```

**Architecturally:**

```text
Coordinator = "Which business domain should handle this?"

Delegator   = "What capabilities are needed and which Workers should perform them?"

Worker      = "How do I execute this specific capability?"
```
