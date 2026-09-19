# The AI Reasoning Loop

## Overview
The reasoning loop is the core control-flow pattern underlying agentic AI: the model iteratively reasons about the current state, decides on an action, executes it, and incorporates the result before deciding the next action. The most widely used formalization of this pattern is ReAct (Reason + Act).

## ReAct Pattern
At each iteration, the model produces:
1. **Thought** — a reasoning trace about what to do next and why
2. **Action** — a specific tool call (with structured inputs) or a decision to produce the final answer
3. **Observation** — the result returned by the tool, fed back into the next iteration's context

```
Thought: I need to find the customer's current subscription tier before answering.
Action: lookup_customer(customer_id="12345")
Observation: {"tier": "enterprise", "renewal_date": "2026-11-01"}
Thought: Now I have what I need to answer the billing question.
Action: final_answer("Your enterprise plan renews on Nov 1, 2026...")
```

## Why the Explicit "Thought" Step Helps
Making the model articulate its reasoning before acting (rather than jumping straight to a tool call) measurably improves decision quality — it surfaces the model's assumptions, makes errors easier to catch via logging, and gives the model a chance to "notice" when a plan doesn't make sense before executing it.

## Variations on the Loop

### Plan-and-Execute
The model first produces a full multi-step plan up front, then executes each step (potentially without re-planning between every step), only re-planning if a step fails or new information significantly changes the situation. More efficient (fewer LLM calls) than fully interleaved reasoning for well-understood tasks, but less adaptive to surprises mid-execution.

### Reflexion / Self-Critique Loops
After producing an action or answer, the model (or a second call) critiques its own output against the goal and decides whether to revise before finalizing — improves quality for tasks where first-pass answers are often subtly wrong, at the cost of extra latency and token spend.

### Tree-of-Thought / Multi-Path Exploration
Rather than a single linear reasoning chain, the model explores multiple candidate reasoning paths in parallel and selects the most promising one — useful for problems with many plausible approaches, but significantly more expensive computationally.

## Stopping Conditions
A reasoning loop needs explicit termination logic:
- The model produces a final answer/completion signal
- A maximum iteration count is reached (critical safety bound — see preventing-agent-loops.md)
- A maximum time or cost budget is exhausted
- A tool call indicates the task cannot proceed (e.g., a hard error) and the agent should stop and report failure rather than retry indefinitely

## Context Management Across Iterations
Each loop iteration adds to the conversation history (thought, action, observation) — this context grows with every step, so long-running agent tasks must manage context window growth (via summarization or windowing, see context-window-optimization.md) to avoid exceeding limits or degrading reasoning quality on later steps.

## Observability
Log every thought/action/observation triple for each iteration — this is essential for debugging agent behavior, since failures in agentic systems are often only understandable by reviewing the full reasoning trace, not just the final output (see agent-tracing.md).

## Summary
The reasoning loop is the fundamental mechanism that turns an LLM into an agent. ReAct's explicit thought-action-observation structure is the most common implementation, with variations (plan-and-execute, reflexion, tree-of-thought) trading off adaptivity, quality, and cost differently depending on task requirements.
