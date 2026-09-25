# Step Functions vs Application-Level Orchestration

The key idea:

> **Step Functions = managed workflow orchestration**
> **Application-level orchestration = your code controls the workflow**

For CWD, I would often use **both**, because they solve different layers of the problem.

### 1. Application-level orchestration

For example, your **Coordinator using LangGraph** can dynamically decide:

```text
User Request
    ↓
Coordinator / LangGraph
    ↓
Understand intent
    ↓
Choose Delegators
    ↓
Choose Workers
    ↓
Dynamic routing
```

The decision can depend on the actual request.

Example:

```text
"Give me a customer briefing"
          ↓
Coordinator
          ↓
Customer + Sales + IT needed?
          ↓
Dynamic decision
```

This is difficult to model purely as a fixed Step Functions state machine.

---

### 2. Step Functions orchestration

Once the workflow is known, Step Functions can reliably execute it:

```text
Step Functions
      ↓
Customer Worker
      ↓
Parallel
 ┌────┴─────┐
 ↓          ↓
Sales     Incident
 ↓          ↓
 └────┬─────┘
      ↓
Briefing
```

It provides:

* Durable execution
* Retry
* Catch
* Timeout
* Parallel execution
* Conditional branches
* Workflow history
* Long-running execution

---

## CWD architecture

I would use the layers like this:

```text id="k6x3nr"
                User
                  ↓
             Coordinator
             / LangGraph
                  ↓
        Dynamic agent decisions
                  ↓
            Delegators
                  ↓
       ┌─────────────────────┐
       │   Step Functions    │
       │                     │
       │ Retry / Timeout     │
       │ Parallel / Catch    │
       │ Durable execution   │
       └──────────┬──────────┘
                  ↓
               Workers
                  ↓
             MCP / APIs
                  ↓
          Enterprise Systems
```

### Why not put everything in Step Functions?

Because CWD is an **agentic system**.

The Coordinator may dynamically decide:

```text
Request A → Sales + Customer Workers
Request B → IT + Incident Workers
Request C → Customer + Sales + IT
```

The exact path may not be known when the workflow starts.

That's where **LangGraph/application orchestration** is useful.

---

## Comparison

|                         | Step Functions          | Application orchestration |
| ----------------------- | ----------------------- | ------------------------- |
| Who controls workflow?  | AWS managed service     | Your application code     |
| Dynamic agent reasoning | Limited                 | ✅                         |
| Durable execution       | ✅                       | You must build it         |
| Retry/timeout           | Built-in                | You implement             |
| Parallel execution      | Built-in                | You implement             |
| Workflow history        | Built-in                | You implement             |
| Agent routing           | Not its primary purpose | ✅                         |
| Long-running workflow   | ✅                       | More work                 |
| Flexibility             | State-machine based     | Very high                 |
| Operational effort      | Lower                   | Higher                    |

### 🎯 Strong interview answer

> **“I use application-level orchestration, such as LangGraph, when the workflow requires dynamic agent reasoning and runtime decisions—for example, determining which Delegators and Workers should participate in a CWD request. I use Step Functions when I need durable execution of a known workflow with built-in retries, timeouts, parallelism, failure handling, and long-running execution. So I don't replace one with the other. LangGraph decides dynamically, while Step Functions can reliably execute the predefined or operational workflow portions.”**

### Easy memory trick

**LangGraph → Decide**

**Step Functions → Execute reliably**

**Workers → Do the work**
