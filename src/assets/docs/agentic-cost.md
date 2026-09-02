# How Does Your Architecture Impact Cost?

## Interview Question

**“How does your Agentic AI architecture impact cost?”**

---

## Strong Interview Answer

> **“The main cost impact comes from the number of LLM calls, token consumption, agent hops, retrieval operations, and external tool/API usage.**
>
> In our architecture, a request can flow through **Coordinator → Delegator → Worker → MCP → Enterprise System**, and multiple stages may involve LLM inference. Compared with a simple single-agent workflow, this can increase both token consumption and infrastructure costs.
>
> I therefore treat cost as an architectural concern rather than something we optimize after deployment.
>
> I control cost through **model routing, short-path execution, limiting unnecessary agent hops, parallelizing independent work, context minimization, caching, retrieval optimization, token budgets, and execution limits**.
>
> For example, I would use a smaller model for classification and routing, while reserving a more capable model for complex reasoning. Similarly, deterministic business rules should not invoke an LLM at all.
>
> So the trade-off is **specialization and architectural flexibility versus additional inference and operational cost**. My goal is to use the minimum amount of agent and model execution required to produce a reliable answer.”**

---

# Where Does the Cost Come From?

A typical request might look like:

```text
User
  ↓
Coordinator
  ↓
Delegator
  ↓
Worker
  ↓
RAG / MCP
  ↓
Enterprise System
  ↓
LLM
```

The cost can come from several layers:

```text
                    Total Cost
                        │
       ┌────────────────┼────────────────┐
       ▼                ▼                ▼
    LLM Cost        Infrastructure    Enterprise
       │                │              Services
       ▼                ▼
  Tokens/Calls     Compute/Storage
```

---

# 1. LLM Calls Are the Biggest Cost Driver

Suppose one request performs:

```text
Coordinator       → 1 LLM call
Delegator         → 1 LLM call
Worker            → 2 LLM calls
Validation        → 1 LLM call
```

That's potentially:

```text
5 LLM invocations
```

for one user request.

A simpler workflow might only require:

```text
User
 ↓
Agent
 ↓
Tool
 ↓
Response
```

Therefore:

> **Every unnecessary LLM invocation increases cost.**

---

# 2. Token Consumption

Cost isn't only about the number of calls.

It is also about how much context we send.

Bad approach:

```text
Coordinator
    ↓
Entire conversation
    ↓
Delegator
    ↓
Entire conversation
    ↓
Worker
    ↓
Entire conversation
```

The same context may be processed repeatedly.

Better:

```text
Coordinator
    ↓
Task-specific context
    ↓
Delegator
    ↓
Domain-specific context
    ↓
Worker
    ↓
Task-specific context
```

This reduces:

* Input tokens
* Processing
* Cost
* Context noise

### Principle

> **Pass the minimum context required by each agent.**

---

# 3. Model Selection Has a Major Impact

I wouldn't use the most expensive model for every operation.

For example:

```text
Intent Classification
        ↓
Small / Fast Model

Routing
        ↓
Small / Fast Model

RAG Answer
        ↓
Medium Model

Complex Root Cause Analysis
        ↓
Advanced Reasoning Model
```

This creates a better:

```text
Cost ↔ Quality ↔ Latency
```

balance.

---

# 4. Multi-Agent Architecture Can Multiply Cost

Consider:

```text
                    Coordinator
                         │
                    Delegator
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
           Worker A   Worker B   Worker C
```

If all three workers independently invoke LLMs:

```text
Coordinator = 1
Delegator   = 1
Worker A    = 1
Worker B    = 1
Worker C    = 1

Total = 5 model calls
```

But if the request only needs Worker A:

```text
Coordinator
     ↓
Worker A
```

we should avoid executing the other workers.

### Key Principle

> **Parallelism improves latency, but unnecessary parallelism can increase cost.**

This is an important architect trade-off.

---

# 5. RAG Also Has Cost

A RAG workflow can involve:

```text
Query
 ↓
Embedding
 ↓
Vector Search
 ↓
Reranking
 ↓
Context Construction
 ↓
LLM Generation
```

Potential cost contributors include:

* Embedding calls
* Reranking
* Vector database
* Storage
* Retrieval compute
* LLM input tokens
* LLM output tokens

### Optimization

I would:

* Use appropriate top-K
* Apply metadata filtering
* Avoid retrieving irrelevant documents
* Cache frequent queries
* Avoid unnecessary reranking
* Keep context concise

---

# 6. MCP and Enterprise APIs Have Operational Cost

MCP itself is a protocol, but the tools and systems behind it may have costs.

For example:

```text
Agent
 ↓
MCP
 ↓
Search API
 ↓
Database
 ↓
Enterprise Service
```

Each system can introduce:

* Compute cost
* Network cost
* API usage
* Database load
* Licensing/usage charges

Therefore, I would monitor tool usage just like model usage.

---

# 7. Infrastructure Cost

A production Agentic AI platform may also require:

```text
API Layer
Agent Runtime
Container/Kubernetes
Vector DB
Databases
Caching
Observability
Message/Event Infrastructure
Storage
```

With distributed agents, independently deployed services may increase infrastructure footprint.

This is another reason I would avoid deploying every small capability as an independent agent.

---

# How I Would Control Cost

## 1. Short-Path Architecture

Instead of:

```text
Every Request
     ↓
Coordinator
     ↓
Delegator
     ↓
Worker
```

use:

```text
                    Request
                       ↓
                     Router
                  ↙         ↘
             Simple          Complex
               ↓                ↓
            Tool/Agent      Multi-Agent
```

Simple requests avoid unnecessary agent execution.

---

# 2. Model Routing

```text
                    Request
                       ↓
                 Model Router
                ↙      ↓       ↘
             Small   Medium   Advanced
```

Use the expensive model only when the problem justifies it.

---

# 3. Token Budgets

I would define:

```text
Max input tokens
Max output tokens
Max agent iterations
Max tool calls
Max workflow duration
```

This prevents runaway execution.

---

# 4. Caching

For repeated requests:

```text
Request
   ↓
Cache?
 ├── Yes → Return cached result
 │
 └── No
      ↓
   Agent Workflow
      ↓
    Cache Result
```

Caching can reduce:

* LLM calls
* Embedding calls
* Retrieval calls
* External API calls

---

# 5. Avoid Agentization of Deterministic Tasks

For example:

```text
Calculate defect percentage
```

doesn't need:

```text
Defect Calculation Agent
```

A deterministic function is cheaper and more reliable:

```text
Python / SQL Tool
```

Similarly:

```text
Validate required field
Check authorization
Calculate total
Format response
```

should generally remain deterministic.

---

# 6. Control Parallelism

Parallel execution can reduce latency:

```text
Worker A ─┐
Worker B ─┼→ Aggregator
Worker C ─┘
```

But if only Worker A is necessary:

```text
Worker A
```

is cheaper.

Therefore:

> **Optimize for the minimum necessary work, not maximum parallelism.**

---

# 7. Monitor Cost Per Request

I would track:

```text
Request
 │
 ├── Agent calls
 ├── Model calls
 ├── Input tokens
 ├── Output tokens
 ├── Tool calls
 ├── Retrieval calls
 ├── Execution time
 └── Estimated cost
```

Then calculate metrics such as:

```text
Cost per request
Cost per successful task
Cost by agent
Cost by model
Cost by business domain
Cost by workflow
```

This allows us to identify expensive workflows.

---

# Cost Optimization Architecture

```text
                         User
                           │
                           ▼
                    Request Router
                           │
              ┌────────────┴────────────┐
              │                         │
          Simple Task               Complex Task
              │                         │
              ▼                         ▼
        Direct Tool               Coordinator
                                        │
                                  Delegator
                                        │
                             ┌──────────┼──────────┐
                             ▼          ▼          ▼
                          Worker A   Worker B   Worker C
                             │          │          │
                             └──────────┼──────────┘
                                        ▼
                                    Aggregator
                                        │
                                        ▼
                                    Response
```

The architecture should make the **cheap path the default** and activate expensive reasoning only when necessary.

---

# Cost vs Architecture Trade-off

| Architecture Choice    | Cost Impact              |
| ---------------------- | ------------------------ |
| More agents            | ↑ LLM/operational cost   |
| More agent hops        | ↑ Inference cost         |
| Larger models          | ↑ Model cost             |
| Larger context         | ↑ Token cost             |
| More retrieval         | ↑ Retrieval + token cost |
| More parallel workers  | ↑ Cost but ↓ latency     |
| Caching                | ↓ Cost                   |
| Smaller routing models | ↓ Cost                   |
| Deterministic tools    | ↓ Cost                   |
| Short-path routing     | ↓ Cost                   |
| Token budgets          | Prevents runaway cost    |

---

# Important Interview Follow-Up

### “How do you balance cost and quality?”

A strong answer:

> **“I don't optimize purely for minimum cost. I optimize for cost per successful business outcome. For simple tasks, I use deterministic logic or smaller models. For complex reasoning where accuracy has higher business value, I allow a more capable model or multiple agents. The decision is based on quality, latency, and cost together.”**

---

# Another Follow-Up

### “Wouldn't a multi-agent system always be more expensive?”

Answer:

> **“Not necessarily. It can be more expensive per request because of additional model calls, but the architecture can also reduce cost through specialization, smaller models, scoped context, parallel execution, and better tool selection. The important metric is not simply the number of agents; it's the total execution path and cost per successful outcome.”**

---

# Architect-Level Answer

> **“The architecture can increase cost because every additional agent, LLM call, token, retrieval operation, and external tool invocation contributes to the total execution cost. The Coordinator–Delegator–Worker model is therefore more expensive than a simple single-agent workflow if we execute the entire hierarchy for every request.
>
> I control that by making execution adaptive. Simple requests take a short path, while complex requests activate specialized agents. I use model routing, scoped context, caching, token and iteration budgets, deterministic tools for deterministic work, and parallelism only where it provides meaningful value.
>
> I also monitor cost at the request, agent, model, and tool levels. Ultimately, I optimize for **cost per successful business outcome**, not simply minimum LLM spend.”**

---

# 30-Second Interview Answer

> **“The main cost impact comes from additional LLM calls, token consumption, agent hops, RAG operations, and enterprise tool calls. A Coordinator → Delegator → Worker workflow can therefore cost more than a single-agent workflow. I control that using short-path routing, smaller models for simple decisions, scoped context, caching, token and iteration limits, and deterministic tools wherever possible. I also monitor cost per request and per successful task. My goal isn't the cheapest possible architecture; it's the best balance of cost, quality, latency, and reliability.”**

---

# Golden Line

> **“I optimize for cost per successful business outcome, not simply the lowest number of LLM calls.”**

## Memory Trick

### **COST = Calls + Context + Compute + Tools**

* **Calls** → Number of LLM/agent calls
* **Context** → Input/output tokens
* **Compute** → Agent/runtime/infrastructure
* **Tools** → RAG, databases, APIs, enterprise services

### Optimization

**Short Path + Model Routing + Context Control + Caching + Deterministic Tools + Budgets**

---

## Strong Architect Principle

> **“Every agent boundary should have a measurable business or architectural benefit. If an agent adds cost without adding meaningful capability, it should probably be a tool or workflow step instead.”**
