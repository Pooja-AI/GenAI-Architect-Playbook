For your **CWD interview**, the key point is:

> **Custom Python can orchestrate a workflow, but LangGraph gives us a structured, stateful workflow model with built-in patterns for agentic systems.**

### LangGraph vs Custom Python

| Area                    | Custom Python                | LangGraph                               |
| ----------------------- | ---------------------------- | --------------------------------------- |
| Basic orchestration     | ✅ Easy                       | ✅                                       |
| Conditional routing     | `if/else`                    | **Graph edges**                         |
| Workflow state          | Manually manage              | **Graph state**                         |
| Parallel execution      | `asyncio` / threads          | **Graph branches**                      |
| Checkpointing           | Build yourself               | **Built-in pattern**                    |
| Resume after failure    | Build yourself               | **Checkpoint + resume**                 |
| Retry/recovery          | Custom code                  | Easier to model                         |
| Human approval          | Custom state machine         | **Interrupt/resume**                    |
| Complex agent workflows | Becomes code-heavy           | **Natural graph representation**        |
| Visualization           | Build yourself               | Graph structure is explicit             |
| Testing workflow paths  | Custom                       | Nodes/edges can be tested independently |
| Long-running workflows  | Significant custom work      | Better suited                           |
| Operational maturity    | Entirely your responsibility | Framework provides workflow primitives  |

### Why not just Python?

You **can** build CWD with Python:

```python
if intent == "customer_briefing":
    sales_result = await sales_delegator()
    it_result = await it_delegator()

    if sales_result.failed:
        await retry_sales()

    if it_result.failed:
        await retry_it()

    return aggregate(sales_result, it_result)
```

This works initially.

But as CWD grows, you may have:

```text
if/else
try/except
retry loops
asyncio
state dictionaries
checkpoint logic
resume logic
timeout handling
human approval
parallel branches
error routing
```

The orchestration logic becomes difficult to maintain.

---

### LangGraph makes the workflow explicit

Instead of hiding the workflow inside Python control flow:

```text id="t4s84h"
START
  ↓
Planner
  ↓
Route Delegators
 ┌───────────────┐
 ↓               ↓
Sales           IT
 ↓               ↓
Workers         Workers
 └───────┬───────┘
         ↓
      Validate
         ↓
      Aggregate
         ↓
        END
```

You explicitly define nodes and edges:

```python
graph.add_node("planner", planner)
graph.add_node("sales", sales_delegator)
graph.add_node("it", it_delegator)
graph.add_node("aggregate", aggregate)

graph.add_conditional_edges(
    "planner",
    route_delegators
)

graph.add_edge("sales", "aggregate")
graph.add_edge("it", "aggregate")
```

The **Python code still exists**. LangGraph is not replacing Python; it provides a framework for structuring the orchestration.

---

### CWD example: Worker failure

Suppose:

```text
Customer Worker     ✓
Incident Worker     ✓
Document Worker     ✗
```

With custom Python, you'd need to design and maintain your own:

```text
state store
retry mechanism
checkpoint format
resume logic
failure routing
```

With LangGraph, you model the workflow and persistence/checkpoint behavior explicitly, allowing the workflow to resume from a known state.

---

### When would I choose custom Python?

For a **simple workflow**:

```text
API
 ↓
LLM
 ↓
One tool
 ↓
Response
```

Custom Python may be completely reasonable.

For CWD, the workflow has:

* Coordinator
* Multiple Delegators
* Multiple Workers
* Conditional routing
* Parallel execution
* A2A
* MCP
* Retries
* Checkpoints
* Long-running tasks
* Failure recovery
* Human-in-the-loop

So a graph-based orchestration model provides more structure.

### Interview-ready answer

> **“I could implement CWD using custom Python orchestration with asyncio, queues, state dictionaries, retries, and exception handling, but I would have to build and maintain many workflow capabilities myself. I chose LangGraph because CWD is a complex, stateful multi-agent workflow. LangGraph lets me explicitly model nodes, conditional edges, parallel branches, state, checkpointing, interrupt/resume, and recovery. Python is still used for the actual business logic; LangGraph provides the orchestration framework around it.”**

### Strong one-line answer

> **“Custom Python gives me control; LangGraph gives me structured workflow orchestration, state management, checkpointing, and recovery without building a workflow engine from scratch.”**
