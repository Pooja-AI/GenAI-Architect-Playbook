# Agent Memory

## Overview
Agent memory refers to information an agent retains and can draw on *across* sessions or tasks — distinct from the working state of a single in-progress task. Memory allows agents to personalize behavior, avoid repeating past mistakes, and accumulate useful context about users or domains over time.

## Types of Agent Memory

### Short-Term (Working) Memory
Effectively the same as agent state for the current task — the immediate conversation and reasoning context. Bounded by the context window.

### Long-Term Episodic Memory
Records of specific past interactions or events (e.g., "this user previously asked about refund policy on March 3rd and was told X") that can be retrieved when relevant to a new interaction.

### Long-Term Semantic Memory
Generalized facts or preferences distilled from past interactions (e.g., "this user prefers concise answers," "this customer's account is on the enterprise tier") rather than raw interaction logs — often derived by periodically summarizing episodic memory.

### Procedural Memory
Learned strategies or successful approaches to recurring task types (e.g., "for this class of support ticket, checking the billing system first resolves most cases") — can be captured as few-shot examples or heuristics injected into future prompts for similar tasks.

## Implementation Approaches

### Vector-Store-Backed Memory
Store memory entries as embedded text in a vector database, retrieved via similarity search against the current context — essentially RAG applied to an agent's own history rather than external documents. This scales well and naturally surfaces the most relevant past memories.

### Structured Key-Value Memory
Store specific, well-defined facts (user preferences, account attributes) in a structured store (DynamoDB, a profile table) for exact, reliable retrieval rather than similarity search — appropriate when the facts have clear schema and don't benefit from fuzzy matching.

### Summarization-Based Memory Consolidation
Periodically summarize and compress raw episodic history into more compact semantic memory, preventing unbounded growth of retrievable memory while retaining the most generalizable and useful information.

## Memory Retrieval Strategy
Similar to RAG retrieval, memory retrieval should be relevance-filtered and precision-focused — dumping a user's entire interaction history into every new task's context wastes tokens and can confuse reasoning with irrelevant past details. Retrieve only memory items relevant to the current task's context.

## Privacy and Data Governance
Long-term memory raises distinct privacy considerations: retained information about users must comply with data retention policies, be deletable on request (e.g., for GDPR "right to be forgotten" compliance), and be properly access-controlled so one user's memory can never leak into another user's context (a specific instance of the multi-tenant isolation concerns in rag-security-trimming.md).

## When Memory Helps Most
- Personal assistants or customer support agents interacting with the same user repeatedly over time
- Systems that benefit from accumulating domain-specific successful strategies across many similar tasks
- Long-running collaborative agents (e.g., a coding agent working across many sessions on the same codebase)

## When to Avoid Persistent Memory
- Stateless, single-interaction use cases where memory adds complexity without benefit
- High-privacy-sensitivity contexts where retaining any cross-session information carries unacceptable risk
- Situations where "fresh start" behavior is actually desirable (e.g., avoiding bias from a prior, possibly outdated interaction)

## Summary
Agent memory extends an agent's usefulness beyond a single task by retaining episodic, semantic, or procedural information across sessions, typically implemented via vector-store retrieval, structured storage, or periodic summarization — always designed with explicit privacy and access-control safeguards.
