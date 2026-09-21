# Where would you use EventBridge?

## Short answer
Use EventBridge as the event bus that routes events between services without tight coupling.

## Key points
- S3 object events, Glue job state changes and Step Functions state changes.
- EventBridge Scheduler for timed jobs; SaaS and cross-account events.
- Rules, archive and replay.

## CWD context
EventBridge says "something happened"; SQS says "please do this".
