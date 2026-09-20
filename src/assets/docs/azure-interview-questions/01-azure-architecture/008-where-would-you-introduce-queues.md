# Where would you introduce queues?

## Short answer
Introduce queues wherever work is slow, bursty, needs retries or must survive a crash.

## Key points
- Between the Delegator and long-running or write Workers (Service Bus queues).
- Ingestion events and re-index jobs.
- Audit and telemetry events so logging never blocks a request.
- Per-tenant buffering to absorb spikes and apply backpressure.
- Every queue gets a dead-letter queue and a replay process.

## CWD context
Do not queue short read-only calls; it only adds latency.
