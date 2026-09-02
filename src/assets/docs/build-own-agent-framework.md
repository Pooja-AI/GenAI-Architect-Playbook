# Would You Build Your Own Agentic AI Orchestration Framework?

## Interview Question

**"Would you build your own Agentic AI orchestration framework? Why or why not?"**

---

# Strong Interview Answer

**I would not build an Agentic AI orchestration framework from scratch by default.**

My first preference would be to use a proven framework such as **LangGraph**, because orchestration involves many complex capabilities beyond simply calling an LLM.

For example, we need to handle:

- Agent state management
- Workflow orchestration
- Routing and delegation
- Parallel and sequential execution
- Retries and error handling
- Human-in-the-loop
- Checkpointing
- Memory
- Observability
- Streaming
- Tool execution
- Long-running workflows
- Failure recovery

Building all of these capabilities ourselves creates significant engineering and operational overhead.

However, **I would consider building a custom orchestration layer when the enterprise has requirements that existing frameworks cannot satisfy**, such as very specific governance, security, interoperability, workflow control, cost optimization, or platform-standardization requirements.

So my approach would be:

> **Use an existing orchestration framework for the core execution engine, and build a thin enterprise orchestration layer around it rather than reinventing the entire framework.**

This gives us the best balance between **speed, flexibility, maintainability, and enterprise control.**

---

# 1. Functional Perspective

From a functional perspective, an Agentic AI orchestration framework is responsible for coordinating multiple agents, tools, workflows, and LLM calls.

For example:

```text
                    User Request
                         |
                         v
                +----------------+
                |   Coordinator  |
                +----------------+
                         |
              Determine Intent
                         |
          +--------------+--------------+
          |              |              |
          v              v              v
     Delegator A    Delegator B    Delegator C
          |              |              |
          v              v              v
      Worker 1        Worker 3       Worker 5
      Worker 2        Worker 4       Worker 6
          |              |              |
          +--------------+--------------+
                         |
                         v
                  Result Aggregator
                         |
                         v
                    Final Answer