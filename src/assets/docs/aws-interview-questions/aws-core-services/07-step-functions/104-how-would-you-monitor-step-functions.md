# How would you monitor Step Functions?

## Short answer
Monitor Step Functions with metrics, logs, traces and event notifications.

## Key points
- Executions started, succeeded, failed, timed out, throttled; execution time.
- Logging at error level to CloudWatch Logs (required for Express); X-Ray.
- Alarms on failures, timeouts and throttling; EventBridge on status changes.

## CWD context
Alert on stuck executions as well as failed ones.
