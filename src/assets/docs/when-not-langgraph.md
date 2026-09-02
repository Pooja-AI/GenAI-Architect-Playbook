# When Would You Not Use LangGraph?

## Interview Question

**"When would you not use LangGraph?"**

## Strong Interview Answer

> **"I would not use LangGraph when the application doesn't require complex stateful orchestration. LangGraph is powerful, but it is a relatively low-level orchestration framework, so using it for a simple use case can introduce unnecessary complexity.**
>
> **For example, if I only need a single LLM with a few tools, a simple agent SDK would be sufficient. If I need straightforward role-based collaboration between a few agents, I might consider CrewAI. If the application is heavily OpenAI-centric and primarily requires agents, tools, handoffs and guardrails, I would evaluate the OpenAI Agents SDK. If the application is deeply integrated with the Microsoft ecosystem, I would also evaluate Semantic Kernel or Microsoft's agent frameworks.**
>
> **I would choose LangGraph when I have a strong need for explicit state, branching, conditional routing, persistence, retries, human-in-the-loop workflows, or long-running execution. So the decision is driven by workflow complexity and architectural requirements, not by the framework being popular."**

---

# 1. Simple Single-Agent Applications

If the architecture is:

```text
User
 |
 v
LLM
 |
 v
Response
```

I would **not** introduce LangGraph.

For example:

```text
Customer asks:
"What is our vacation policy?"

       ↓

LLM + RAG

       ↓

Answer
```

There is no need for:

```text
Nodes
Edges
Conditional Routing
Checkpoints
Subgraphs
```

A simpler RAG/agent implementation would be easier to maintain.

---

# 2. Simple Tool-Calling Agent

Suppose the requirement is:

```text
User
 |
 v
Agent
 |
 +---- Weather API
 |
 +---- Calendar API
 |
 +---- Database
 |
 v
Response
```

The agent simply decides which tool to call.

I wouldn't automatically choose LangGraph.

A higher-level agent SDK can be sufficient.

### Interview statement

> **"If the primary requirement is tool calling rather than workflow orchestration, I would start with a simpler agent abstraction."**

---

# 3. Straightforward Sequential Workflow

Suppose:

```text
Document
  ↓
Extract
  ↓
Summarize
  ↓
Store
```

This is deterministic.

You don't necessarily need a graph.

A simple workflow could be:

```python
text = extract(document)
summary = summarize(text)
store(summary)
```

Using LangGraph here could be unnecessary abstraction.

---

# 4. Simple RAG Application

Suppose:

```text
User
 |
 v
Embedding
 |
 v
Vector DB
 |
 v
Retrieve
 |
 v
LLM
 |
 v
Answer
```

This is primarily a **RAG architecture**, not necessarily an agentic workflow.

I would focus on:

```text
Chunking
Embedding
Retrieval
Reranking
Context Construction
Generation
Evaluation
```

rather than introducing LangGraph just because the application uses an LLM.

---

# 5. When Deterministic Logic Is Enough

This is an important architect-level principle.

Suppose:

```text
if document_type == "invoice":
    invoice_processor()

elif document_type == "claim":
    claim_processor()
```

There is no reason to ask an LLM:

> "Which workflow should I use?"

if a deterministic rule can make the decision reliably.

I prefer:

```text
Deterministic Logic
        +
LLM where reasoning is actually required
```

rather than:

```text
LLM everywhere
```

---

# 6. Very Simple Multi-Agent Collaboration

Suppose you have:

```text
Researcher
    ↓
Writer
    ↓
Reviewer
```

with very simple responsibilities.

A role/task-oriented framework such as CrewAI may provide a simpler developer experience.

I wouldn't automatically introduce LangGraph.

### My decision:

```text
Simple Agent Team
       ↓
CrewAI / Agent SDK
```

versus:

```text
Complex Stateful Workflow
       ↓
LangGraph
```

---

# 7. OpenAI-Centric Application With Simple Handoffs

Suppose the application is:

```text
                 Triage Agent
                 /          \
                v            v
        Billing Agent    Support Agent
                |            |
              Tools        Tools
```

If the organization is heavily invested in OpenAI and the primary requirement is:

* Agents
* Tools
* Handoffs
* Guardrails
* Sessions
* Tracing

then I would seriously consider the **OpenAI Agents SDK**.

The OpenAI Agents SDK is designed around agents, tools, handoffs, guardrails, sessions and tracing. ([openai.github.io](https://openai.github.io/openai-agents-python/?utm_source=chatgpt.com))

There is no reason to use LangGraph simply because it is capable of implementing the same workflow.

---

# 8. Microsoft-Centric Enterprise Application

Suppose the organization already has:

```text
Azure
Azure OpenAI
.NET
Microsoft Identity
Microsoft integrations
```

and the application fits naturally into Microsoft's agent ecosystem.

I would evaluate:

```text
Semantic Kernel
Microsoft Agent Framework
```

alongside LangGraph.

The question becomes:

> **"Which framework integrates most naturally with the organization's existing technology and operating model?"**

rather than:

> "Which framework is technically more powerful?"

---

# 9. Extremely High-Throughput, Simple Pipelines

Suppose you need to process:

```text
10 million documents
        |
        v
Classification
        |
        v
Extraction
        |
        v
Storage
```

If each document follows the same deterministic pipeline, I would likely use:

```text
Batch Processing
+
Queue
+
Workers
+
LLM Services
```

rather than creating an agent graph for every document.

For example:

```text
Kafka / Queue
      |
      v
Worker Pool
      |
      +---- LLM
      |
      +---- Database
      |
      v
Storage
```

The architecture should match the workload.

---

# 10. When Latency Is Extremely Sensitive

Agentic workflows can involve:

```text
Coordinator
   ↓
Agent
   ↓
Tool
   ↓
Agent
   ↓
Validator
```

Each additional LLM call potentially adds latency.

If the requirement is:

```text
< 500 ms response
```

I would strongly question whether a multi-agent workflow is appropriate.

I would prefer:

```text
API
 ↓
Deterministic Routing
 ↓
Single Optimized LLM Call
 ↓
Response
```

where possible.

---

# 11. When the Team Doesn't Need Graph-Based Orchestration

Framework choice should consider the engineering team.

If the team is comfortable with:

```text
Simple Python
REST APIs
LLM SDKs
```

but not with:

```text
Graph State
Reducers
Checkpoints
Subgraphs
Interrupts
Persistence
```

then introducing LangGraph may increase the learning curve unnecessarily.

I would ask:

> **"Does the complexity solve a real business problem?"**

If not, don't introduce it.

---

# 12. When the Workflow Is Better Represented by a Business Process Engine

This is an advanced Solution Architect answer.

Some enterprise workflows are better handled by:

```text
BPM
Workflow Engine
State Machine
Event-Driven Architecture
```

rather than an LLM orchestration framework.

For example:

```text
Loan Application
      |
      v
Credit Check
      |
      v
Compliance
      |
      v
Approval
      |
      v
Disbursement
```

If the workflow is highly deterministic and regulated, I would not make LangGraph the primary business-process engine.

The LLM could still be used inside one of the steps:

```text
Business Workflow Engine
          |
          +---- LLM-based Document Analysis
```

This is a much better architecture.

---

# 13. When the Agent Doesn't Need State

LangGraph becomes particularly valuable when state matters.

If your application is simply:

```text
Request
 ↓
LLM
 ↓
Tool
 ↓
Response
```

and there is no need for:

* Persistent state
* Resume
* Checkpointing
* Long-running execution
* Human interruption

then a simpler solution may be preferable.

---

# 14. When Framework Lock-In Is a Concern

If the application needs to remain extremely portable across multiple orchestration technologies, I would avoid putting all business logic directly into LangGraph-specific APIs.

Instead:

```text
Business Logic
      |
      v
Agent Interfaces
      |
      v
Orchestration Adapter
      |
      +---- LangGraph
      +---- OpenAI Agents SDK
      +---- Other
```

This makes future migration easier.

---

# 15. My Decision Matrix

I would think about it this way:

| Requirement                                       | Use LangGraph?                               |
| ------------------------------------------------- | -------------------------------------------- |
| Single LLM call                                   | ❌ No                                         |
| Simple RAG                                        | ❌ Usually no                                 |
| Basic tool calling                                | ❌ Usually no                                 |
| Simple sequential pipeline                        | ❌ Usually no                                 |
| Deterministic business workflow                   | ❌ Usually no                                 |
| Simple 2–3 agent collaboration                    | ❌ Not necessarily                            |
| OpenAI-centric simple agent system                | ❌ Evaluate OpenAI Agents SDK                 |
| Microsoft-centric agent system                    | ❌ Evaluate Microsoft/Semantic Kernel options |
| Complex multi-agent workflow                      | ✅ Yes                                        |
| Shared agent state                                | ✅ Yes                                        |
| Conditional routing                               | ✅ Yes                                        |
| Complex branching                                 | ✅ Yes                                        |
| Retry/recovery paths                              | ✅ Yes                                        |
| Long-running workflows                            | ✅ Yes                                        |
| Human-in-the-loop                                 | ✅ Yes                                        |
| Checkpoint/resume                                 | ✅ Yes                                        |
| Complex coordinator/delegator/worker architecture | ✅ Yes                                        |

---

# 16. Applying This to My CWD Project

For my CWD enterprise assistant, the architecture was:

```text
                         User
                          |
                          v
                    Coordinator
                          |
             +------------+------------+
             |            |            |
             v            v            v
        Delegator A   Delegator B   Delegator C
             |            |            |
             v            v            v
          Workers      Workers      Workers
             |            |            |
             +------------+------------+
                          |
                          v
                    RAG / MCP / APIs
                          |
                          v
                       Validator
                          |
                     +----+----+
                     |         |
                   Retry     Success
                     |         |
                     +         v
                           Response
```

This had:

```text
✓ Multiple agents
✓ Hierarchical orchestration
✓ Conditional routing
✓ Shared state
✓ RAG
✓ MCP tools
✓ Enterprise APIs
✓ Validation
✓ Retry paths
✓ Potential human intervention
✓ Long-running workflows
```

Therefore LangGraph made sense.

But if the requirement were simply:

```text
User
 ↓
LLM
 ↓
MCP Tool
 ↓
Response
```

I would **not** use LangGraph just for the sake of using an Agentic AI framework.

---

# Best Interview Answer — 30 Seconds

> **"I would not use LangGraph for every Agentic AI application. If I have a simple single-agent application, basic RAG, straightforward tool calling, or a deterministic sequential workflow, I would use a simpler SDK or workflow implementation. If the application is OpenAI-centric with simple agent handoffs, I would evaluate the OpenAI Agents SDK. For Microsoft-centric environments, I would evaluate Semantic Kernel or Microsoft's agent frameworks.**
>
> **I choose LangGraph when the application has real workflow complexity—shared state, conditional routing, branching, retries, persistence, human-in-the-loop, or long-running multi-agent execution. In our CWD project, those requirements existed, so the additional complexity of LangGraph was justified."**

---

# Strongest Architect-Level Statement

> **"I don't introduce an agent framework unless I have an orchestration problem to solve. If deterministic code or a simpler agent SDK can solve the problem reliably, I prefer the simpler architecture. I use LangGraph when the complexity of the workflow justifies the control that LangGraph provides."**

### Easy memory rule

```text
Simple problem
      ↓
Simple solution

Complex agent workflow
      ↓
LangGraph

OpenAI-centric agent + simple handoffs
      ↓
OpenAI Agents SDK

Role-based agent collaboration
      ↓
CrewAI

Microsoft-centric ecosystem
      ↓
Semantic Kernel / Microsoft agent framework

Deterministic business process
      ↓
Traditional workflow/BPM engine
```
