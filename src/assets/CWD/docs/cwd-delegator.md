# Delegator Layer in CWD

## 1. Overview

The **Delegator** is the **domain-level orchestration layer** in CWD.

If the **Coordinator** manages the enterprise-level workflow, the **Delegator** manages the workflow **inside a specific business domain**.

For example:

```text
                    Coordinator
                         │
              ┌──────────┼──────────┐
              ↓          ↓          ↓
           Sales      Finance       HR
         Delegator   Delegator   Delegator
              │
       ┌──────┼──────┐
       ↓      ↓      ↓
    Worker  Worker  Worker
```

The Delegator understands:

* What the business domain is
* Which Workers are required
* How the domain task should be decomposed
* Which Workers can perform each task
* Which tasks can execute in parallel
* Which tasks depend on other tasks
* How Workers should communicate
* How Worker results should be combined
* When execution should succeed, retry, fail, or escalate

The key definition is:

> **Delegator = Domain Routing + Task Decomposition + Worker Selection + Domain Execution Control + Result Coordination**

---

# 2. Coordinator vs Delegator

The most important distinction is the **level of responsibility**.

| Component   | Responsibility                 |
| ----------- | ------------------------------ |
| Coordinator | Enterprise-level orchestration |
| Delegator   | Domain-level orchestration     |
| Worker      | Task-level execution           |
| LLM         | Reasoning/intelligence         |
| MCP/Tool    | Controlled system interaction  |
| A2A         | Agent-to-agent communication   |

For example:

```text
User:
"Create a complete customer briefing."
```

The Coordinator determines:

```text
Intent = Customer Briefing
Domain = Sales
Execution Required = Yes
Delegator = Sales Delegator
```

The Sales Delegator then determines:

```text
Customer Briefing
       │
       ├── Customer Profile Worker
       ├── Opportunity Worker
       ├── Revenue Worker
       └── Interaction Worker
```

The Workers execute the actual domain tasks.

---

# 3. Where the Delegator Fits

The CWD execution model is:

```text
User
 │
 ▼
Gateway
 │
 ▼
Coordinator
 │
 │  A2A
 ▼
Delegator
 │
 ├── Worker
 ├── Worker
 ├── Worker
 └── Worker
 │
 ▼
Enterprise Systems
```

The Delegator therefore acts as the **bridge between enterprise orchestration and specialized task execution**.

```text
Coordinator
     │
     │ Enterprise decision
     ↓
Delegator
     │
     │ Domain decision
     ↓
Workers
     │
     │ Task execution
     ↓
Enterprise Systems
```

---

# 4. Why the Delegator Layer Is Required

Without Delegators, the Coordinator would need to understand every business domain and every Worker.

That would create a very large and tightly coupled Coordinator.

For example:

```text
Coordinator
 ├── Sales logic
 ├── Finance logic
 ├── HR logic
 ├── Supply Chain logic
 ├── Customer Experience logic
 ├── Quality logic
 ├── Email logic
 └── Calendar logic
```

This does not scale.

Instead:

```text
                    Coordinator
                         │
        ┌────────────────┼────────────────┐
        ↓                ↓                ↓
     Sales            Finance            HR
   Delegator         Delegator         Delegator
        │                │                │
    Workers           Workers           Workers
```

Each Delegator owns the orchestration logic for its domain.

This gives CWD:

* Modularity
* Domain isolation
* Independent development
* Reusable Workers
* Easier scaling
* Better governance
* Reduced Coordinator complexity

---

# 5. Delegator Responsibility #1 — Receive Domain Task

The Coordinator sends a structured execution request to the Delegator.

For example:

```json
{
  "task_id": "task-123",
  "run_id": "run-456",
  "correlation_id": "corr-789",
  "domain": "sales",
  "intent": "customer_briefing",
  "objective": "Create customer briefing for Customer ABC",
  "priority": "normal"
}
```

The Delegator receives the task through the governed CWD communication path, typically using **A2A**.

```text
Coordinator
      │
      │ A2A Task
      ▼
Sales Delegator
```

---

# 6. Delegator Responsibility #2 — Validate Domain Task

The Delegator should validate that the received task belongs to its domain.

For example:

```text
Domain = Sales
Intent = Customer Briefing
Capability = Customer Intelligence
```

The Sales Delegator can accept it.

But if the request is:

```text
Domain = Finance
Capability = Payroll Processing
```

the Sales Delegator should reject it or return a controlled routing error.

This provides another layer of defense against incorrect routing.

---

# 7. Delegator Responsibility #3 — Domain-Level Task Decomposition

The Coordinator creates the **high-level enterprise task**.

The Delegator converts that into **domain-specific tasks**.

Example:

```text
Coordinator Task

Create customer briefing
```

Sales Delegator decomposes it:

```text
Customer Briefing
       │
       ├── Retrieve customer profile
       ├── Retrieve open opportunities
       ├── Retrieve revenue information
       ├── Retrieve recent interactions
       └── Generate sales briefing
```

The Delegator understands the business meaning of these domain tasks.

---

# 8. Task Dependency Management

The Delegator determines dependencies between Workers.

For example:

```text
Customer Profile ──────┐
                       │
Opportunities ─────────┤
                       │
Revenue ────────────────┼──► Generate Briefing
                       │
Interactions ──────────┘
```

The first four tasks can execute independently.

Therefore:

```text
Parallel Execution

Profile Worker ────────┐
Opportunity Worker ────┤
Revenue Worker ──────── ├──► Briefing Worker
Interaction Worker ────┘
```

This improves execution latency.

---

# 9. Sequential Dependencies

Some workflows require sequential execution.

Example:

```text
Customer Search
      ↓
Customer Validation
      ↓
Opportunity Retrieval
      ↓
Opportunity Analysis
      ↓
Recommendation
```

The Delegator understands these dependencies and prevents a downstream Worker from executing before its prerequisites are complete.

---

# 10. Delegator Responsibility #4 — Worker Selection

The Delegator determines which Worker has the required capability.

For example:

```text
Required Capability
        ↓
"Retrieve customer opportunities"
        ↓
Worker Registry
        ↓
Opportunity Worker
```

Worker selection should be capability-based rather than hard-coded wherever possible.

Conceptually:

```text
Task
 ↓
Required Capability
 ↓
Worker Registry
 ↓
Candidate Workers
 ↓
Policy
 ↓
Health
 ↓
Availability
 ↓
Selected Worker
```

---

# 11. Worker Selection Criteria

A Delegator can consider:

```text
Domain
Capability
Worker status
Health
Version
Environment
Authorization
Data access
Execution policy
Priority
Latency
Cost
```

For example:

```text
Task:
Retrieve customer revenue

Candidate Workers:
 ├── Revenue Worker v1
 ├── Revenue Worker v2
 └── Revenue Worker fallback

Selection:
 Capability ✓
 Authorization ✓
 Health ✓
 Policy ✓
 Version ✓
        ↓
Revenue Worker v2
```

---

# 12. Delegator Responsibility #5 — Execution Control

The Delegator controls how domain tasks are executed.

It determines:

* What executes first
* What executes in parallel
* What depends on another task
* Which Worker receives the task
* How context is passed
* When a task is complete
* When to retry
* When to use fallback
* When to stop execution

For example:

```text
Domain Workflow
      │
      ├── Task A ──────┐
      ├── Task B ──────┤
      ├── Task C ──────┼──► Task D
      └── Task E ──────┘
```

The Delegator controls this domain workflow.

---

# 13. Delegator and LLM

The Delegator can use an LLM for domain reasoning.

For example:

```text
Delegator
    │
    ├── Domain Context
    ├── Task Context
    ├── Business Rules
    └── LLM
          ↓
     Domain Plan
```

The LLM may determine:

```text
"To create the customer briefing, I need customer
profile, opportunities, revenue and interactions."
```

But the LLM does not independently execute those operations.

The Delegator validates and controls the resulting plan.

```text
LLM
 ↓
Recommended domain plan
 ↓
Delegator
 ↓
Policy / capability / dependency validation
 ↓
Worker execution
```

Again:

> **LLM provides reasoning; Delegator provides controlled domain execution.**

---

# 14. Delegator Responsibility #6 — Worker Communication

The Delegator communicates execution requests to Workers.

Conceptually:

```text
Delegator
    │
    │ Task Request
    ▼
Worker
```

The request should carry execution context.

For example:

```json
{
  "task_id": "task-001",
  "run_id": "run-001",
  "correlation_id": "corr-001",
  "parent_task_id": "task-customer-briefing",
  "domain": "sales",
  "capability": "customer_profile",
  "input": {
    "customer_id": "ABC"
  }
}
```

This allows the Worker execution to remain traceable to the original user request.

---

# 15. Delegator → Worker Communication

The communication pattern is:

```text
Coordinator
      │
      │ A2A
      ▼
Delegator
      │
      ├── Worker Request
      │
      ▼
Worker
```

Depending on the CWD implementation, Worker communication can use the platform's approved messaging/API mechanism.

The important architectural principle is:

> **The Delegator controls domain execution rather than allowing the Coordinator to directly orchestrate every Worker.**

---

# 16. Delegator Context Management

The Delegator receives context from the Coordinator and enriches it with domain-specific information.

Context can include:

```text
session_id
task_id
run_id
turn_id
step_id
correlation_id
user identity context
domain
intent
business entities
authorization context
execution constraints
parent task
```

The Delegator then adds:

```text
domain context
worker capability
domain policies
task dependencies
worker selection information
```

So:

```text
Coordinator Context
        +
Domain Context
        ↓
Delegator Execution Context
        ↓
Worker
```

---

# 17. Context Should Be Minimum Necessary

The Delegator should not blindly pass the entire conversation or all available enterprise data to every Worker.

Instead:

```text
Original User Request
        ↓
Coordinator
        ↓
Relevant Context
        ↓
Delegator
        ↓
Worker-Specific Context
```

For example:

```text
Opportunity Worker
```

may only need:

```text
customer_id
time_range
authorized sales context
```

It does not need unrelated HR or Finance information.

This supports:

* Least privilege
* Data minimization
* Security
* Performance
* Lower token usage

---

# 18. Delegator Responsibility #7 — Result Collection

Workers return results to the Delegator.

```text
Worker A ──────┐
Worker B ──────┤
Worker C ──────┼──► Delegator
Worker D ──────┘
```

The Delegator:

1. Correlates results
2. Validates responses
3. Checks task completion
4. Detects failures
5. Handles partial results
6. Aggregates domain-level results
7. Returns the domain result to the Coordinator

---

# 19. Domain-Level Result Aggregation

Example:

```text
Profile Worker
      ↓
Customer Profile

Opportunity Worker
      ↓
Open Opportunities

Revenue Worker
      ↓
Revenue Metrics

Interaction Worker
      ↓
Recent Interactions
```

The Delegator combines these into:

```text
Sales Domain Result
        │
        ├── Customer Profile
        ├── Opportunities
        ├── Revenue
        └── Interactions
```

The Coordinator then receives the domain-level result.

```text
Workers
   ↓
Delegator
   ↓
Sales Result
   ↓
Coordinator
```

---

# 20. Delegator Failure Handling

The Delegator is also responsible for domain-level execution recovery.

For example:

```text
Revenue Worker
      ↓
Timeout
      ↓
Delegator
      ↓
Retry
      ↓
Still failed?
      │
      ├── Yes → Fallback Worker
      │
      └── No → Continue
```

It can handle:

* Worker timeout
* Worker unavailable
* Tool failure
* Enterprise API failure
* Retry
* Fallback
* Partial results
* Dependency failure
* Domain-level escalation

---

# 21. Critical vs Optional Worker Tasks

Not every Worker failure should terminate the complete workflow.

For example:

```text
Customer Briefing

Customer Profile     → Critical
Opportunities        → Critical
Revenue              → Important
Recent Interactions  → Optional
```

If the Interaction Worker fails:

```text
Profile ✓
Opportunities ✓
Revenue ✓
Interactions ✗
```

The Delegator may still produce:

```text
Partial Sales Briefing
```

But if the Customer Profile Worker fails:

```text
Profile ✗
```

the Delegator may stop the workflow because the core context is missing.

---

# 22. Delegator and Policy Enforcement

The Delegator operates within the governance framework established by CWD.

Before invoking a Worker, it can validate:

```text
Worker approved?
Capability allowed?
User authorized?
Data access allowed?
Tool allowed?
Execution policy satisfied?
```

Therefore:

```text
Coordinator
     ↓
Enterprise Authorization
     ↓
Delegator
     ↓
Domain Policy
     ↓
Worker
```

This provides defense in depth.

---

# 23. Delegator and MCP

The Delegator normally should not directly bypass the Worker abstraction to access enterprise systems.

The preferred pattern is:

```text
Delegator
     ↓
Worker
     ↓
MCP / Approved Tool
     ↓
Enterprise API
     ↓
Enterprise System
```

For example:

```text
Sales Delegator
       ↓
Opportunity Worker
       ↓
Salesforce MCP Tool
       ↓
Salesforce
```

This keeps domain orchestration separate from system/tool execution.

---

# 24. Delegator and A2A

A2A is important at the **agent boundary**.

For the Coordinator:

```text
Coordinator
      │
      │ A2A
      ▼
Delegator
```

For a multi-agent domain architecture, A2A can also be used when a Delegator needs to communicate with another independent specialized agent.

Conceptually:

```text
Coordinator
    │
    │ A2A
    ▼
Sales Delegator
    │
    ├── Worker
    ├── Worker
    │
    └── A2A → Customer Intelligence Agent
```

The exact use should depend on whether the downstream component is actually an independent agent boundary.

---

# 25. Delegator and LangGraph

LangGraph can be used to control the Delegator's domain workflow.

For example:

```text
START
  ↓
Validate Domain Task
  ↓
Create Domain Plan
  ↓
Select Workers
  ↓
Execute Ready Tasks
  ↓
Check Dependencies
  ↓
Collect Results
  ↓
Retry / Recover
  ↓
Aggregate
  ↓
END
```

The distinction is:

```text
LLM
  → Reasoning

LangGraph
  → Workflow state and transitions

Delegator
  → Domain orchestration decisions

Worker
  → Task execution
```

---

# 26. Complete Delegator Execution Flow

A production-oriented flow is:

```text
                 Coordinator
                      │
                      │ A2A Task
                      ▼
              ┌───────────────┐
              │   Delegator   │
              └───────┬───────┘
                      │
              Validate Domain
                      │
                      ▼
             Understand Domain Task
                      │
                      ▼
             Decompose Domain Task
                      │
                      ▼
             Identify Capabilities
                      │
                      ▼
              Discover Workers
                      │
                      ▼
             Check Authorization
                      │
                      ▼
             Build Task Dependency
                  Graph
                      │
            ┌─────────┼─────────┐
            ↓         ↓         ↓
         Worker A  Worker B  Worker C
            │         │         │
            └─────────┼─────────┘
                      ↓
               Collect Results
                      │
                      ▼
              Validate Results
                      │
                ┌─────┴─────┐
                ↓           ↓
             Complete     Failure
                │           │
                │       Retry/Fallback
                │           │
                └─────┬─────┘
                      ↓
             Domain Aggregation
                      │
                      ▼
                 Coordinator
```

---

# 27. Example: Sales Customer Briefing

Suppose the Coordinator sends:

```text
Task:
Create a customer briefing for Customer ABC.
```

The Sales Delegator receives it.

### Domain interpretation

```text
Domain = Sales
Workflow = Customer Briefing
```

### Decomposition

```text
Task 1 → Customer Profile
Task 2 → Opportunities
Task 3 → Revenue
Task 4 → Recent Interactions
Task 5 → Generate Briefing
```

### Dependency graph

```text
Task 1 ──────┐
Task 2 ──────┤
Task 3 ──────┼──► Task 5
Task 4 ──────┘
```

### Worker selection

```text
Task 1 → Customer Profile Worker
Task 2 → Opportunity Worker
Task 3 → Revenue Worker
Task 4 → Interaction Worker
Task 5 → Briefing Worker
```

### Execution

```text
Profile Worker ────────┐
Opportunity Worker ────┤
Revenue Worker ─────────┼──► Briefing Worker
Interaction Worker ────┘
```

### Result

```text
Briefing Worker
      ↓
Sales Delegator
      ↓
Domain Result
      ↓
Coordinator
```

The Coordinator does not need to understand the internal details of every Sales Worker.

That knowledge remains inside the Sales Delegator.

---

# 28. Multiple Domain Example

Consider a request:

```text
"Prepare an executive customer review including
sales, financial and supply-chain information."
```

The Coordinator identifies multiple domains:

```text
                   Coordinator
                        │
        ┌───────────────┼────────────────┐
        ↓               ↓                ↓
      Sales           Finance        Supply Chain
    Delegator        Delegator         Delegator
        │               │                │
     Workers         Workers          Workers
        │               │                │
        └───────────────┼────────────────┘
                        ↓
                    Coordinator
                        ↓
                 Final Synthesis
```

Each Delegator independently manages its domain.

The Coordinator manages the **enterprise-level orchestration and final aggregation**.

---

# 29. Delegator Responsibility Matrix

| Responsibility                | Delegator |
| ----------------------------- | --------: |
| Receive Coordinator task      |         ✓ |
| Validate domain               |         ✓ |
| Domain interpretation         |         ✓ |
| Domain task decomposition     |         ✓ |
| Identify capabilities         |         ✓ |
| Worker discovery              |         ✓ |
| Worker selection              |         ✓ |
| Dependency management         |         ✓ |
| Parallel execution            |         ✓ |
| Sequential execution          |         ✓ |
| Worker context propagation    |         ✓ |
| Worker invocation             |         ✓ |
| Worker monitoring             |         ✓ |
| Retry/fallback                |         ✓ |
| Partial failure handling      |         ✓ |
| Result validation             |         ✓ |
| Domain result aggregation     |         ✓ |
| Return result to Coordinator  |         ✓ |
| Enterprise-wide routing       |         ✗ |
| Final enterprise response     |         ✗ |
| Direct uncontrolled DB access |         ✗ |

---

# 30. Coordinator vs Delegator vs Worker

The simplest way to understand CWD is:

```text
Coordinator
"What business objective are we fulfilling?"

Delegator
"How do we fulfill that objective within my domain?"

Worker
"What specific operation do I execute?"
```

For example:

```text
Coordinator:
"Create customer briefing."

Delegator:
"To create the Sales briefing, I need
profile, opportunities, revenue and interactions."

Worker:
"I will retrieve the customer's open opportunities."
```

---

# 31. Delegator as Domain Control Plane

The Delegator can be viewed as a **domain-specific control plane**.

```text
Enterprise Control Plane
        │
        ▼
    Coordinator
        │
        ├───────────────┐
        ↓               ↓
Domain Control      Domain Control
   Sales              Finance
 Delegator           Delegator
        │               │
   Workers           Workers
```

This architecture allows each business domain to evolve independently while remaining governed by the common CWD platform.

---

# 32. Key Architectural Principles

### Principle 1 — Coordinator owns enterprise orchestration

```text
Enterprise workflow → Coordinator
```

### Principle 2 — Delegator owns domain orchestration

```text
Domain workflow → Delegator
```

### Principle 3 — Worker owns task execution

```text
Specific operation → Worker
```

### Principle 4 — LLM provides reasoning

```text
Reasoning → LLM
```

### Principle 5 — Tools perform controlled actions

```text
System interaction → MCP / Approved Tools
```

### Principle 6 — A2A connects agent boundaries

```text
Agent ↔ Agent → A2A
```

### Principle 7 — Governance controls execution

```text
Identity + Policy + Authorization
        ↓
Allowed Execution
```

---

# 33. Final Architect Definition

The **Delegator is the domain-level execution controller within CWD**.

It receives a high-level task from the Coordinator, understands the domain-specific objective, decomposes the task into executable subtasks, identifies required capabilities, selects appropriate Workers, manages dependencies and parallel execution, propagates context, handles failures and retries, validates Worker results, aggregates domain results, and returns the completed domain outcome to the Coordinator.

The complete responsibility can be summarized as:

```text
Delegator
=
Receive
+
Validate
+
Understand Domain
+
Decompose
+
Select Workers
+
Build Dependencies
+
Execute
+
Manage Context
+
Monitor
+
Recover
+
Aggregate
+
Return Result
```

The overall CWD hierarchy is:

```text
                  ┌──────────────────────┐
                  │     COORDINATOR      │
                  │                      │
                  │ Enterprise Control   │
                  └──────────┬───────────┘
                             │
                            A2A
                             │
                             ▼
                  ┌──────────────────────┐
                  │      DELEGATOR       │
                  │                      │
                  │ Domain Control       │
                  │ Task Decomposition   │
                  │ Worker Selection     │
                  │ Execution Control    │
                  └──────────┬───────────┘
                             │
                 ┌───────────┼───────────┐
                 ↓           ↓           ↓
              Worker       Worker      Worker
                 │           │           │
                 └───────────┼───────────┘
                             ↓
                       MCP / Tools
                             ↓
                  Enterprise Systems
```

> **Coordinator decides the enterprise objective and execution path. Delegator decides how that objective is fulfilled within a business domain. Workers perform the specialized operations.**

This separation is what allows CWD to scale from a few agents to a **large enterprise multi-agent ecosystem without turning the Coordinator into a monolithic workflow engine**.
