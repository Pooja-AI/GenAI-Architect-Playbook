# LangGraph Loops

## Overview
Support for cycles — the ability for graph execution to return to a previously visited node — is one of LangGraph's defining capabilities, distinguishing it from purely linear orchestration frameworks. Loops are essential for implementing agent reasoning loops, iterative refinement, and retry patterns, but require careful design to avoid the runaway execution risks discussed in preventing-agent-loops.md.

## How Loops Are Expressed
A loop is simply a conditional edge whose routing function can return to an earlier node in the graph:
```python
graph.add_conditional_edges(
    "critique",
    lambda state: "write" if state["needs_revision"] else "finalize",
    {"write": "write_node", "finalize": "finalize_node"}
)
```
Here, if `needs_revision` is true, execution routes back to the `write_node`, which was already visited earlier — forming a cycle between "write" and "critique" that continues until the routing condition changes.

## Essential Loop Safety Mechanisms

### Iteration Counters
Include an explicit counter field in the graph state, incremented each time through the loop, and check it in the routing function to force termination after a maximum number of iterations regardless of whether the "ideal" exit condition has been met:
```python
def route_after_critique(state: AgentState) -> str:
    if state["iteration_count"] >= MAX_ITERATIONS:
        return "finalize"  # force exit even if not fully satisfied
    if state["needs_revision"]:
        return "write"
    return "finalize"
```

### Recursion Limits
LangGraph itself provides a configurable recursion/step limit as a global safety net at the framework level, raising an error if a graph execution exceeds it — a backstop in addition to (not a replacement for) explicit application-level iteration counters, since a framework-level hard error is a less graceful failure mode than an intentional, application-defined exit path.

### Progress Tracking
For loops meant to converge toward improvement (e.g., iterative document refinement), track whether each iteration is genuinely making progress (e.g., a quality score improving) — and add logic to exit early if progress stalls or reverses, rather than only relying on a fixed maximum iteration count.

## Common Loop Use Cases in LangGraph
- **Reasoning loops**: the ReAct-style thought-action-observation cycle (see ai-reasoning-loop.md) implemented as a loop between a "reason" node and a "tool execution" node
- **Critique-and-revise**: alternating between a "generate" node and a "critique" node until the critique passes or a maximum iteration count is reached
- **Retry-on-failure**: looping back to retry a failed tool call or sub-task with adjusted parameters, up to a maximum retry count

## Debugging Loops
With checkpointing enabled (see langgraph-checkpointing.md), you can inspect the state at every iteration of a loop, making it possible to trace exactly how the state evolved across iterations and diagnose why a loop failed to converge, looped more than expected, or exited prematurely.

## Cost and Latency Implications
Every loop iteration typically involves at least one additional LLM call — loops that run to their maximum iteration count on a regular basis can significantly increase cost and latency compared to the "ideal" single-pass case, making it important to monitor actual iteration count distributions in production and investigate if loops are routinely running longer than expected.

## Summary
LangGraph's native support for cycles enables essential agentic patterns like reasoning loops and iterative refinement, but every loop must be paired with explicit iteration limits, progress tracking, and monitoring to prevent the runaway execution risks inherent to any cyclic agentic control flow.
