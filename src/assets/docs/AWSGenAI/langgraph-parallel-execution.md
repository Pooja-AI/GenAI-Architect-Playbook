# LangGraph Parallel Execution

## Overview
LangGraph supports fanning out execution to multiple nodes concurrently and merging their results back into shared state, implementing the parallel-agent-execution.md pattern natively within the graph framework — rather than requiring custom async orchestration code outside the graph abstraction.

## Basic Fan-Out Pattern
A single node can have multiple outgoing edges to independent nodes that all execute concurrently:
```python
graph.add_edge("start", "research_topic_a")
graph.add_edge("start", "research_topic_b")
graph.add_edge("start", "research_topic_c")

graph.add_edge("research_topic_a", "aggregate")
graph.add_edge("research_topic_b", "aggregate")
graph.add_edge("research_topic_c", "aggregate")
```
LangGraph runs the three research nodes concurrently and waits for all of them to complete before proceeding to the `aggregate` node — implementing the fan-out/fan-in pattern described in parallel-agent-execution.md.

## State Merging for Parallel Branches
Because multiple nodes execute concurrently and each may return a state update, the state schema's reducer functions (see langgraph-state-graph.md) become especially important — an accumulator-style reducer (e.g., appending to a list) correctly merges updates from parallel branches, while a naive overwrite-based field would non-deterministically retain only one branch's result depending on execution timing.

## Handling Partial Failures in Parallel Nodes
If one parallel branch node raises an error or produces a failure state, decide explicitly (as discussed in multi-agent-failure-handling.md) whether the aggregate node should:
- Wait for and require all branches to succeed before proceeding
- Proceed with whatever branches succeeded, explicitly noting the gap
- Trigger a retry of only the failed branch

This logic typically lives in the aggregation node itself, which should check each branch's contribution to state for error markers before treating them as valid inputs to synthesis.

## Dynamic Fan-Out (Map-Style Parallelism)
For cases where the number of parallel branches isn't known upfront (e.g., processing an arbitrary-length list of items), LangGraph supports dynamically generating parallel branches at runtime based on the current state (sometimes referred to as a "map" or "Send" pattern) — each item in a list spawns its own parallel node execution, all converging at a subsequent aggregation node.

## Performance Considerations
- Parallel node execution multiplies concurrent LLM/tool calls, which can hit provider rate limits faster than sequential execution (see bedrock-retries-throttling.md) — ensure adequate quota or apply an explicit concurrency cap when fanning out to a large number of branches
- The overall latency benefit is bounded by the slowest individual branch, so consider per-branch timeouts to prevent one slow branch from stalling the entire parallel group indefinitely

## When to Use Parallel Nodes in LangGraph
- Independent research or analysis sub-tasks that don't depend on each other's results
- Batch processing of multiple independent items within a single graph execution
- Redundant verification patterns, running the same sub-task through multiple independent paths for comparison

## Summary
LangGraph's native parallel execution support lets fan-out/fan-in patterns be expressed directly in the graph structure, with the state schema's reducer functions handling correct merging of concurrent updates — reducing the need for custom async orchestration code while still requiring explicit attention to partial-failure handling and concurrency limits.
