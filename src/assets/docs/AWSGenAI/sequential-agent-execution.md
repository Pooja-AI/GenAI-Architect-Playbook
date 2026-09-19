# Sequential Agent Execution

## Overview
Sequential agent execution runs agents one after another, where each agent's output becomes part of the next agent's input — a pipeline pattern used when sub-tasks have genuine dependencies and must happen in a specific order.

## When Sequential Execution Is Required
- **Pipeline dependencies**: a later step genuinely needs the output of an earlier step (e.g., a "research" agent must complete before a "writing" agent can draft content based on its findings)
- **Progressive refinement**: each stage improves or transforms the previous stage's output (e.g., draft → edit → fact-check → finalize)
- **Staged validation**: earlier agents perform checks or transformations that must complete before later, potentially more expensive, steps proceed (fail fast on cheap checks before running costly ones)

## Architecture Pattern
```
Input → Agent A → Agent B → Agent C → Final Output
       (research)  (draft)   (review)
```
Each arrow represents a full handoff: Agent A's complete output (or a relevant, scoped subset of it, see agent-communication.md) becomes part of Agent B's input context.

## Design Considerations

### Context Handoff
Decide exactly what each agent passes to the next — the full raw output, or a distilled/structured summary. Passing everything verbatim is simpler but risks context bloat by the time a pipeline reaches its final stages; passing only the essential structured output keeps later stages' context focused (a specific instance of context window optimization applied to pipeline design).

### Stage-Level Validation
Insert validation checks between stages (either automated or via a dedicated "reviewer" agent) so an error introduced early in the pipeline is caught before propagating through and compounding in later, potentially more expensive stages.

### Early Termination
If an early stage determines the task cannot proceed (e.g., research finds no relevant information exists), the pipeline should be able to terminate early with an appropriate response rather than forcing later stages to work with an already-doomed input.

### Latency Implications
Sequential execution's total latency is the sum of each stage's latency — unlike parallel execution, there's no latency benefit from concurrency. For latency-sensitive applications, look for opportunities to convert genuinely independent portions of an otherwise sequential pipeline into parallel branches (see parallel-agent-execution.md).

## Sequential vs. Single-Agent-With-Internal-Steps
A sequential multi-agent pipeline is conceptually similar to a single agent working through multiple internal reasoning steps, but with the benefit of each stage potentially using a different, specialized prompt/model/tool configuration, and clearer separation for testing and debugging each stage independently.

## Error Propagation
Because each stage builds directly on the previous stage's output, errors compound through a sequential pipeline more severely than in parallel or single-agent architectures. Robust sequential pipelines need:
- Clear validation gates between stages
- The ability to route a failed or low-confidence stage output back for retry or human review rather than blindly passing it forward
- Comprehensive per-stage logging so failures can be traced to the specific stage that introduced the error

## Hybrid Sequential-Parallel Pipelines
Real-world workflows are often a mix: some stages run sequentially (because of genuine dependency) while sub-portions of individual stages run in parallel (e.g., a "research" stage that internally parallelizes multiple independent search queries before proceeding sequentially to a synthesis stage).

## Summary
Sequential agent execution is the right pattern when sub-tasks have genuine, unavoidable dependencies. It trades latency (no parallelism benefit) for a clear, easy-to-reason-about pipeline, and requires careful attention to context handoff and stage-level validation to prevent error compounding across stages.
