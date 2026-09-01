# Why Did You Choose LangGraph Instead of OpenAI Agents SDK?

## Interview Question

**"Why did you choose LangGraph instead of the OpenAI Agents SDK?"**

## Strong Interview Answer

> **"OpenAI Agents SDK was a strong option, especially for building production agent applications with tools, handoffs, guardrails, sessions, human-in-the-loop capabilities and built-in tracing. We could have implemented our multi-agent solution using it.**
>
> **The reason we selected LangGraph was primarily the orchestration model and the level of control we wanted over our enterprise workflow. Our architecture had one coordinator, multiple delegators and specialized workers, and the workflow involved explicit state transitions, conditional routing, retries, validation and potentially long-running execution.**
>
> **With LangGraph, the workflow itself is represented as a state graph. Agents and business functions become nodes, transitions become edges, and routing decisions become conditional edges. That made the execution path explicit and easier for us to reason about, test and govern.**
>
> **The OpenAI Agents SDK provides a higher-level agent runtime where agents can use tools and delegate through handoffs or agents-as-tools. That's excellent for many agentic applications. But our primary requirement was not simply agent delegation; it was explicit workflow orchestration around multiple enterprise capabilities.**
>
> **So I wouldn't say LangGraph is universally better than the OpenAI Agents SDK. The decision was based on architectural fit. LangGraph gave us the graph-based orchestration model we wanted for our hierarchical enterprise workflow."**

---

# The Core Difference

The easiest way to remember it:

```text
OpenAI Agents SDK
=================

                 Agent
                   |
          +--------+--------+
          |        |        |
        Tools   Handoffs  Guardrails
                   |
                   v
             Specialist Agent
```

The primary abstraction is:

> **Agent + Tools + Handoffs + Guardrails + Runtime**

OpenAI's current Agents SDK documentation describes agents as LLMs configured with instructions, tools and optional runtime behavior such as handoffs, guardrails and structured outputs. It also provides sessions, human-in-the-loop mechanisms and tracing.

---

LangGraph:

```text
LangGraph
=========

                    State
                      |
                      v
                 Coordinator
                      |
               Conditional Edge
                /      |      \
               v       v       v
          Delegator Delegator Delegator
              |         |         |
              v         v         v
           Worker     Worker     Worker
              \         |         /
               \        |        /
                +-------+-------+
                        |
                        v
                    Validator
                     /     \
                    v       v
                Success    Retry
                    |
                    v
                 Response
```

The primary abstraction is:

> **State + Nodes + Edges + Conditional Routing**

That was a better match for your CWD architecture.

---

# 1. Our Architecture Was Workflow-Centric

Your architecture was:

```text
                         User
                          |
                          v
                    Coordinator
                          |
             +------------+------------+
             |            |            |
             v            v            v
        Delegator A  Delegator B  Delegator C
             |            |            |
             v            v            v
          Workers      Workers      Workers
             |            |            |
             +------------+------------+
                          |
                          v
                   Enterprise Tools
                          |
                          v
                         RAG
                          |
                          v
                      Validator
                          |
                          v
                       Response
```

The important question was:

> **"What should happen next based on the current workflow state?"**

That is where LangGraph fit particularly well.

---

# 2. Explicit State

For example:

```python
class AgentState(TypedDict):

    user_query: str
    intent: str

    context: list
    tool_results: list

    analysis: str
    final_response: str

    retry_count: int
    validation_status: str
```

Then the state flows through the system:

```text
                  AgentState
                      |
                      v
                Coordinator
                      |
                      v
                 Delegator
                      |
                      v
                   Worker
                      |
                      v
                  Validator
                      |
                      v
                Updated State
```

This makes the workflow state a first-class architectural object.

---

# 3. Explicit Conditional Routing

For example:

```python
def route_request(state):

    if state["intent"] == "incident":
        return "incident_delegator"

    elif state["intent"] == "knowledge":
        return "knowledge_delegator"

    elif state["intent"] == "analytics":
        return "analytics_delegator"
```

And:

```python
graph.add_conditional_edges(
    "coordinator",
    route_request,
    {
        "incident_delegator": "incident_delegator",
        "knowledge_delegator": "knowledge_delegator",
        "analytics_delegator": "analytics_delegator"
    }
)
```

This creates:

```text
                    Coordinator
                         |
                Conditional Routing
                /        |        \
               v         v         v
          Incident    Knowledge   Analytics
          Delegator   Delegator   Delegator
```

The execution path is explicitly represented in the application.

---

# 4. OpenAI Agents SDK Can Also Do Multi-Agent Routing

This is important.

Don't tell the interviewer:

> ❌ "OpenAI Agents SDK cannot do multi-agent routing."

That's incorrect.

The SDK supports:

* Agents
* Tools
* Handoffs
* Agents as tools
* Guardrails
* Sessions
* Human-in-the-loop
* Tracing

OpenAI documents two important multi-agent patterns: **manager-style orchestration using agents as tools**, and **handoffs**, where control transfers to a specialist.

For example:

```text
                 Triage Agent
                 /          \
                /            \
               v              v
       Billing Agent      Support Agent
```

A handoff is effectively represented to the model as a tool for transferring control to the specialist.

That's very useful.

---

# 5. But Our Requirement Was More Than Agent Delegation

Our workflow was:

```text
User
 |
 v
Coordinator
 |
 v
Intent
 |
 +------ Incident ------> Incident Delegator
 |
 +------ Knowledge -----> Knowledge Delegator
 |
 +------ Analytics -----> Analytics Delegator
                              |
                              v
                           Worker
                              |
                         +----+----+
                         |         |
                        RAG       Tool
                         |         |
                         +----+----+
                              |
                              v
                          Validator
                           /     \
                          /       \
                      Retry      Success
                        |           |
                        +---->      v
                              Response
```

We wanted the **workflow topology itself** to be explicit.

That was the main reason for choosing LangGraph.

---

# 6. Deterministic Orchestration Around LLM Reasoning

This is the strongest architect-level statement:

> **"I wanted deterministic orchestration around probabilistic LLM reasoning."**

The LLM handles:

```text
Reasoning
Intent understanding
Planning
Classification
Generation
```

LangGraph controls:

```text
State
Routing
Transitions
Retry
Workflow execution
Persistence
```

Conceptually:

```text
                 LLM
                  |
          Probabilistic Reasoning
                  |
                  v
        +------------------+
        |    LangGraph     |
        |   Orchestration  |
        +------------------+
                  |
          Deterministic Flow
                  |
       +----------+----------+
       |          |          |
       v          v          v
     Agent      Agent      Agent
```

That separation was valuable for an enterprise system.

---

# 7. Retry and Recovery

Suppose an enterprise API fails:

```text
Worker
  |
  v
Enterprise API
  |
  +---- Success ----> Validator
  |
  +---- Failure ----> Retry
                         |
                         v
                       Worker
```

The retry path can be explicitly represented in the graph.

```python
graph.add_conditional_edges(
    "validator",
    validate_result,
    {
        "success": "response",
        "retry": "worker"
    }
)
```

This is one of the strongest reasons to explain your LangGraph choice.

---

# 8. OpenAI Agents SDK Has Strong Features Too

Don't undersell it.

The current OpenAI Agents SDK provides:

```text
Agents
Tools
Handoffs
Agents-as-tools
Guardrails
Sessions
Human-in-the-loop
Tracing
MCP tool integration
```

The SDK documentation explicitly describes built-in tracing, sessions, guardrails, handoffs and human-in-the-loop support.

It also supports MCP server tools directly.

So for a new project that is heavily OpenAI-centric, I would absolutely evaluate it.

---

# 9. One Important Advantage of OpenAI Agents SDK

If the interviewer asks:

**"What would make you choose OpenAI Agents SDK instead?"**

Answer:

> **"If the application were primarily OpenAI-centric and the workflow was relatively agent-driven rather than requiring a complex explicit state graph, I would strongly consider the OpenAI Agents SDK. Its built-in agent runtime, handoffs, tools, guardrails, sessions and tracing provide a very clean developer experience."**

For example:

```text
                  Triage Agent
                       |
                +------+------+
                |             |
                v             v
          Billing Agent   Support Agent
                |             |
              Tools          Tools
                |             |
                +------+------+
                       |
                    Response
```

That's a very natural fit for the SDK.

---

# 10. Why LangGraph for Our CWD System?

Our requirement was closer to:

```text
                 Coordinator
                      |
               State / Intent
                      |
              Conditional Route
                      |
              +-------+-------+
              |               |
         Delegator         Delegator
              |               |
           Workers          Workers
              |               |
              +-------+-------+
                      |
                  Validation
                      |
                +-----+-----+
                |           |
              Retry       Success
                |           |
                +           v
                         Response
```

The workflow had:

* Multiple branches
* Multiple workers
* Shared state
* Tool execution
* RAG
* Validation
* Retry paths
* Potential human approval
* Long-running execution
* Enterprise governance requirements

That made a graph-based orchestration model attractive.

---

# 11. Model and Provider Consideration

Another consideration is **architectural portability**.

Your enterprise architecture was intended to be cloud-agnostic:

```text
                Agentic Layer
                     |
          +----------+----------+
          |          |          |
       Azure       AWS        Other
          |          |          |
    Azure OpenAI  Bedrock    Other LLMs
```

If the orchestration layer is intentionally separated from the model provider, LangGraph gives us a framework-level orchestration layer rather than making the architecture primarily centered around one model provider.

The OpenAI Agents SDK can work with non-OpenAI providers as well, but the SDK is naturally centered around the OpenAI agent runtime and Responses API ecosystem. The official docs note that the SDK uses the Responses API by default for OpenAI models and also documents model/provider configuration.

So I would describe this as an **architectural consideration**, not a limitation.

---

# 12. Technical Comparison

| Requirement                    | OpenAI Agents SDK                 | LangGraph                                     | Our Decision  |
| ------------------------------ | --------------------------------- | --------------------------------------------- | ------------- |
| Agent creation                 | **Excellent**                     | Excellent                                     | Both          |
| Tools                          | **Excellent**                     | Excellent                                     | Both          |
| Agent-to-agent handoffs        | **Excellent**                     | Supported                                     | Both          |
| Agents as tools                | **Excellent**                     | Supported patterns                            | Both          |
| Guardrails                     | **Excellent**                     | Supported                                     | Both          |
| Sessions                       | **Built-in**                      | Persistence/checkpointing                     | Both          |
| Tracing                        | **Built-in OpenAI tracing**       | Integrates with LangSmith/other observability | SDK advantage |
| MCP                            | **Built-in support**              | Supported through integrations                | Both          |
| Explicit state graph           | Possible through application code | **Core abstraction**                          | **LangGraph** |
| Conditional graph routing      | Possible                          | **Core abstraction**                          | **LangGraph** |
| Complex branching              | Good                              | **Very strong fit**                           | **LangGraph** |
| Cyclic workflows               | Possible                          | **Natural graph pattern**                     | **LangGraph** |
| Explicit retry paths           | Possible                          | **Natural graph pattern**                     | **LangGraph** |
| Long-running stateful workflow | Strong                            | **Strong fit**                                | **LangGraph** |
| Provider-neutral orchestration | Good                              | **Strong fit**                                | **LangGraph** |
| OpenAI-first development       | **Excellent**                     | Excellent                                     | SDK advantage |
| Our hierarchical workflow      | Good                              | **Very strong fit**                           | **LangGraph** |

---

# 13. The Trade-Off

I would explain the trade-off honestly:

```text
OpenAI Agents SDK
        |
        v
Higher-level Agent Runtime
        |
        +--- Tools
        +--- Handoffs
        +--- Guardrails
        +--- Sessions
        +--- Tracing
```

Versus:

```text
LangGraph
        |
        v
Lower-level Workflow Orchestration
        |
        +--- State
        +--- Nodes
        +--- Edges
        +--- Conditional Edges
        +--- Loops
        +--- Persistence
```

So:

> **OpenAI Agents SDK gives you a very productive agent runtime. LangGraph gives you more direct control over the workflow topology.**

That's the distinction I would emphasize.

---

# 14. When Would I Choose OpenAI Agents SDK?

I would choose it when:

```text
OpenAI-centric
      +
Agent-based
      +
Tools
      +
Handoffs
      +
Guardrails
      +
Simple/moderate workflow
```

Example:

```text
User
 |
 v
Triage Agent
 |
 +---- Billing Agent
 |
 +---- Support Agent
 |
 +---- Technical Agent
```

That's a very good OpenAI Agents SDK use case.

---

# 15. When Would I Choose LangGraph?

I would choose it when:

```text
Complex Workflow
       +
Shared State
       +
Multiple Branches
       +
Loops
       +
Retries
       +
Persistence
       +
Human Approval
       +
Long-running Execution
```

Example:

```text
Coordinator
     |
     v
Delegator
     |
     v
Worker
     |
   Tool/RAG
     |
     v
Validator
   /     \
Retry   Success
  |        |
  +------> Response
```

That matches your CWD architecture.

---

# 16. If the Interviewer Says: "But OpenAI Agents SDK Can Do All That"

This is the response you should give:

> **"Yes, that's fair. The OpenAI Agents SDK has evolved significantly and provides many of the capabilities required for production agentic systems, including handoffs, agents-as-tools, guardrails, sessions, human-in-the-loop and tracing. So I wouldn't claim that LangGraph is the only framework capable of implementing our architecture. My decision was about the abstraction and level of control. Our workflow was naturally represented as a state machine with explicit transitions, branches and retry paths, so LangGraph gave us a more direct representation of the architecture."**

This is the **safe and technically mature answer**.

---

# 17. If They Ask: "Would You Use OpenAI Agents SDK Today?"

Say:

> **"Yes, I would definitely evaluate it for a new project. The SDK has become a strong production option, especially if the application is OpenAI-centric and benefits from its built-in tools, handoffs, guardrails, sessions and tracing. But I would still choose the framework based on workflow complexity, state-management requirements, model-provider strategy, observability, deployment and enterprise integration requirements."**

---

# Best 30-Second Interview Answer

> **"OpenAI Agents SDK was a strong alternative, and we could have implemented the solution with it. Its agents, tools, handoffs, guardrails, sessions and tracing make it very good for production agent applications. We chose LangGraph because our architecture was more workflow-centric. We had a coordinator, multiple delegators and workers, with shared state, conditional routing, validation, retry paths and long-running execution. LangGraph allowed us to model those explicitly as state, nodes and edges. So it wasn't that OpenAI Agents SDK couldn't solve the problem; LangGraph gave us better control over the workflow topology and matched our enterprise architecture better."**

---

# One-Line Memory Trick

```text
OpenAI Agents SDK
→ "How do I build and run agents with tools and handoffs?"

LangGraph
→ "How do I explicitly control a complex stateful agent workflow?"
```

### Final architect-level statement

> **"I selected LangGraph because I wanted the orchestration layer to be explicit and provider-independent, while the LLM remained responsible for reasoning. The framework decision was driven by workflow complexity and enterprise control requirements, not by claiming that one framework was universally better than another."**
