# Where would you use SQS in CWD?

## Short answer
Use SQS between components wherever work is slow, bursty or needs retries.

## Key points
- Delegator to Worker job queues and reply queues.
- Ingestion tasks, audit events, retry buffers.
- A rate-limited buffer in front of Bedrock or MCP servers.

## CWD context
Every queue has a DLQ and an owner.
