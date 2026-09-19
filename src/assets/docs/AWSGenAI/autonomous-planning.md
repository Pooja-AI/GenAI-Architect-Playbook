# Autonomous Planning

## Overview
Planning is the process by which an agent decomposes a high-level goal into a sequence of concrete, executable steps. Effective planning is what distinguishes an agent capable of handling genuinely complex, multi-part tasks from one that can only handle single-step tool invocations.

## Planning Approaches

### Zero-Shot Planning
The model generates a full plan directly from the goal description in a single call, without examples. Fast and simple, but can be unreliable for genuinely complex or unfamiliar task structures.

### Few-Shot Planning
Provide example task-decompositions in the prompt to guide the model toward a consistent planning format and style — improves reliability for recurring task types at the cost of prompt length.

### Hierarchical Planning
Break the goal into high-level sub-goals first, then recursively decompose each sub-goal into concrete steps only as needed — avoids over-planning distant steps that may become irrelevant once earlier steps produce new information.

### Dynamic (Interleaved) Planning
Plan only the next one or two steps at a time, re-planning after each observation — most adaptive to unexpected results, but requires more LLM calls and can lose sight of the overall goal if not periodically re-grounded.

## Plan Representation
Plans can be represented as:
- **Natural language step lists** — human-readable, easy for the model to generate, harder to programmatically validate
- **Structured task graphs** (JSON with dependencies) — enables programmatic validation, parallel execution of independent steps, and clearer dependency tracking
- **State machines** — useful when the task has well-defined discrete states and transitions (e.g., an order-processing workflow)

## Handling Plan Failures
A good planning system anticipates that not every step will succeed as expected:
- **Step-level retry**: retry a single failed step with adjusted parameters before abandoning the whole plan
- **Re-planning on failure**: if a step fails in a way that invalidates the rest of the plan, trigger a fresh planning pass incorporating the failure information
- **Partial success handling**: define what "good enough" partial completion looks like when full plan execution isn't achievable

## Balancing Plan Detail and Adaptivity
Overly detailed upfront plans become brittle when early steps surface unexpected information; overly loose plans risk the agent wandering without making progress toward the actual goal. A common effective pattern: plan the *first few concrete steps* in detail, keep later steps at a higher level of abstraction, and refine as execution proceeds.

## Task Decomposition Heuristics
- Break tasks along natural dependency boundaries (steps that must happen in order vs. steps that can happen independently — informs parallel execution opportunities)
- Identify checkpoints where human review or validation should occur before proceeding (see human-in-the-loop.md)
- Keep individual steps small enough that a single tool call or LLM reasoning step can reliably execute them

## Evaluating Planning Quality
- **Plan validity**: does the plan, if executed correctly, actually achieve the stated goal?
- **Plan efficiency**: does it avoid unnecessary or redundant steps?
- **Robustness**: does the plan (or the re-planning strategy) handle realistic failure scenarios gracefully?

Test planning specifically, separate from execution quality, by having the model produce plans for a benchmark of tasks and having them reviewed (by humans or a strong LLM judge) before ever executing them.

## Summary
Autonomous planning is the decomposition layer that enables agents to tackle multi-step, complex goals. The right level of planning granularity and adaptivity depends on task predictability — dynamic, interleaved planning suits novel or unpredictable environments, while more upfront hierarchical planning suits well-understood, repeatable workflows.
