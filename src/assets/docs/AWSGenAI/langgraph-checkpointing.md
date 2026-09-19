# LangGraph Checkpointing

## Overview
Checkpointing is LangGraph's built-in mechanism for persisting graph state at each step of execution, enabling resumability after interruption, durable long-running workflows, human-in-the-loop pauses, and "time-travel" debugging by inspecting or replaying from any historical checkpoint.

## How Checkpointing Works
LangGraph persists the full graph state to a configured checkpoint store (e.g., an in-memory store for development, or a durable backend like a database for production) after each node's execution, tagged with a thread/session identifier. This means:
- A graph execution can be paused (deliberately or due to a crash/timeout) and resumed later from the last completed step, without re-executing already-completed nodes
- The full history of state at every step is available for inspection

## Checkpoint Backends
For production use on AWS, checkpoint state is typically persisted to a durable backend such as DynamoDB or a relational database (via a custom or community-provided checkpoint saver implementation), rather than relying on in-memory checkpointing which doesn't survive process restarts — this is the practical implementation of the durable state persistence pattern described in agent-state.md.

## Use Cases Enabled by Checkpointing

### Resumable Long-Running Workflows
A graph execution spanning many steps (potentially over minutes or hours, involving slow external tool calls) can be safely interrupted (e.g., due to a Lambda timeout) and resumed from its last checkpoint rather than restarting the entire workflow from scratch — critical for cost and latency in genuinely long-running agentic tasks.

### Human-in-the-Loop Pauses
A graph can be designed to pause at a specific node awaiting human approval (see langgraph-human-in-loop.md and human-in-the-loop.md), with the paused state durably checkpointed until a human provides input, potentially much later, at which point execution resumes exactly where it left off.

### Time-Travel Debugging
Because every step's state is persisted, you can inspect the exact state at any historical point in a given execution — invaluable for diagnosing why a graph produced a particular (possibly incorrect) result, without needing to reproduce the failure from scratch.

### Replaying and Branching
Some implementations support resuming execution from a historical checkpoint with modified state or logic — useful for testing "what if" scenarios or recovering from a specific known-bad step without discarding all the valid work that preceded it.

## Design Considerations
- **Checkpoint granularity**: checkpointing after every single node provides maximum resumability but adds persistence overhead on every step — evaluate whether this overhead is acceptable for your latency requirements, or whether coarser checkpointing (e.g., only at defined milestone nodes) is more appropriate
- **State schema evolution**: changing the state schema after checkpoints already exist for in-flight executions can break resumption — plan for schema versioning or migration if this is a realistic operational scenario
- **Storage growth and retention**: checkpoint data accumulates over time; define retention/cleanup policies appropriate to your debugging and compliance needs

## Relationship to Multi-Agent State
Checkpointing is the durability mechanism underlying the broader multi-agent state management concepts described in multi-agent-state.md — it provides the concrete implementation for persisting and resuming shared state across a complex, potentially long-running multi-agent graph execution.

## Summary
LangGraph checkpointing provides durable, inspectable persistence of graph state at each execution step, enabling resumable long-running workflows, human-in-the-loop pauses, and powerful time-travel debugging — essential infrastructure for any production agentic system with non-trivial execution duration or human oversight requirements.
