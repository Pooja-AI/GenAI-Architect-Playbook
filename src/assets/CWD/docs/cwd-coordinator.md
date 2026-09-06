Markdown

````
# What is the Coordinator?

## 1. Definition

The **Coordinator is the enterprise-level orchestration component of CWD**.

It is responsible for understanding the user's business request, creating an execution plan, identifying the required agents, coordinating their work, and returning the final business outcome.

The Coordinator is the **central control point of the CWD execution lifecycle**.

> **The Coordinator decides what needs to happen and coordinates how the complete request should be fulfilled.**

---

## 2. Position in CWD

```text
                    BUSINESS USER
                         │
                         ▼
                    API Gateway
                         │
                         ▼
                 ┌──────────────┐
                 │ Coordinator  │
                 │              │
                 │ Enterprise   │
                 │ Orchestration│
                 └──────┬───────┘
                        │
             ┌──────────┼──────────┐
             ▼          ▼          ▼
        Delegator   Delegator   Delegator
          Sales      Finance    Supply Chain
             │          │          │
             ▼          ▼          ▼
          Workers    Workers    Workers
             │          │          │
             └──────────┼──────────┘
                        ▼
                 Enterprise Systems
                        │
                        ▼
                 Results / Outcome
                        │
                        ▼
                   Coordinator
                        │
                        ▼
                       User
````

The Coordinator sits above the Delegators and Workers.

# 3. Business Responsibility

The Coordinator converts a business request into a coordinated enterprise workflow.

### Example

User request:

> "Create a customer briefing using the latest sales information, customer history, and relevant business documents."

The Coordinator determines:

```
1. Understand the requested business outcome
2. Identify the required business capabilities
3. Determine which domains are involved
4. Create the execution plan
5. Route tasks to the appropriate Delegators
6. Coordinate the execution
7. Collect and validate results
8. Produce the final response
```

The Coordinator does not need to know the internal implementation of every Worker.

# 4. Core Responsibilities

## 4.1 Intent Understanding

The Coordinator identifies what the user actually wants.

```
User Request
     │
     ▼
Coordinator
     │
     ▼
Business Intent
```

Example:

```
"Show me the latest customer information"
              ↓
Intent: Retrieve customer information
```

## 4.2 Request Classification

The Coordinator identifies the type and domain of the request.

```
Request
   │
   ▼
Classification
   │
   ├── Sales
   ├── Finance
   ├── Supply Chain
   ├── HR
   ├── Quality
   └── Other Business Domain
```

A request may involve more than one domain.

## 4.3 Planning

The Coordinator creates a plan for completing the request.

```
Business Request
       │
       ▼
Execution Plan
       │
       ├── Task 1
       ├── Task 2
       ├── Task 3
       └── Task 4
```

For example:

```
Customer Briefing
       │
       ├── Retrieve customer profile
       ├── Retrieve sales opportunities
       ├── Retrieve customer history
       └── Retrieve relevant knowledge
```

## 4.4 Agent Discovery

The Coordinator identifies which Delegator or agent can fulfill the required capability.

```
Coordinator
     │
     ▼
Agent Registry
     │
     ▼
Capability Matching
     │
     ▼
Selected Delegator
```

This allows CWD to support a growing ecosystem of agents without hard-coded routing for every request.

## 4.5 Routing

The Coordinator routes tasks to the appropriate Delegators.

```
Coordinator
     │
     ├── Sales Task ───────► Sales Delegator
     │
     ├── Finance Task ─────► Finance Delegator
     │
     └── Knowledge Task ───► Knowledge Agent
```

Routing is based on:

* Business intent

* Required capability

* Domain

* Agent availability

* Execution context

* Applicable policies

## 4.6 Execution Coordination

The Coordinator manages the overall workflow.

It determines whether tasks should execute:

### Sequentially

```
Task 1
  ↓
Task 2
  ↓
Task 3
```

### In parallel

```
             Coordinator
                  │
        ┌─────────┼─────────┐
        ▼         ▼         ▼
      Task 1    Task 2    Task 3
        │         │         │
        └─────────┼─────────┘
                  ▼
              Aggregate
```

Parallel execution is useful when tasks are independent.

## 4.7 Context Propagation

The Coordinator ensures that the required execution context is carried across agents.

```
Coordinator
     │
     ▼
Delegator
     │
     ▼
Worker
```

Typical context includes:

```
Session ID
Task ID
Run ID
Turn ID
Step ID
Correlation ID
User Context
Execution Metadata
```

This allows every component to understand which business request it belongs to.

## 4.8 Result Aggregation

The Coordinator collects results from multiple Delegators or Workers.

```
Sales Result ────────┐
Finance Result ──────┤
Knowledge Result ────┤
                     ▼
                Coordinator
                     │
                     ▼
              Combined Result
```

It is responsible for producing a coherent enterprise-level outcome.

## 4.9 Error Handling and Recovery

The Coordinator manages failures at the workflow level.

```
Coordinator
     │
     ▼
Delegator
     │
     ▼
Worker
     │
     X
   Failure
     │
     ▼
Coordinator
     │
     ├── Retry
     ├── Re-route
     ├── Continue with Partial Result
     └── Return Controlled Error
```

The Coordinator should prevent a failure in one task from unnecessarily failing the entire business request.

## 4.10 Final Response Generation

After collecting results, the Coordinator prepares the final business response.

```
Worker Results
      │
      ▼
Delegator Results
      │
      ▼
Coordinator
      │
      ▼
Result Aggregation
      │
      ▼
Response Synthesis
      │
      ▼
Final Business Outcome
```

The response may be:

* A business answer

* A report

* A recommendation

* A generated document

* A structured result

* A workflow completion message

# 5. Coordinator and LLM

The Coordinator can use an LLM for enterprise-level reasoning.

```
                 Coordinator
                      │
                      ▼
                     LLM
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
       Intent      Planning     Routing
       Analysis                 Decision
```

### Important distinction

```
LLM
 ↓
Understands, reasons and recommends

Coordinator
 ↓
Controls and coordinates execution

Worker / Tool
 ↓
Performs the actual business operation
```

The LLM does not replace the Coordinator.

The Coordinator provides the controlled execution structure around the LLM.

# 6. Coordinator vs Delegator vs Worker

|
Component

|

Main Question

|

Responsibility

|
| --- | --- | --- |
|

Coordinator

|

What needs to happen?

|

Enterprise-level planning and orchestration

|
|

Delegator

|

Which domain should handle it?

|

Domain-level task decomposition and routing

|
|

Worker

|

How should the task be executed?

|

Specialized task execution

|
|

LLM

|

How should the agent reason?

|

Intelligence and decision support

|
|

Tool / API

|

How is the enterprise action performed?

|

Controlled system interaction

|

### Example

```
User:
"Create a customer briefing."

Coordinator:
"Which business capabilities are required?"

Delegator:
"Which Sales Workers should execute the domain tasks?"

Worker:
"Retrieve the customer opportunities from Salesforce."

Tool:
"Execute the Salesforce API request."
```

# 7. Coordinator Execution Flow

```
┌─────────────────────┐
│    User Request     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    Coordinator      │
│                     │
│ Intent Understanding│
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Request Planning    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Agent Discovery     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Task Routing        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Delegator Execution │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Result Aggregation  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Final Response      │
└─────────────────────┘
```

# 8. Coordinator Responsibilities in Production CWD

In the production CWD platform, the Coordinator is responsible for controlling the complete execution lifecycle.

### Production responsibilities

* Receive authorized requests

* Maintain execution context

* Understand business intent

* Create execution plans

* Discover available agents

* Route tasks to Delegators

* Coordinate multiple agents

* Support parallel and sequential execution

* Manage execution dependencies

* Handle failures and retries

* Aggregate results

* Apply workflow-level governance

* Produce the final response

* Maintain end-to-end traceability

# 9. What the Coordinator Does Not Do

The Coordinator should not become responsible for every business operation.

It should not:

* Directly query enterprise databases

* Contain every domain's business logic

* Replace all Delegators

* Replace specialized Workers

* Store unrestricted enterprise data

* Bypass authorization

* Execute uncontrolled tools

* Hard-code every agent's implementation

Instead:

```
Coordinator
    │
    ▼
Delegator
    │
    ▼
Worker
    │
    ▼
Approved Tool
    │
    ▼
Enterprise System
```

This separation keeps the platform maintainable and scalable.

# 10. Coordinator as the Control Plane

The Coordinator is the control plane of CWD.

```
                    CONTROL PLANE
┌──────────────────────────────────────────────────────┐
│                                                      │
│ Coordinator                                          │
│                                                      │
│ Intent                                               │
│ Planning                                             │
│ Routing                                              │
│ Execution Coordination                               │
│ Context Propagation                                  │
│ Result Aggregation                                   │
│ Error Handling                                       │
│                                                      │
└──────────────────────────┬───────────────────────────┘
                           │
                           ▼
                    EXECUTION PLANE
┌──────────────────────────────────────────────────────┐
│                                                      │
│ Delegators                                           │
│ Workers                                              │
│ Tools                                                │
│ Enterprise Systems                                   │
│                                                      │
└──────────────────────────────────────────────────────┘
```

The Coordinator controls what should execute, while the execution plane performs the actual work.

# 11. Business Value of the Coordinator

The Coordinator provides the following business value:

* Faster execution by coordinating multiple tasks

* Consistent workflows across business domains

* Reduced manual coordination between systems and agents

* Reusable orchestration for multiple use cases

* Controlled enterprise AI execution

* Improved reliability through retries and recovery

* Better traceability across the complete request

* Scalable agent onboarding through discovery and routing

# 12. Final Definition

> The Coordinator is the enterprise-level orchestration component of CWD that transforms an authorized business request into a coordinated execution plan, discovers and routes work to the appropriate Delegators, manages the execution lifecycle, aggregates results, handles failures, and returns the final governed business outcome.

### In one line

```
Coordinator = Understand + Plan + Route + Coordinate + Aggregate
```

### Architect's perspective

> The Coordinator is not the agent that performs every task. It is the component that makes multiple specialized agents operate as one coherent enterprise AI system.
