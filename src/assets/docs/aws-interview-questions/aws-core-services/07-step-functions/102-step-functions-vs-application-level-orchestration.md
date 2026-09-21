# Step Functions vs application-level orchestration?

## Short answer
Application-level orchestration (LangGraph) is flexible for agent reasoning; Step Functions is durable for deterministic workflows.

## Key points
- LangGraph: dynamic LLM-driven loops, in-code state.
- Step Functions: declarative, auditable, long waits, per-transition cost.
- Hybrid: a LangGraph node starts a Step Functions workflow for long jobs.

## CWD context
Do not force dynamic agent loops into a state machine.
