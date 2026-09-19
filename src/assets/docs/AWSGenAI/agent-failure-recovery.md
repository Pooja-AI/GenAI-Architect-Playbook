# Agent Failure Recovery

## Overview
Agentic systems will encounter failures — tool errors, model misunderstandings, downstream service outages, ambiguous instructions. Failure recovery is the set of strategies for detecting these failures and responding gracefully rather than crashing, looping, or silently producing an incorrect result.

## Categories of Failure

### Tool Execution Failures
An invoked tool returns an error (invalid input, downstream service unavailable, timeout, permission denied).

### Reasoning Failures
The model misinterprets the task, draws an incorrect conclusion from correct information, or produces an invalid plan.

### Ambiguity Failures
The task or user request is genuinely underspecified, and the agent cannot proceed without clarification.

### Resource/Budget Exhaustion
The agent hits an iteration cap, time limit, or cost budget before completing the task.

### External Dependency Failures
An upstream service the agent relies on (vector database, API, another agent in a multi-agent system) is degraded or unavailable.

## Recovery Strategies

### Retry with Backoff
For transient failures (network blips, temporary rate limiting), retry with exponential backoff before escalating (see bedrock-retries-throttling.md for the underlying pattern).

### Alternative Approach / Tool Substitution
If a specific tool or approach fails, allow the agent to reason about and attempt an alternative path to the same sub-goal rather than only retrying the identical failed action.

### Graceful Degradation
When full task completion isn't possible, define what a "best effort" partial result looks like and have the agent produce that with clear communication about what wasn't achieved, rather than either fully failing or fabricating a complete-seeming but inaccurate result.

### Clarification Requests
When ambiguity is the root cause, the agent should explicitly ask a clarifying question (to a human user or an upstream orchestrating agent) rather than guessing and proceeding on a potentially wrong assumption.

### Escalation to Human
For failures that exceed the agent's ability to self-recover (see human-in-the-loop.md), escalate with full context (what was attempted, what failed, current state) so a human can resolve the specific blocking issue rather than starting from scratch.

### Checkpoint-Based Resumption
If agent state is checkpointed (see agent-state.md), a failure partway through a long task can resume from the last successful checkpoint rather than restarting the entire task from the beginning — important for cost and latency in long-running workflows.

## Designing for Recoverability
- Make each step's failure mode explicit and anticipated rather than assuming happy-path execution
- Ensure error messages returned to the model (from tools) are informative enough for it to reason about appropriate recovery, not just a generic failure signal
- Build in idempotency for actions that might be retried, so a retry after a partial failure doesn't cause duplicate side effects (e.g., double-charging, duplicate ticket creation)

## Failure Recovery vs. Loop Prevention
These are closely related but distinct: loop prevention (see preventing-agent-loops.md) stops an agent from repeating the *same* failed action indefinitely, while failure recovery is about choosing the *right next action* when a failure occurs — including recognizing when retrying isn't the right strategy at all.

## Monitoring Failure Patterns
Track failure rate by category (tool errors, reasoning failures, ambiguity, budget exhaustion) as a production metric — a rising rate in a specific category points to a specific fix (e.g., improving a tool's error messages, adding a missing capability, clarifying ambiguous parts of the system prompt).

## Summary
Robust failure recovery requires anticipating multiple distinct failure categories and providing the agent with explicit, well-reasoned recovery paths for each — retry, alternative approach, graceful degradation, clarification, or human escalation — rather than a single generic error-handling fallback.
