# What Is LangGraph?

## Overview
LangGraph is an open-source framework (built by the LangChain team) for building stateful, multi-step, and multi-agent applications as explicit graphs of nodes and edges, with built-in support for cycles, persistent state, and checkpointing. It's designed specifically to address the limitations of simpler linear "chain" abstractions when building genuinely agentic or multi-agent systems.

## Core Concepts
- **State**: a shared, typed object (commonly a Python TypedDict or Pydantic model) that flows through the graph and is updated by each node — see langgraph-state-graph.md
- **Nodes**: functions (often wrapping an LLM call, a tool invocation, or custom logic) that receive the current state and return updates to it — see langgraph-nodes-edges.md
- **Edges**: define control flow between nodes, including conditional edges that route dynamically based on state — see langgraph-conditional-routing.md
- **Checkpointing**: built-in persistence of graph state at each step, enabling resumability, time-travel debugging, and durable long-running executions — see langgraph-checkpointing.md

## Why LangGraph Exists
Earlier LLM orchestration abstractions (like simple linear "chains") work well for straightforward sequential pipelines but struggle to naturally express:
- **Cycles**: an agent reasoning loop (see ai-reasoning-loop.md) or a "critique and revise" pattern requires the ability to loop back to an earlier step, which a purely linear chain abstraction doesn't support cleanly
- **Complex conditional branching**: routing to different paths based on intermediate results
- **Durable, resumable execution**: long-running or human-in-the-loop workflows that need to pause and resume, potentially much later, without losing state

LangGraph's graph-based model directly addresses these needs with first-class support for cycles, explicit state, and persistence.

## Basic Example Structure (Conceptual)
```python
from langgraph.graph import StateGraph

class State(TypedDict):
    messages: list
    next_step: str

graph = StateGraph(State)
graph.add_node("research", research_node)
graph.add_node("write", write_node)
graph.add_node("critique", critique_node)

graph.add_edge("research", "write")
graph.add_conditional_edge("critique", route_based_on_critique)

app = graph.compile()
result = app.invoke({"messages": [...]})
```

## Relationship to LangChain
LangGraph builds on LangChain's ecosystem (model integrations, tool abstractions) but provides a distinct, lower-level orchestration model focused specifically on stateful, cyclic, multi-step control flow — see langgraph-vs-langchain.md for a detailed comparison of when to use each.

## Common Use Cases
- Multi-agent systems using the supervisor-worker or graph-based patterns described in the Multi-Agent Systems section of this knowledge base
- Agents requiring reasoning loops with explicit iteration control (see preventing-agent-loops.md for why this matters)
- Workflows needing human-in-the-loop pauses (see langgraph-human-in-loop.md)
- Long-running, resumable processes that must survive interruptions

## Deployment on AWS
LangGraph applications can be deployed on Lambda (for shorter-running graphs), ECS/EKS (for longer-running or more resource-intensive graphs), or via LangGraph's own deployment tooling, integrating with Bedrock for model invocation and standard AWS services for checkpointing state persistence (see langgraph-production-deployment.md).

## Summary
LangGraph provides a graph-based orchestration model with explicit state, cycles, and checkpointing, purpose-built for the agentic and multi-agent patterns that simpler linear orchestration abstractions handle poorly — making it a common foundation for production agentic systems on AWS built with Bedrock-hosted models.
