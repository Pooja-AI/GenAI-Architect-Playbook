# Agent-to-Agent Communication in CWD

**Agent-to-Agent (A2A) communication** enables independent CWD agents to collaborate by exchanging **structured tasks, execution context, status, and results** without tightly coupling their internal implementations.

In CWD, this is primarily the communication mechanism between the **Coordinator and Delegators**, and it can also be used between Delegators or between other independently managed agents when cross-domain collaboration is required.

### Core principle

> **A2A defines how independent agents communicate; LangGraph controls the workflow around that communication; MCP connects an agent to external capabilities.**

```text
                 CWD
                  │
        ┌─────────┴─────────┐
        │                   │
   Coordinator          Delegator A
        │                   │
        │ A2A Task          │
        ▼                   ▼
   Delegator B          Worker Pool
        │                   │
        │ A2A Result        │
        ▼                   │
   Coordinator ◄────────────┘
```

---

# 1. Why Agent-to-Agent Communication Is Needed

A production enterprise system should not put all intelligence into one giant agent.

Instead, responsibilities can be separated:

```text
Coordinator
    │
    ├── Customer Domain Agent
    │
    ├── Order Domain Agent
    │
    ├── Finance Domain Agent
    │
    ├── Inventory Domain Agent
    │
    └── Support Domain Agent
```

Each agent can have:

* its own domain logic
* its own tools
* its own prompts
* its own policies
* its own Worker pool
* its own deployment lifecycle
* its own scaling characteristics
* its own observability

A2A provides the communication boundary between these independent agents.

---

# 2. CWD Agent Hierarchy

A typical CWD architecture is:

```text
                    User
                      │
                      ▼
                Coordinator
                      │
             ┌────────┴────────┐
             │                 │
          A2A Task          A2A Task
             │                 │
             ▼                 ▼
       Order Delegator    Customer Delegator
             │                 │
        ┌────┴────┐       ┌────┴────┐
        ▼         ▼       ▼         ▼
   Order Worker  ... Customer Worker
        │
        │ MCP
        ▼
 Enterprise Systems
```

The important separation is:

```text
A2A
=
Agent ↔ Agent

MCP
=
Agent/Worker ↔ Tool/System
```

---

# 3. What Is Exchanged Between Agents?

An A2A interaction should not simply be:

```text
"Hey, do this."
```

Instead, the sending agent should provide a structured task.

For example:

```json
{
  "task_id": "task-1001",
  "parent_task_id": "task-9000",
  "correlation_id": "corr-789",
  "source_agent": "coordinator",
  "target_agent": "order-delegator",

  "intent": "investigate_order",

  "task": {
    "order_id": "ORD-12345",
    "customer_id": "CUST-100"
  },

  "priority": "high",
  "deadline": "2026-09-06T17:00:00Z",

  "required_capabilities": [
    "order_lookup",
    "shipment_tracking"
  ]
}
```

The receiving Delegator now has a well-defined contract.

---

# 4. Task Request Lifecycle

The basic lifecycle is:

```text
Agent A
   │
   │ 1. Create task
   ▼
A2A Message
   │
   │ 2. Authenticate
   ▼
Agent B
   │
   │ 3. Validate request
   ▼
Authorization / Policy
   │
   │ 4. Accept
   ▼
Agent B Workflow
   │
   │ 5. Execute
   ▼
Workers / MCP
   │
   │ 6. Produce result
   ▼
Agent B
   │
   │ 7. Return result
   ▼
A2A Response
   │
   ▼
Agent A
```

---

# 5. Agent Discovery

Before communication, the Coordinator may need to determine:

> **Which agent can perform this task?**

This is where the **Agent Registry** becomes important.

For example:

```json
{
  "agent_id": "order-delegator",
  "domain": "order-management",
  "capabilities": [
    "order_lookup",
    "shipment_tracking",
    "order_update"
  ],
  "status": "healthy",
  "version": "2.4",
  "endpoint": "internal-agent-endpoint"
}
```

The Coordinator can select the appropriate agent based on:

```text
Capability
+
Policy
+
Health
+
Availability
+
Version
+
Workload
+
Deadline
```

This is different from MCP tool discovery.

```text
Agent Registry
      ↓
"What agent can perform this task?"

MCP Discovery
      ↓
"What tools/resources does this agent's MCP server expose?"
```

---

# 6. A2A Task Delegation

Suppose the user asks:

> "Investigate order ORD-12345 and tell me why it has not arrived."

The Coordinator may determine that multiple domains are required.

```text
Coordinator
     │
     ├── A2A → Order Agent
     │
     ├── A2A → Shipping Agent
     │
     └── A2A → Customer Agent
```

Each agent independently processes its task.

### Order Agent

```text
Find order
Check status
Check fulfillment
Return order information
```

### Shipping Agent

```text
Find shipment
Check tracking
Check carrier events
Return shipping information
```

### Customer Agent

```text
Check customer/account information
Return relevant information
```

The Coordinator eventually aggregates these results.

---

# 7. Structured Result

Agents should return structured results rather than arbitrary natural-language responses.

For example:

```json
{
  "task_id": "task-1001",
  "source_agent": "order-delegator",
  "status": "completed",

  "result": {
    "order_id": "ORD-12345",
    "status": "SHIPPED",
    "shipment_id": "SHIP-7788",
    "last_known_location": "Dallas",
    "exception": "Carrier delay"
  },

  "confidence": 0.94,

  "completed_at": "2026-09-06T16:20:00Z"
}
```

This makes downstream processing deterministic.

---

# 8. Agent-to-Agent State Propagation

The sending agent should not send its entire internal workflow state.

Instead, it should send the **minimum context required by the receiving agent**.

For example:

```text
Coordinator State
      │
      │ selected context
      ▼
A2A Task
      │
      ▼
Delegator State
```

Conceptually:

```python
a2a_task = {
    "task_id": state["task_id"],
    "correlation_id": state["correlation_id"],
    "intent": state["intent"],
    "customer_id": state["customer_id"],
    "order_id": state["order_id"],
    "constraints": state["constraints"]
}
```

This is important for:

* security
* privacy
* token efficiency
* data minimization
* loose coupling

---

# 9. Parent and Child Tasks

CWD workflows can create hierarchical tasks.

```text
Parent Task
TASK-100
   │
   ├── TASK-101 → Order Agent
   │
   ├── TASK-102 → Shipping Agent
   │
   └── TASK-103 → Customer Agent
```

Each child task contains:

```text
parent_task_id = TASK-100
```

This allows the Coordinator to understand:

```text
Which workflow created this task?
Which agent owns it?
What is its status?
Which result belongs to which task?
```

---

# 10. Correlation IDs

Every A2A interaction should carry a correlation identifier.

```text
correlation_id = CORR-123
```

Then:

```text
Coordinator
     │
     ├── Delegator
     │      ├── Worker
     │      └── MCP
     │
     ├── Delegator
     │      └── Worker
     │
     └── Delegator
```

can all be associated with:

```text
CORR-123
```

This is extremely valuable for enterprise observability.

You can trace:

```text
User Request
   ↓
Coordinator
   ↓
A2A Task
   ↓
Delegator
   ↓
Worker
   ↓
MCP Tool
   ↓
Enterprise API
```

using one correlation chain.

---

# 11. A2A + LangGraph

This is where the distinction becomes important.

**A2A does not replace LangGraph.**

Instead:

```text
LangGraph
    =
"What should happen next?"

A2A
    =
"How does Agent A communicate with Agent B?"
```

For example:

```text
Coordinator LangGraph

START
  │
  ▼
Understand Intent
  │
  ▼
Authorize
  │
  ▼
Plan
  │
  ▼
Discover Agents
  │
  ▼
Delegate via A2A
  │
  ▼
Wait for Results
  │
  ▼
Aggregate
  │
  ▼
Final Response
```

The `Delegate via A2A` node performs the actual agent-to-agent communication.

---

# 12. A2A + StateGraph

The A2A task becomes part of the CWD workflow state.

For example:

```python
state = {
    "workflow_id": "WF-001",
    "correlation_id": "CORR-123",

    "tasks": [
        {
            "task_id": "TASK-101",
            "agent": "order-delegator",
            "status": "running"
        }
    ],

    "results": [],

    "errors": []
}
```

When the Delegator responds:

```python
state["results"].append({
    "task_id": "TASK-101",
    "status": "completed",
    "result": {
        "order_status": "SHIPPED"
    }
})
```

LangGraph can then use that updated state to determine the next node.

```text
A2A Result
    ↓
Update State
    ↓
Conditional Edge
    │
    ├── More tasks → Execute
    │
    ├── Retry → Retry
    │
    ├── Approval → Human Review
    │
    ├── Failure → Recovery
    │
    └── Complete → Aggregate
```

---

# 13. Asynchronous Agent Communication

Enterprise agents should not always require synchronous request/response.

For long-running tasks:

```text
Coordinator
     │
     │ Submit A2A Task
     ▼
Delegator
     │
     │ Acknowledge
     ▼
Coordinator
     │
     │ continue / wait
     ▼
Delegator
     │
     │ executes Workers
     ▼
Result Event
     │
     ▼
Coordinator
```

This is useful when:

* tasks take minutes or hours
* external systems are slow
* human approval is required
* Workers are busy
* workflows need durable execution

A message broker can support this pattern:

```text
Coordinator
      │
      ▼
Service Bus / Kafka
      │
      ▼
Delegator
```

The broker provides decoupling, buffering and scalable delivery, while A2A defines the agent-level task/result contract.

---

# 14. Failure Handling

A2A communication must account for failures.

For example:

```text
Coordinator
     │
     │ A2A
     ▼
Order Agent
     │
     X
  timeout
```

The Coordinator should distinguish:

```text
Timeout
Transient failure
Permanent failure
Authorization failure
Invalid task
Agent unavailable
Dependency failure
```

Then LangGraph can route appropriately.

```text
A2A Failure
    │
    ▼
Classify Error
    │
    ├── Retryable
    │       ↓
    │     Retry
    │
    ├── Agent unavailable
    │       ↓
    │     Rediscover / Redistribute
    │
    ├── Authorization failure
    │       ↓
    │     Stop / Escalate
    │
    └── Permanent failure
            ↓
          Recovery
```

---

# 15. Retry and Idempotency

A dangerous pattern is:

```text
A2A request
   ↓
Agent executes write
   ↓
Network timeout
   ↓
Coordinator retries
   ↓
Agent executes write again
```

This can create duplicate operations.

For example:

```text
create_order()
```

might accidentally create two orders.

Therefore A2A tasks should have unique identifiers:

```text
task_id = TASK-123
```

and operations should use idempotency where appropriate:

```text
idempotency_key = TASK-123
```

The receiving agent can recognize:

```text
TASK-123 already completed
```

and return the existing result rather than performing the operation again.

---

# 16. Security of Agent-to-Agent Communication

A2A must be secured just like any enterprise service-to-service interaction.

```text
Agent A
   │
   │ Authentication
   ▼
Agent B
   │
   ├── Authenticate Agent A
   ├── Validate identity
   ├── Authorize task
   ├── Validate payload
   ├── Check policy
   └── Audit request
```

Security controls include:

* service authentication
* workload identity
* OAuth tokens
* mutual TLS where appropriate
* authorization
* RBAC/ABAC
* tenant isolation
* task-level permissions
* input validation
* data minimization
* encryption in transit
* audit logging
* rate limiting

---

# 17. Don't Trust Another Agent Automatically

A critical enterprise principle:

> **Agent-to-agent communication does not imply automatic trust.**

For example:

```text
Customer Agent
       │
       │ requests
       ▼
Finance Agent
```

The Finance Agent should still validate:

```text
Who is calling?
Is Customer Agent authorized?
What operation is requested?
Which customer?
Which data?
Is the operation permitted?
Does approval exist?
```

An agent should never assume:

```text
"Coordinator sent it, therefore it is authorized."
```

Authorization remains an independent security concern.

---

# 18. Agent Capability Contracts

Independent agents should publish a clear capability contract.

For example:

```json
{
  "agent_id": "shipping-agent",
  "capabilities": [
    {
      "name": "track_shipment",
      "description": "Retrieve shipment tracking information",
      "input": {
        "shipment_id": "string"
      }
    }
  ]
}
```

The calling agent can determine whether the target agent supports the required capability.

This promotes **loose coupling**.

The Coordinator does not need to know:

```text
How the Shipping Agent implements tracking.
```

It only needs to know:

```text
What capability it provides.
What inputs it accepts.
What results it returns.
```

---

# 19. Independent Agent Deployment

One of the biggest advantages of A2A is independent lifecycle management.

```text
             A2A
              │
     ┌────────┼────────┐
     │        │        │
 Order     Finance   Support
 Agent      Agent     Agent
     │        │        │
     ▼        ▼        ▼
 Version    Version   Version
  2.1        4.2       1.8
```

Each can:

* scale independently
* deploy independently
* upgrade independently
* use different models
* use different tools
* maintain different prompts
* have different domain policies

This makes the architecture more modular.

---

# 20. A2A vs MCP

This is one of the most important interview distinctions.

| Aspect          | A2A                        | MCP                            |
| --------------- | -------------------------- | ------------------------------ |
| Communication   | Agent ↔ Agent              | Agent/Application ↔ Capability |
| Purpose         | Collaboration              | Tool/resource integration      |
| Example         | Coordinator → Order Agent  | Worker → `get_order_status`    |
| Main object     | Task/result                | Tool/resource/prompt           |
| Discovery       | Agent capability discovery | Tool/resource discovery        |
| Workflow        | External to protocol       | External to protocol           |
| Backend         | Another agent              | Enterprise system/service      |
| Typical CWD use | Coordinator ↔ Delegator    | Worker ↔ Enterprise capability |

Think:

```text
A2A
Agent ───────────── Agent

MCP
Agent ───────────── Tool ───────────── Enterprise System
```

---

# 21. A2A vs API Calls

A REST API might look like:

```text
POST /orders/investigate
```

A2A represents a higher-level **agent collaboration contract**.

For example:

```text
"Investigate this order using your domain capabilities,
return findings, confidence, evidence and status."
```

The receiving agent can internally perform:

```text
Planning
  ↓
Workers
  ↓
MCP tools
  ↓
Enterprise systems
  ↓
Validation
  ↓
Aggregation
```

The caller does not need to know these implementation details.

---

# 22. Complete CWD Example

User asks:

> **"Why is customer C123's order delayed?"**

### Step 1 — Coordinator

```text
Understand Intent
       ↓
Investigate delayed order
```

### Step 2 — Planning

Coordinator determines:

```text
Need:
- Order information
- Shipment information
- Customer information
```

### Step 3 — Agent discovery

```text
Agent Registry
    │
    ├── Order Agent
    ├── Shipping Agent
    └── Customer Agent
```

### Step 4 — A2A delegation

```text
Coordinator
   │
   ├── A2A → Order Agent
   │
   ├── A2A → Shipping Agent
   │
   └── A2A → Customer Agent
```

### Step 5 — Independent execution

```text
Order Agent
    ↓
Order Worker
    ↓
MCP
    ↓
Order API


Shipping Agent
    ↓
Shipping Worker
    ↓
MCP
    ↓
Carrier API


Customer Agent
    ↓
Customer Worker
    ↓
MCP
    ↓
CRM
```

### Step 6 — Results

```text
Order Agent
    ↓
Order Result

Shipping Agent
    ↓
Shipping Result

Customer Agent
    ↓
Customer Result
```

### Step 7 — Coordinator aggregation

```text
                    Coordinator
                         ▲
             ┌───────────┼───────────┐
             │           │           │
        Order Result Shipping     Customer
                     Result        Result
             │           │           │
             └───────────┼───────────┘
                         ▼
                     Aggregate
                         ↓
                  Generate Answer
```

---

# 23. End-to-End CWD Architecture

```text
                         USER
                           │
                           ▼
                    API / Gateway
                           │
                           ▼
                    COORDINATOR
                           │
                 LangGraph Workflow
                           │
             ┌─────────────┼─────────────┐
             │             │             │
            A2A           A2A           A2A
             │             │             │
             ▼             ▼             ▼
        Order Agent   Shipping Agent  Customer Agent
             │             │             │
          LangGraph     LangGraph     LangGraph
             │             │             │
             ▼             ▼             ▼
          Workers       Workers       Workers
             │             │             │
            MCP           MCP           MCP
             │             │             │
             ▼             ▼             ▼
       Enterprise APIs / Databases / SaaS
             │             │             │
             └─────────────┼─────────────┘
                           │
                        Results
                           │
                           ▼
                    Agent Aggregation
                           │
                           ▼
                      Coordinator
                           │
                           ▼
                     Final Response
```

---

# 24. Responsibility Separation

| Component      | Responsibility                         |
| -------------- | -------------------------------------- |
| Coordinator    | Global planning and orchestration      |
| Agent Registry | Discover/select capable agents         |
| A2A            | Agent-to-agent communication           |
| Delegator      | Domain decomposition and orchestration |
| Worker         | Specialized task execution             |
| LangGraph      | State, routing, retries, checkpoints   |
| MCP Client     | Connect Worker to MCP server           |
| MCP Server     | Expose governed capabilities           |
| Policy         | Authorization and governance           |
| Service Bus    | Async messaging/decoupling             |
| Observability  | Trace agent interactions               |

This separation prevents one technology from becoming responsible for the entire architecture.

---

# 25. Key Design Principles

### 1. Loose coupling

Agents communicate through contracts rather than implementation details.

### 2. Structured messages

Use explicit task/result schemas.

### 3. Identity propagation

Preserve:

```text
user
application
agent
workflow
task
correlation ID
```

### 4. Least privilege

An agent should only invoke capabilities it is authorized to use.

### 5. Idempotency

Important for retries and duplicate message delivery.

### 6. Async support

Long-running agent tasks should not require blocking synchronous calls.

### 7. Observability

Every A2A interaction should be traceable.

### 8. Explicit ownership

Each task should have a clearly identifiable owning agent.

---

# 26. Interview-Ready Answer

If asked:

> **"How does A2A communication work in your CWD architecture?"**

A strong answer is:

> **"In CWD, A2A provides the communication boundary between independently deployed agents. The Coordinator discovers capable domain agents through the Agent Registry, creates a structured task containing the intent, task ID, correlation ID, context, constraints and required capabilities, and sends it to the appropriate Delegator through A2A. The receiving agent authenticates and authorizes the request, validates the task, and runs its own LangGraph workflow to decompose and execute the work using its Workers and MCP-connected enterprise tools. It then returns a structured result containing task status, result data, errors, confidence and execution metadata. The Coordinator updates its workflow state and uses LangGraph conditional routing to aggregate results, retry, redistribute, request human approval, recover, or complete the workflow. A2A therefore handles agent-to-agent collaboration, while LangGraph handles workflow state and control, and MCP handles access to external enterprise capabilities."**

---

# Final Definition

**Agent-to-agent communication in CWD is a structured communication mechanism that allows independently deployed Coordinator, Delegator, and domain agents to discover each other's capabilities, exchange authorized tasks and execution context, report status and results, and collaborate without exposing their internal implementation details.**

The overall relationship is:

```text
                 CWD Enterprise Architecture

        ┌─────────────────────────────────────┐
        │             LangGraph                │
        │       State + Workflow + Control     │
        └──────────────────┬──────────────────┘
                           │
                    Agent-to-Agent
                           │
        ┌──────────────────▼──────────────────┐
        │                A2A                   │
        │       Agent ↔ Agent Communication   │
        └──────────────────┬──────────────────┘
                           │
                     Domain Agent
                           │
                         Worker
                           │
                           ▼
                         MCP
                           │
                           ▼
                 Enterprise Capability
```

### Core formula

```text
A2A Collaboration
=
Agent Discovery
+ Task Contract
+ Identity
+ Authorization
+ Task Transmission
+ Independent Execution
+ Status Updates
+ Structured Results
+ Error Handling
+ Correlation
+ Retry / Recovery
```

### The simplest way to remember it

> **LangGraph controls the workflow → A2A connects the agents → Workers perform the domain work → MCP connects Workers to enterprise capabilities.**

That separation is what allows CWD to evolve from a single agent into a **scalable, independently deployable, governed multi-agent enterprise platform**.
