# Where would you introduce SQS?

## Short answer
Introduce SQS wherever work is slow, bursty or side-effecting.

## Key points
- In front of long-running and write Workers; ingestion and re-index jobs.
- Audit and telemetry; buffering before Bedrock-limited stages.
- In front of Lambda to control concurrency.
- Always with a DLQ.

## CWD context
Not for short read-only calls.
