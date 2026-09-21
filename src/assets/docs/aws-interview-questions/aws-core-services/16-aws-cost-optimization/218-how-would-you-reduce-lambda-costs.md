# How would you reduce Lambda costs?

## Short answer
Reduce Lambda cost by right-sizing, speeding up and invoking less.

## Key points
- Right-size memory with power tuning; use arm64 (Graviton).
- Reuse connections and shorten duration; filter events and batch SQS messages.
- Drop unneeded provisioned concurrency; Compute Savings Plans; reduce log volume.

## CWD context
Memory affects CPU, so more memory can be cheaper if it shortens duration.
