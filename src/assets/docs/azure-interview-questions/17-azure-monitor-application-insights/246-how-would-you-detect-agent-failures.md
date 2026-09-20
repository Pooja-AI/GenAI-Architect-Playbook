# How would you detect agent failures?

## Short answer
Detect agent failures with outcome and behaviour metrics, not just exceptions.

## Key points
- Run outcomes: success, failed, timeout, aborted.
- Tool failure rate, retries per run, loop-guard hits, validation failures, fallback events, DLQ counts.
- Low groundedness and negative user feedback.

## CWD context
Store failed runs with trace IDs so they can be replayed and added to the golden set.
