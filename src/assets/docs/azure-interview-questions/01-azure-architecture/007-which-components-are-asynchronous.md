# Which components are asynchronous?

## Short answer
Asynchronous components are slow, retry-prone or side-effecting work that should not block the user.

## Key points
- Document ingestion and re-indexing (Data Factory / Databricks, event triggers).
- Long-running Workers and MCP write operations via Service Bus.
- Evaluation runs, audit and telemetry export, notifications, DLQ replay.
- Cosmos DB change feed consumers that update downstream views.

## CWD context
The client gets 202 Accepted and polls a status endpoint or receives a callback.
