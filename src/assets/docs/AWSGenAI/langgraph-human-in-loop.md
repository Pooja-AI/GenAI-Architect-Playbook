# LangGraph Human-in-the-Loop

## Overview
LangGraph provides native support for pausing graph execution at a designated point to await human input, approval, or correction — implementing the human-in-the-loop pattern described in human-in-the-loop.md directly within the graph orchestration framework, backed by checkpointing for durable pausing.

## How It Works
A graph can be configured with an "interrupt" point — a node (or the point before/after a specific node) where execution deliberately pauses and returns control to the calling application, rather than proceeding automatically. The current state is checkpointed (see langgraph-checkpointing.md) at this pause point, and execution can be resumed later — potentially after an arbitrary delay while a human reviews and responds — by re-invoking the graph with the same thread ID and any additional input (e.g., an approval decision or edited content).

## Implementation Pattern (Conceptual)
```python
graph = StateGraph(AgentState)
# ... add nodes and edges ...

# Compile with an interrupt before the "execute_action" node
app = graph.compile(interrupt_before=["execute_action"])

# First invocation runs up to the interrupt point and pauses
result = app.invoke(initial_state, config={"thread_id": "task-123"})

# ... application surfaces the pending action to a human reviewer ...

# After human approval, resume execution from the checkpoint
app.invoke(None, config={"thread_id": "task-123"})
```

## Common HITL Patterns Implemented This Way

### Pre-Action Approval
Interrupt before a node that executes a high-stakes action (see agent-guardrails.md), surfacing the proposed action to a human, and only proceeding to actually execute it upon explicit approval.

### Editable Draft Review
Interrupt after a node produces a draft output, allowing a human to review and optionally edit the state (e.g., modify the draft text) before execution resumes with the human-edited content incorporated into state.

### Conditional HITL Based on Confidence
Combine with conditional routing (see langgraph-conditional-routing.md) so the interrupt only triggers when a confidence or risk-score field in the state falls below a threshold, allowing high-confidence cases to proceed fully autonomously while routing lower-confidence cases through human review.

## Advantages of Native Framework Support
Implementing human-in-the-loop pausing without a framework typically requires significant custom infrastructure for durably storing partial execution state and correctly resuming from it — LangGraph's built-in checkpointing and interrupt mechanism handles this durability and resumption logic directly, substantially reducing the custom infrastructure needed to build reliable HITL workflows.

## Operational Considerations
- Design the application layer surfacing paused executions to human reviewers with sufficient context (the proposed action, relevant state, reasoning trace) for an efficient, well-informed review — the interrupt mechanism itself only handles the pause/resume mechanics, not the review UX
- Handle the case where a human never responds (define a timeout or escalation policy) so paused executions don't accumulate indefinitely without resolution
- Ensure the resumed execution correctly incorporates any human-provided modifications into subsequent node logic, not just passing through unchanged

## Testing HITL Graphs
Test both the "approved" and "rejected/modified" resumption paths explicitly, since these represent genuinely different subsequent control flow (e.g., a rejected action might route to an alternative node rather than proceeding to execution) — don't only test the happy-path approval flow.

## Summary
LangGraph's interrupt and checkpointing mechanisms provide native, durable support for human-in-the-loop workflows, letting graph execution pause for human approval or input and resume later exactly where it left off — significantly reducing the custom infrastructure burden of building reliable HITL patterns compared to implementing this from scratch.
