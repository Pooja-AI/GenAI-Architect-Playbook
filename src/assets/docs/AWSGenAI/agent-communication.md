# Agent Communication

## Overview
Agent communication defines how information — requests, results, status updates, questions — is exchanged between agents in a multi-agent system. The design of this communication layer significantly affects reliability, debuggability, and how well agents can genuinely collaborate rather than talk past each other.

## Communication Structures

### Structured Message Passing
Agents exchange well-defined, schema-based messages (task requests, structured results, status codes) rather than free-form natural language — improves reliability of parsing and reduces ambiguity, similar to structured tool inputs (see structured-tool-inputs.md).

### Natural Language Communication
Agents exchange plain text messages, which is more flexible and easier for an LLM to both produce and interpret, but harder to validate programmatically and more prone to ambiguity or misinterpretation between agents.

### Hybrid Approach
Use structured envelopes (sender, recipient, message type, task ID) wrapping a natural-language payload — combines the reliability of structured routing/tracking with the flexibility of natural language content.

## Common Message Types
- **Task delegation**: a supervisor assigning a sub-task to a worker, including necessary context and constraints
- **Result reporting**: a worker returning its output, ideally in a structured format the receiving agent can reliably parse
- **Status/progress updates**: for long-running tasks, periodic updates on progress before final completion
- **Clarification requests**: an agent asking another agent (or the human orchestrator) for missing information needed to proceed
- **Error/failure reports**: structured information about what went wrong, to support failure recovery (see agent-failure-recovery.md and multi-agent-failure-handling.md)

## Context Scoping
A critical communication design decision is *how much context* to pass between agents. Passing an agent's entire conversation history to every other agent it communicates with bloats context windows unnecessarily and can leak information a receiving agent doesn't need or shouldn't have. Best practice is to scope each message to exactly the information the receiving agent needs for its specific sub-task.

## Standardized Protocols
For interoperability — especially across agents built by different teams or vendors — standardized communication protocols like Agent-to-Agent (A2A, see what-is-a2a.md) define common message formats, capability discovery, and negotiation patterns, reducing the need for custom point-to-point integration between every pair of agents.

## Synchronous vs. Asynchronous Communication
- **Synchronous**: an agent blocks and waits for a response before proceeding — simpler to reason about, but can create latency bottlenecks in complex workflows
- **Asynchronous**: an agent dispatches a request and continues other work (or another agent proceeds independently), reconciling results later — better for parallelism (see parallel-agent-execution.md) but requires more sophisticated coordination logic

## Reliability Considerations
- Handle message delivery failures (timeouts, dropped messages) explicitly, similar to tool-call error handling
- Consider idempotency for message processing, in case of retries or duplicate delivery
- Log every inter-agent message for debugging and audit purposes — this is often the single most useful data source when diagnosing multi-agent system failures

## Summary
Effective agent communication balances structure (for reliability and parseability) with flexibility (for genuine collaborative reasoning), carefully scopes context to what's actually needed by the recipient, and is logged comprehensively — this communication layer is frequently the most overlooked yet highest-impact design decision in multi-agent system reliability.
