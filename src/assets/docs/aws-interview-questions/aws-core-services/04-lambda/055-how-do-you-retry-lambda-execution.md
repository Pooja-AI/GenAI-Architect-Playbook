# How do you retry Lambda execution?

## Short answer
Configure retries deliberately for each invocation type.

## Key points
- Asynchronous: set maximum retry attempts and maximum event age.
- SQS: retries come from the visibility timeout and redrive policy.
- Step Functions: Retry with backoff and Catch.
- Retry only transient errors; keep handlers idempotent.

## CWD context
Do not stack retries at several layers.
