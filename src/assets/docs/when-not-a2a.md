# When Would You Not Use A2A?

## Interview Question

**“When would you not use A2A?”**

---

## Strong Interview Answer

> **I would not use A2A when agent-to-agent communication does not provide meaningful architectural value.**
>
> For example, if all my agents are running within the same application and are tightly controlled by a single orchestration workflow, I would prefer using **LangGraph directly** rather than introducing A2A.
>
> I also would not use A2A for traditional **microservice-to-microservice communication**, where REST or gRPC is simpler and the services are not autonomous agents.
>
> Similarly, if an agent only needs to interact with tools, databases, APIs, or enterprise resources, I would use **MCP rather than A2A**.
>
> So my decision is based on the architectural boundary:
>
> * **Same workflow / same runtime → LangGraph**
> * **Agent → Agent collaboration → A2A**
> * **Agent → Tool/Data → MCP**
> * **Traditional service → Service → REST/gRPC**
>
> I avoid A2A when it adds protocol and operational complexity without providing a clear benefit such as agent autonomy, interoperability, independent deployment, or cross-team ownership.

---

# Technical Explanation

A2A introduces an additional communication boundary between agents.

You may need to consider:

* Agent discovery
* Capability identification
* Task lifecycle
* Context exchange
* Status tracking
* Error handling
* Authentication and authorization
* Network communication
* Observability
* Version compatibility
* Additional latency

If the agents are simply functions/nodes inside one LangGraph workflow, introducing A2A can be unnecessary overhead.

### Example

Instead of:

```text
Coordinator
    ↓ A2A
Worker Agent
```

If everything is inside one application:

```text
Coordinator
    ↓
LangGraph
    ↓
Worker Node
```

LangGraph can directly manage:

* State
* Routing
* Conditional execution
* Retries
* Checkpoints
* Agent invocation
* Workflow transitions

There is no strong reason to introduce an A2A communication boundary.

---

# When I Would NOT Use A2A

## 1. Agents Are Inside the Same Workflow

If agents are implemented as nodes in a single LangGraph application:

```text
Coordinator
     ↓
LangGraph
     ├── Agent A
     ├── Agent B
     └── Agent C
```

**Use LangGraph directly.**

A2A may add unnecessary complexity.

---

## 2. Simple Sequential Workflow

For a simple flow:

```text
Input
 ↓
Agent A
 ↓
Agent B
 ↓
Response
```

If there is no independent agent lifecycle or interoperability requirement, a normal workflow is sufficient.

---

## 3. Traditional Microservices

Suppose:

```text
Order Service → Payment Service
```

These are conventional backend services, not autonomous agents.

I would normally use:

```text
REST / gRPC / Kafka
```

rather than A2A.

---

## 4. Agent Needs Tools or Data

Suppose an agent needs:

```text
Agent
  ↓
Database
```

or:

```text
Agent
  ↓
Enterprise API
```

or:

```text
Agent
  ↓
Knowledge Base
```

This is primarily **Agent → Tool/Data** communication.

I would use **MCP**, not A2A.

---

## 5. Very Low-Latency Internal Calls

If an internal component needs a simple function call:

```python
result = worker_agent(input)
```

creating a network-based agent communication boundary may introduce unnecessary latency and operational overhead.

---

## 6. No Need for Independent Agent Ownership

If the same team owns all agents and they:

* deploy together,
* version together,
* scale together,
* share the same runtime,

then A2A may provide limited value.

A simpler internal orchestration model can be better.

---

# Architect-Level Decision

The key question I ask is:

> **“Do I need an independent agent boundary, or do I simply need another step in my workflow?”**

If it is another workflow step:

```text
LangGraph
   ↓
Agent Node
```

If it is an independently managed autonomous agent:

```text
Agent A
   ↓
   A2A
   ↓
Agent B
```

If it is a tool or enterprise resource:

```text
Agent
   ↓
  MCP
   ↓
Tool / Data / API
```

---

# Simple Decision Matrix

| Requirement                        | Preferred Approach                |
| ---------------------------------- | --------------------------------- |
| Agents in same workflow            | **LangGraph**                     |
| Agents in same application         | **Direct invocation / LangGraph** |
| Independent autonomous agents      | **A2A**                           |
| Cross-team agent collaboration     | **A2A**                           |
| Independently deployed agents      | **A2A**                           |
| Agent interoperability             | **A2A**                           |
| Agent → Database                   | **MCP**                           |
| Agent → Enterprise API             | **MCP**                           |
| Agent → Tool                       | **MCP**                           |
| Service → Service                  | **REST / gRPC**                   |
| Event-driven service communication | **Kafka / Event Bus**             |

---

# Strong Architect Closing Statement

> **“I don't use A2A simply because I have multiple agents. I use it when those agents represent independent capabilities with their own lifecycle, ownership, deployment, or interoperability requirements. If the agents are just nodes inside one controlled workflow, LangGraph is usually simpler. If I'm connecting to tools or enterprise data, I use MCP. And for conventional microservices, I use REST, gRPC, or event-driven communication.”**

---

## Memory Trick

**A2A = Independent Agents**

**LangGraph = Workflow**

**MCP = Tools & Data**

**REST/gRPC = Services**

> **Don't introduce A2A just because you have multiple agents; introduce it when you need an agent boundary.**
