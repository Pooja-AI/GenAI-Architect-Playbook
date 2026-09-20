# How would you handle workflow state?

## Short answer
Persist LangGraph state through a Cosmos DB checkpointer keyed by thread ID.

## Key points
- A checkpoint is written after each node with the state snapshot and metadata.
- Resume from a thread ID and checkpoint ID.
- Version the state schema; keep items well under the item size limit.

## CWD context
Workflow state is separate from conversation history for cleaner lifecycle and retention.
