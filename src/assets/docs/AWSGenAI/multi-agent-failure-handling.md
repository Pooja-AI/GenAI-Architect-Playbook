# Multi-Agent Failure Handling

## Overview
Multi-agent systems have more components that can fail than a single-agent system — any individual agent, the communication layer between agents, or the orchestration logic itself can break down. Robust failure handling requires anticipating failures at each of these levels, not just within individual agents.

## Failure Categories Specific to Multi-Agent Systems

### Individual Agent Failure
A single worker agent fails to complete its sub-task (see agent-failure-recovery.md for single-agent recovery strategies, which still apply at the individual-agent level within a multi-agent system).

### Communication Failure
A message between agents is lost, malformed, or misinterpreted — the receiving agent may act on incomplete or incorrect information without any explicit "failure" being raised at all, which is a particularly dangerous, silent failure mode.

### Coordination Failure
The orchestration logic (supervisor or graph engine) makes an incorrect delegation decision, routes to the wrong agent, or fails to properly aggregate results — a failure of the "glue" rather than any individual agent.

### Cascading Failure
An error in one agent's output propagates through subsequent agents that build on it (especially severe in sequential pipelines, see sequential-agent-execution.md), compounding into a significantly wrong final result that's hard to trace back to its origin.

### Partial Completion
In parallel execution, some branches succeed while others fail or time out — the system must have an explicit policy for whether to proceed with partial results, retry only the failed branches, or fail the entire task.

## Failure Handling Strategies

### Per-Agent Timeouts and Retries
Apply timeout and retry logic (see bedrock-retries-throttling.md) at the level of each individual agent invocation, not just at the overall task level, so a single slow or failing agent doesn't silently stall or corrupt the entire multi-agent workflow.

### Circuit Breakers Between Agents
If a specific agent or downstream dependency is failing repeatedly, temporarily route around it (to a fallback agent or a degraded-but-functional path) rather than repeatedly invoking a consistently failing component.

### Validation at Handoff Points
Validate the output of each agent against an expected schema/sanity check before passing it to the next agent or aggregation step — catching malformed or clearly incorrect intermediate results before they propagate further.

### Explicit Partial-Failure Policies
For parallel or multi-stage workflows, define upfront: what fraction of successful branches is "good enough" to proceed with aggregation, versus what failure threshold should trigger a full task failure or escalation.

### Supervisor-Level Reconciliation
A supervisor agent (in the supervisor-worker pattern) should have explicit logic for handling worker failures — reassigning a failed sub-task to a retry or a different worker, or explicitly flagging the gap in its final synthesis rather than silently omitting it.

## Observability Requirements
Comprehensive logging of every agent invocation, every inter-agent message, and every orchestration decision is essential for diagnosing multi-agent failures after the fact — because failures can originate at the coordination layer rather than within any single agent, single-agent tracing alone is insufficient (see multi-agent-observability.md).

## Testing Failure Scenarios
Proactively test multi-agent systems under simulated failure conditions — inject artificial delays, errors, or malformed outputs from individual agents — to validate that failure handling logic actually behaves as intended, rather than discovering gaps only when a real failure occurs in production.

## Summary
Multi-agent failure handling must address failures at the individual-agent, communication, and coordination layers, with explicit policies for partial completion and cascading-failure prevention — supported by comprehensive cross-agent observability and proactive failure-scenario testing, since the added architectural complexity of multi-agent systems creates correspondingly more ways for things to go wrong.
