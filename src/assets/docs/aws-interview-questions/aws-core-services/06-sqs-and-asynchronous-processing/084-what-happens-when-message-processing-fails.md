# What happens when message processing fails?

## Short answer
A failed message is not deleted, so it reappears and is retried until it reaches the DLQ.

## Key points
- The redrive policy moves it to the DLQ after maxReceiveCount.
- Use partial batch failure responses to avoid retrying successes.
- Increase the timeout on each failure for backoff; alert on DLQ growth.

## CWD context
Distinguish transient from permanent failures.
