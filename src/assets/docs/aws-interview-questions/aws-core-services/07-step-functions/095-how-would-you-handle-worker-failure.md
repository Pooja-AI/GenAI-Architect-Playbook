# How would you handle Worker failure?

## Short answer
Handle Worker failure with Retry for transient errors and Catch for fallback paths.

## Key points
- Retry with backoff and jitter; Catch routes to compensation, notification or partial-result states.
- Preserve the original input in the error path.
- Alarm on failed executions.

## CWD context
Decide which failures abort the whole workflow and which allow partial completion.
