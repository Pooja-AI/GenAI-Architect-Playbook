# How would you implement retry and catch?

## Short answer
Configure Retry and Catch per state, with specific error names.

## Key points
- Retry transient errors (service exceptions, throttling, timeouts) with interval, backoff rate, maximum attempts and jitter.
- Do not retry permanent errors; place States.ALL last.
- Catch with ResultPath so the input and error both reach the handler.

## CWD context
Retries and Catch make failure handling visible in the workflow definition.
