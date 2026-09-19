# Multi-Agent State

## Overview
Multi-agent state management extends single-agent state concepts (see agent-state.md) to the challenge of tracking and synchronizing state across multiple cooperating agents — each of which may have its own local working context alongside data that must be shared or synchronized across the group.

## State Scoping Levels

### Global/Shared State
Information relevant to the overall task that all or most agents need visibility into — the original goal, overall progress, key decisions made so far. In graph-based architectures (see stateful-multi-agent-graphs.md), this is typically the single shared state object flowing through the graph.

### Agent-Local State
Information specific to a single agent's internal reasoning or sub-task progress that doesn't need to be visible to other agents — keeping this local (rather than polluting shared state) reduces context bloat and avoids one agent's internal reasoning artifacts confusing another agent's context.

### Task-Scoped State
Information relevant only to a specific delegated sub-task, passed to the worker handling it and potentially discarded (or summarized into shared state) once that sub-task completes.

## Synchronization Challenges
- **Consistency**: ensuring all agents that need a piece of information have an up-to-date view of it, especially in parallel or asynchronous execution where updates can arrive out of order
- **Conflicting updates**: when multiple agents might update overlapping parts of shared state concurrently (e.g., two workers both proposing edits to the same document section), define clear conflict resolution rules (last-write-wins, explicit merge logic, or routing conflicts to a supervisor/human)
- **Partial visibility by design**: not every agent should see every piece of state — apply the same least-necessary-context principle used in agent-communication.md to state visibility, not just message passing

## Implementation Patterns

### Centralized State Store
A single persistent store (e.g., DynamoDB, a graph framework's built-in state) that all agents read from and write to, with the orchestrator (supervisor or graph engine) managing consistency and update ordering.

### Message-Passed State Deltas
Rather than agents directly reading/writing a shared store, state updates are communicated as messages (see agent-communication.md), and each agent maintains its own locally relevant projection of the state derived from received messages — more naturally fits decentralized architectures but requires careful design to avoid state divergence between agents.

## Checkpointing in Multi-Agent Systems
Persisting the full multi-agent state at defined points allows the entire system to be paused, inspected, resumed, or rolled back — particularly valuable for long-running, expensive multi-agent workflows where a mid-execution failure shouldn't require restarting the entire task from scratch.

## Debugging Multi-Agent State
Because failures often stem from one agent acting on stale, incomplete, or incorrectly scoped state, debugging requires the ability to reconstruct the exact state each agent saw at each point in the workflow — reinforcing the importance of comprehensive state logging and checkpointing discussed in agent-state.md and multi-agent-observability.md.

## Summary
Multi-agent state management requires deliberately scoping what's global/shared versus agent-local, defining clear rules for handling concurrent updates and conflicts, and maintaining robust checkpointing — all essential for building multi-agent systems that behave predictably and can be debugged when they don't.
