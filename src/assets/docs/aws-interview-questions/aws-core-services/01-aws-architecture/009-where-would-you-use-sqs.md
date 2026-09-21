# Where would you use SQS?

## Short answer
Use SQS wherever work is slow, bursty, needs retries or must survive a crash.

## Key points
- Between Delegators and long-running or write Workers.
- Ingestion tasks and re-index jobs; audit events.
- Buffering and backpressure per tenant; every queue gets a DLQ.

## CWD context
Do not queue short read-only calls; it only adds latency.
