# How would you implement retry policies?

## Short answer
Configure retries only for idempotent requests, with exponential intervals and a small count.

## Key points
- Condition on 429 or 5xx statuses.
- Count, interval and maximum interval; consider first-fast-retry.
- Body buffering may be required.
- Retry in one layer only.

## CWD context
Stacking retries in APIM, the app and the SDK multiplies load during an outage.
