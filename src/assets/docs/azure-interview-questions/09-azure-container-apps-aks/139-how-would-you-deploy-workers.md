# How would you deploy Workers?

## Short answer
Deploy Workers as container apps scaled by queue depth, or as jobs for batch tasks.

## Key points
- KEDA Service Bus scaler; scale to zero when idle.
- Distinct identity per Worker type; idempotent handlers.
- Call MCP servers rather than embedding system integrations.

## CWD context
Scale Workers on backlog, not CPU.
