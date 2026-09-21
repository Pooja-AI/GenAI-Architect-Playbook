# How would you implement backpressure?

## Short answer
Backpressure stops a fast producer from overwhelming a slower consumer.

## Key points
- Queue-depth-based admission control and 429 or "accepted, please wait" responses.
- Consumer concurrency limits; per-tenant limits; rate limits toward Bedrock and MCP.
- Priority-based load shedding.

## CWD context
A buffer without backpressure only delays the overload.
