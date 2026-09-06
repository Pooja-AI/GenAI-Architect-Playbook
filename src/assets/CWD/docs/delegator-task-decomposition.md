# How Delegators Decompose Complex Domain Tasks into Atomic Worker Tasks

In the CWD architecture, the **Delegator is responsible for converting a complex domain-level objective into a structured execution plan made up of smaller, well-defined Worker tasks**.

The Delegator does not simply split a request into arbitrary pieces. It must preserve:

* **Task dependencies**
* **Execution order**
* **Business context**
* **Required inputs**
* **Expected outputs**
* **Authorization context**
* **Correlation and execution identifiers**
* **Failure and retry behavior**

The fundamental transformation is:

```text
Complex Domain Task
        |
        v
Domain Understanding
        |
        v
Task Decomposition
        |
        v
Dependency Analysis
        |
        v
Input / Output Definition
        |
        v
Execution Plan
        |
        v
Atomic Worker Tasks
```

---

# 1. Start With the Domain-Level Objective

The Delegator receives a high-level task from the Coordinator.

For example:

> "Create a complete customer briefing for ABC Corp including customer information, revenue, open opportunities, and recent interactions."

The Delegator first understands the **business objective**, rather than immediately creating Worker calls.

```text
Domain Objective
       |
       v
Customer Briefing
       |
       +-- Customer Profile
       +-- Revenue
       +-- Opportunities
       +-- Interactions
       +-- Briefing Preparation
```

The Delegator asks:

* What information is required?
* What actions are required?
* What capabilities are required?
* Which operations are independent?
* Which operations depend on other operations?
* What information must flow between tasks?
* What final output is expected?

---

# 2. Identify the Required Domain Capabilities

The Delegator maps the domain objective to capabilities.

For the customer briefing:

```text
Customer Briefing
       |
       +-- customer_profile
       +-- revenue_analysis
       +-- opportunity_analysis
       +-- interaction_history
       +-- briefing_generation
```

These capabilities become candidates for Worker tasks.

Importantly, the Delegator identifies **capabilities first**, rather than immediately selecting specific Worker implementations.

```text
Business Requirement
        ↓
Capability
        ↓
Worker Discovery
        ↓
Worker Selection
```

---

# 3. Convert Capabilities Into Atomic Tasks

The Delegator then creates **atomic Worker tasks**.

An atomic task should have one clear responsibility.

For example:

```text
Task 1:
Retrieve customer profile

Task 2:
Retrieve open opportunities

Task 3:
Retrieve revenue information

Task 4:
Retrieve recent interactions

Task 5:
Generate customer briefing
```

Each Worker should have a well-defined contract.

For example:

```text
Task
 ├── task_id
 ├── task_type
 ├── capability
 ├── input
 ├── dependencies
 ├── expected_output
 ├── context
 ├── policy
 └── execution metadata
```

---

# 4. Define Task Inputs

Every Worker task must clearly specify what information it requires.

For example:

```text
Customer Profile Worker

Input:
    customer_id

Output:
    customer_profile
```

Another Worker:

```text
Opportunity Worker

Input:
    customer_id

Output:
    opportunities[]
```

Another:

```text
Revenue Worker

Input:
    customer_id
    time_range

Output:
    revenue_summary
```

The Delegator therefore knows exactly what must be supplied to each Worker.

---

# 5. Define Expected Outputs

The Delegator also defines what each Worker should return.

Example:

```text
Customer Profile Worker
        |
        v
{
    customer_id,
    customer_name,
    industry,
    region,
    status
}
```

Opportunity Worker:

```text
{
    opportunity_id,
    stage,
    amount,
    expected_close_date
}
```

Revenue Worker:

```text
{
    period,
    revenue,
    currency
}
```

This creates a predictable Worker contract.

The Delegator can then validate whether the Worker returned the expected information.

---

# 6. Identify Task Dependencies

This is one of the most important responsibilities of the Delegator.

Not every task can execute immediately.

For example:

```text
Resolve Customer
       |
       +----------------+
       |                |
       v                v
Retrieve Revenue   Retrieve Opportunities
       |                |
       +--------+-------+
                |
                v
       Generate Briefing
```

The Delegator represents these relationships as dependencies.

Conceptually:

```text
Task A
  |
  | produces customer information
  v
Task B
```

If Task B requires the output of Task A, Task B cannot start until Task A completes successfully.

---

# 7. Build a Task Dependency Graph

The Delegator can represent the workflow as a directed graph.

For the customer briefing:

```text
                 Resolve Customer
                       |
          +------------+------------+
          |            |            |
          v            v            v
     Customer      Revenue      Opportunities
      Profile      Analysis       Analysis
          |            |            |
          |            |            |
          +------------+------------+
                       |
                       v
                Recent Interactions
                       |
                       v
                Generate Briefing
```

Or, if the customer ID is already known:

```text
Customer Profile ────────┐
Revenue Analysis ────────┤
Opportunity Analysis ────┼──> Generate Briefing
Interaction History ─────┘
```

This is a **dependency graph**, not just a list of Worker calls.

---

# 8. Determine Execution Order

Once dependencies are identified, the Delegator determines execution order.

There are three common patterns.

## Sequential

```text
Task A
  ↓
Task B
  ↓
Task C
```

Used when:

```text
B depends on A
C depends on B
```

---

## Parallel

```text
       +-- Task A
       |
Start--+-- Task B
       |
       +-- Task C
```

Used when tasks are independent.

For example:

```text
Customer Profile
Revenue
Opportunities
Interactions
```

can potentially be retrieved simultaneously.

---

## Parallel Then Aggregate

```text
             +-- Customer Worker
             |
             +-- Revenue Worker
             |
             +-- Opportunity Worker
             |
             +-- Interaction Worker
             |
             v
          Delegator
             |
             v
       Generate Briefing
```

This is common for enterprise data aggregation workflows.

---

# 9. Preserve Business Context

Breaking a task into smaller tasks must not lose the original business context.

The Delegator propagates the relevant context to every Worker.

For example:

```text
Original Request:

"Create a customer briefing for ABC Corp
for the Q2 business review."
```

The Delegator may preserve:

```text
customer_id = ABC123
customer_name = ABC Corp
period = Q2
business_purpose = business_review
domain = sales
requested_output = customer_briefing
```

Then each Worker receives only the context it needs.

```text
Revenue Worker
    |
    +-- customer_id
    +-- period
    +-- authorization context

Opportunity Worker
    |
    +-- customer_id
    +-- period
    +-- authorization context
```

This is preferable to sending the entire conversation to every Worker.

---

# 10. Preserve Execution Context

CWD uses execution identifiers to maintain traceability.

Typical identifiers include:

```text
session_id
task_id
run_id
turn_id
step_id
correlation_id
```

The Delegator propagates them into Worker tasks.

Example:

```text
Coordinator
   |
   | task_id = T100
   | run_id = R200
   | correlation_id = C300
   v
Sales Delegator
   |
   +-- Worker Task 1
   |     step_id = S001
   |
   +-- Worker Task 2
   |     step_id = S002
   |
   +-- Worker Task 3
         step_id = S003
```

This allows the entire execution to be traced.

---

# 11. Preserve Required Inputs and Outputs

The Delegator maintains the data flow between tasks.

For example:

```text
Task A
Input:
    customer_name

Output:
    customer_id
```

Then:

```text
Task B
Input:
    customer_id
```

The Delegator knows that:

```text
Task A.output.customer_id
            |
            v
Task B.input.customer_id
```

This creates an explicit **data dependency**.

---

# 12. Separate Business Dependencies From Technical Dependencies

A dependency can exist because of business logic or because of technical execution requirements.

### Business dependency

```text
Customer Identification
        ↓
Retrieve Customer Data
```

You cannot retrieve information until the customer has been identified.

### Technical dependency

```text
Authentication
        ↓
Enterprise API Call
```

The Worker cannot access the API until the required authorization context/token is available.

The Delegator needs to account for both types when constructing the execution plan.

---

# 13. Create a Structured Task Contract

Each Worker task should be represented using a structured contract.

Conceptually:

```json
{
  "task_id": "TASK-001",
  "step_id": "STEP-003",
  "capability": "revenue_analysis",
  "domain": "sales",
  "description": "Retrieve customer revenue for Q2",
  "dependencies": [
    "STEP-001"
  ],
  "input": {
    "customer_id": "${STEP-001.customer_id}",
    "period": "Q2"
  },
  "expected_output": {
    "revenue_summary": "object"
  },
  "context": {
    "session_id": "SESSION-001",
    "run_id": "RUN-001",
    "correlation_id": "CORR-001"
  }
}
```

This is much safer than passing arbitrary text between agents.

---

# 14. Determine Which Tasks Are Ready

The Delegator maintains task state.

For example:

```text
PENDING
   ↓
READY
   ↓
RUNNING
   ↓
COMPLETED
```

If a task has dependencies:

```text
Task B
Dependencies:
    Task A
```

then:

```text
Task A = COMPLETED
        |
        v
Task B = READY
```

If Task A has not completed:

```text
Task A = RUNNING
        |
        v
Task B = BLOCKED
```

This allows the Delegator to control execution dynamically.

---

# 15. Select Workers After Task Definition

Once the atomic tasks are defined, the Delegator maps each task to a Worker.

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
Candidate Workers
  |
  v
Policy + Health + Authorization
  |
  v
Selected Worker
```

Example:

```text
Task:
revenue_analysis

        ↓

Agent Registry

        ↓

Revenue Worker A
Revenue Worker B

        ↓

Capability + Policy + Health

        ↓

Revenue Worker A
```

This keeps task decomposition separate from Worker implementation.

---

# 16. Execute the Task Graph

The Delegator then controls the actual workflow.

For example:

```text
                Start
                  |
                  v
          Resolve Customer
                  |
          +-------+-------+
          |       |       |
          v       v       v
       Profile Revenue Opportunities
          |       |       |
          +-------+-------+
                  |
                  v
            Interactions
                  |
                  v
          Generate Briefing
                  |
                  v
                Done
```

The Delegator determines which tasks can execute at each point.

---

# 17. Handle Intermediate Results

Worker output may become input to downstream tasks.

Example:

```text
Customer Worker
      |
      v
customer_id
      |
      +------------+
      |            |
      v            v
Revenue Worker   Opportunity Worker
```

The Delegator stores the intermediate result in the appropriate execution state.

Conceptually:

```python
state["results"]["customer_profile"] = customer_result
state["results"]["revenue"] = revenue_result
```

Downstream tasks can then consume the required result.

---

# 18. Handle Partial Completion

Suppose:

```text
Customer Worker       → SUCCESS
Revenue Worker        → SUCCESS
Opportunity Worker    → TIMEOUT
Interaction Worker    → SUCCESS
```

The Delegator does not necessarily fail the entire workflow immediately.

It evaluates whether the failed task is:

```text
Critical
    or
Optional
```

For example:

```text
Required:
Customer Profile ✓
Revenue ✓

Optional:
Recent Interactions ✗
```

The Delegator may continue with a partial result if policy permits.

```text
Partial Execution
       |
       v
Validate Completeness
       |
       +-- Sufficient → Continue
       |
       +-- Insufficient → Recovery / Escalation
```

---

# 19. Handle Task-Level Recovery

Each atomic Worker task can have its own recovery strategy.

For example:

```text
Revenue Worker
      |
      v
Timeout
      |
      v
Retry
      |
   Failed
      |
      v
Fallback Worker
      |
   Success
```

The Delegator maintains the rest of the workflow state while recovery occurs.

This is one reason task decomposition is important: **failure can be isolated to a specific task instead of restarting the entire domain workflow.**

---

# 20. Delegator + LangGraph

In the CWD implementation, LangGraph can represent the Delegator's execution state and transitions.

Conceptually:

```text
START
  |
  v
Validate Domain Task
  |
  v
Decompose Task
  |
  v
Build Dependency Graph
  |
  v
Discover Workers
  |
  v
Select Workers
  |
  v
Execute Ready Tasks
  |
  +--------+
  |        |
  v        v
Success  Failure
  |        |
  |     Recovery
  |        |
  +----+---+
       |
       v
Check Dependencies
       |
       v
More Tasks?
   |       |
  Yes      No
   |       |
   +-------+
           |
           v
     Aggregate Results
           |
           v
          END
```

The important separation is:

```text
Delegator
    = Domain orchestration decisions

LangGraph
    = Workflow state and transition management

LLM
    = Reasoning / decomposition assistance

Agent Registry
    = Worker discovery

A2A
    = Agent-to-agent communication

MCP / Tools
    = Worker-to-enterprise-system interaction
```

---

# 21. Example End-to-End Decomposition

Consider:

> **"Prepare a customer briefing for ABC Corp using revenue, opportunities, customer profile, and recent interactions."**

### Step 1 — Domain Objective

```text
Customer Briefing
```

### Step 2 — Required Capabilities

```text
customer_profile
revenue_analysis
opportunity_analysis
interaction_history
briefing_generation
```

### Step 3 — Atomic Tasks

```text
T1 = Retrieve Customer Profile
T2 = Retrieve Revenue
T3 = Retrieve Opportunities
T4 = Retrieve Interactions
T5 = Generate Briefing
```

### Step 4 — Dependencies

```text
T1 ────────────────┐
T2 ────────────────┤
T3 ────────────────┼──> T5
T4 ────────────────┘
```

### Step 5 — Worker Mapping

```text
T1 → Customer Profile Worker
T2 → Revenue Worker
T3 → Opportunity Worker
T4 → Interaction Worker
T5 → Briefing Worker
```

### Step 6 — Execution

```text
                 Sales Delegator
                       |
        +--------------+--------------+
        |              |              |
        v              v              v
 Customer Worker   Revenue Worker   Opportunity Worker
        |              |              |
        +--------------+--------------+
                       |
                       v
              Interaction Worker
                       |
                       v
                Briefing Worker
```

### Step 7 — Result

```text
Workers
   |
   v
Delegator
   |
   +-- Validate
   +-- Normalize
   +-- Aggregate
   |
   v
Domain Result
   |
   v
Coordinator
```

---

# 22. What the Delegator Should NOT Do

The Delegator should not become another monolithic component.

It should **not**:

* Directly query every enterprise database
* Contain implementation logic for every Worker
* Bypass authorization
* Send unrestricted context to Workers
* Hard-code every Worker endpoint
* Allow the LLM to directly execute tools
* Replace the Agent Registry
* Replace A2A
* Replace MCP
* Reimplement Worker business logic

Instead:

```text
Delegator
     |
     | Decides
     v
Worker
     |
     | Executes
     v
Enterprise Capability
```

---

# 23. Responsibility Flow

The complete decomposition responsibility can be summarized as:

```text
Complex Domain Objective
          |
          v
   Understand Objective
          |
          v
 Identify Required Capabilities
          |
          v
      Decompose
          |
          v
 Create Atomic Worker Tasks
          |
          v
 Identify Dependencies
          |
          v
 Define Inputs / Outputs
          |
          v
 Preserve Context
          |
          v
 Build Execution Graph
          |
          v
 Discover Workers
          |
          v
 Select Workers
          |
          v
 Apply Policies
          |
          v
 Execute Ready Tasks
          |
          v
 Track State
          |
          v
 Handle Failures
          |
          v
 Validate Results
          |
          v
 Aggregate Domain Result
          |
          v
       Coordinator
```

# 24. Coordinator vs Delegator During Decomposition

The responsibility boundary is important.

| Activity                      | Coordinator | Delegator |
| ----------------------------- | ----------- | --------- |
| Understand enterprise request | ✓           |           |
| Identify business domain      | ✓           | Validate  |
| Select Delegator              | ✓           |           |
| Understand domain objective   |             | ✓         |
| Identify domain capabilities  |             | ✓         |
| Decompose domain task         |             | ✓         |
| Create atomic Worker tasks    |             | ✓         |
| Identify dependencies         |             | ✓         |
| Define Worker inputs/outputs  |             | ✓         |
| Discover Workers              |             | ✓         |
| Select Workers                |             | ✓         |
| Coordinate Worker execution   |             | ✓         |
| Handle Worker failures        |             | ✓         |
| Aggregate domain results      |             | ✓         |
| Enterprise-level synthesis    | ✓           |           |

The hierarchy is therefore:

```text
Coordinator
    |
    | "Here is the Sales objective."
    v
Sales Delegator
    |
    | "I will turn this objective into executable tasks."
    v
Worker Tasks
    |
    | "I will execute these specific capabilities."
    v
Enterprise Systems
```

# Final Definition

> **The Delegator decomposes a complex domain-level objective into a structured dependency-aware execution plan containing atomic Worker tasks. Each task has a clear capability, input contract, expected output, execution context, dependency relationship, and execution state. The Delegator then discovers and selects appropriate Workers, determines execution order and parallelism, propagates the required context, coordinates execution, handles failures and recovery, and aggregates the resulting outputs into a domain-level result.**

The key transformation is:

```text
Domain Objective
       ↓
Capabilities
       ↓
Atomic Tasks
       ↓
Dependencies
       ↓
Inputs / Outputs
       ↓
Worker Mapping
       ↓
Execution Graph
       ↓
Controlled Execution
       ↓
Domain Result
```

### The simplest way to remember it

```text
Coordinator:
"What business objective needs to be fulfilled?"

Delegator:
"How do I break that domain objective into executable tasks?"

Worker:
"How do I perform this specific task?"
```

**Therefore, the Delegator is the component that transforms a domain objective into a governed, dependency-aware, executable Worker workflow while preserving the context and contracts required for reliable downstream execution.**
