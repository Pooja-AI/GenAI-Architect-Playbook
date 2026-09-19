# Agent State

## Overview
Agent state is the information an agent maintains and updates across the steps of a task — its current progress, intermediate results, working variables, and context. Properly designed state management is what allows an agent to execute genuinely multi-step tasks reliably, resume after interruption, and be debugged effectively.

## What Belongs in Agent State
- **Task goal and constraints**: the original objective and any explicit boundaries
- **Plan (if using planning)**: the current sequence of steps, including which are complete, in-progress, or pending
- **Conversation/reasoning history**: the accumulated thought-action-observation trace
- **Intermediate results**: data retrieved or computed in earlier steps that later steps depend on
- **Iteration/cost counters**: for loop-prevention and budget enforcement
- **Error/retry history**: what has failed so far and why, to avoid blind repetition

## State Storage Patterns

### In-Memory (Ephemeral)
State lives only in the running process's memory for the duration of a single request — simplest, but state is lost on failure or if the task spans multiple separate invocations (e.g., a Lambda timing out).

### Externalized State (Durable)
State is persisted to an external store (DynamoDB, Redis, a database) after each step, keyed by a task/session ID — enables resuming after failure, supports long-running tasks that exceed a single compute invocation's lifetime, and makes state inspectable for debugging without needing to reproduce the exact failure.

### Checkpointing
Periodically save a full snapshot of state at defined points (not necessarily every single step) — balances durability against the overhead of persisting state on every micro-step. This is the pattern LangGraph's checkpointing feature implements (see langgraph-checkpointing.md).

## State Schema Design
Define an explicit, versioned schema for agent state rather than an unstructured blob — this makes state easier to validate, migrate as the agent's logic evolves, and inspect during debugging. Include metadata (task ID, timestamps, agent version) alongside the task-specific fields.

## Managing State Growth
Long-running or highly iterative agents can accumulate large state (extensive reasoning history, many intermediate results) that eventually strains context windows or storage. Apply the same techniques used for context window optimization — summarize or prune older history, retain only the intermediate results still relevant to remaining steps — while preserving enough detail for the agent to reason correctly and for auditors to reconstruct what happened.

## Concurrency Considerations
For multi-agent systems or systems handling many simultaneous tasks, ensure state updates are properly isolated per task/session (no cross-task state leakage) and consider optimistic concurrency control or locking if multiple processes might update the same task's state concurrently.

## State vs. Memory
Agent *state* typically refers to the working context for a single task/session; agent *memory* (see agent-memory.md) refers to information retained *across* sessions or tasks — e.g., learned user preferences or long-term facts. The two are related but serve different purposes and often use different storage and retrieval mechanisms.

## Debugging with State
Persisted, well-structured state is one of the most valuable debugging assets for agentic systems — being able to inspect the exact state at the point of failure (rather than only the final error) dramatically speeds up root-causing production issues.

## Summary
Agent state management — what to track, how to persist it, and how to keep it from growing unbounded — is foundational infrastructure for reliable multi-step agents. Externalized, checkpointed, schema-defined state is the production-grade approach, especially for long-running or resumable tasks.
