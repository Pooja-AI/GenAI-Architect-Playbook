Here is the **single `.md` interview script**, focused only on the important points for this question.

````md
# Why Did You Choose A2A Instead of REST APIs for Agent Communication?

## Interview Question

**"Why did you choose A2A instead of REST APIs for agent communication?"**

---

## Strong Interview Answer

I would not say that A2A completely replaces REST APIs.

REST is a **general-purpose API communication mechanism**, whereas A2A is designed specifically for **communication and collaboration between autonomous AI agents**.

In my project, I chose A2A at the **agent communication layer** because my agents were independently responsible for different business capabilities and needed to exchange tasks, context, status, and results.

REST could certainly have been used, but then I would have had to define and maintain my own conventions for agent capabilities, task management, context exchange, status tracking, and result handling.

A2A gave us a more **standardized agent-to-agent communication model**, which helped keep the architecture loosely coupled and extensible.

---

# REST vs A2A

| Area | REST API | A2A |
|---|---|---|
| Primary purpose | General application communication | Agent-to-agent communication |
| Resource-oriented | Yes | Agent/task-oriented |
| HTTP-based | Commonly | Commonly |
| Agent discovery | Must be designed | Supported by agent-oriented model |
| Agent capabilities | Custom implementation | Agent capability model |
| Task lifecycle | Custom implementation | Designed around agent tasks |
| Context exchange | Custom payloads | Agent interaction model |
| Long-running tasks | Custom polling/webhooks | Better suited to agent task interactions |
| Interoperability | API contract | Agent communication contract |
| Best use case | Microservices / CRUD / APIs | Autonomous agent collaboration |

---

# Why REST Was Not Enough

Suppose I had three agents:

```text
Coordinator Agent
       |
       +---- REST ----> Vision Agent
       |
       +---- REST ----> Manufacturing Agent
       |
       +---- REST ----> Quality Agent
````

REST would handle the HTTP communication.

But I would still need to define things like:

```text
How do I identify an agent?

What capabilities does the agent provide?

How do I submit an agent task?

How do I track task status?

How do I exchange task context?

How do I handle long-running tasks?

How do I represent the final result?

How do agents discover each other?
```

I would essentially be building my own agent communication conventions on top of REST.

A2A provides an agent-oriented abstraction for these interactions.

---

# Example

Suppose the Manufacturing Agent needs image analysis.

```text
Manufacturing Agent
        |
        | "Analyze this defect image"
        v
    Vision Agent
        |
        | Analysis Result
        v
Manufacturing Agent
```

With a REST-only approach, I might define:

```text
POST /vision/analyze
GET  /vision/task/{id}
GET  /vision/result/{id}
```

Then I have to define:

```text
Request schema
Response schema
Task status
Error model
Capability discovery
Authentication
Context propagation
Long-running task handling
```

With A2A, these interactions are treated as **agent-level communication rather than simply endpoint calls**.

---

# Important Architectural Point

The key reason was **not**:

> "REST is bad and A2A is better."

That would be an incorrect architectural argument.

The correct explanation is:

> **"REST is appropriate for service-to-service communication, while A2A is more appropriate when the communication boundary itself represents autonomous agents and their tasks."**

---

# How I Used Them Together

In an enterprise architecture, I would not necessarily eliminate REST.

The architecture can look like:

```text
                   User
                     |
                     v
              Coordinator Agent
                     |
                 LangGraph
               Orchestration
                     |
                     v
             A2A Communication
                     |
        +------------+------------+
        |                         |
        v                         v
   Vision Agent             Data Agent
        |                         |
        |                         |
        v                         v
   REST / APIs              REST / APIs
        |                         |
        v                         v
 Enterprise Services       Enterprise Data
```

So there are different layers:

```text
LangGraph
    ↓
Workflow orchestration

A2A
    ↓
Agent-to-agent communication

REST
    ↓
Traditional service/API integration

MCP
    ↓
Agent-to-tool / agent-to-data interaction
```

---

# Why A2A Was Valuable in My Project

## 1. Loose Coupling

The Coordinator did not need to know the internal implementation of every agent.

```text
Coordinator
     |
     v
    A2A
     |
     +----> Agent A
     +----> Agent B
     +----> Agent C
```

Agents could evolve independently.

---

## 2. Interoperability

Different agents could potentially be implemented using different frameworks or runtimes.

```text
LangGraph Agent
       |
       A2A
       |
Python Agent
       |
       A2A
       |
Java/Spring Agent
```

The communication contract is independent of the internal agent implementation.

---

## 3. Task-Oriented Communication

Agents don't simply exchange CRUD data.

They often exchange **tasks**.

For example:

```text
"Analyze this image."

"Find similar historical incidents."

"Determine the probable root cause."

"Generate a remediation recommendation."
```

The task-oriented model is more natural for autonomous agents than treating everything as a simple REST resource.

---

## 4. Long-Running Agent Tasks

Some agent tasks can take significant time.

For example:

```text
Agent A
   |
   | Create task
   v
Agent B
   |
   | Processing
   |
   | In Progress
   |
   | Completed
   v
Result
```

With REST, I could implement this using polling, webhooks, queues, or custom status APIs.

A2A provides a more agent-oriented model for handling these interactions.

---

# Interview Follow-Up

### Interviewer:

**"But isn't A2A implemented over HTTP?"**

### Answer:

Yes.

The important distinction is that **HTTP is the transport mechanism**, while A2A defines the **agent communication semantics and interaction model**.

For example:

```text
HTTP
 ↓
Transport

A2A
 ↓
Agent communication protocol
```

So saying:

> "A2A and REST are mutually exclusive"

would be incorrect.

They operate at different abstraction levels.

---

# Interview Follow-Up

### Interviewer:

**"Why not just build your own REST-based agent protocol?"**

### Answer:

We could, but that would introduce additional architectural responsibility.

We would need to define and maintain our own standards for:

```text
Agent discovery
Capability representation
Task lifecycle
Context exchange
Result handling
Error handling
Authentication
Versioning
```

Using an agent communication protocol reduces the amount of custom communication infrastructure we need to define and maintain.

---

# Interview Follow-Up

### Interviewer:

**"When would you still use REST instead of A2A?"**

### Answer:

I would use REST when communicating with traditional enterprise services that expose well-defined APIs.

For example:

```text
Agent
  |
  | REST
  v
Customer Service
```

or:

```text
Agent
  |
  | REST
  v
Payment Service
```

These are traditional services, not autonomous agents.

I would use A2A when:

```text
Agent
  |
  | A2A
  v
Another Agent
```

where both sides participate as autonomous agents.

---

# Architect-Level Answer

> **"I chose A2A over a REST-only approach because the communication requirement in my system was not simply service-to-service API invocation; it was collaboration between autonomous agents. REST is excellent for traditional microservice integration, but with REST I would have to build and maintain custom conventions for agent capabilities, task lifecycle, context exchange, status, and results. A2A provides an agent-oriented communication contract that allows independently developed agents to collaborate while remaining loosely coupled. That said, I would still use REST for integration with traditional enterprise microservices. So I see A2A and REST as complementary rather than competing technologies."**

---

# Best Short Answer

> **"I chose A2A because my requirement was agent collaboration, not just API invocation. REST gives me transport and service APIs, but A2A gives me an agent-oriented communication model for capabilities, tasks, context, status, and results. I still use REST for traditional enterprise services. So A2A is for agent-to-agent collaboration, while REST is for conventional service integration."**

