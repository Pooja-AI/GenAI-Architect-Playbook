# LangGraph Conditional Routing

## Overview
Conditional routing in LangGraph is implemented via conditional edges — functions that inspect the current graph state and determine which node should execute next. This is the mechanism through which LangGraph implements dynamic control flow, including the branching and looping patterns essential to agentic systems.

## Basic Conditional Edge Pattern
```python
def route_decision(state: AgentState) -> str:
    if state["confidence"] < 0.7:
        return "human_review"
    elif state["needs_more_research"]:
        return "research"
    else:
        return "finalize"

graph.add_conditional_edges(
    "assess",
    route_decision,
    {
        "human_review": "human_review_node",
        "research": "research_node",
        "finalize": "finalize_node"
    }
)
```
The routing function returns a key, which is mapped to the actual next node via the provided dictionary — this indirection keeps routing logic and node naming decoupled and explicit.

## Common Routing Patterns

### Confidence-Based Routing
Route to a more thorough or human-reviewed path when a confidence signal is low, and to a fast-path finalization when confidence is high — implementing confidence-based routing (see conditional-agent-routing.md) directly within the graph structure.

### Retry Loops
Route back to a prior node (e.g., re-attempt a failed tool call, or send a draft back for revision) when a condition indicates the current attempt was unsuccessful — combined with an iteration counter in state to enforce a hard cap and avoid infinite loops (see preventing-agent-loops.md).

### Multi-Way Branching
Route to entirely different sub-graphs or processing paths based on a classification of the input (e.g., different handling for different request categories) — the graph-native implementation of intent-based conditional routing.

### Error-Path Routing
Route to a dedicated error-handling or escalation node when a state field indicates a prior node encountered a failure, rather than letting the graph continue down the "happy path" with invalid or incomplete state.

## Designing Robust Routing Logic
- Keep routing functions simple and deterministic given the state — complex conditional logic buried in a routing function is harder to test and reason about than simple, clearly named boolean/categorical state fields that the routing function checks
- Ensure every possible return value from a routing function has a corresponding mapped node — an unhandled routing key will cause a runtime error
- Always include a path to a terminal state from every routing decision, directly or indirectly, to avoid graphs that can get stuck without a way to reach `END`

## Testing Conditional Routing
Because routing functions are plain functions of the state, they can be unit tested directly: construct various state scenarios (low confidence, high confidence, error present, iteration limit reached) and assert the routing function returns the expected next-node key for each — critical for validating routing correctness without needing to run the full graph end-to-end for every scenario.

## Visualizing Routing Logic
LangGraph supports generating a visual diagram of the compiled graph's structure, including conditional edges — reviewing this visualization is a valuable sanity check to confirm the intended control flow (including all loop-back and terminal paths) matches what was actually implemented.

## Summary
LangGraph's conditional edges provide an explicit, testable mechanism for dynamic control flow — implementing confidence-based routing, retry loops, multi-way branching, and error handling directly within the graph's structure rather than as implicit logic buried inside monolithic node functions.
