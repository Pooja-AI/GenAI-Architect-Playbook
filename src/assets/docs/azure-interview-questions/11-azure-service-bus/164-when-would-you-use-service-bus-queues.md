# When would you use Service Bus queues?

## Short answer
Use queues for work that exactly one consumer should perform.

## Key points
- Worker job dispatch by Worker type.
- Ingestion tasks and commands ("do this").
- Retry and dead-letter handling.

## CWD context
One queue per Worker type gives independent scaling.
