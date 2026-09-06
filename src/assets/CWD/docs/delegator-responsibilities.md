# Core Responsibilities of a Delegator Agent

The **Delegator Agent** is the **domain-level orchestration layer** in the CWD architecture. It sits between the **Coordinator** and specialized **Worker Agents**.

Its primary responsibility is to take a high-level business task from the Coordinator, understand what needs to be done within its domain, break the work into executable tasks, select the right Workers, coordinate execution, enforce domain policies, handle failures, and return a validated result.

## 1. Domain Identification

The Delegator first determines whether the incoming task belongs to its supported business domain.

For example:

```text
Coordinator
     |
     | "Create a customer briefing"
     v
Sales Delegator
     |
     +-- Customer information
     +-- Opportunities
     +-- Revenue
     +-- Recent interactions
```

The Delegator validates:

* Business domain
* Requested capability
* Task type
* Required enterprise data
* Applicable domain policies
* User authorization/context

The Delegator should **not accept tasks outside its domain**.

---

## 2. Task Decomposition

The Delegator converts the high-level domain task into smaller executable subtasks.

For example:

```text
Customer Briefing
       |
       +-- Retrieve customer profile
       |
       +-- Retrieve opportunities
       |
       +-- Retrieve revenue information
       |
       +-- Retrieve recent interactions
       |
       +-- Generate customer briefing
```

It determines:

* What tasks are required
* Which tasks are independent
* Which tasks depend on other tasks
* Which tasks can execute in parallel
* Which tasks must execute sequentially
* What inputs each Worker requires
* What output each Worker must produce

This allows the Delegator to create a **domain-specific execution plan**.

---

## 3. Worker Discovery

The Delegator does not need to hard-code every Worker.

Instead, it uses the **Agent Registry** or equivalent capability metadata to discover available Workers.

For example:

```text
Required Capability
        |
        v
Agent Registry
        |
        +-- Customer Profile Worker
        +-- Opportunity Worker
        +-- Revenue Worker
        +-- Interaction Worker
```

Worker metadata can include:

* Agent name
* Capability
* Business domain
* Endpoint
* Version
* Health status
* Supported operations
* Authorization requirements
* Data classification
* Priority

This makes Worker onboarding and replacement easier.

---

## 4. Worker Selection

After discovering candidate Workers, the Delegator selects the most appropriate Worker.

Selection can consider:

```text
Capability
   +
Domain
   +
Authorization
   +
Health
   +
Availability
   +
Version
   +
Routing Policy
   +
Execution Constraints
```

For example:

```text
Task: Retrieve Salesforce Opportunities

Candidate Workers
        |
        +-- Salesforce Opportunity Worker
        +-- Generic CRM Worker
        +-- Legacy Opportunity Worker

                |
                v

        Policy + Capability
                |
                v

   Salesforce Opportunity Worker
```

The **LLM may recommend** a Worker, but the Delegator applies the actual routing and policy rules.

---

## 5. Execution Coordination

The Delegator controls how selected Workers execute.

It determines whether tasks should run:

### Sequentially

```text
Worker A
   |
   v
Worker B
   |
   v
Worker C
```

### In Parallel

```text
        +-- Worker A
        |
Task ---+-- Worker B
        |
        +-- Worker C
```

### Parallel Then Aggregate

```text
        +-- Customer Worker
        |
        +-- Revenue Worker
        |
        +-- Opportunity Worker
        |
        v
   Delegator Aggregation
```

This is particularly important for enterprise workflows where multiple systems must be queried simultaneously.

---

## 6. Context Management

The Delegator maintains and propagates the execution context required by Workers.

Typical identifiers include:

```text
session_id
task_id
run_id
turn_id
step_id
correlation_id
```

It also passes relevant business context such as:

```text
Customer ID
Account ID
Region
Business Unit
Requested Output
Task Constraints
Authorization Context
```

The Delegator should follow **minimum necessary context**.

It should not blindly forward the entire conversation or unrestricted enterprise data to every Worker.

---

## 7. Policy Enforcement

The Delegator acts as an important policy enforcement point within the domain.

Before invoking a Worker, it can validate:

```text
User Authorization
       |
       v
Domain Policy
       |
       v
Worker Capability
       |
       v
Data Access Policy
       |
       v
Execution Allowed?
```

Possible policy outcomes include:

```text
ALLOW
DENY
REDACT
ESCALATE
REQUIRE_APPROVAL
```

For example, if a Worker requests restricted financial information that the user is not entitled to access, the Delegator must prevent execution.

The LLM should never be allowed to bypass these controls.

---

## 8. Worker Communication

The Delegator communicates with Workers using the approved CWD communication mechanisms.

For agent-to-agent communication:

```text
Coordinator
     |
    A2A
     |
Delegator
     |
    A2A
     |
Worker
```

For Worker interaction with enterprise systems:

```text
Worker
   |
  MCP / Tool
   |
   +-- Salesforce
   +-- Snowflake
   +-- Oracle
   +-- SharePoint
   +-- Other APIs
```

The important distinction is:

```text
A2A = Agent ↔ Agent

MCP / Tools = Agent ↔ Enterprise Capability
```

---

## 9. Failure Handling

The Delegator is responsible for managing failures within its domain.

Typical failures include:

* Worker unavailable
* Worker timeout
* API failure
* Authentication failure
* Authorization failure
* Invalid Worker response
* Rate limiting
* Partial data
* Dependency failure

The Delegator determines whether the failure is:

```text
Transient
Permanent
Authorization
Data
Timeout
Dependency
Policy
```

It can then apply the appropriate strategy:

```text
Failure
   |
   +-- Retry
   |
   +-- Fallback Worker
   |
   +-- Continue with Partial Result
   |
   +-- Resume
   |
   +-- Human Escalation
   |
   +-- Controlled Failure
```

Retries must use appropriate idempotency and execution identifiers to avoid duplicate side effects.

---

## 10. Dependency Management

The Delegator maintains task dependencies.

Example:

```text
Retrieve Customer
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

The final briefing cannot be generated until the required upstream information is available.

The Delegator therefore tracks:

```text
PENDING
READY
RUNNING
COMPLETED
FAILED
RETRYING
SKIPPED
```

This allows the Delegator to control the workflow rather than simply forwarding requests.

---

## 11. Result Management

After Workers complete their tasks, the Delegator collects and validates their results.

```text
Worker A ──┐
Worker B ──┼──> Delegator
Worker C ──┘
               |
               v
        Validate Results
               |
               v
        Normalize Results
               |
               v
        Aggregate Results
```

The Delegator checks:

* Did the Worker succeed?
* Is the response structurally valid?
* Is required information missing?
* Is the result authorized?
* Are there conflicting results?
* Is the result complete enough for the downstream task?

It then creates a domain-level result for the Coordinator.

---

## 12. Domain-Level Result Aggregation

The Delegator performs the **first level of aggregation**.

For example:

```text
Sales Workers
     |
     +-- Customer Profile
     +-- Opportunities
     +-- Revenue
     +-- Interactions
     |
     v
Sales Delegator
     |
     v
Customer Briefing Data
     |
     v
Coordinator
```

The Coordinator can then combine this result with results from other domains.

For example:

```text
                Coordinator
                     |
        +------------+-------------+
        |            |             |
        v            v             v
      Sales        Finance      Supply Chain
    Delegator     Delegator      Delegator
        |            |             |
      Workers      Workers       Workers
        |            |             |
        +------------+-------------+
                     |
                     v
             Final Enterprise Result
```

---

# Delegator Responsibility Summary

| Responsibility            | Delegator Role                                           |
| ------------------------- | -------------------------------------------------------- |
| Domain identification     | Validate that the task belongs to the domain             |
| Task decomposition        | Break domain task into executable subtasks               |
| Dependency management     | Determine task ordering and dependencies                 |
| Worker discovery          | Find Workers through Agent Registry                      |
| Worker selection          | Select appropriate Worker based on capability and policy |
| Execution coordination    | Control sequential/parallel execution                    |
| Context management        | Propagate required execution and business context        |
| Policy enforcement        | Apply domain authorization and governance rules          |
| Worker communication      | Communicate with Workers using approved protocols        |
| Failure handling          | Retry, fallback, recover, or escalate                    |
| Result validation         | Validate Worker responses                                |
| Result aggregation        | Combine Worker results into a domain result              |
| Observability             | Track execution, failures, latency, and outcomes         |
| Coordinator communication | Return structured results/status to Coordinator          |

---

# Delegator in the CWD Execution Model

The complete responsibility chain is:

```text
                         USER
                           |
                           v
                    +-------------+
                    | Coordinator |
                    +-------------+
                           |
                    Enterprise Intent
                           |
                           | A2A
                           v
                    +-------------+
                    |  Delegator  |
                    +-------------+
                           |
              Domain Task Decomposition
                           |
             +-------------+-------------+
             |             |             |
             v             v             v
         Worker A      Worker B      Worker C
             |             |             |
             v             v             v
          MCP/Tools    MCP/Tools    MCP/Tools
             |             |             |
             v             v             v
        Enterprise Systems / Data
             |             |             |
             +-------------+-------------+
                           |
                           v
                    Worker Results
                           |
                           v
                    +-------------+
                    |  Delegator  |
                    | Aggregation  |
                    +-------------+
                           |
                           v
                    Domain Result
                           |
                           | A2A
                           v
                    +-------------+
                    | Coordinator |
                    +-------------+
                           |
                           v
                    Final Response
```

# Coordinator vs Delegator vs Worker

The simplest way to understand the separation is:

```text
Coordinator
    = Enterprise-level orchestration

Delegator
    = Domain-level orchestration

Worker
    = Task-level execution
```

| Layer           | Main Question                                                                  |
| --------------- | ------------------------------------------------------------------------------ |
| **Coordinator** | What does the enterprise request require, and which domain should handle it?   |
| **Delegator**   | How should this domain task be decomposed and which Workers should execute it? |
| **Worker**      | How do I perform this specific operation?                                      |

For example:

```text
User:
"Create a customer briefing including revenue,
opportunities and recent interactions."

Coordinator:
"Sales domain is required."

        ↓

Sales Delegator:
"I need customer, revenue, opportunity
and interaction data."

        ↓

Workers:
"Retrieve customer data."
"Retrieve revenue."
"Retrieve opportunities."
"Retrieve interactions."

        ↓

Sales Delegator:
"Combine and validate the domain results."

        ↓

Coordinator:
"Combine the Sales result and produce
the final enterprise response."
```

# Key Architectural Principle

The Delegator prevents the Coordinator from becoming a **large monolithic orchestration engine**.

```text
Coordinator
    |
    | Enterprise decisions
    v
Delegator
    |
    | Domain decisions
    v
Workers
    |
    | Task execution
    v
Enterprise Systems
```

This separation provides:

* **Clear responsibility boundaries**
* **Domain isolation**
* **Efficient Worker routing**
* **Independent domain evolution**
* **Better scalability**
* **Failure isolation**
* **Simpler Coordinator design**
* **Reusable Worker capabilities**
* **Domain-specific policy enforcement**
* **Better observability and maintainability**

## Final Definition

> **The Delegator is the domain-level orchestration agent that receives a task from the Coordinator, identifies the required domain actions, decomposes the task, discovers and selects appropriate Workers, coordinates their execution, enforces domain policies, handles failures and recovery, manages execution context, validates and aggregates results, and returns a structured domain result to the Coordinator.**

In one line:

```text
Delegator =
Domain Identification
+ Task Decomposition
+ Worker Discovery
+ Worker Selection
+ Execution Coordination
+ Policy Enforcement
+ Failure Handling
+ Result Management
```
