# How would you store session/task/run/turn/step state?

## Short answer
Model state hierarchically as session → run → turn → step, with the session in one logical partition.

## Key points
- Hierarchical partition key such as tenantId / sessionId / runId.
- Typed documents (a type field); append-only step documents.
- Transactional batch works within a partition.
- Large payloads in blob storage; TTL for ephemeral items.

## CWD context
Most queries are "give me this session's state", so partition by session.
