# How would you control Step Functions cost?

## Short answer
Control cost by reducing state transitions and choosing the right workflow type.

## Key points
- Combine steps; avoid polling loops by using callbacks and synchronous service integrations.
- Express for high-volume short workflows; log at error level, not all.
- Distributed Map only when the volume needs it; limit payloads.

## CWD context
Set budgets and alerts on Step Functions spend.
