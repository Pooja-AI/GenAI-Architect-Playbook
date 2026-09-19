# LangGraph vs. LangChain

## Overview
LangChain and LangGraph are related but distinct frameworks from the same ecosystem, addressing different levels of an LLM application's architecture. Understanding the distinction helps clarify when to use each.

## LangChain
LangChain is a broad framework providing:
- **Model integrations**: standardized interfaces to many LLM providers (including Bedrock)
- **Prompt templates**: reusable, parameterized prompt construction
- **Chains**: composable sequences of calls (LLM calls, tool calls, data transformations) — primarily linear or simple branching pipelines
- **Retrievers and document loaders**: abstractions supporting RAG pipeline construction
- **Memory abstractions**: simple conversation history management utilities

LangChain is well suited to straightforward, largely linear pipelines: a RAG chain (retrieve → construct prompt → generate), a simple summarization pipeline, or a basic tool-augmented single-turn agent.

## LangGraph
LangGraph is a more specialized, lower-level framework for building **stateful, cyclic, multi-step control flow** — the graph-based model described in what-is-langgraph.md. It's designed for cases where a simple linear chain isn't expressive enough:
- Agent reasoning loops with explicit, controllable iteration
- Multi-agent systems with conditional routing between agents
- Workflows requiring durable checkpointing and resumability
- Human-in-the-loop pauses mid-execution

## Key Differences

| | LangChain | LangGraph |
|---|---|---|
| Control flow model | Linear chains, simple branching | Explicit graph with cycles and conditional edges |
| State management | Lightweight memory abstractions | First-class, explicit, persisted state object |
| Cycles/loops | Not natively well-supported | Core feature |
| Checkpointing/resumability | Limited | Built-in |
| Best fit | Simple RAG, straightforward pipelines | Agentic loops, multi-agent orchestration |
| Learning curve | Lower for simple use cases | Higher, but scales better to complex control flow |

## Can They Be Used Together?
Yes — LangGraph is built on top of and interoperates with LangChain's model integrations and tool abstractions. A common pattern is using LangChain's model/tool integration layer *within* LangGraph nodes, combining LangChain's convenience for individual LLM/tool calls with LangGraph's superior control-flow model for the overall orchestration.

## When to Choose LangChain Alone
- Simple, mostly linear RAG or summarization pipelines without complex looping or branching requirements
- Rapid prototyping where the full graph-based state management isn't yet justified
- Teams already deeply familiar with LangChain's chain abstractions for their existing simpler use cases

## When to Choose LangGraph
- Any workflow requiring cycles (agent reasoning loops, critique-and-revise patterns)
- Multi-agent systems with non-trivial conditional routing
- Workflows needing durable, resumable state (long-running tasks, human-in-the-loop pauses)
- Systems where explicit, inspectable state and control flow materially aid debugging and reliability

## Migration Considerations
Teams that start with a simple LangChain pipeline often find they need LangGraph's capabilities as their use case evolves toward genuine multi-step agentic behavior — recognizing this inflection point early (rather than building increasingly convoluted workarounds within a linear chain abstraction) leads to a cleaner architecture.

## Summary
LangChain and LangGraph serve complementary purposes: LangChain for model/tool integration and simple pipeline construction, LangGraph for the more complex, cyclic, stateful control flow required by genuinely agentic and multi-agent systems — and the two are commonly combined rather than treated as mutually exclusive choices.
