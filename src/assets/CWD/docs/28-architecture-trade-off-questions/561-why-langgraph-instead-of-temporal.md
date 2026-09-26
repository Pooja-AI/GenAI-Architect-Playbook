For your **CWD architecture**, the key distinction is:

> **LangGraph = AI/agent orchestration**
> **Temporal = durable workflow orchestration**

### Why LangGraph instead of Temporal?

I chose **LangGraph** because CWD's primary problem is **LLM-driven agent orchestration**:

1. **Agent state**

   * Maintains conversation/task state between Coordinator → Delegator → Worker.

2. **Conditional routing**

   * Coordinator can dynamically decide which Delegator to invoke.
   * Delegator can dynamically select Workers.

3. **LLM-native**

   * Easy integration with LLM calls, tool calling, MCP, RAG, and agent reasoning.

4. **Human-in-the-loop**

   * Supports interrupt/resume patterns for approval of sensitive actions.

5. **Parallel agent execution**

   * Multiple Workers can execute in parallel and results can be aggregated.

6. **Checkpointing**

   * Persist workflow state so execution can resume after interruption/failure.

### Where Temporal would be stronger

Temporal is particularly strong when the requirement is **long-running, highly durable business workflows** with reliable execution across failures.

For example:

```text
Order → Payment → Approval → Fulfillment → Notification
```

That is more traditional workflow orchestration.

### Interview answer

> **"I chose LangGraph because CWD is primarily an LLM-driven multi-agent orchestration problem. We needed dynamic routing between Coordinator, Delegators, and Workers, agent state, tool calling, parallel execution, human-in-the-loop, and checkpointing. Temporal is excellent for durable long-running business workflows, but LangGraph was a better fit for the AI reasoning and agent orchestration layer. In a mature architecture, I could also use both—LangGraph for agent reasoning and Temporal for long-running business workflow durability."**
