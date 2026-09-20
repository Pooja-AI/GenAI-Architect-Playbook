# How do you handle message ordering?

## Short answer
Ordering is not guaranteed across competing consumers; use sessions where order matters.

## Key points
- SessionId (for example conversation or customer ID) gives FIFO within a session.
- Ordering reduces parallelism, so use it selectively.
- Alternative: sequence numbers and idempotent handlers.

## CWD context
Most Worker jobs do not need ordering; enforce it only per entity.
