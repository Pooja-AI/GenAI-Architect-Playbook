# How would you prevent Lambda concurrency exhaustion?

## Short answer
Prevent concurrency exhaustion with caps, queues and monitoring.

## Key points
- Reserved concurrency on critical functions; maximum concurrency on SQS event source mappings.
- Buffer bursts in SQS; request quota increases early.
- Alarms on ConcurrentExecutions and Throttles.

## CWD context
One runaway function should never starve the authoriser.
