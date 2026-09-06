# Delegator Agent in CWD Architecture

## 1. What Is a Delegator Agent?

A **Delegator Agent** is a specialized **domain-level orchestration agent** within the CWD architecture.

Its purpose is to take a high-level task received from the **Coordinator** and determine **how that task should be executed within a specific business domain**.

The Delegator does not normally perform every individual operation itself. Instead, it:

* Understands the domain-specific objective
* Decomposes the domain task
* Identifies required capabilities
* Selects appropriate Workers
* Determines task dependencies
* Controls sequential and parallel execution
* Passes the required context to Workers
* Monitors Worker execution
* Handles retries and failures
* Collects and validates Worker results
* Aggregates the domain-level result
* Returns the result to the Coordinator

In simple terms:

```text
Coordinator
    ↓
"What needs to be accomplished?"
    ↓
Delegator
    ↓
"How should this be accomplished within my domain?"
    ↓
Workers
    ↓
"Execute these specific operations."
```

---

# 2. Where the Delegator Fits in CWD

The Delegator sits **between the Coordinator and specialized Workers**.

```text
                         USER
                           │
                           ▼
                    ┌─────────────┐
                    │   Gateway   │
                    └──────┬──────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │   COORDINATOR   │
                  │                 │
                  │ Enterprise      │
                  │ Orchestration   │
                  └────────┬────────┘
                           │
                          A2A
                           │
                           ▼
                  ┌─────────────────┐
                  │    DELEGATOR    │
                  │                 │
                  │ Domain          │
                  │ Orchestration   │
                  └────────┬────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
          Worker A      Worker B     Worker C
              │            │            │
              └────────────┼────────────┘
                           │
                           ▼
                    MCP / Tools
                           │
                           ▼
                 Enterprise Systems
```

This gives CWD a clear three-level execution hierarchy:

```text
Coordinator
    │
    │ Enterprise-level orchestration
    ▼
Delegator
    │
    │ Domain-level orchestration
    ▼
Worker
    │
    │ Task-level execution
    ▼
Enterprise System / Tool
```

---

# 3. Why the Delegator Layer Exists

A major purpose of the Delegator is to prevent the Coordinator from becoming a **monolithic enterprise workflow engine**.

Imagine the Coordinator directly managing every Worker:

```text
Coordinator
 ├── Sales Worker
 ├── Revenue Worker
 ├── Opportunity Worker
 ├── Finance Worker
 ├── Payroll Worker
 ├── Supply Chain Worker
 ├── Inventory Worker
 ├── HR Worker
 ├── Customer Worker
 ├── Quality Worker
 └── ...
```

As the number of enterprise agents increases, the Coordinator becomes increasingly complex.

Instead, CWD groups Workers by domain:

```text
                         Coordinator
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
   Sales Delegator       Finance Delegator     HR Delegator
        │                     │                     │
   ┌────┼────┐           ┌────┼────┐           ┌────┼────┐
   ↓    ↓    ↓           ↓    ↓    ↓           ↓    ↓    ↓
 Worker Worker Worker   Worker Worker Worker   Worker Worker Worker
```

The Coordinator only needs to know:

> **Which domain-level Delegator should handle this request?**

The Delegator knows:

> **Which Workers are required to fulfill the request?**

---

# 4. Delegator as the Domain Control Plane

The Delegator can be viewed as a **domain-specific control plane**.

For example:

```text
                    CWD
                     │
              Coordinator
             Enterprise Control
                     │
                     ▼
             Sales Delegator
              Domain Control
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
 Customer Worker  Revenue Worker  Opportunity Worker
```

The Coordinator controls the **enterprise workflow**.

The Sales Delegator controls the **Sales workflow**.

The Workers control the **individual operations**.

---

# 5. Example

Suppose the user asks:

```text
"Create a complete customer briefing for Customer ABC."
```

The Coordinator determines:

```text
Intent:
Customer Briefing

Domain:
Sales

Execution:
Required

Delegator:
Sales Delegator
```

The Coordinator sends the task to the Sales Delegator.

The Sales Delegator then determines:

```text
Customer Briefing
       │
       ├── Retrieve customer profile
       ├── Retrieve opportunities
       ├── Retrieve revenue
       ├── Retrieve recent interactions
       └── Generate briefing
```

It then maps those tasks to Workers:

```text
Retrieve customer profile
        ↓
Customer Profile Worker

Retrieve opportunities
        ↓
Opportunity Worker

Retrieve revenue
        ↓
Revenue Worker

Retrieve interactions
        ↓
Interaction Worker

Generate briefing
        ↓
Briefing Worker
```

The Delegator controls the execution.

---

# 6. Coordinator vs Delegator

The distinction is critical.

| Question                      | Coordinator | Delegator |
| ----------------------------- | ----------- | --------- |
| What is the user's objective? | ✓           |           |
| Which business domain?        | ✓           |           |
| Which Delegator?              | ✓           |           |
| Enterprise-level workflow?    | ✓           |           |
| Domain-level workflow?        |             | ✓         |
| Decompose domain task?        |             | ✓         |
| Which Workers?                |             | ✓         |
| Worker dependencies?          |             | ✓         |
| Parallel Worker execution?    |             | ✓         |
| Worker retries/fallback?      |             | ✓         |
| Domain result aggregation?    |             | ✓         |
| Final enterprise response?    | ✓           |           |
| Enterprise-wide routing?      | ✓           |           |

A simple mental model is:

```text
Coordinator:
"Where should this request go?"

Delegator:
"What needs to happen inside this domain?"

Worker:
"Perform this specific operation."
```

---

# 7. Delegator Receives a Structured Task

The Coordinator should not send only a natural-language message.

It should send a structured execution request.

Example:

```json
{
  "task_id": "task-123",
  "run_id": "run-456",
  "correlation_id": "corr-789",
  "domain": "sales",
  "intent": "customer_briefing",
  "objective": "Create customer briefing for Customer ABC",
  "priority": "normal",
  "context": {
    "customer_id": "ABC"
  }
}
```

The Delegator uses this information to construct the domain execution plan.

---

# 8. Delegator Task Decomposition

The Delegator converts one high-level domain task into multiple executable tasks.

For example:

```text
Input:
Customer Briefing
```

becomes:

```text
Task 1:
Get customer profile

Task 2:
Get open opportunities

Task 3:
Get revenue

Task 4:
Get recent interactions

Task 5:
Generate briefing
```

This is **domain-level task decomposition**.

The Delegator understands the business-specific relationship between these tasks.

---

# 9. Task Dependencies

The Delegator determines which tasks can run independently.

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

The first four tasks can execute in parallel.

```text
        ┌── Profile Worker ────────┐
        │                          │
        ├── Opportunity Worker ────┤
        │                          │
Start ──┼── Revenue Worker ────────┼──► Briefing Worker
        │                          │
        └── Interaction Worker ────┘
```

This reduces overall workflow latency.

---

# 10. Sequential Execution

The Delegator can also enforce sequential dependencies.

For example:

```text
Customer Lookup
      ↓
Customer Validation
      ↓
Opportunity Retrieval
      ↓
Opportunity Analysis
      ↓
Recommendation
```

The Delegator prevents downstream execution until prerequisite tasks have completed successfully.

---

# 11. Worker Selection

Once the Delegator has decomposed the task, it determines which Worker should perform each operation.

For example:

```text
Required capability:
"Retrieve customer opportunities"

        ↓

Worker Registry

        ↓

Opportunity Worker
```

The selection should preferably be capability-based rather than hard-coded.

Conceptually:

```text
Domain Task
     ↓
Required Capability
     ↓
Worker Registry
     ↓
Candidate Workers
     ↓
Policy / Authorization
     ↓
Health / Availability
     ↓
Selected Worker
```

---

# 12. Worker Selection Example

Suppose the Worker Registry contains:

```text
Revenue Worker v1
Revenue Worker v2
Revenue Worker Fallback
```

The Delegator evaluates:

```text
Capability      ✓
Domain          ✓
Authorization   ✓
Policy          ✓
Health          ✓
Availability    ✓
Version         ✓
```

and selects:

```text
Revenue Worker v2
```

This makes Worker selection dynamic and allows Workers to evolve independently.

---

# 13. Delegator Controls Execution

The Delegator is responsible for controlling the domain workflow.

It determines:

```text
Which task executes first?
Which tasks execute in parallel?
Which tasks depend on others?
Which Worker handles each task?
When is a task complete?
What happens when a Worker fails?
When should a retry occur?
When should a fallback Worker be used?
When should the workflow stop?
```

Therefore:

> **The Delegator is not simply a router. It is an execution controller.**

---

# 14. Delegator and LLM

The Delegator can use an LLM to reason about domain-specific tasks.

For example:

```text
Delegator
    │
    ├── Domain Context
    ├── Business Rules
    ├── Task Context
    │
    ▼
   LLM
    │
    ▼
Domain Execution Plan
```

The LLM might determine:

```text
"Customer briefing requires profile,
opportunity, revenue and interaction information."
```

But the LLM should not directly execute those operations.

Instead:

```text
LLM
 ↓
Recommended Plan
 ↓
Delegator
 ↓
Validate
 ↓
Authorize
 ↓
Select Workers
 ↓
Execute
```

The architectural principle is:

> **LLM reasons about the domain; Delegator controls the domain execution.**

---

# 15. Delegator and Context

The Coordinator provides the global execution context.

The Delegator enriches it with domain-specific context.

```text
Coordinator Context
        +
Sales Domain Context
        ↓
Delegator Context
        ↓
Worker Context
```

Important identifiers should be propagated:

```text
session_id
task_id
run_id
turn_id
step_id
correlation_id
```

Additional domain information can include:

```text
domain
intent
business entity
capability
parent task
execution constraints
authorization context
```

---

# 16. Context Propagation to Workers

For example:

```json
{
  "task_id": "task-001",
  "run_id": "run-001",
  "correlation_id": "corr-001",
  "parent_task_id": "customer-briefing",
  "domain": "sales",
  "capability": "customer_profile",
  "input": {
    "customer_id": "ABC"
  }
}
```

The Worker can therefore understand:

```text
Who initiated the execution?
What task am I performing?
Which domain does it belong to?
What is the parent workflow?
What business entity is involved?
How should this execution be traced?
```

---

# 17. Least-Privilege Context

The Delegator should not pass unnecessary information to Workers.

For example:

```text
Opportunity Worker
```

may need:

```text
customer_id
time_range
authorized sales context
```

It does not necessarily need:

```text
HR information
Finance information
Unrelated conversation history
Unrelated customer data
```

This supports:

* Least privilege
* Data minimization
* Security
* Lower token consumption
* Better agent isolation

---

# 18. Delegator → Worker Communication

The communication path is:

```text
Coordinator
      │
      │ A2A
      ▼
Delegator
      │
      │ Worker Task
      ▼
Worker
```

The Delegator should use the approved CWD execution mechanisms rather than allowing uncontrolled direct calls to enterprise systems.

A typical Worker execution path is:

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
Salesforce Tool
      ↓
Salesforce
```

---

# 19. Delegator and A2A

A2A is primarily relevant at the **agent boundary**.

The Coordinator communicates with the Delegator:

```text
Coordinator
      │
      │ A2A
      ▼
Sales Delegator
```

The A2A message carries information such as:

```text
task_id
run_id
correlation_id
source_agent
target_agent
intent
domain
task
context
execution constraints
```

This allows the Delegator to operate as an independent domain agent while remaining part of the CWD execution hierarchy.

---

# 20. Delegator and MCP

A useful separation is:

```text
A2A
Agent ↔ Agent

MCP
Agent ↔ Tool/System
```

Therefore:

```text
Coordinator
      │
     A2A
      ↓
Delegator
      │
      ↓
Worker
      │
     MCP
      ↓
Enterprise System
```

This prevents communication and execution responsibilities from becoming mixed together.

---

# 21. Delegator Result Management

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
6. Aggregates domain results
7. Returns the domain result to the Coordinator

---

# 22. Domain-Level Aggregation

For the Customer Briefing example:

```text
Customer Profile Worker
        ↓
Customer Profile

Opportunity Worker
        ↓
Opportunities

Revenue Worker
        ↓
Revenue

Interaction Worker
        ↓
Interactions
```

The Delegator produces:

```text
Sales Domain Result
 ├── Customer Profile
 ├── Opportunities
 ├── Revenue
 └── Interactions
```

Then:

```text
Sales Delegator
       ↓
Coordinator
```

The Coordinator can combine this with results from other domains if required.

---

# 23. Delegator Failure Handling

The Delegator also controls domain-level recovery.

Example:

```text
Revenue Worker
      ↓
Timeout
      ↓
Delegator
      ↓
Retry
      ↓
Failure?
   ┌──┴──┐
   ↓     ↓
 Yes     No
   ↓      ↓
Fallback Continue
```

Possible actions include:

```text
Retry
Fallback
Skip optional task
Resume dependent workflow
Return partial result
Escalate
Terminate workflow
```

---

# 24. Critical and Optional Tasks

The Delegator should understand task criticality.

For example:

```text
Customer Profile     → Critical
Opportunities        → Critical
Revenue              → Important
Interactions         → Optional
```

If the Interaction Worker fails:

```text
Profile ✓
Opportunities ✓
Revenue ✓
Interactions ✗
```

The Delegator can potentially continue.

But if the Customer Profile Worker fails:

```text
Profile ✗
```

the Delegator may stop the domain workflow because a critical dependency is missing.

---

# 25. Delegator Governance

The Delegator also operates under CWD governance.

Before invoking a Worker, it can validate:

```text
Worker approved?
        ↓
Capability allowed?
        ↓
User authorized?
        ↓
Data access allowed?
        ↓
Tool permitted?
        ↓
Execution policy satisfied?
        ↓
Execute
```

This creates defense in depth:

```text
Coordinator
   ↓
Enterprise Policy
   ↓
Delegator
   ↓
Domain Policy
   ↓
Worker
   ↓
Tool Policy
```

---

# 26. Delegator and LangGraph

LangGraph can represent the Delegator's domain execution workflow.

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
Aggregate Results
  ↓
Return to Coordinator
  ↓
END
```

The separation remains:

```text
LLM
    → Reasoning

LangGraph
    → Workflow state/transitions

Delegator
    → Domain orchestration decisions

Worker
    → Specialized execution
```

---

# 27. Complete CWD Delegator Flow

The complete execution model is:

```text
                         USER
                           │
                           ▼
                        Gateway
                           │
                           ▼
                    ┌──────────────┐
                    │ Coordinator  │
                    │              │
                    │ Intent       │
                    │ Domain       │
                    │ Planning     │
                    │ Authorization│
                    └──────┬───────┘
                           │
                          A2A
                           │
                           ▼
                    ┌──────────────┐
                    │  Delegator   │
                    │              │
                    │ Domain       │
                    │ Decomposition│
                    │ Worker       │
                    │ Selection    │
                    │ Execution    │
                    └──────┬───────┘
                           │
                ┌──────────┼──────────┐
                ▼          ▼          ▼
             Worker A   Worker B   Worker C
                │          │          │
                └──────────┼──────────┘
                           │
                           ▼
                     MCP / Tools
                           │
                           ▼
                  Enterprise Systems
                           │
                           ▼
                     Worker Results
                           │
                           ▼
                       Delegator
                           │
                   Domain Aggregation
                           │
                           ▼
                      Coordinator
                           │
                   Enterprise Aggregation
                           │
                           ▼
                          User
```

---

# 28. Example with Multiple Domains

Suppose the request is:

```text
"Prepare an executive customer review
with sales, financial and supply-chain information."
```

The Coordinator determines that multiple domains are required:

```text
                         Coordinator
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
     Sales Delegator     Finance Delegator   Supply Chain
          │                   │                Delegator
      Workers              Workers               │
          │                   │                Workers
          └───────────────────┼───────────────────┘
                              ▼
                         Coordinator
                              │
                        Final Synthesis
                              │
                              ▼
                             User
```

Each Delegator owns its domain-specific workflow.

The Coordinator remains responsible for the enterprise-level orchestration.

---

# 29. Delegator vs Worker

A common misunderstanding is treating the Delegator as simply another Worker.

They have different responsibilities.

### Delegator

```text
Plans
Decomposes
Selects
Coordinates
Controls
Monitors
Aggregates
```

### Worker

```text
Executes
Calls tools
Retrieves data
Performs computation
Generates artifacts
Returns results
```

Therefore:

```text
Delegator = "How should the domain workflow execute?"

Worker = "Perform this specific task."
```

---

# 30. Delegator as an Independent Agent

A Delegator is an **agent**, but it has a specific architectural role.

It can have:

```text
LLM
Domain Prompt
Domain Policies
Domain Context
Task Planner
Worker Registry
Execution Engine
State
Tool/Worker Interfaces
Observability
```

For example:

```text
                 Sales Delegator
                       │
       ┌───────────────┼────────────────┐
       │               │                │
       ▼               ▼                ▼
      LLM          Domain Policy    Worker Registry
       │               │                │
       └───────────────┼────────────────┘
                       ▼
                 Domain Planner
                       │
                       ▼
                Execution Engine
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
       Worker A     Worker B     Worker C
```

This is why the Delegator is more than a simple routing component.

---

# 31. Responsibilities at Each CWD Level

| Level             | Primary Responsibility     |
| ----------------- | -------------------------- |
| Coordinator       | Enterprise orchestration   |
| Delegator         | Domain orchestration       |
| Worker            | Specialized task execution |
| MCP               | Tool/system interaction    |
| Enterprise System | System-of-record operation |

Another useful representation is:

```text
Coordinator
"What should the enterprise workflow accomplish?"

        ↓

Delegator
"How should my business domain accomplish its portion?"

        ↓

Worker
"What specific operation should I execute?"

        ↓

MCP / Tool
"How do I interact with the target system?"

        ↓

Enterprise System
"Perform the actual system operation."
```

---

# 32. Final Definition

The **Delegator Agent is the domain-level orchestration layer of CWD**.

It sits between the enterprise-level **Coordinator** and specialized **Workers**.

Its primary responsibility is to transform a high-level domain task into a controlled execution workflow by:

```text
Receive
   ↓
Validate
   ↓
Understand Domain Objective
   ↓
Decompose
   ↓
Identify Capabilities
   ↓
Select Workers
   ↓
Determine Dependencies
   ↓
Execute
   ↓
Manage Context
   ↓
Monitor
   ↓
Recover
   ↓
Collect Results
   ↓
Aggregate
   ↓
Return Domain Result
```

The overall CWD model is therefore:

```text
┌─────────────────────────────────────────────┐
│                 COORDINATOR                 │
│                                             │
│ Enterprise-level orchestration              │
│ Intent • Planning • Routing • Governance    │
└──────────────────────┬──────────────────────┘
                       │
                      A2A
                       │
                       ▼
┌─────────────────────────────────────────────┐
│                  DELEGATOR                  │
│                                             │
│ Domain-level orchestration                  │
│ Decomposition • Worker Selection            │
│ Dependencies • Execution • Recovery         │
│ Domain Result Aggregation                   │
└──────────────────────┬──────────────────────┘
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
       Worker       Worker       Worker
          │            │            │
          └────────────┼────────────┘
                       ▼
                 MCP / Tools
                       │
                       ▼
             Enterprise Systems
```

> **Coordinator decides the enterprise execution path. Delegator determines how the business-domain portion of that path is executed. Workers perform the specialized tasks.**

This separation is fundamental to CWD because it allows the platform to support many business domains and many specialized Workers while keeping enterprise orchestration centralized, domain logic modular, and task execution specialized.
