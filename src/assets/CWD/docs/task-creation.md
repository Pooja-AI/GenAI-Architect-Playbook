# How the Coordinator Creates Structured Tasks, Maintains Context, and Passes Execution Requests to Downstream Agents

## 1. Overview

In CWD, the Coordinator converts a user's natural-language request into a **structured, executable task**.

The Coordinator performs three important functions:

1. **Creates structured tasks** from the interpreted user intent.
2. **Maintains execution context** throughout the task lifecycle.
3. **Passes the execution request to the appropriate downstream Delegator through A2A.**

The overall flow is:

```text
User Request
     |
     v
Coordinator
     |
     +--> Understand Intent
     |
     +--> Identify Required Actions
     |
     +--> Create Structured Tasks
     |
     +--> Attach Context
     |
     +--> Build Execution Plan
     |
     v
A2A Request
     |
     v
Delegator
     |
     +--> Decompose Domain Tasks
     |
     +--> Select Workers
     |
     +--> Execute Tools / APIs / RAG
     |
     v
Result
     |
     v
Coordinator
```

The key principle is:

> **The Coordinator transforms an unstructured user request into a governed execution contract that downstream agents can understand and execute.**

---

# 2. From User Request to Structured Task

Consider a user request:

```text
"Create a customer briefing for ABC Corporation using
current opportunities, revenue, and recent customer interactions."
```

The Coordinator first interprets the request.

It identifies:

```text
Intent:
    create_customer_briefing

Domain:
    Sales

Customer:
    ABC Corporation

Required information:
    Customer profile
    Opportunities
    Revenue
    Recent interactions

Expected output:
    Customer briefing

Execution:
    Multi-step workflow
```

The Coordinator then converts this into structured tasks.

---

# 3. Task Structure

A task should contain enough information for the downstream agent to understand **what needs to be done and under what execution context**.

A conceptual task structure is:

```json
{
  "task_id": "task-001",
  "task_type": "customer_briefing",
  "intent": "create_customer_briefing",
  "domain": "sales",
  "description": "Create customer briefing for ABC Corporation",
  "priority": "normal",
  "status": "created",
  "dependencies": [],
  "inputs": {
    "customer": "ABC Corporation"
  },
  "expected_output": {
    "type": "customer_briefing"
  },
  "context": {
    "session_id": "session-001",
    "run_id": "run-001",
    "turn_id": "turn-001",
    "correlation_id": "corr-001"
  }
}
```

This is very different from simply sending:

```text
"Create a customer briefing."
```

The structured task provides downstream agents with the necessary execution information.

---

# 4. Task Decomposition

The Coordinator may identify multiple logical actions.

For example:

```text
Customer Briefing
        |
        +--> Retrieve Customer Profile
        |
        +--> Retrieve Opportunities
        |
        +--> Retrieve Revenue
        |
        +--> Retrieve Recent Interactions
        |
        +--> Generate Briefing
```

The tasks can be represented as:

```json
[
  {
    "task_id": "task-101",
    "action": "retrieve_customer_profile"
  },
  {
    "task_id": "task-102",
    "action": "retrieve_opportunities"
  },
  {
    "task_id": "task-103",
    "action": "retrieve_revenue"
  },
  {
    "task_id": "task-104",
    "action": "retrieve_interactions"
  },
  {
    "task_id": "task-105",
    "action": "generate_customer_briefing",
    "dependencies": [
      "task-101",
      "task-102",
      "task-103",
      "task-104"
    ]
  }
]
```

This creates an executable task graph.

---

# 5. Task Dependencies

The Coordinator identifies which tasks can run independently and which tasks depend on previous results.

For the customer briefing:

```text
                  +--> Customer Profile
                  |
                  +--> Opportunities
                  |
Customer Brief -->+--> Revenue
                  |
                  +--> Interactions
                           |
                           +---------+
                                     |
                                     v
                              Generate Briefing
```

The first four tasks can execute in parallel.

The final task must wait for their results.

Therefore:

```text
Phase 1:
    Profile
    Opportunities
    Revenue
    Interactions

Phase 2:
    Briefing Generation
```

The Coordinator stores these relationships in the execution plan.

---

# 6. Task Context

Task context is critical in a multi-agent system.

A downstream Delegator should know:

```text
Who initiated the request?
What session does it belong to?
What task is being executed?
Which execution attempt is this?
Which conversation turn created it?
Which step is currently executing?
Why was this task created?
What domain does it belong to?
What data is required?
What constraints apply?
```

CWD therefore maintains a hierarchy of execution identifiers:

```text
Session
   |
   +--> Task
          |
          +--> Run
                 |
                 +--> Turn
                        |
                        +--> Step
                               |
                               +--> LLM
                               |
                               +--> Tool
```

---

# 7. CWD Context Hierarchy

## Session

Represents the overall conversational or workflow context.

```text
session_id
```

Example:

```text
session-abc123
```

A session can contain multiple tasks.

---

## Task

Represents a discrete business objective.

```text
task_id
```

Example:

```text
task-customer-briefing-001
```

---

## Run

Represents one execution attempt of a task.

```text
run_id
```

For example, if the task fails and is retried:

```text
Task
 |
 +--> Run 1 --> Failed
 |
 +--> Run 2 --> Successful
```

The task remains the same while the execution run changes.

---

## Turn

Represents the logical conversational interaction that triggered the work.

```text
turn_id
```

---

## Step

Represents an individual operation within the workflow.

```text
step_id
```

Example:

```text
step-retrieve-opportunities
```

---

# 8. Correlation ID

The `correlation_id` connects the entire execution across CWD components.

For example:

```text
correlation_id = corr-12345
```

The same correlation ID can appear in:

```text
Coordinator
   |
   +--> A2A
   |
   +--> Delegator
   |
   +--> Worker
   |
   +--> MCP
   |
   +--> Enterprise API
   |
   +--> Observability
```

This allows the platform team to trace one business request across multiple agents and systems.

---

# 9. Context Propagation

When the Coordinator invokes a Delegator, it should propagate the relevant execution context.

Conceptually:

```text
Coordinator Context
        |
        v
     A2A Task
        |
        v
Delegator Context
        |
        v
Worker Context
        |
        v
Tool/API Context
```

For example:

```json
{
  "session_id": "session-001",
  "task_id": "task-001",
  "run_id": "run-001",
  "turn_id": "turn-001",
  "step_id": "step-001",
  "correlation_id": "corr-001"
}
```

The downstream agent can therefore associate its work with the original request.

---

# 10. Business Context vs Execution Context

It is useful to distinguish two types of context.

### Business Context

Describes what the business request is about.

```json
{
  "intent": "create_customer_briefing",
  "domain": "sales",
  "customer": "ABC Corporation",
  "requested_output": "customer briefing"
}
```

### Execution Context

Describes how the request is being executed.

```json
{
  "session_id": "session-001",
  "task_id": "task-001",
  "run_id": "run-001",
  "correlation_id": "corr-001",
  "source_agent": "cwd-coordinator",
  "target_agent": "sales-delegator"
}
```

Together:

```text
Business Context
       +
Execution Context
       |
       v
Structured Execution Request
```

---

# 11. Execution Plan

The Coordinator combines tasks, dependencies, context, and routing information into an execution plan.

Conceptually:

```json
{
  "plan_id": "plan-001",
  "intent": "create_customer_briefing",
  "domain": "sales",
  "execution_mode": "parallel_then_aggregate",

  "tasks": [
    {
      "task_id": "task-101",
      "action": "retrieve_customer_profile",
      "dependencies": []
    },
    {
      "task_id": "task-102",
      "action": "retrieve_opportunities",
      "dependencies": []
    },
    {
      "task_id": "task-103",
      "action": "retrieve_revenue",
      "dependencies": []
    },
    {
      "task_id": "task-104",
      "action": "retrieve_interactions",
      "dependencies": []
    },
    {
      "task_id": "task-105",
      "action": "generate_customer_briefing",
      "dependencies": [
        "task-101",
        "task-102",
        "task-103",
        "task-104"
      ]
    }
  ]
}
```

This plan represents the Coordinator's understanding of the workflow.

---

# 12. Selecting the Downstream Agent

After creating the task, the Coordinator determines which Delegator can execute it.

The process is:

```text
Structured Task
      |
      v
Required Capability
      |
      v
Business Domain
      |
      v
Agent Registry
      |
      v
Matching Delegator
```

For example:

```text
Capability:
customer_briefing

Domain:
sales

Agent Registry
       |
       v
sales-delegator
```

The Coordinator does not need to know the internal implementation of the Sales Delegator.

It only needs to know that the registered agent provides the required capability.

---

# 13. Preparing the A2A Execution Request

The Coordinator then creates an A2A request.

Conceptually:

```json
{
  "message_type": "task_request",

  "task": {
    "task_id": "task-001",
    "task_type": "customer_briefing",
    "intent": "create_customer_briefing",
    "domain": "sales"
  },

  "source_agent": {
    "agent_id": "cwd-coordinator"
  },

  "target_agent": {
    "agent_id": "sales-delegator"
  },

  "context": {
    "session_id": "session-001",
    "run_id": "run-001",
    "turn_id": "turn-001",
    "correlation_id": "corr-001"
  },

  "input": {
    "customer": "ABC Corporation"
  },

  "execution": {
    "priority": "normal",
    "timeout_seconds": 300
  }
}
```

This becomes the contract between the Coordinator and Delegator.

---

# 14. Passing the Request Through A2A

The communication path is:

```text
                 Coordinator
                     |
                     |
             Create A2A Task
                     |
                     v
                A2A Gateway
                     |
              Agent Registry
                     |
              Authentication
                     |
              Authorization
                     |
              Context Propagation
                     |
                     v
             Sales Delegator
```

The Coordinator therefore does not directly call internal Worker implementations.

Instead:

```text
Coordinator
     |
     v
    A2A
     |
     v
Delegator
     |
     v
Workers
```

This maintains a clean agent boundary.

---

# 15. What the Delegator Receives

The Delegator receives enough information to understand the requested business operation.

For example:

```text
Target Agent:
    sales-delegator

Intent:
    create_customer_briefing

Domain:
    sales

Customer:
    ABC Corporation

Required Capabilities:
    customer_profile
    opportunities
    revenue
    interactions
    briefing_generation

Execution Context:
    session_id
    task_id
    run_id
    turn_id
    correlation_id
```

The Delegator can then perform domain-level decomposition.

---

# 16. Coordinator Does Not Send Every Worker Task

This is an important responsibility boundary.

The Coordinator should generally send:

```text
"Create customer briefing for ABC."
```

to:

```text
Sales Delegator
```

rather than directly sending:

```text
Retrieve Salesforce opportunity
Retrieve Snowflake revenue
Retrieve SharePoint interactions
Generate briefing
```

The Delegator owns domain-specific execution.

Therefore:

```text
Coordinator
   |
   | High-level business task
   v
Sales Delegator
   |
   | Domain decomposition
   +--> Customer Worker
   +--> Opportunity Worker
   +--> Revenue Worker
   +--> Interaction Worker
   +--> Briefing Worker
```

This prevents the Coordinator from becoming a giant business-logic component.

---

# 17. Delegator Creates Domain-Level Tasks

The Delegator can take the Coordinator's task and create its own internal execution plan.

For example:

```text
Coordinator Task
        |
        v
Sales Delegator
        |
        +--> retrieve_customer
        |
        +--> retrieve_opportunities
        |
        +--> retrieve_revenue
        |
        +--> retrieve_interactions
        |
        +--> generate_briefing
```

The responsibility split becomes:

```text
Coordinator
    |
    | Enterprise-level planning
    v
Delegator
    |
    | Domain-level planning
    v
Workers
    |
    | Task execution
    v
Tools / APIs / Data
```

---

# 18. Context Is Preserved Across the Agent Hierarchy

The original context should remain traceable.

```text
User Request
     |
     | correlation_id = C123
     v
Coordinator
     |
     | correlation_id = C123
     v
Sales Delegator
     |
     | correlation_id = C123
     v
Opportunity Worker
     |
     | correlation_id = C123
     v
Salesforce
```

This allows the platform to answer:

```text
Which user initiated this?
Which task was executed?
Which Delegator handled it?
Which Worker executed it?
Which tool was called?
What data was accessed?
What happened when execution failed?
```

---

# 19. State Management

The Coordinator should maintain execution state throughout the workflow.

Conceptually:

```text
CREATED
   |
   v
VALIDATED
   |
   v
AUTHORIZED
   |
   v
PLANNED
   |
   v
DELEGATOR_SELECTED
   |
   v
SUBMITTED
   |
   v
RUNNING
   |
   v
COMPLETED
```

Failure states can also be represented:

```text
RUNNING
   |
   +--> FAILED
          |
          +--> RETRY
          |
          +--> COMPENSATE
          |
          +--> ESCALATE
```

This state can be maintained using the CWD state/memory architecture, with Redis and other persistent state mechanisms as appropriate.

---

# 20. Handling Long-Running Tasks

Not every Delegator task will complete immediately.

For example:

```text
Generate large customer analysis
```

may require several downstream operations.

The Coordinator can submit the task and track its status:

```text
Coordinator
     |
     | submit task
     v
Delegator
     |
     | RUNNING
     v
Workers
```

The task may transition through:

```text
SUBMITTED
    |
    v
RUNNING
    |
    v
PARTIALLY_COMPLETED
    |
    v
COMPLETED
```

The Coordinator can use task identifiers to correlate the eventual result with the original request.

---

# 21. Error Handling

Suppose the Sales Delegator fails.

The A2A response might contain:

```json
{
  "task_id": "task-001",
  "status": "failed",
  "error": {
    "code": "SALES_AGENT_UNAVAILABLE",
    "message": "Sales Delegator unavailable"
  },
  "correlation_id": "corr-001"
}
```

The Coordinator can then decide:

```text
Delegator failure
       |
       +--> Retry
       |
       +--> Select alternate registered agent
       |
       +--> Resume
       |
       +--> Escalate
       |
       +--> Return controlled failure
```

The correct behavior depends on policy and workflow type.

---

# 22. Result Propagation

The downstream result follows the reverse path.

```text
Enterprise Systems
       |
       v
Workers
       |
       v
Delegator
       |
       v
A2A
       |
       v
Coordinator
       |
       v
Aggregation
       |
       v
Response Governance
       |
       v
User
```

The result remains associated with:

```text
task_id
run_id
correlation_id
```

This allows the Coordinator to determine which result belongs to which execution.

---

# 23. Context Should Not Mean Sending Everything Everywhere

Context propagation does **not** mean passing the entire conversation history or all enterprise data to every agent.

The Coordinator should propagate **relevant and authorized context**.

For example:

```text
Coordinator
      |
      +--> Required task context
      |
      +--> Required business parameters
      |
      +--> Authorization context
      |
      +--> Correlation identifiers
      |
      +--> Relevant prior results
      |
      v
Delegator
```

Sensitive information should be minimized and controlled according to data governance and policy.

The principle is:

> **Propagate the minimum context required for the downstream agent to perform its authorized task.**

---

# 24. Where LLM Fits

The LLM participates primarily in the reasoning portion.

```text
User Request
     |
     v
LLM
     |
     | Interpret
     | Identify intent
     | Identify actions
     v
Coordinator
     |
     | Validate
     | Authorize
     | Structure
     | Route
     | Control
     v
A2A
     |
     v
Delegator
```

The LLM should not directly construct an uncontrolled network request to a Delegator.

Instead:

```text
LLM recommendation
        |
        v
Coordinator validation
        |
        v
Structured task
        |
        v
A2A execution
```

This preserves governance.

---

# 25. Where LangGraph Fits

LangGraph can represent the Coordinator's execution state.

For example:

```text
validate
   |
   v
interpret
   |
   v
authorize
   |
   v
create_tasks
   |
   v
discover_delegator
   |
   v
create_a2a_request
   |
   v
submit
   |
   v
wait / monitor
   |
   v
aggregate
   |
   v
complete
```

The separation is:

```text
LLM
= Reasoning

LangGraph
= Workflow state transitions

Coordinator
= Enterprise orchestration decisions

Agent Registry
= Agent discovery

A2A
= Agent-to-agent communication

Delegator
= Domain orchestration

Worker
= Task execution

MCP / APIs
= Tool/system interaction
```

---

# 26. Conceptual Python Model

A simplified representation of the Coordinator's task creation can look like this:

```python
from pydantic import BaseModel, Field
from typing import Any, List
from uuid import uuid4


class ExecutionContext(BaseModel):
    session_id: str
    task_id: str
    run_id: str
    turn_id: str
    correlation_id: str


class StructuredTask(BaseModel):
    task_id: str
    task_type: str
    intent: str
    domain: str
    description: str
    inputs: dict[str, Any]
    dependencies: List[str] = Field(default_factory=list)
    context: ExecutionContext


class Coordinator:

    def create_task(
        self,
        intent: str,
        domain: str,
        description: str,
        inputs: dict[str, Any],
        session_id: str,
        turn_id: str
    ) -> StructuredTask:

        task_id = f"task-{uuid4().hex[:8]}"
        run_id = f"run-{uuid4().hex[:8]}"
        correlation_id = f"corr-{uuid4().hex[:8]}"

        context = ExecutionContext(
            session_id=session_id,
            task_id=task_id,
            run_id=run_id,
            turn_id=turn_id,
            correlation_id=correlation_id
        )

        return StructuredTask(
            task_id=task_id,
            task_type=intent,
            intent=intent,
            domain=domain,
            description=description,
            inputs=inputs,
            context=context
        )
```

The important part is not the UUID implementation.

The architectural point is that the Coordinator creates a **structured task object containing business intent plus execution context**.

---

# 27. Conceptual A2A Request Creation

After creating the task:

```python
def create_a2a_request(task: StructuredTask, delegator_id: str):

    return {
        "message_type": "task_request",

        "source_agent": "cwd-coordinator",

        "target_agent": delegator_id,

        "task": {
            "task_id": task.task_id,
            "task_type": task.task_type,
            "intent": task.intent,
            "domain": task.domain,
            "description": task.description,
            "inputs": task.inputs,
            "dependencies": task.dependencies
        },

        "context": {
            "session_id": task.context.session_id,
            "task_id": task.context.task_id,
            "run_id": task.context.run_id,
            "turn_id": task.context.turn_id,
            "correlation_id": task.context.correlation_id
        }
    }
```

The A2A client then sends this request to the selected Delegator.

---

# 28. Complete CWD Flow

Putting everything together:

```text
                    USER
                      |
                      v
              Natural Language
                      |
                      v
                COORDINATOR
                      |
          +-----------+-----------+
          |           |           |
          v           v           v
       Intent      Policy      Context
          |           |           |
          +-----------+-----------+
                      |
                      v
              Execution Required
                      |
                      v
             Identify Capability
                      |
                      v
                AGENT REGISTRY
                      |
                      v
             Select Delegator
                      |
                      v
              Create Task Graph
                      |
                      v
             Attach Execution Context
                      |
                      v
              Create A2A Request
                      |
                      v
                     A2A
                      |
                      v
               DOMAIN DELEGATOR
                      |
              +-------+-------+
              |       |       |
              v       v       v
           Worker  Worker  Worker
              |       |       |
              +-------+-------+
                      |
                      v
               Tools / APIs
                      |
                      v
             Enterprise Systems
                      |
                      v
                  Results
                      |
                      v
                 Delegator
                      |
                      v
                     A2A
                      |
                      v
                Coordinator
                      |
                      v
             Aggregate Results
                      |
                      v
             Validate / Govern
                      |
                      v
                  Response
                      |
                      v
                    USER
```

---

# 29. Responsibility Summary

| Activity                           | Coordinator |                  Delegator |
| ---------------------------------- | ----------: | -------------------------: |
| Understand user request            |         Yes |                         No |
| Identify intent                    |         Yes |                         No |
| Determine execution requirement    |         Yes |                         No |
| Identify business domain           |         Yes |                         No |
| Identify required capability       |         Yes | Domain-specific refinement |
| Create enterprise task             |         Yes |                         No |
| Maintain execution context         |         Yes |           Propagate/extend |
| Build high-level task dependencies |         Yes |  Domain-level dependencies |
| Discover Delegator                 |         Yes |                         No |
| Create A2A request                 |         Yes |                   Receives |
| Invoke downstream agent            |         Yes |           Yes, when needed |
| Decompose domain task              |          No |                        Yes |
| Select Workers                     |          No |                        Yes |
| Execute tools                      |          No |            Through Workers |
| Aggregate domain results           |          No |                        Yes |
| Aggregate enterprise workflow      |         Yes |                         No |
| Final response                     |         Yes |                         No |

---

# 30. Final Architecture Definition

The Coordinator acts as the **enterprise execution controller**.

Its process is:

```text
Understand
   ↓
Structure
   ↓
Create Tasks
   ↓
Attach Context
   ↓
Determine Dependencies
   ↓
Discover Agent
   ↓
Authorize
   ↓
Create A2A Request
   ↓
Invoke Delegator
   ↓
Track Execution
   ↓
Receive Results
   ↓
Aggregate
   ↓
Govern
   ↓
Respond
```

The most important architectural distinction is:

```text
Coordinator
    |
    | Creates WHAT needs to be accomplished
    | Maintains WHY and CONTEXT
    | Controls WHERE it is executed
    |
    v
Delegator
    |
    | Determines HOW the business domain accomplishes it
    |
    v
Workers
    |
    | Perform the actual operations
    |
    v
Enterprise Systems
```

## Key Principle

> **The Coordinator does not simply forward a user's message to another agent. It transforms the request into a structured execution task, attaches the required business and execution context, establishes dependencies and routing information, and sends a governed A2A execution request to the selected Delegator.**

This is what makes the Coordinator the **control plane of CWD**, while Delegators and Workers form the downstream **execution plane**.
