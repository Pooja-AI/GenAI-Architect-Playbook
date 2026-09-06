# Communication Between Coordinator and Delegator Agents in CWD

In the **CWD (Coordinator–Delegator–Worker)** architecture, communication between the **Coordinator** and **Delegator** is the primary **agent-to-agent (A2A) collaboration boundary**.

The key idea is:

> **The Coordinator decides what needs to be done at the enterprise level; the Delegator decides how that work should be executed within its domain.**

---

## 1. Why Coordinator–Delegator communication is needed

The Coordinator should **not directly manage every Worker** in a large enterprise system.

For example, suppose the user asks:

> "Analyze this customer's order issue and determine why the shipment was delayed."

There may be several domain agents:

* Customer Agent
* Order Agent
* Shipping Agent
* Inventory Agent
* Finance Agent

The Coordinator shouldn't know the internal implementation of every domain.

Instead:

```text
                    User
                     │
                     ▼
              ┌──────────────┐
              │ Coordinator  │
              └──────┬───────┘
                     │
                A2A Task
                     │
                     ▼
             ┌──────────────┐
             │  Delegator   │
             │  Shipping    │
             └──────┬───────┘
                    │
             Internal workflow
                    │
          ┌─────────┼─────────┐
          ▼         ▼         ▼
       Worker 1  Worker 2  Worker 3
       Tracking  Inventory Carrier
```

The Coordinator only needs to know:

> "The Shipping Delegator can handle shipment-related investigation."

It does **not** need to know how the Shipping Delegator internally selects Workers.

---

# 2. Responsibilities of each agent

| Component          | Primary responsibility                                   |
| ------------------ | -------------------------------------------------------- |
| **Coordinator**    | Enterprise-level intent, planning, routing, coordination |
| **Delegator**      | Domain-level decomposition and Worker orchestration      |
| **Worker**         | Specialized execution                                    |
| **A2A**            | Coordinator ↔ Delegator communication                    |
| **LangGraph**      | Workflow state and execution control                     |
| **MCP**            | Worker ↔ enterprise tool/system integration              |
| **Agent Registry** | Agent capability discovery                               |
| **Policy/IAM**     | Authorization and governance                             |

A useful separation is:

```text
Coordinator
   │
   │ "What domain work is required?"
   ▼
Delegator
   │
   │ "How do I execute this domain work?"
   ▼
Workers
   │
   │ "Perform this specific operation."
   ▼
Enterprise Systems
```

---

# 3. What does the Coordinator send to the Delegator?

The Coordinator should send a **structured task**, not an informal conversation.

Conceptually:

```json
{
  "task_id": "TASK-1001",
  "parent_task_id": "REQ-5001",
  "correlation_id": "CORR-7890",

  "source_agent": "coordinator",
  "target_agent": "shipping-delegator",

  "intent": "investigate_shipment_delay",

  "task": {
    "customer_id": "C123",
    "order_id": "ORD456",
    "shipment_id": "SHIP789"
  },

  "constraints": {
    "deadline": "30s",
    "priority": "high"
  },

  "required_output": {
    "root_cause": true,
    "shipment_status": true,
    "recommendation": true
  }
}
```

The important point is that the Delegator receives a **bounded business task**.

It does not receive the entire Coordinator's internal state.

---

# 4. What happens inside the Delegator?

Once the Delegator receives the A2A task, it takes ownership of **domain-level execution**.

For example:

```text
Coordinator
     │
     │ investigate shipment delay
     ▼
Shipping Delegator
     │
     ├──► Tracking Worker
     │
     ├──► Carrier Worker
     │
     └──► Inventory Worker
```

The Delegator may determine:

```text
Step 1 → Get shipment tracking
Step 2 → Check carrier events
Step 3 → Check inventory availability
Step 4 → Correlate results
Step 5 → Determine root cause
```

This decomposition is the Delegator's responsibility.

The Coordinator doesn't need to know these internal steps.

---

# 5. Coordinator → Delegator communication lifecycle

A typical lifecycle is:

```text
1. User Request
       │
       ▼
2. Coordinator
       │
       ├── Understand intent
       ├── Authenticate
       ├── Authorize
       ├── Create plan
       └── Identify required domain
       │
       ▼
3. Agent Registry
       │
       └── Find capable Delegator
       │
       ▼
4. A2A Task
       │
       ▼
5. Delegator
       │
       ├── Validate task
       ├── Authorize
       ├── Decompose
       ├── Select Workers
       └── Execute
       │
       ▼
6. Worker Execution
       │
       ├── MCP
       ├── RAG
       ├── APIs
       └── Databases
       │
       ▼
7. Delegator Aggregates Results
       │
       ▼
8. A2A Response
       │
       ▼
9. Coordinator
       │
       ├── Validate result
       ├── Update state
       ├── Continue/retry/recover
       └── Aggregate final response
       │
       ▼
10. User
```

---

# 6. A2A task is the communication contract

The Coordinator and Delegator should agree on a common contract.

Conceptually:

```python
class A2ATask:
    task_id: str
    parent_task_id: str
    correlation_id: str

    source_agent: str
    target_agent: str

    intent: str
    input_data: dict

    priority: str
    deadline: str

    required_capabilities: list
```

The Delegator returns something like:

```python
class A2AResult:
    task_id: str
    status: str

    result: dict

    artifacts: list
    errors: list

    execution_metadata: dict
```

For example:

```json
{
  "task_id": "TASK-1001",
  "status": "completed",

  "result": {
    "shipment_status": "delayed",
    "root_cause": "carrier_capacity_issue",
    "recommendation": "reroute shipment"
  },

  "execution_metadata": {
    "workers_used": [
      "tracking-worker",
      "carrier-worker"
    ],
    "duration_ms": 4200
  }
}
```

---

# 7. Why structured communication matters

Imagine the Coordinator receives this:

```text
"The shipment seems to be delayed because maybe the carrier
had a capacity problem."
```

The Coordinator now has to interpret the response.

That's fragile.

Instead:

```json
{
  "status": "completed",
  "root_cause": {
    "category": "carrier_capacity",
    "confidence": 0.93
  },
  "shipment_status": "delayed",
  "recommended_action": "reroute"
}
```

Now LangGraph can make a deterministic routing decision:

```text
if status == completed
       │
       ▼
confidence >= threshold?
   │            │
  YES           NO
   │             │
   ▼             ▼
Complete      Human Review
```

So:

> **Structured A2A results become inputs to workflow state and conditional routing.**

---

# 8. Communication is not necessarily synchronous

Coordinator–Delegator communication can be synchronous:

```text
Coordinator
     │
     │ request
     ▼
Delegator
     │
     │ response
     ▼
Coordinator
```

But enterprise agents often perform long-running tasks.

Therefore, asynchronous communication is important:

```text
Coordinator
     │
     │ Submit Task
     ▼
Delegator
     │
     └──► Task Accepted
              │
              │
              ▼
         Execute domain work
              │
              ▼
         Status: working
              │
              ▼
         Status: completed
              │
              ▼
         Result
              │
              ▼
         Coordinator
```

A message bus such as Service Bus or Kafka can be used underneath for delivery and buffering, while **A2A defines the agent-level communication contract**.

---

# 9. Status communication

The Delegator doesn't necessarily need to wait until everything finishes before communicating.

It can provide lifecycle updates:

```text
submitted
    ↓
working
    ↓
worker_execution
    ↓
aggregating
    ↓
completed
```

Or:

```text
submitted
    ↓
working
    ↓
input_required
    ↓
human_approval
    ↓
working
    ↓
completed
```

This becomes particularly useful for long-running enterprise workflows.

---

# 10. Error communication

The Delegator should return **structured errors**.

For example:

```json
{
  "task_id": "TASK-1001",
  "status": "failed",

  "error": {
    "code": "CARRIER_API_TIMEOUT",
    "type": "transient",
    "retryable": true,
    "message": "Carrier system did not respond"
  }
}
```

The Coordinator/LangGraph can then decide:

```text
                  Delegator
                     │
                     ▼
               Task Failed
                     │
              classify error
                     │
       ┌─────────────┼──────────────┐
       ▼             ▼              ▼
   transient      permanent      approval
       │             │              │
       ▼             ▼              ▼
     retry          stop          human
```

The Delegator reports the problem.

**The Coordinator decides the enterprise-level recovery path.**

---

# 11. Retry and idempotency

Suppose the Coordinator doesn't receive a response because of a network timeout.

It might retry:

```text
Coordinator
     │
     │ TASK-1001
     ▼
Delegator
     │
     ├── processing
     │
     X response lost
     
Coordinator
     │
     │ retry TASK-1001
     ▼
Delegator
```

Without idempotency, the Delegator might execute the task twice.

Therefore:

```text
task_id = TASK-1001
```

can act as an idempotency/tracing key.

The Delegator can recognize:

```text
TASK-1001 already completed
```

and return the existing result instead of duplicating side effects.

This is particularly important for operations such as:

```text
Create Order
Cancel Order
Issue Refund
Update Customer
Submit Payment
```

---

# 12. Correlation IDs

Enterprise CWD requires end-to-end tracing.

For example:

```text
correlation_id = CORR-7890
```

The same correlation ID can flow through:

```text
User
 │
 ▼
Gateway
 │
 ▼
Coordinator
 │
 │ A2A
 ▼
Delegator
 │
 ▼
Worker
 │
 │ MCP
 ▼
MCP Server
 │
 ▼
Enterprise API
```

This allows operations teams to answer:

> "What happened to request CORR-7890?"

They can reconstruct the entire execution path.

---

# 13. How LangGraph fits into the communication

This distinction is very important.

**A2A does not replace LangGraph.**

A2A handles:

```text
Coordinator ↔ Delegator
```

LangGraph handles:

```text
What should happen before/after that communication?
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
Discover Delegator
  │
  ▼
Create A2A Task
  │
  ▼
Send Task
  │
  ▼
Wait for Result
  │
  ├───────────────┐
  │               │
success         failure
  │               │
  ▼               ▼
Aggregate       Retry/Recovery
```

The A2A call is one part of the graph.

---

# 14. Delegator's LangGraph

The Delegator can have its own independent workflow:

```text
        Delegator LangGraph

Receive A2A Task
       │
       ▼
Validate
       │
       ▼
Authorize
       │
       ▼
Decompose
       │
       ▼
Select Workers
       │
       ▼
Execute Workers
       │
       ├──────► Worker A
       │
       ├──────► Worker B
       │
       └──────► Worker C
       │
       ▼
Validate Results
       │
       ▼
Aggregate
       │
       ▼
Return A2A Result
```

This demonstrates an important architectural principle:

> **Each independent agent owns its own internal workflow.**

The Coordinator doesn't reach inside the Delegator's LangGraph.

---

# 15. Coordinator should not directly call Delegator Workers

### ❌ Bad architecture

```text
Coordinator
   │
   ├──► Worker A
   ├──► Worker B
   ├──► Worker C
   ├──► Worker D
   └──► Worker E
```

Now the Coordinator knows everything about the domain.

This causes:

* tight coupling
* complex Coordinator
* difficult maintenance
* poor domain ownership
* difficult independent deployment
* difficult scaling

### ✅ Better architecture

```text
Coordinator
   │
   ├──► Customer Delegator
   │
   ├──► Order Delegator
   │
   ├──► Shipping Delegator
   │
   └──► Finance Delegator
```

Each Delegator manages its own Workers.

---

# 16. End-to-end CWD example

User:

> "Why was order ORD123 delayed, and should we reroute it?"

### Step 1 — Coordinator

Understands:

```text
Intent = shipment investigation + recommendation
```

### Step 2 — Discover Delegator

```text
Agent Registry
      │
      ▼
Shipping Delegator
```

### Step 3 — Coordinator sends A2A task

```json
{
  "task_id": "T100",
  "correlation_id": "C900",
  "intent": "investigate_and_recommend",
  "input": {
    "order_id": "ORD123"
  }
}
```

### Step 4 — Delegator decomposes

```text
Shipping Delegator
       │
       ├──► Tracking Worker
       ├──► Carrier Worker
       └──► Route Optimization Worker
```

### Step 5 — Workers execute

Workers may use MCP:

```text
Tracking Worker
      │
      ▼
MCP Client
      │
      ▼
Tracking MCP Server
      │
      ▼
Carrier API
```

### Step 6 — Delegator aggregates

```json
{
  "shipment_status": "delayed",
  "root_cause": "carrier_capacity",
  "reroute_available": true
}
```

### Step 7 — Delegator returns A2A result

```text
Delegator
    │
    │ A2A Result
    ▼
Coordinator
```

### Step 8 — Coordinator makes enterprise-level decision

```text
Result
  │
  ▼
Validation
  │
  ▼
Policy Check
  │
  ▼
Final Response
```

---

# 17. Security boundary

Coordinator → Delegator communication must be authenticated and authorized.

A useful model is:

```text
Coordinator
    │
    │ authenticated A2A request
    ▼
A2A Endpoint
    │
    ├── Authenticate
    ├── Authorize
    ├── Validate schema
    ├── Validate task
    └── Check permissions
    │
    ▼
Delegator
```

The Delegator should **not blindly trust the Coordinator** merely because the request came through A2A.

You want defense in depth:

```text
Authentication
      +
Authorization
      +
Input Validation
      +
Policy
      +
Audit
```

---

# 18. What should NOT cross the A2A boundary?

The Coordinator should avoid sending unnecessary internal information.

### Don't send:

```text
Entire LangGraph state
Entire conversation history
Secrets
Access tokens
Database credentials
Internal prompts
Unnecessary customer data
Internal Worker implementation details
```

Instead send:

```text
Task
Required context
Constraints
Authorization context
Correlation ID
Expected output
Deadline
Priority
```

This follows the principle:

> **Share the minimum context required to perform the task.**

---

# 19. Coordinator–Delegator contract

A strong enterprise contract contains:

| Field                   | Purpose                   |
| ----------------------- | ------------------------- |
| `task_id`               | Unique task identity      |
| `parent_task_id`        | Parent-child relationship |
| `correlation_id`        | End-to-end tracing        |
| `source_agent`          | Requesting agent          |
| `target_agent`          | Receiving agent           |
| `intent`                | Business objective        |
| `input`                 | Task-specific data        |
| `constraints`           | Deadline/priority/policy  |
| `required_capabilities` | Expected capability       |
| `status`                | Lifecycle state           |
| `result`                | Structured output         |
| `error`                 | Structured failure        |
| `artifacts`             | Generated work products   |

---

# 20. Responsibility separation

The clean architecture is:

```text
┌──────────────────────────────────────────┐
│              COORDINATOR                │
│                                          │
│ Intent → Plan → Route → Monitor →        │
│ Aggregate → Final Response               │
└──────────────────┬───────────────────────┘
                   │
                   │ A2A
                   │
┌──────────────────▼───────────────────────┐
│               DELEGATOR                 │
│                                          │
│ Domain Task → Decompose → Select →       │
│ Execute → Validate → Aggregate            │
└──────────────────┬───────────────────────┘
                   │
                   │ Internal orchestration
                   │
          ┌────────┼────────┐
          ▼        ▼        ▼
       Worker   Worker   Worker
          │        │        │
          └────────┼────────┘
                   │
                  MCP
                   │
                   ▼
          Enterprise Systems
```

---

# 21. The most important distinction

Think of the architecture as three different communication layers:

```text
┌───────────────────────────────────────┐
│       Agent ↔ Agent                   │
│              A2A                      │
│                                       │
│ Coordinator ↔ Delegator               │
└───────────────────┬───────────────────┘
                    │
┌───────────────────▼───────────────────┐
│       Workflow orchestration          │
│             LangGraph                 │
│                                       │
│ State + Nodes + Edges + Routing       │
└───────────────────┬───────────────────┘
                    │
┌───────────────────▼───────────────────┐
│       Agent ↔ Enterprise capability   │
│                MCP                    │
│                                       │
│ Worker ↔ Tool/API/Resource/System     │
└───────────────────────────────────────┘
```

So:

> **A2A tells the Coordinator and Delegator how to communicate. LangGraph determines how each agent manages its workflow. MCP tells Workers how to interact with governed enterprise capabilities.**

---

## 22. Interview-ready answer

> **In CWD, communication between the Coordinator and Delegator is primarily an agent-to-agent interaction using a standardized A2A contract. The Coordinator owns enterprise-level intent understanding, planning, authorization, routing, monitoring, and final aggregation. Once it identifies that a particular domain is required, it discovers the appropriate Delegator through the Agent Registry and sends a structured task containing the task ID, correlation ID, intent, required context, constraints, and expected output.**
>
> **The Delegator independently receives and validates the task, decomposes it into domain-specific Worker tasks, selects appropriate Workers, executes the domain workflow, aggregates and validates the results, and returns a structured A2A result or error to the Coordinator.**
>
> **LangGraph manages the workflow state and conditional routing around these interactions, while A2A provides the interoperability contract between independent agents. The Delegator can then use Workers and MCP internally to access enterprise tools and systems. This separation allows the Coordinator and Delegators to be independently deployed, scaled, versioned, and implemented while still collaborating through a consistent communication contract.**

### Core formula

```text
Coordinator–Delegator Communication
=
Agent Discovery
+ A2A Task Contract
+ Authentication/Authorization
+ Context Exchange
+ Task Delegation
+ Status Updates
+ Structured Results
+ Error Handling
+ Correlation
+ Retry/Recovery
```

**Mental model:**

```text
Coordinator = "What domain work needs to happen?"
Delegator   = "How should this domain work be executed?"
A2A         = "How do these independent agents communicate?"
LangGraph   = "How does each agent control its workflow?"
MCP         = "How do Workers access enterprise capabilities?"
```

This separation is what makes CWD scalable from a small multi-agent application into an **enterprise-grade distributed agent architecture**.
