# How would you monitor Lambda errors?

## Short answer
Monitor Lambda errors with metrics, metric math and log filters.

## Key points
- Errors, Throttles, Duration relative to the timeout, ConcurrentExecutions.
- Error rate as Errors divided by Invocations; metric filters for exceptions.
- Alarms to SNS; watch DLQ depth for async and SQS triggers.

## CWD context
Alarm on rate, not just count.
