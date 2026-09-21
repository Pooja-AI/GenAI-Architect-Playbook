# What is backpressure?

## Short answer
Backpressure is slowing producers or consumption when downstream systems cannot keep up.

## Key points
- SQS buffers naturally; add consumer concurrency limits.
- Queue-depth-based admission control (429 or "accepted, wait" responses).
- Per-tenant limits, rate limits toward Bedrock and MCP, shedding low-priority work.

## CWD context
Without backpressure a buffer just delays the overload.
