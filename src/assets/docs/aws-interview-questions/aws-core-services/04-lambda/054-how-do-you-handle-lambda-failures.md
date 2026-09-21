# How do you handle Lambda failures?

## Short answer
Failure handling depends on how the function is invoked.

## Key points
- Synchronous: the error returns to the caller.
- Asynchronous: automatic retries, then an on-failure destination or DLQ.
- SQS trigger: the message reappears after the visibility timeout and moves to a DLQ after maxReceiveCount; use partial batch responses.
- Step Functions adds Retry and Catch.

## CWD context
Alarm on Errors, Throttles and DLQ depth.
