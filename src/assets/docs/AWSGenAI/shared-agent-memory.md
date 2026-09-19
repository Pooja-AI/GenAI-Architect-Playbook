# Shared Agent Memory

## Overview
Shared agent memory extends the single-agent memory concept (see agent-memory.md) to a store that multiple agents in a multi-agent system can read from and contribute to — enabling agents to build on each other's learned knowledge, past decisions, and accumulated context rather than each agent starting from a blank slate.

## Why Shared Memory Matters in Multi-Agent Systems
Without shared memory, valuable information one agent discovers (a useful fact, a successful strategy, a user preference) is siloed within that agent's own context and lost once its task completes — other agents, or future invocations of the same task, must rediscover it from scratch, wasting effort and potentially producing inconsistent results across agents.

## Types of Shared Memory Content
- **Facts discovered during task execution**: e.g., a research agent's findings that a later writing agent should draw on directly rather than re-deriving
- **Decisions and their rationale**: recording *why* a particular approach was chosen, useful for consistency if related sub-tasks are handled by different agents
- **Learned strategies**: successful patterns for handling particular task types, usable across agents that encounter similar sub-problems
- **User/domain context**: persistent information about the user or domain relevant across the whole multi-agent workflow, not just one agent's slice of it

## Implementation Patterns

### Shared Vector Store
All agents write relevant findings/decisions as embedded entries into a common vector store, and any agent can retrieve relevant prior entries via similarity search when starting a new sub-task — this mirrors RAG retrieval but over the system's own accumulated working memory rather than external documents.

### Shared Structured Blackboard
A structured, schema-defined shared store (sometimes called a "blackboard" in classic multi-agent AI literature) where agents post and read well-defined facts/results, avoiding the fuzziness of similarity-based retrieval when the information has clear structure.

### Hybrid
Structured storage for well-defined facts (e.g., "customer tier: enterprise") combined with a vector store for less structured findings (research summaries, reasoning notes) that benefit from semantic retrieval.

## Access Control Within Shared Memory
Not all shared memory should be visible to every agent — apply role-based access so, for example, a customer-facing agent doesn't see internal strategic notes intended only for supervisor-level agents, following the same least-necessary-visibility principle discussed in multi-agent-state.md.

## Avoiding Shared Memory Pitfalls
- **Staleness**: shared memory entries can become outdated as a task progresses; timestamp entries and have agents treat older entries with appropriate skepticism, especially for information likely to change during the task
- **Noise accumulation**: without periodic pruning or consolidation, shared memory can accumulate low-value entries that dilute retrieval relevance — apply the same precision-focused retrieval discipline used in RAG (see rag-retrieval-optimization.md)
- **Consistency conflicts**: two agents may write contradictory information to shared memory; define a resolution strategy (timestamp priority, explicit supervisor arbitration) rather than leaving contradictions unresolved

## Relationship to Long-Term Memory
Shared agent memory during a single multi-agent task execution is often ephemeral (scoped to that task), while long-term memory (see agent-memory.md) persists across separate task executions — a well-designed system may consolidate valuable findings from task-scoped shared memory into longer-term memory after task completion, if that information is likely to be useful for future tasks.

## Summary
Shared agent memory lets a multi-agent system accumulate and reuse knowledge across its constituent agents within a task, reducing redundant work and improving consistency — but requires careful access control, staleness management, and conflict resolution to avoid becoming a source of confusion rather than coordination.
