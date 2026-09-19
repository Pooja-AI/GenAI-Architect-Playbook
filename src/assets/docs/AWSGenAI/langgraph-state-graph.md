# LangGraph State Graph

## Overview
The `StateGraph` is LangGraph's core abstraction: a graph definition built around a single, explicitly typed shared state object that flows through and is updated by every node in the graph. Understanding state graph design is foundational to building effective LangGraph applications.

## Defining State
State is typically defined as a typed schema (a Python `TypedDict` or Pydantic model), explicitly declaring every field the graph will read from or write to:
```python
class AgentState(TypedDict):
    messages: list
    research_findings: list[str]
    draft: str
    iteration_count: int
```
This explicit schema (rather than an unstructured dictionary) provides type safety, self-documentation of what data flows through the graph, and easier validation.

## State Update Semantics
Each node function receives the current state and returns a (partial) update, which LangGraph merges into the overall state — typically via either:
- **Overwrite**: the returned value for a field replaces the existing value
- **Reducer functions**: a custom merge function combines the new value with the existing one (commonly used for fields like `messages`, where new messages should be appended rather than replacing the entire history)

Explicitly defining reducers for fields that should accumulate (rather than overwrite) is a common source of bugs when first learning the framework — a message list field without an append-reducer will silently lose prior history on each update.

## Designing a Good State Schema
- **Include only what's genuinely needed across nodes** — agent-local working variables that don't need to be shared don't belong in the top-level graph state (see agent-state.md and multi-agent-state.md for the broader principle)
- **Use clear, descriptive field names** reflecting their role in the workflow, not generic names like `data` or `temp`
- **Version your state schema** as the application evolves, especially if using checkpointing — a schema change can break resumption of in-flight checkpointed executions if not handled carefully

## State Visibility Across Multi-Agent Nodes
In a multi-agent LangGraph application, each "agent" is typically implemented as one or more nodes — the shared state graph naturally implements the shared multi-agent state pattern described in multi-agent-state.md, with the explicit schema helping enforce discipline about what's genuinely shared versus scoped to a specific node's internal processing.

## Common State Design Patterns

### Accumulator Fields
Fields that grow over the graph's execution (message history, list of findings, log of actions taken) — use reducers to append rather than overwrite.

### Control Fields
Fields specifically used to drive conditional routing decisions (e.g., `needs_revision: bool`, `confidence_score: float`) — kept distinct from substantive content fields for clarity.

### Terminal/Output Fields
Fields representing the final result, typically only populated by a final node before the graph completes.

## Debugging State Graphs
Because state is explicit and (with checkpointing enabled) persisted at each step, you can inspect the exact state at any point in a graph's execution — an invaluable debugging capability compared to reconstructing an equivalent picture from scattered logs in an ad hoc orchestration implementation.

## Summary
The StateGraph's explicit, typed shared state is what enables LangGraph's clarity and debuggability advantages over less structured orchestration approaches. Careful schema design — including correct use of reducers for accumulating fields — is the foundational skill for building reliable LangGraph applications.
