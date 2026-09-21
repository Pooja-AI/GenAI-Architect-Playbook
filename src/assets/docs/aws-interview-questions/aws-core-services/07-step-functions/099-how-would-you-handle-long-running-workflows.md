# How would you handle long-running workflows?

## Short answer
Standard workflows can run for up to a year and wait without cost.

## Key points
- Wait states and waitForTaskToken for human approvals and external systems.
- Heartbeats for stall detection; do not hold Lambdas open while waiting.
- Cost depends on state transitions, not duration.

## CWD context
Use callbacks instead of polling loops.
