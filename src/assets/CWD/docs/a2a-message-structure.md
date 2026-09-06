# Understanding the Structure and Metadata of Agent Communication Messages

In the **CWD (Coordinator–Delegator–Worker) architecture**, agent communication messages are the standardized envelopes used to exchange **tasks, context, status, results, errors, and control information** between independent agents.

The key idea is:

> **The message payload describes the business task or result; metadata describes how that message should be processed, correlated, secured, traced, and governed.**

---

## 1. Why Agent Messages Need Structure

Consider a Coordinator sending a task to a Shipping Delegator.

A simple message such as:

```text
"Check why shipment SHIP123 is delayed"
```

is insufficient for enterprise orchestration.

The receiving agent also needs to know:

* Who sent the request?
* Who should process it?
* Which workflow does it belong to?
* Is it a new task or a retry?
* What is the parent task?
* What capability is required?
* What is the priority?
* What is the deadline?
* What authorization context applies?
* What response is expected?
* How should the result be correlated?
* How should failures be handled?

Therefore, CWD should use a **structured message contract**.

---

# 2. High-Level Message Structure

A useful conceptual structure is:

```text
Agent Message
│
├── Metadata
│   ├── message_id
│   ├── message_type
│   ├── timestamp
│   ├── protocol_version
│   ├── correlation_id
│   ├── workflow_id
│   ├── parent_task_id
│   └── idempotency_key
│
├── Routing Information
│   ├── source_agent
│   ├── target_agent
│   ├── capability
│   └── destination
│
├── Security Context
│   ├── user_identity
│   ├── agent_identity
│   ├── tenant
│   ├── authorization_context
│   └── data_classification
│
├── Task / Message Payload
│   ├── intent
│   ├── action
│   ├── input
│   ├── constraints
│   └── expected_output
│
└── Control Information
    ├── priority
    ├── deadline
    ├── retry_count
    ├── timeout
    └── response_required
```

---

# 3. Metadata vs Payload

This distinction is extremely important.

### Metadata

Metadata describes the **communication and execution context**.

Example:

```json
{
  "message_id": "MSG-9001",
  "correlation_id": "CORR-7890",
  "workflow_id": "WF-1001",
  "source_agent": "coordinator",
  "target_agent": "shipping-delegator",
  "priority": "high"
}
```

It answers:

> **How should this message be tracked and processed?**

### Payload

Payload describes the **actual business request**.

```json
{
  "intent": "investigate_shipment_delay",
  "input": {
    "shipment_id": "SHIP123"
  }
}
```

It answers:

> **What does the receiving agent need to do?**

---

# 4. Core Message Metadata

## 4.1 `message_id`

Uniquely identifies the individual message.

```json
{
  "message_id": "MSG-9001"
}
```

Useful for:

* tracing
* deduplication
* auditing
* debugging
* message acknowledgment

Think:

```text
message_id = identity of this communication
```

---

# 5. `correlation_id`

The `correlation_id` connects multiple messages belonging to the same business request.

For example:

```text
User Request
    │
    │ CORR-7890
    ▼
Coordinator
    │
    │ CORR-7890
    ▼
Shipping Delegator
    │
    │ CORR-7890
    ▼
Tracking Worker
    │
    │ CORR-7890
    ▼
MCP
```

Every component can use:

```text
CORR-7890
```

to reconstruct the complete execution path.

This is essential for distributed tracing.

---

# 6. `workflow_id`

Identifies the overall workflow execution.

```json
{
  "workflow_id": "WF-1001"
}
```

For example:

```text
WF-1001
│
├── Intent Analysis
├── Authorization
├── Shipping Delegation
├── Customer Delegation
├── Finance Delegation
└── Final Response
```

A workflow may contain many tasks and messages.

Therefore:

```text
workflow_id
    ↓
entire workflow

task_id
    ↓
specific task

message_id
    ↓
specific communication
```

---

# 7. `task_id`

Identifies a specific unit of work.

Example:

```json
{
  "task_id": "TASK-5001"
}
```

The Coordinator may create:

```text
TASK-5001
   │
   ├── Shipping investigation
   │
   └── delegated to Shipping Delegator
```

The Delegator can create child tasks:

```text
TASK-5001
│
├── TASK-5101 → Tracking Worker
├── TASK-5102 → Carrier Worker
└── TASK-5103 → Logistics Worker
```

---

# 8. `parent_task_id`

This establishes the parent-child task relationship.

```json
{
  "task_id": "TASK-5101",
  "parent_task_id": "TASK-5001"
}
```

This gives CWD a task hierarchy:

```text
Coordinator Task
TASK-5001
      │
      ├── Delegator Task
      │   TASK-5100
      │
      ├── Worker Task
      │   TASK-5101
      │
      └── Worker Task
          TASK-5102
```

This becomes particularly important when multiple Workers execute in parallel.

---

# 9. `source_agent`

Identifies the sender.

```json
{
  "source_agent": "shipping-delegator"
}
```

For example:

```text
Coordinator
     │
     │ source_agent = coordinator
     ▼
Shipping Delegator
```

---

# 10. `target_agent`

Identifies the intended receiver.

```json
{
  "target_agent": "shipping-delegator"
}
```

Together:

```json
{
  "source_agent": "coordinator",
  "target_agent": "shipping-delegator"
}
```

means:

```text
Coordinator → Shipping Delegator
```

---

# 11. `message_type`

Defines what kind of communication is being sent.

Typical conceptual message types include:

```text
TASK_REQUEST
TASK_ACCEPTED
TASK_STARTED
STATUS_UPDATE
TASK_RESULT
TASK_FAILED
TASK_CANCEL
TASK_RETRY
INPUT_REQUIRED
APPROVAL_REQUIRED
```

For example:

```json
{
  "message_type": "TASK_REQUEST"
}
```

versus:

```json
{
  "message_type": "TASK_RESULT"
}
```

This allows the receiving runtime to understand the purpose of the message.

---

# 12. `timestamp`

Records when the message was created.

```json
{
  "timestamp": "2026-09-06T15:10:00Z"
}
```

Useful for:

* latency analysis
* SLA monitoring
* debugging
* ordering
* audit
* timeout calculation

---

# 13. `protocol_version`

Allows agents to evolve independently.

```json
{
  "protocol_version": "1.0"
}
```

Suppose:

```text
Coordinator → protocol v1
Shipping Agent → protocol v2
```

A versioned communication contract allows the platform to manage compatibility instead of breaking integrations.

---

# 14. Capability Metadata

The message can indicate what capability is required.

```json
{
  "capability": "shipment_tracking"
}
```

This is useful when the Coordinator or Delegator performs dynamic routing.

For example:

```text
Task:
    capability = shipment_tracking

             ↓

Agent Registry

             ↓

Tracking Agent
```

Important distinction:

```text
Agent Registry
    → discovers who can perform the capability

A2A
    → communicates the task

Agent
    → performs the task
```

---

# 15. Task Payload

The actual task can be represented as:

```json
{
  "intent": "investigate_shipment_delay",

  "action": "get_tracking_events",

  "input": {
    "shipment_id": "SHIP123"
  }
}
```

The receiving agent now knows:

```text
Intent
  ↓
Why?

Action
  ↓
What operation?

Input
  ↓
What data?
```

---

# 16. Constraints

Enterprise tasks usually need execution constraints.

Example:

```json
{
  "constraints": {
    "timeout_ms": 5000,
    "priority": "high",
    "max_retries": 2,
    "deadline": "2026-09-06T15:30:00Z"
  }
}
```

These constraints help the receiving agent make execution decisions.

For example:

```text
timeout = 5 seconds
max retries = 2
priority = HIGH
```

The Delegator can use this information when scheduling Workers.

---

# 17. Expected Output

The sender can define the expected result shape.

```json
{
  "expected_output": {
    "shipment_status": true,
    "root_cause": true,
    "recommendation": true
  }
}
```

This reduces ambiguity between agents.

Instead of:

```text
"Give me the result"
```

the receiving agent knows:

```text
Required:
    shipment_status
    root_cause
    recommendation
```

---

# 18. Security Metadata

Enterprise agent communication should carry security context where appropriate.

Conceptually:

```json
{
  "security": {
    "tenant_id": "TENANT-001",
    "agent_identity": "coordinator-service",
    "user_identity": "user-123",
    "data_classification": "internal"
  }
}
```

However, sensitive identity information should be handled according to the enterprise identity architecture rather than blindly copying credentials into every message.

The principle is:

> **Propagate identity context, not secrets.**

For example:

```text
User Identity
      │
      ▼
Coordinator
      │
      │ authorized identity context
      ▼
Delegator
      │
      ▼
Worker
```

Authentication tokens, secrets, API keys, and passwords should not be embedded in normal agent payloads.

---

# 19. Idempotency Metadata

For operations that may have side effects, an idempotency key is extremely important.

Example:

```json
{
  "idempotency_key": "IDEMP-ABC123"
}
```

Suppose:

```text
Coordinator
    ↓
Delegator
    ↓
Worker
    ↓
Create Order
```

The Worker times out after successfully creating the order.

A retry occurs.

Without idempotency:

```text
Retry
  ↓
Create Order Again
  ↓
Duplicate Order ❌
```

With idempotency:

```text
Retry
  ↓
Same idempotency_key
  ↓
Backend recognizes previous operation
  ↓
No duplicate operation
```

---

# 20. Complete CWD Task Message

A conceptual Coordinator → Delegator message could look like this:

```json
{
  "message_id": "MSG-9001",
  "message_type": "TASK_REQUEST",
  "protocol_version": "1.0",

  "timestamp": "2026-09-06T15:10:00Z",

  "workflow_id": "WF-1001",
  "correlation_id": "CORR-7890",

  "task": {
    "task_id": "TASK-5001",
    "parent_task_id": null,

    "intent": "investigate_shipment_delay",
    "capability": "shipment_management",

    "action": "investigate_delay",

    "input": {
      "shipment_id": "SHIP123"
    },

    "constraints": {
      "priority": "high",
      "timeout_ms": 10000,
      "max_retries": 2,
      "deadline": "2026-09-06T15:30:00Z"
    },

    "expected_output": {
      "shipment_status": true,
      "root_cause": true,
      "recommendation": true
    }
  },

  "routing": {
    "source_agent": "coordinator",
    "target_agent": "shipping-delegator"
  },

  "security": {
    "agent_identity": "coordinator-service",
    "data_classification": "internal"
  },

  "control": {
    "idempotency_key": "IDEMP-5001",
    "response_required": true
  }
}
```

---

# 21. Delegator → Worker Message

The Delegator can create a child task:

```json
{
  "message_id": "MSG-9101",
  "message_type": "TASK_REQUEST",

  "workflow_id": "WF-1001",
  "correlation_id": "CORR-7890",

  "task": {
    "task_id": "TASK-5101",
    "parent_task_id": "TASK-5001",

    "capability": "shipment_tracking",

    "action": "get_tracking_events",

    "input": {
      "shipment_id": "SHIP123"
    },

    "constraints": {
      "timeout_ms": 5000,
      "priority": "high"
    }
  },

  "routing": {
    "source_agent": "shipping-delegator",
    "target_agent": "tracking-worker"
  }
}
```

Notice the hierarchy:

```text
TASK-5001
Coordinator
    │
    └── Shipping Delegator
             │
             └── TASK-5101
                 Tracking Worker
```

---

# 22. Worker → Delegator Result Message

The Worker returns a structured result.

```json
{
  "message_id": "MSG-9201",
  "message_type": "TASK_RESULT",
  "protocol_version": "1.0",

  "workflow_id": "WF-1001",
  "correlation_id": "CORR-7890",

  "task": {
    "task_id": "TASK-5101",
    "parent_task_id": "TASK-5001"
  },

  "routing": {
    "source_agent": "tracking-worker",
    "target_agent": "shipping-delegator"
  },

  "execution": {
    "status": "completed",
    "duration_ms": 1240
  },

  "result": {
    "shipment_id": "SHIP123",
    "latest_status": "delayed",
    "location": "Dallas",
    "root_cause": "carrier_capacity_constraint"
  },

  "errors": [],

  "metadata": {
    "tools_used": [
      "get_tracking_events"
    ]
  }
}
```

---

# 23. Message Lifecycle

A production CWD message may move through:

```text
              ┌─────────────────┐
              │ Create Message  │
              └────────┬────────┘
                       ↓
              ┌─────────────────┐
              │ Authenticate    │
              └────────┬────────┘
                       ↓
              ┌─────────────────┐
              │ Validate Schema │
              └────────┬────────┘
                       ↓
              ┌─────────────────┐
              │ Authorize       │
              └────────┬────────┘
                       ↓
              ┌─────────────────┐
              │ Route Message   │
              └────────┬────────┘
                       ↓
              ┌─────────────────┐
              │ Execute Task    │
              └────────┬────────┘
                       ↓
              ┌─────────────────┐
              │ Update State    │
              └────────┬────────┘
                       ↓
              ┌─────────────────┐
              │ Return Result   │
              └────────┬────────┘
                       ↓
              ┌─────────────────┐
              │ Audit/Trace     │
              └─────────────────┘
```

---

# 24. Message Metadata and LangGraph State

This is especially important in CWD.

The incoming message becomes part of the LangGraph execution state.

Conceptually:

```python
state = {
    "workflow_id": "WF-1001",
    "correlation_id": "CORR-7890",

    "current_task": {
        "task_id": "TASK-5001",
        "source": "coordinator",
        "target": "shipping-delegator"
    },

    "input": {
        "shipment_id": "SHIP123"
    },

    "results": [],
    "errors": [],
    "status": "working"
}
```

Then LangGraph executes:

```text
Message
   ↓
State
   ↓
Node
   ↓
State Update
   ↓
Conditional Edge
   ↓
Next Node
```

So:

```text
A2A Message
     ↓
LangGraph State
     ↓
Workflow Execution
     ↓
Result Message
```

---

# 25. Message vs LangGraph State

Don't confuse the two.

| Concept         | Purpose                                     |
| --------------- | ------------------------------------------- |
| Message         | Communication between agents                |
| Metadata        | Communication/execution context             |
| Payload         | Business task/result                        |
| LangGraph State | Internal workflow execution state           |
| Checkpoint      | Persisted workflow state                    |
| A2A             | Agent-to-agent communication contract       |
| MCP             | Agent/Worker-to-tool capability integration |

For example:

```text
Coordinator
    │
    │ A2A Message
    ▼
Delegator
    │
    │ internal LangGraph State
    ▼
Worker
    │
    │ MCP Message
    ▼
Enterprise System
```

---

# 26. Why Metadata Is Critical in Distributed CWD

Imagine 20 agents and hundreds of Workers.

Without metadata, you cannot reliably determine:

```text
Which request?
Which workflow?
Which parent task?
Which Worker?
Which user?
Which agent?
Which retry?
Which result?
Which failure?
```

With metadata:

```text
correlation_id
      ↓
workflow

task_id
      ↓
specific task

parent_task_id
      ↓
task hierarchy

message_id
      ↓
specific message

source/target
      ↓
communication direction

timestamp
      ↓
timing

idempotency_key
      ↓
duplicate protection
```

This turns distributed agent execution into something that can be **traced, audited, recovered, and governed**.

---

# 27. Message Structure Across CWD

The complete communication model becomes:

```text
                 ┌──────────────────────┐
                 │     Coordinator      │
                 └──────────┬───────────┘
                            │
                       A2A Message
                            │
                            ▼
                 ┌──────────────────────┐
                 │      Delegator       │
                 └──────────┬───────────┘
                            │
                      Task Message
                            │
                            ▼
                 ┌──────────────────────┐
                 │       Worker         │
                 └──────────┬───────────┘
                            │
                       MCP Message
                            │
                            ▼
                 ┌──────────────────────┐
                 │ Enterprise System    │
                 └──────────────────────┘
```

And results travel upward:

```text
Enterprise System
       ↓
     MCP
       ↓
    Worker
       ↓
Worker Result
       ↓
  Delegator
       ↓
Domain Result
       ↓
 Coordinator
       ↓
Enterprise Result
```

---

# 28. Important Design Principle

A good agent message should be:

### Structured

Machine-readable rather than free-form text.

### Correlatable

Every task/result should be traceable.

### Versioned

Communication contracts must evolve safely.

### Secure

Identity and authorization context must be governed.

### Idempotent

Retries should not create unintended duplicate operations.

### Minimal

Only required context should be transmitted.

### Validatable

Schema and business rules must be checked.

### Observable

Messages should support distributed tracing and auditing.

---

# 29. Common Anti-Patterns

### ❌ Sending only natural language

```json
{
  "message": "Please investigate shipment"
}
```

Too ambiguous for enterprise orchestration.

### ❌ No correlation ID

Makes distributed tracing extremely difficult.

### ❌ No task hierarchy

Delegator cannot reliably associate Worker results with parent work.

### ❌ Sending secrets

```json
{
  "api_key": "secret123"
}
```

Never put secrets into agent messages.

### ❌ Trusting LLM-generated metadata

The LLM may recommend:

```text
target_agent = finance-agent
```

but the runtime should validate that target through the Agent Registry and policy layer.

### ❌ Returning raw backend responses

Workers should transform raw API/MCP results into governed Worker-level results.

---

# 30. CWD Responsibility Model

| Layer          | Responsibility                             |
| -------------- | ------------------------------------------ |
| Coordinator    | Creates enterprise-level task              |
| A2A            | Defines agent communication                |
| Delegator      | Decomposes and manages domain tasks        |
| Worker         | Executes specialized task                  |
| MCP            | Connects Worker to enterprise capabilities |
| LangGraph      | Manages workflow state/transitions         |
| Agent Registry | Discovers capable agents                   |
| Policy/IAM     | Authorizes execution                       |
| Message Bus    | Provides asynchronous delivery/buffering   |
| Observability  | Tracks messages and execution              |

---

# 31. Interview-Ready Answer

> **Agent communication messages should use a structured envelope containing both metadata and business payload. Metadata typically includes message ID, message type, protocol version, workflow ID, correlation ID, task ID, parent task ID, source and target agents, timestamps, capability information, priority, deadlines, retry and idempotency information, and appropriate security context. The payload contains the actual task, input data, constraints, expected output, or execution result.**
>
> **In CWD, this structure allows the Coordinator, Delegators, and Workers to exchange tasks and results without tightly coupling their internal implementations. Correlation IDs and task relationships allow distributed execution to be traced, while status, retry, deadline, and idempotency metadata support reliable workflow execution. LangGraph consumes the message information as workflow state and uses it for routing and recovery, while A2A provides the agent-to-agent communication contract and MCP handles Worker-to-enterprise capability interaction.**

## Core Formula

```text
Agent Message
=
Metadata
+
Routing
+
Security Context
+
Task/Result Payload
+
Execution Control
```

And the most important mental model is:

```text
message_id       → Which message?
workflow_id      → Which workflow?
correlation_id   → Which business request?
task_id          → Which task?
parent_task_id   → Who created this task?
source_agent     → Who sent it?
target_agent     → Who receives it?
message_type     → What kind of message?
payload          → What needs to be done / what happened?
control metadata → How should it be executed?
security context → Who is allowed to perform it?
```

**Definition:**

> **Agent communication message structure is the standardized envelope that carries task or result payloads together with identity, routing, correlation, workflow, security, execution, and control metadata, enabling CWD agents to communicate reliably, securely, traceably, and asynchronously across distributed workflows.**
