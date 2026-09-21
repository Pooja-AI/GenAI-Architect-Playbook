# Where would you use DynamoDB?

## Short answer
Use DynamoDB for durable, key-based operational state.

## Key points
- Sessions, workflow state and checkpoints, run and step records.
- Agent and prompt registries, idempotency keys, quotas and counters, audit metadata.
- Not for large documents, vectors or ad-hoc analytics.

## CWD context
Access patterns decide the table design, so define them first.
