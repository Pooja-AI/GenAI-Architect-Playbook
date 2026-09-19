# Preventing Agent Loops

## Overview
An agent stuck in a loop — repeatedly calling the same tool, oscillating between two unproductive states, or endlessly re-planning without progress — is one of the most common and costly failure modes in agentic systems. Left unchecked, loops can run up significant cost, degrade user experience, and in the worst case take repeated unintended actions.

## Common Loop Patterns

### Retry Loops
An agent repeatedly retries a failing tool call with the same or trivially varied arguments, never recognizing the underlying error is not something a retry will fix (e.g., invalid permissions, a fundamentally malformed request).

### Oscillation Loops
The agent alternates between two states without making net progress — e.g., repeatedly toggling between two candidate answers, or undoing and redoing a plan step in response to ambiguous feedback.

### Exploration Loops
In open-ended research or search tasks, an agent may continue retrieving and reasoning indefinitely without a clear stopping condition, especially if its goal isn't crisply defined.

### Self-Reinforcing Confusion
An error early in the reasoning chain leads the model to misinterpret subsequent observations, compounding into increasingly incoherent behavior that doesn't naturally self-correct.

## Prevention Mechanisms

### Hard Iteration Caps
Set an explicit maximum number of reasoning/action iterations per task, after which the agent is forced to stop and either produce its best available answer or explicitly report failure — this is the simplest and most essential safeguard.

### Cost and Time Budgets
In addition to iteration count, cap total token spend and wall-clock time per task, since some loops involve expensive individual steps rather than simply many steps.

### Repetition Detection
Track the sequence of recent actions (tool name + arguments) and detect when the same or near-identical action repeats beyond a small threshold (e.g., 2-3 times) — trigger an explicit re-planning step or escalation rather than allowing indefinite repetition.

### Progress Checks
Periodically (e.g., every N iterations) prompt the model to explicitly assess whether it's making progress toward the goal, and force a strategy change or escalation to a human if it self-assesses as stuck.

### Explicit Failure Paths
Design the agent's action space to always include a valid "I cannot complete this task" or "escalate to human" action, so the model has a legitimate off-ramp rather than being forced to keep trying indefinitely because no other action is available.

## Detecting Loops in Production
Monitor iteration count distributions, tool-call repetition rates, and per-task cost as production metrics — a rising tail of unusually long-running or high-cost tasks is a strong signal of loop behavior that needs investigation, even before it becomes a dominant cost driver.

## Root-Causing Loops
When a loop is detected, review the full reasoning trace (see agent-tracing.md) to identify the underlying cause — often traceable to an ambiguous tool description, a missing capability the agent kept trying to work around, or a genuinely underspecified goal that gave the model no clear completion criteria.

## Summary
Loop prevention combines hard technical limits (iteration caps, cost budgets) with softer design mechanisms (repetition detection, progress checks, explicit failure paths). Every production agentic system needs these safeguards regardless of how well-tested the underlying reasoning and planning logic is, because loops are an emergent failure mode that can't be fully eliminated through prompting alone.
