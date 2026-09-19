# LangGraph Nodes and Edges

## Overview
Nodes and edges are the fundamental building blocks of a LangGraph graph: nodes perform work and update state, while edges define the control flow connecting them. Designing clean, well-scoped nodes and clear edge logic is central to building maintainable LangGraph applications.

## Nodes
A node is simply a function that takes the current state as input and returns a state update:
```python
def research_node(state: AgentState) -> dict:
    findings = perform_research(state["messages"][-1])
    return {"research_findings": findings}
```

### Good Node Design Principles
- **Single responsibility**: each node should do one clear thing (call one agent, invoke one tool, perform one transformation) — mirroring the single-purpose tool design principle in function-calling-tool-use.md
- **Pure with respect to state**: a node should only read the state fields it needs and only return updates to the fields it's responsible for, avoiding unexpected side effects on unrelated state
- **Explicit error handling**: nodes should catch and represent failures in the state (e.g., an `error` field) rather than raising uncaught exceptions that crash the entire graph execution, unless a hard failure is genuinely the intended behavior

## Edges
Edges define what node executes next after a given node completes.

### Fixed Edges
A simple, unconditional connection: node A always leads to node B.
```python
graph.add_edge("research", "write")
```

### Conditional Edges
The next node is determined dynamically by a routing function that inspects the current state:
```python
def route_after_critique(state: AgentState) -> str:
    if state["needs_revision"]:
        return "write"
    return "finalize"

graph.add_conditional_edges("critique", route_after_critique)
```
This is how LangGraph implements the conditional routing patterns described in conditional-agent-routing.md and enables cycles (e.g., looping back from "critique" to "write").

### Entry and Terminal Points
Every graph needs a defined starting node (or entry point) and at least one path to a terminal state (`END`) — graphs without a reachable terminal state risk infinite execution, reinforcing the importance of the loop-prevention safeguards discussed in preventing-agent-loops.md even within a well-structured graph framework.

## Composing Nodes from Sub-Graphs
For complex workflows, individual nodes can themselves wrap entire compiled sub-graphs — enabling hierarchical composition where a complex multi-step process is encapsulated as a single reusable node within a larger graph, improving modularity and reuse across different top-level graph definitions.

## Parallel Node Execution
LangGraph supports fanning out to multiple nodes that execute concurrently from a single preceding node, with their results merged back into shared state before the graph proceeds — the graph-based implementation of the parallel-agent-execution.md pattern.

## Testing Nodes and Edges Independently
Because nodes are just functions taking and returning explicit state, they can be unit-tested in isolation (given a specific input state, does the node produce the expected state update?) without needing to run the entire graph — a significant testability advantage over monolithic agent implementations.

## Summary
Nodes should be small, single-purpose, and explicit about their state reads/writes; edges — especially conditional edges — implement the graph's control flow and routing logic. Together they let complex, cyclic agentic workflows be expressed as a composable, independently testable set of building blocks.
