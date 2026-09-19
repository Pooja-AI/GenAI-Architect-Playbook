# Why Multi-Agent Systems?

## Overview
A multi-agent system uses several specialized AI agents that collaborate — each with a narrower scope, distinct capabilities, or a different role — to accomplish a task that would be harder to solve with a single, monolithic agent. This document explains the motivations and trade-offs behind moving from a single-agent to a multi-agent architecture.

## Motivations for Multi-Agent Design

### Specialization
A single agent asked to be simultaneously an expert researcher, a careful writer, a rigorous fact-checker, and a code reviewer tends to perform each role less well than dedicated agents optimized (via focused prompts, tools, and even different underlying models) for each specific role.

### Separation of Concerns
Breaking a complex workflow into distinct agent responsibilities makes the system easier to reason about, test, and improve incrementally — you can iterate on the "research agent" without risking regressions in the "writing agent."

### Parallelism
Independent sub-tasks can be handled by separate agents running concurrently, reducing overall task latency compared to a single agent working through every step sequentially (see parallel-agent-execution.md).

### Context Window Management
Splitting a large task across agents, each with its own focused context, avoids overloading a single context window with the accumulated history of an entire complex, multi-domain task.

### Different Model/Capability Requirements Per Role
Some sub-tasks benefit from a large, expensive reasoning model (planning, complex synthesis) while others are well-served by smaller, faster models (simple extraction, formatting) — a multi-agent architecture allows different models per role, optimizing cost and latency holistically.

## When Multi-Agent Adds Real Value
- Genuinely distinct, well-defined sub-tasks with different skill/tool requirements
- Tasks benefiting from independent verification (a "writer" and a separate "critic" agent catch more errors than a single agent self-reviewing)
- Workflows with natural parallelism (independent research streams that later get synthesized)
- Systems requiring clear audit boundaries between roles (e.g., a "proposer" agent and an independent "approver" agent, for governance reasons)

## When Multi-Agent Is Unnecessary Overhead
- Simple, single-domain tasks that a well-prompted single agent handles reliably
- Tasks where the coordination/communication overhead between agents exceeds the benefit of specialization
- Early-stage prototypes where the added architectural complexity slows iteration without a corresponding quality or capability gain

Multi-agent systems introduce real costs: more LLM calls (higher latency and expense), coordination complexity, and more surface area for failure (see multi-agent-failure-handling.md). The decision to go multi-agent should be justified by a clear capability or quality gain, not adopted by default because it's architecturally fashionable.

## Core Architectural Patterns
This knowledge base covers the primary multi-agent patterns in dedicated documents:
- **Supervisor-worker** (centralized coordination) — see supervisor-worker.md
- **Decentralized/peer-to-peer** agent collaboration — see decentralized-agents.md
- Execution patterns: sequential, parallel, and conditional routing between agents
- State and memory sharing across agents
- Failure handling and result aggregation across multiple agents
- Observability for multi-agent systems, which is substantially harder than single-agent tracing

## A Simple Decision Heuristic
Start with a single, well-designed agent. Move to multi-agent only when you can articulate a specific, concrete reason a single agent is insufficient — a clearly separable sub-task requiring a different skill set, tool access, or model, or a genuine need for independent verification or parallelism.

## Summary
Multi-agent systems offer real benefits in specialization, parallelism, and separation of concerns, but at the cost of added latency, expense, and coordination complexity. The decision to adopt a multi-agent architecture should be driven by concrete task requirements, not defaulted to as inherently more sophisticated or capable.
