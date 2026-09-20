# Which CWD components would run as containers?

## Short answer
Run long-lived, HTTP-serving and queue-consuming components as containers.

## Key points
- API gateway service, Coordinator, Delegators, Workers and MCP servers.
- Background consumers; evaluation and batch work as Container Apps jobs.
- Event glue stays on Functions.

## CWD context
One image per component, built once and promoted through environments.
