# Agent Evaluation

## Overview
Evaluating agentic systems requires assessing not just the final output quality (as in single-turn LLM evaluation) but the full trajectory of decisions — planning quality, tool selection, intermediate reasoning, and the efficiency of the path taken to reach a result — since an agent can arrive at a correct final answer through a flawed or inefficient process that won't generalize reliably to other tasks.

## Evaluation Dimensions Specific to Agents

### Task Completion Rate
Did the agent successfully accomplish the overall goal? This is the most fundamental metric but insufficient alone, since it doesn't capture *how* the agent got there.

### Trajectory/Process Quality
Was the sequence of reasoning steps, tool calls, and intermediate decisions sound? Evaluating the full trajectory (not just the final output) catches cases where an agent got lucky despite flawed intermediate reasoning, or took an unnecessarily circuitous or costly path to a correct result.

### Tool Selection Accuracy
Did the agent choose appropriate tools for each sub-task, and avoid unnecessary or incorrect tool invocations? See tool-selection-evaluation.md for a detailed treatment of this specific dimension.

### Efficiency
How many steps, tool calls, and tokens did the agent consume to complete the task, relative to a reasonable baseline? Excessive iteration or redundant tool calls indicate planning or reasoning inefficiency even when the final result is correct (connecting to the loop-prevention concerns in preventing-agent-loops.md).

### Failure Handling Quality
When the agent encountered an error or obstacle, did it respond appropriately (retry sensibly, try an alternative approach, escalate when appropriate) rather than looping unproductively or giving up prematurely? (see agent-failure-recovery.md)

### Safety and Guardrail Adherence
Did the agent stay within its intended scope of authorized actions, and did it correctly defer to human approval for actions that should require it? (see agent-guardrails.md and human-in-the-loop.md)

## Evaluation Methods

### Trajectory Annotation
Human or LLM-judge review of the full step-by-step reasoning trace (not just the final answer) against a rubric assessing planning quality, tool use appropriateness, and efficient progress toward the goal.

### Simulated Environment Testing
For agents interacting with external systems, testing against a simulated or sandboxed version of those systems allows controlled, repeatable evaluation scenarios — including deliberately simulating tool failures or unexpected results to test failure-handling quality specifically.

### Outcome-Based Scoring with Process Diagnostics
Score final task completion as the primary metric, but always pair it with process-level diagnostics (step count, tool-call accuracy, error recovery instances) so that a passing outcome score doesn't mask underlying process quality issues that would likely surface on a different, harder task instance.

### Benchmark Task Suites
Maintain a suite of representative agentic tasks spanning easy to hard difficulty, single-tool to multi-tool requirements, and clean to adversarial/ambiguous scenarios — analogous to the golden dataset concept (see golden-dataset.md) but specifically designed to exercise multi-step agentic behavior rather than single-turn responses.

## Common Agent Evaluation Pitfalls
- Evaluating only final task success, missing inefficiency, unsafe intermediate actions, or fragile reasoning that happened to work on this particular task instance
- Testing only "clean" scenarios where all tool calls succeed on the first try, missing the failure-recovery dimension that's often where agentic systems most commonly break down in real deployment
- Not testing genuinely ambiguous or underspecified tasks, missing whether the agent appropriately seeks clarification versus guessing

## Summary
Agent evaluation must go beyond simple task-completion success to assess the full reasoning trajectory — tool selection accuracy, efficiency, failure-handling quality, and guardrail adherence — using trajectory annotation and simulated environment testing against a representative benchmark suite spanning normal, ambiguous, and failure-inducing scenarios.
