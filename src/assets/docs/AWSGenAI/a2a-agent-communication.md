# A2A Agent Communication

## Overview
This document details the communication mechanics of the Agent-to-Agent (A2A) protocol — how task requests, responses, and status updates flow between independent agents in a standardized, interoperable way.

## Message Flow Pattern
A typical A2A interaction follows a request-response (or request-stream) pattern:
1. A client agent discovers a remote agent's capabilities via its published agent card (see what-is-a2a.md)
2. The client agent sends a task request, including the task description and any necessary input artifacts (documents, structured data, prior context)
3. The remote agent processes the task — potentially over an extended duration for complex tasks — and returns a response, or streams incremental status updates for long-running tasks
4. The client agent incorporates the remote agent's response into its own ongoing reasoning or workflow

## Task Artifacts
A2A defines a structured way to pass "artifacts" — files, structured data, or other content — as part of a task request or response, rather than requiring everything to be encoded as plain text within a message. This mirrors the structured message-passing principles in agent-communication.md, adapted for cross-organizational, cross-framework interoperability.

## Synchronous vs. Streaming Interaction
For short tasks, a simple synchronous request-response pattern is sufficient. For longer-running tasks, A2A supports streaming intermediate status updates back to the requesting agent, so the delegating agent (and potentially a human observing its progress) has visibility into the remote task's progress rather than a long, opaque wait for a final result — an important usability and observability consideration for delegated long-running work, echoing the general async communication considerations in agent-communication.md.

## Multi-Turn Task Refinement
A2A supports follow-up interactions within the context of an already-delegated task — the client agent can send additional clarifying information or refine the original request based on the remote agent's initial response, without needing to start an entirely new, context-free task request.

## Error and Failure Reporting
Standardized error/status reporting lets a client agent understand *why* a remote agent's task failed (e.g., a permissions issue, an ambiguous request, a genuine inability to complete the task) — enabling the client agent to apply appropriate failure-recovery logic (see agent-failure-recovery.md), such as retrying with a corrected request, delegating to a different agent, or escalating to a human, rather than treating every failure identically.

## Context and Data Scoping
As with any inter-agent communication (see agent-communication.md), A2A task requests should be scoped to exactly the information the remote agent needs — especially important in cross-organizational contexts where sharing more information than necessary can create data governance or privacy concerns beyond what's relevant within a single organization's internal multi-agent system.

## Trust Boundaries in Communication
Because A2A explicitly spans trust boundaries (different organizations, potentially different security postures), a client agent should treat responses from a remote agent as untrusted input requiring the same scrutiny applied to any external data source — including awareness of prompt injection risk if a remote agent's response is incorporated directly into the client agent's own subsequent reasoning context (see prompt-injection.md).

## Summary
A2A communication mechanics — task requests with structured artifacts, synchronous or streaming responses, multi-turn refinement, and standardized error reporting — extend the general agent communication principles from agent-communication.md to work reliably across organizational and framework boundaries, with additional attention to trust and data-scoping given the cross-boundary nature of the interaction.
