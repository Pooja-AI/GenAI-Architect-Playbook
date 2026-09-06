# Agent2Agent (A2A) Protocol

**Agent2Agent (A2A)** is an open protocol designed to allow **independent AI agents to communicate, discover capabilities, exchange tasks, and return results through a standardized interface**.

For your CWD architecture, the key idea is:

> **A2A provides the interoperability layer between independent agents, allowing one agent to delegate work to another without needing to know how the receiving agent internally reasons, orchestrates, or uses its tools.**

```text
                    Enterprise User
                          │
                          ▼
                    CWD Coordinator
                          │
                     A2A Protocol
                          │
             ┌────────────┼────────────┐
             ▼            ▼            ▼
        Order Agent   Finance Agent  Support Agent
             │            │            │
          Workers       Workers       Workers
             │            │            │
            MCP          MCP          MCP
             │            │            │
             ▼            ▼            ▼
        Enterprise Systems / APIs / Data
```

---

# 1. Why A2A Is Needed

Imagine an enterprise has specialized agents:

```text
Order Agent
Finance Agent
HR Agent
Customer Support Agent
Inventory Agent
Security Agent
```

Each agent may have:

* different LLMs
* different prompts
* different tools
* different databases
* different workflows
* different teams
* different programming languages
* different deployment environments

Without an interoperability protocol, every agent would need custom integrations:

```text
Order ↔ Finance
Order ↔ Support
Order ↔ Inventory
Finance ↔ Support
Finance ↔ Security
...
```

This creates an integration explosion.

A2A provides a common communication contract:

```text
Agent A
   │
   │ A2A
   ▼
Agent B
```

Agent A does not need to understand Agent B's internal implementation.

---

# 2. What A2A Actually Standardizes

A2A primarily standardizes the **agent collaboration boundary**.

It enables agents to:

1. discover other agents
2. understand their capabilities
3. send tasks
4. provide context
5. receive task status
6. receive results
7. handle long-running tasks
8. exchange artifacts
9. support asynchronous interaction
10. operate across organizational/system boundaries

The important abstraction is:

```text
Agent A
   │
   │ "Please perform this task"
   ▼
Agent B
   │
   │ "Task accepted"
   ▼
Agent B executes
   │
   │ "Task completed + result"
   ▼
Agent A
```

---

# 3. A2A's Core Architecture

Conceptually:

```text
┌───────────────────────┐
│      Client Agent     │
│                       │
│ Coordinator / Agent A │
└───────────┬───────────┘
            │
            │ A2A
            ▼
┌───────────────────────┐
│      Remote Agent     │
│                       │
│     Agent B           │
└───────────┬───────────┘
            │
       Internal Logic
            │
       ┌────┴─────┐
       ▼          ▼
    Workers      Tools
                  │
                 MCP
                  │
                  ▼
          Enterprise Systems
```

The **client agent** is the agent requesting work.

The **remote agent** is the agent providing the capability.

---

# 4. Agent Discovery

Before an agent can collaborate with another agent, it needs to understand:

> **What can this agent do?**

A2A uses an **Agent Card** concept to describe an agent's capabilities and interaction details.

Conceptually:

```json
{
  "name": "Order Management Agent",
  "description": "Handles enterprise order investigation and management",
  "version": "2.1",

  "skills": [
    {
      "id": "order-investigation",
      "name": "Investigate Order",
      "description": "Investigates order status and fulfillment issues"
    },
    {
      "id": "shipment-tracking",
      "name": "Track Shipment",
      "description": "Retrieves shipment tracking information"
    }
  ],

  "supported_input_modes": [
    "text",
    "structured-data"
  ],

  "supported_output_modes": [
    "text",
    "structured-data"
  ]
}
```

The exact Agent Card schema depends on the A2A specification/version, but architecturally its purpose is:

```text
Agent Card
     ↓
Agent identity
     +
Capabilities
     +
Skills
     +
Interaction information
```

This enables **capability-based agent discovery**.

---

# 5. A2A Agent ≠ CWD Worker

This distinction is extremely important.

A CWD Worker is generally a **specialized execution component**.

An A2A agent represents an **independent collaboration endpoint**.

For example:

```text
                 Order Agent
                      │
              ┌───────┴───────┐
              ▼               ▼
        Order Worker     Shipment Worker
              │               │
             MCP             MCP
              │               │
              ▼               ▼
        Order System     Carrier System
```

The entire **Order Agent** can expose an A2A interface.

Internally, it can use:

* LangGraph
* multiple Workers
* MCP
* RAG
* databases
* APIs
* custom business logic

The remote agent doesn't need to know these implementation details.

---

# 6. A2A Task

A2A revolves around the concept of a **task**.

For example:

```text
Coordinator
      │
      │ A2A Task
      ▼
Order Agent

Task:
"Investigate order ORD-12345
and determine why shipment is delayed."
```

Conceptually:

```json
{
  "task_id": "TASK-1001",
  "context_id": "CTX-5001",

  "request": {
    "intent": "investigate_order",
    "order_id": "ORD-12345"
  },

  "priority": "high"
}
```

The task gives the receiving agent enough information to execute the request without exposing the caller's entire internal state.

---

# 7. Task Lifecycle

A2A is particularly useful because agent work isn't always instantaneous.

A conceptual lifecycle is:

```text
                 ┌──────────┐
                 │ Submitted│
                 └────┬─────┘
                      │
                      ▼
                 ┌──────────┐
                 │ Working  │
                 └────┬─────┘
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
      Completed     Failed     Input Needed
          │           │           │
          ▼           ▼           ▼
       Result      Recovery     Continue
```

An agent may therefore:

```text
receive task
     ↓
acknowledge
     ↓
work asynchronously
     ↓
update status
     ↓
produce result
```

This is valuable for enterprise workflows that can run for seconds, minutes, or much longer.

---

# 8. Messages and Parts

A2A allows information exchanged between agents to contain different types of content.

Conceptually:

```text
Message
   │
   ├── Text
   ├── Structured data
   ├── Files
   └── Other artifacts
```

For example:

```json
{
  "message": {
    "role": "agent",
    "parts": [
      {
        "type": "text",
        "text": "Investigate order ORD-12345"
      },
      {
        "type": "data",
        "data": {
          "customer_id": "C123",
          "priority": "high"
        }
      }
    ]
  }
}
```

This is more flexible than simply passing strings between agents.

---

# 9. Artifacts

An agent may produce an artifact rather than just a conversational response.

For example:

```text
Finance Agent
      │
      ▼
Generate financial analysis
      │
      ▼
Artifact
   ├── Report
   ├── Structured JSON
   ├── CSV
   └── Document
```

Another agent can consume that artifact.

Example:

```text
Financial Analyst Agent
       │
       │ A2A
       ▼
Report Generation Agent
       │
       ▼
PDF / structured report
       │
       ▼
Coordinator
```

This makes A2A suitable for enterprise workflows involving documents and structured outputs.

---

# 10. Agent Communication Is Not Just Chat

A common misconception is:

> "A2A is just agents sending messages to each other."

It is more accurately understood as:

```text
Agent Collaboration
=
Discovery
+
Task Delegation
+
Status
+
Messages
+
Artifacts
+
Results
```

The important abstraction is **collaborative task execution**, not merely conversation.

---

# 11. A2A and CWD Coordinator

Now map this directly to CWD.

The Coordinator receives:

```text
"Why is customer C123's order delayed?"
```

It creates a plan:

```text
Need:
1. Order information
2. Shipment information
3. Customer information
```

Agent Registry identifies:

```text
Order Agent
Shipping Agent
Customer Agent
```

The Coordinator then creates A2A tasks:

```text
                 Coordinator
                      │
          ┌───────────┼───────────┐
          │           │           │
         A2A         A2A         A2A
          │           │           │
          ▼           ▼           ▼
      Order Agent  Shipping    Customer
                   Agent       Agent
```

---

# 12. Each Agent Executes Independently

### Order Agent

```text
A2A Request
    ↓
Order Agent
    ↓
Internal LangGraph
    ↓
Order Worker
    ↓
MCP
    ↓
Order API
```

### Shipping Agent

```text
A2A Request
    ↓
Shipping Agent
    ↓
Internal Workflow
    ↓
Shipping Worker
    ↓
MCP
    ↓
Carrier API
```

### Customer Agent

```text
A2A Request
    ↓
Customer Agent
    ↓
Customer Worker
    ↓
MCP
    ↓
CRM
```

The Coordinator doesn't need to know the internal implementation.

---

# 13. Results Come Back Through A2A

Each agent returns a result.

```text
Order Agent
     │
     ▼
{
  "order_status": "SHIPPED",
  "fulfillment_status": "COMPLETE"
}
```

```text
Shipping Agent
     │
     ▼
{
  "carrier": "XYZ",
  "status": "DELAYED",
  "last_location": "Dallas"
}
```

The Coordinator receives the results:

```text
                 Coordinator
                ▲     ▲     ▲
                │     │     │
               A2A   A2A   A2A
                │     │     │
             Order Shipping Customer
```

Then:

```text
Results
   ↓
Aggregate
   ↓
Reason
   ↓
Generate final answer
```

---

# 14. A2A + LangGraph

This relationship is critical in your CWD architecture.

```text
LangGraph
    │
    │ controls
    ▼
Workflow
    │
    ├── Discover Agent
    ├── Create Task
    ├── Send A2A Request
    ├── Wait
    ├── Receive Result
    ├── Update State
    ├── Retry
    └── Aggregate
```

A2A itself does not become the workflow engine.

Instead:

```text
LangGraph
=
Workflow orchestration

A2A
=
Agent interoperability
```

For example:

```text
START
  │
  ▼
Understand Intent
  │
  ▼
Plan
  │
  ▼
Discover Agent
  │
  ▼
Send A2A Task
  │
  ▼
Wait for Result
  │
  ▼
Evaluate Result
  │
  ├── Retry
  ├── Delegate another task
  ├── Human approval
  └── Complete
```

---

# 15. A2A + MCP

This is another critical distinction.

Suppose:

```text
Coordinator
     │
     │ A2A
     ▼
Order Agent
     │
     ▼
Order Worker
     │
     │ MCP
     ▼
Order MCP Server
     │
     ▼
Order API
```

The protocols serve different boundaries:

```text
A2A
Agent ───────────────── Agent

MCP
Agent/Worker ─────────── Tool / Resource
```

### A2A

Answers:

> **"How can one independent agent collaborate with another agent?"**

### MCP

Answers:

> **"How can an agent/application discover and use external tools and resources?"**

---

# 16. A2A vs REST API

REST can expose:

```text
GET /orders/123
POST /orders/123/cancel
```

A2A is more appropriate when the target is an **agent capable of reasoning and performing multi-step work**.

For example:

```text
A2A:

"Investigate why order 123 is delayed,
use your available domain capabilities,
and return findings with evidence."
```

The receiving agent might internally:

```text
Plan
 ↓
Retrieve
 ↓
Call multiple tools
 ↓
Analyze
 ↓
Validate
 ↓
Return result
```

The caller doesn't need to orchestrate those internal steps.

---

# 17. Interoperability

The major value proposition is:

> **An agent should be able to collaborate with another compatible agent without knowing the vendor, framework, model, or internal implementation used by that agent.**

Conceptually:

```text
Agent A
  │
  │ A2A
  ▼
┌──────────────────────────┐
│ Agent B                  │
│                          │
│ Could use:               │
│ GPT / Claude / Gemini    │
│ LangGraph / custom code  │
│ Python / Java / etc.     │
│ MCP / APIs / databases   │
└──────────────────────────┘
```

The interoperability boundary is the protocol contract.

---

# 18. Enterprise Security

A2A interoperability does **not** mean unrestricted trust.

The receiving agent should establish:

```text
Who is calling?
      ↓
Is caller authenticated?
      ↓
Is caller authorized?
      ↓
Is requested capability allowed?
      ↓
Is requested data accessible?
      ↓
Is the operation permitted?
```

Conceptually:

```text
A2A Request
     │
     ▼
Authentication
     │
     ▼
Authorization
     │
     ▼
Policy
     │
     ▼
Input Validation
     │
     ▼
Task Execution
     │
     ▼
Audit
```

This is especially important in CWD because agents may operate across different domains and data boundaries.

---

# 19. Trust Boundaries

Consider:

```text
Finance Agent
       │
       │ A2A
       ▼
HR Agent
```

The HR Agent should not automatically expose all employee information.

Instead:

```text
Finance Agent
     │
     │ Request
     ▼
HR Agent
     │
     ├── Identity validation
     ├── Authorization
     ├── Data classification
     ├── Policy
     └── Data filtering
     │
     ▼
Approved Result
```

Therefore:

> **A2A creates interoperability, not implicit trust.**

---

# 20. Asynchronous Communication

Enterprise agents often perform long-running tasks.

For example:

```text
Coordinator
     │
     │ A2A task
     ▼
Compliance Agent
     │
     │ accepted
     ▼
Coordinator continues
     │
     │ ...
     ▼
Compliance Agent
     │
     │ result event
     ▼
Coordinator
```

This allows:

* long-running workflows
* asynchronous execution
* human approval
* external system delays
* scalable agent pools
* fault recovery

A message broker can optionally sit between agents:

```text
Agent A
   │
   ▼
Service Bus / Kafka
   │
   ▼
Agent B
```

A2A defines the agent interaction semantics; messaging infrastructure can provide transport, buffering, and delivery capabilities.

---

# 21. Failure and Recovery

Suppose:

```text
Coordinator
      │
      │ A2A
      ▼
Finance Agent
      │
      X
   timeout
```

CWD can classify the failure:

```text
A2A Failure
    │
    ▼
Error Classification
    │
    ├── Transient → Retry
    │
    ├── Agent unavailable → Rediscover
    │
    ├── Permanent → Recovery
    │
    ├── Authorization → Stop
    │
    └── Deadline exceeded → Escalate
```

LangGraph manages these workflow transitions.

Checkpointing can preserve:

```text
task status
agent selected
results received
retry count
workflow state
approval status
```

so the entire workflow doesn't necessarily have to restart.

---

# 22. Multi-Agent Parallel Execution

A2A is particularly useful when independent agents can work concurrently.

For example:

```text
                  Coordinator
                       │
          ┌────────────┼────────────┐
          │            │            │
         A2A          A2A          A2A
          │            │            │
          ▼            ▼            ▼
       Agent A      Agent B      Agent C
          │            │            │
          ▼            ▼            ▼
       Result A      Result B      Result C
          │            │            │
          └────────────┼────────────┘
                       ▼
                   Aggregate
```

This can significantly reduce end-to-end latency when tasks have no dependency on each other.

If dependencies exist:

```text
Agent A
   │
   ▼
Result A
   │
   ▼
Agent B
   │
   ▼
Result B
```

LangGraph can model those dependencies.

---

# 23. A2A State vs CWD State

Another important distinction:

### A2A

Carries information necessary for **agent interaction**.

### CWD/LangGraph state

Maintains the **complete workflow execution context**.

For example:

```text
CWD State
├── workflow_id
├── user_context
├── intent
├── plan
├── tasks
├── agent assignments
├── results
├── retries
├── approvals
├── errors
└── final response
```

An A2A message should carry only the context needed by the receiving agent.

This supports:

```text
Data minimization
Security
Loose coupling
Lower token usage
Independent agents
```

---

# 24. Complete CWD + A2A + MCP Architecture

```text
                         USER
                           │
                           ▼
                    API / Gateway
                           │
                           ▼
                    COORDINATOR
                           │
                     LangGraph
                           │
                    Agent Registry
                           │
             ┌─────────────┼─────────────┐
             │             │             │
            A2A           A2A           A2A
             │             │             │
             ▼             ▼             ▼
        ORDER AGENT   SHIPPING AGENT  FINANCE AGENT
             │             │             │
        LangGraph      LangGraph      LangGraph
             │             │             │
          Workers       Workers       Workers
             │             │             │
            MCP           MCP           MCP
             │             │             │
             ▼             ▼             ▼
        Enterprise APIs / DB / SaaS
             │             │             │
             └─────────────┼─────────────┘
                           │
                        Results
                           │
                           ▼
                      Coordinator
                           │
                       Aggregate
                           │
                           ▼
                     Final Response
```

---

# 25. Protocol Responsibility Model

| Layer              | Responsibility                           |
| ------------------ | ---------------------------------------- |
| **Agent Card**     | Agent identity and capability discovery  |
| **A2A**            | Agent interoperability and collaboration |
| **Task**           | Unit of delegated work                   |
| **Message**        | Communication between agents             |
| **Artifact**       | Produced/consumed work product           |
| **Agent**          | Reasoning and domain execution           |
| **LangGraph**      | Internal workflow/state orchestration    |
| **Worker**         | Specialized execution                    |
| **MCP**            | Tool/resource integration                |
| **Policy/IAM**     | Authorization and governance             |
| **Infrastructure** | Networking, scaling, reliability         |

---

# 26. A2A vs MCP vs LangGraph

The easiest interview memory model is:

| Technology         | Main question                              |
| ------------------ | ------------------------------------------ |
| **LangGraph**      | **What happens next?**                     |
| **A2A**            | **How do agents collaborate?**             |
| **MCP**            | **How does an agent access capabilities?** |
| **Agent Registry** | **Which agent can do this?**               |
| **Policy/IAM**     | **Is it allowed?**                         |
| **Worker**         | **How is the specialized task executed?**  |

So:

```text
                 CWD
                  │
          ┌───────┼────────┐
          │       │        │
     LangGraph    A2A      MCP
          │       │        │
      Workflow   Agent    Tools/
       State     Agent   Resources
          │       │        │
          └───────┼────────┘
                  │
               Workers
```

---

# 27. Interview-Ready Answer

If an interviewer asks:

> **"What is the Agent2Agent protocol and why is it important?"**

You can answer:

> **"A2A is an interoperability protocol for communication and collaboration between independent AI agents. It provides a standardized way for agents to discover capabilities, exchange structured tasks and context, communicate status, return results, and exchange artifacts without requiring the calling agent to understand the receiving agent's internal implementation. In our CWD architecture, the Coordinator can discover domain agents, delegate tasks through A2A, and receive structured results from independently deployed agents. Each receiving agent can then use its own LangGraph workflow, Workers, and MCP integrations to execute the task. LangGraph manages the workflow state and recovery, A2A handles agent-to-agent interoperability, and MCP handles agent-to-tool or enterprise capability integration. This separation allows us to build scalable, loosely coupled, independently deployable multi-agent systems."**

---

# Final Definition

**Agent2Agent (A2A) is an interoperability protocol that enables independent AI agents to discover each other's capabilities and communicate through standardized task, message, status, result, and artifact exchanges. It abstracts the internal implementation of each agent, allowing agents built with different models, frameworks, runtimes, and enterprise systems to collaborate through a common agent-to-agent contract.**

### Core formula

```text
A2A Interoperability
=
Agent Discovery
+
Capability Description
+
Task Delegation
+
Context Exchange
+
Task Status
+
Messages
+
Artifacts
+
Results
+
Asynchronous Collaboration
+
Secure Agent Communication
```

### CWD mental model

```text
Coordinator
     │
     │ "Who can do this?"
     ▼
Agent Registry
     │
     │ "Order Agent"
     ▼
A2A
     │
     │ "Please investigate Order 123"
     ▼
Order Agent
     │
     ▼
LangGraph
     │
     ▼
Workers
     │
     ▼
MCP
     │
     ▼
Enterprise Systems
     │
     ▼
Result
     │
     ▼
A2A
     │
     ▼
Coordinator
```

> **A2A makes independent agents interoperable; LangGraph makes their execution stateful and controllable; MCP gives them standardized access to enterprise capabilities.**
