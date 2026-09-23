### Interview answer

> **I would reduce CWD complexity by enforcing clear responsibilities and using deterministic mechanisms wherever possible. The goal is not to remove the Coordinator–Delegator–Worker pattern, but to make each layer thinner and simpler.**
>
> **First, I would keep the Coordinator focused on intent, planning, routing, and final aggregation.** I would remove detailed business logic and tool execution from it.
>
> **Second, I would keep Delegators domain-focused.** A Sales Delegator should know which Sales Workers are required, while an IT Delegator should know which IT Workers are required. They should not contain infrastructure, security, or retry logic.
>
> **Third, I would make Workers independently executable.** Each Worker should perform one well-defined capability through MCP and return a structured result.
>
> **Fourth, I would avoid using an LLM for deterministic decisions.** Authentication, authorization, schema validation, routing rules, retries, timeouts, and aggregation should primarily be code or policy-driven. The LLM should handle tasks that actually require reasoning.
>
> **Fifth, I would standardize interfaces.** Every Worker should follow a common contract such as:
>
> ```text
> WorkerRequest
>   → request_id
>   → customer_id
>   → context
>   → parameters
>
> WorkerResponse
>   → status
>   → data
>   → error
>   → metadata
> ```
>
> This prevents every Worker from implementing its own communication pattern.
>
> **Sixth, I would centralize cross-cutting concerns.** Security, tracing, authentication, rate limiting, auditing, and policy enforcement should be platform capabilities instead of being implemented separately by every Worker.
>
> **Finally, I would use asynchronous execution only where it provides value.** I wouldn't introduce queues, agents, or workflows simply because they are available. For a simple synchronous lookup, a direct call is simpler.

### Before vs. after

**Over-complex CWD:**

```text
Coordinator
   ↓
LLM routing
   ↓
Delegator
   ↓
LLM routing
   ↓
Worker
   ↓
Custom security
   ↓
Custom retry
   ↓
Custom logging
   ↓
MCP
   ↓
Enterprise API
```

**Simplified CWD:**

```text
                 Coordinator
              /              \
       Sales Delegator     IT Delegator
            |                  |
        CRM Worker         Incident Worker
            |                  |
            +------- MCP ------+
                     |
              Enterprise APIs
```

With shared platform services:

```text
        Security | Observability | Policy
                    |
              All Components
```

### The key principle

**Every layer should have one primary responsibility:**

| Layer               | Responsibility             |
| ------------------- | -------------------------- |
| **Coordinator**     | Plan, route, aggregate     |
| **Delegator**       | Domain-level coordination  |
| **Worker**          | Execute one capability     |
| **MCP**             | Standardized tool access   |
| **Policy layer**    | Authorization/governance   |
| **Observability**   | Trace/measure              |
| **Workflow engine** | Durable execution/recovery |

### Strong closing answer

> **“I reduce complexity by making the Coordinator thinner, keeping Delegators domain-focused, making Workers independently executable, removing unnecessary LLM decisions, standardizing Worker contracts, and centralizing cross-cutting concerns such as security and observability. I also avoid introducing agents, queues, or asynchronous workflows unless they solve a real business or scalability problem. The architectural principle is: use the simplest mechanism that satisfies the requirement.”**
