# What Are the Trade-offs of Your Multi-Agent Architecture?

## Interview Question

**“What are the trade-offs of your multi-agent architecture?”**

---

## Strong Interview Answer

> **“The biggest trade-off is that multi-agent architecture gives us better modularity, specialization, scalability, and domain isolation, but it also introduces additional complexity.**
>
> **In my Coordinator → Delegator → Worker architecture, we have more agent interactions, more orchestration state, more LLM calls, and potentially higher latency and cost compared with a single-agent design. We also have to manage agent communication, context propagation, failure handling, observability, security, and consistency across agents.**
>
> **I accepted those trade-offs because the business problem had multiple domains and specialized capabilities that benefited from independent reasoning and ownership. I wouldn't use multi-agent simply because it is more advanced. If the problem can be solved reliably with a single agent or deterministic workflow, I would prefer the simpler architecture.”**

---

# 1. Architecture Complexity

### Benefit

Each agent has a focused responsibility:

```text
Coordinator
    ↓
Domain Delegator
    ↓
Specialized Worker
```

This improves separation of concerns.

### Trade-off

The overall architecture becomes more complex.

Instead of:

```text
User → Agent → Tool
```

we may have:

```text
User
 ↓
Coordinator
 ↓
Delegator
 ↓
Worker
 ↓
Tool
 ↓
Enterprise Data
```

There are more components to design, deploy, monitor, and maintain.

### Architect Point

> **“Multi-agent reduces local complexity inside individual agents but increases system-level complexity.”**

---

# 2. Latency

This is one of the biggest trade-offs.

A single-agent workflow might be:

```text
User
 ↓
LLM
 ↓
Tool
 ↓
Response
```

A multi-agent workflow could involve:

```text
Coordinator
 ↓
Delegator
 ↓
Worker
 ↓
Another Worker
 ↓
Delegator
 ↓
Coordinator
 ↓
Response
```

Each agent interaction can introduce:

* LLM inference latency
* network latency
* serialization/deserialization
* context transfer
* tool execution time

Therefore:

> **More agents can mean more hops and potentially higher end-to-end latency.**

---

# 3. Cost

Each additional reasoning step can potentially result in another LLM call.

For example:

```text
Single Agent

1–2 LLM calls
```

versus:

```text
Multi-Agent

Coordinator → LLM
Delegator   → LLM
Worker      → LLM
Critic      → LLM
```

This can increase token consumption and inference cost.

### How I Would Control It

I would use:

* deterministic routing where possible
* smaller models for classification/routing
* larger models only for complex reasoning
* prompt optimization
* context minimization
* caching
* parallel execution where appropriate
* maximum iteration limits
* token budgets

---

# 4. Context Propagation

Agents need the right context to perform their tasks.

For example:

```text
Coordinator
     ↓
Task + User Context
     ↓
Delegator
     ↓
Relevant Domain Context
     ↓
Worker
```

The challenge is deciding:

> **What context should be passed to each agent?**

Passing everything creates:

* larger prompts
* higher token cost
* latency
* irrelevant information
* potential data exposure

Passing too little context causes:

* poor reasoning
* incorrect decisions
* repeated retrieval

Therefore, context needs to be **scoped and minimized**.

---

# 5. Failure Handling

In a single-agent architecture:

```text
Agent → Tool
```

failure handling is relatively straightforward.

In multi-agent:

```text
Coordinator
     ↓
Delegator
     ↓
Worker A
     ↓
Worker B
```

any component can fail.

Examples:

```text
Worker timeout
Agent unavailable
A2A communication failure
Tool failure
LLM timeout
Invalid worker response
```

So we need:

* retries
* timeouts
* circuit breakers
* fallback agents
* idempotency
* error propagation
* partial-result handling

---

# 6. Observability Becomes More Important

With multiple agents, a simple application log isn't enough.

We need to understand:

```text
User Request
   ↓
Coordinator decision
   ↓
Delegator decision
   ↓
Worker invocation
   ↓
Tool invocation
   ↓
Worker result
   ↓
Delegator result
   ↓
Final response
```

I would use:

* correlation IDs
* distributed tracing
* agent-level logs
* token/cost metrics
* latency metrics
* tool invocation logs
* prompt/model version tracking
* evaluation metrics

This allows us to answer:

> **“Which agent made the wrong decision and why?”**

---

# 7. Non-Determinism

LLM-based agents are probabilistic.

A multi-agent system compounds this.

For example:

```text
Coordinator
     ↓
Decision 1
     ↓
Delegator
     ↓
Decision 2
     ↓
Worker
     ↓
Decision 3
```

If each decision has some probability of being incorrect, the overall workflow can become harder to predict.

Therefore, I would keep critical business rules deterministic wherever possible.

For example:

```text
Business Rule
      ↓
Deterministic Code
```

rather than:

```text
Business Rule
      ↓
LLM Decision
```

---

# 8. Security Complexity

More agents mean more potential access paths.

For example:

```text
Coordinator
 ↓
Delegator
 ↓
Worker
 ↓
Database
```

Each boundary needs appropriate:

* authentication
* authorization
* RBAC
* data filtering
* secrets management
* audit logging
* tenant isolation

The architecture should follow:

> **Least privilege — each agent gets only the tools and data it actually needs.**

---

# 9. Data Consistency

If multiple agents modify enterprise systems, consistency becomes more complicated.

For example:

```text
Agent A → Database
Agent B → API
Agent C → Another System
```

You need to consider:

* transaction boundaries
* duplicate execution
* idempotency
* stale data
* conflicting updates
* eventual consistency

For critical updates, I would prefer deterministic service/API workflows rather than allowing autonomous agents to make uncontrolled changes.

---

# 10. Agent Communication Overhead

In my architecture, if agents are independently deployed, A2A can provide structured agent communication.

But communication itself introduces overhead:

```text
Agent A
   ↓
A2A request
   ↓
Agent B
   ↓
A2A response
```

Compared with:

```text
function_call()
```

A2A can introduce additional:

* network latency
* serialization
* authentication
* retries
* monitoring
* operational complexity

Therefore:

> **I wouldn't use A2A for every internal function call.**

If two components are tightly coupled and run in the same application, direct invocation may be simpler.

---

# 11. Testing Complexity

Testing a single agent:

```text
Input → Agent → Expected Output
```

is relatively straightforward.

Testing a multi-agent system requires:

```text
Coordinator
   ↓
Delegator
   ↓
Worker
   ↓
Tool
```

We need:

### Unit Testing

Test individual agents.

### Integration Testing

Test agent-to-agent and agent-to-tool interactions.

### Workflow Testing

Test the complete execution path.

### Evaluation Testing

Measure:

* correctness
* groundedness
* hallucination
* tool selection
* routing accuracy
* task completion

### Failure Testing

Test:

* timeout
* agent failure
* invalid response
* tool failure
* partial execution

---

# 12. Debugging Is Harder

Consider:

```text
User
 ↓
Coordinator
 ↓
Delegator
 ↓
Worker A
 ↓
Worker B
 ↓
Tool
```

If the final answer is wrong, the problem could be:

```text
Coordinator routing
       OR
Delegator planning
       OR
Worker reasoning
       OR
Tool result
       OR
Context propagation
```

Therefore, multi-agent systems require strong observability and traceability.

---

# 13. Deployment and Operations

With one agent:

```text
1 application
```

With multiple independently deployed agents:

```text
Coordinator Service
Delegator Service
Worker A Service
Worker B Service
Worker C Service
```

Now we need to manage:

* deployment
* version compatibility
* service discovery
* scaling
* health checks
* configuration
* security
* monitoring

This increases operational overhead.

---

# 14. Coordination vs Autonomy Trade-off

More autonomy isn't always better.

```text
High autonomy
      ↓
More flexibility
      ↓
Less predictability
```

Whereas:

```text
More orchestration
      ↓
More control
      ↓
Less autonomy
```

My architecture intentionally chooses **controlled autonomy**.

```text
Coordinator
   ↓
Controls overall workflow

Delegator
   ↓
Controls domain decisions

Worker
   ↓
Has specialized autonomy
```

---

# 15. Agent Proliferation

One of the biggest architectural mistakes is:

> **“Every task should become an agent.”**

I would avoid that.

For example:

```text
Calculate Average
     ↓
Tool ❌ Agent
```

```text
Query Database
     ↓
Tool ❌ Agent
```

```text
Analyze manufacturing defect
     ↓
Specialized Agent ✅
```

The rule is:

> **If deterministic code or a tool can solve it, don't create an agent unnecessarily.**

---

# How I Mitigate These Trade-offs

| Trade-off              | Mitigation                                          |
| ---------------------- | --------------------------------------------------- |
| Latency                | Parallel execution, model selection, caching        |
| Cost                   | Smaller models, token budgets, routing optimization |
| Complexity             | Clear agent boundaries                              |
| Failure                | Retry, timeout, fallback, circuit breaker           |
| Context                | Scoped context propagation                          |
| Security               | Least privilege, RBAC                               |
| Debugging              | Distributed tracing, correlation IDs                |
| Agent proliferation    | Capability-based agent design                       |
| Non-determinism        | Deterministic rules for critical logic              |
| Communication overhead | Direct calls for tightly coupled components         |
| Testing                | Unit + integration + workflow + evaluation tests    |

---

# Architecture Decision

My decision was essentially:

```text
                 Business Complexity
                        ↓
              Multiple Domains?
                    /       \
                  No         Yes
                  ↓           ↓
             Single Agent   Multiple Agents
                              ↓
                       Independent Domains?
                           /       \
                         No         Yes
                         ↓           ↓
                    Supervisor   Hierarchical
```

And if agents require independent communication:

```text
Hierarchical Agents
        +
       A2A
```

If they need tools/data:

```text
Agents
   ↓
MCP
   ↓
Tools / Enterprise Data
```

---

# What I Would Say as an Architect

> **“The trade-off of my multi-agent architecture is that I exchanged simplicity for modularity and enterprise scalability. We gained specialized agents, domain isolation, independent ownership, controlled access to tools and data, and better scalability. But we introduced additional latency, LLM cost, communication overhead, state management, observability, security, testing, and failure-handling complexity.**
>
> **I mitigated those costs through scoped agent boundaries, deterministic routing where possible, model selection, parallel execution, token budgets, caching, distributed tracing, retries, timeouts, and least-privilege access. Most importantly, I don't create an agent unless there is a meaningful business or architectural boundary. If a single agent or deterministic workflow can solve the problem reliably, I prefer the simpler architecture.”**

---

# 30-Second Interview Version

> **“The main trade-off is complexity versus modularity. Multi-agent gives me specialization, domain isolation, independent scaling, and ownership, but it increases latency, LLM cost, communication overhead, context management, testing, observability, and failure-handling complexity. In my architecture, I addressed those through scoped contexts, model routing, parallel execution, token budgets, retries, timeouts, tracing, and least-privilege access. I also avoid agent proliferation—if a task can be handled deterministically or by a tool, I don't make it an agent.”**

---

# Golden Architect Statement

> **“Multi-agent architecture doesn't eliminate complexity; it moves complexity from inside one large agent to the interactions between multiple specialized agents.”**

That is the key trade-off an **architect** should demonstrate you understand.
