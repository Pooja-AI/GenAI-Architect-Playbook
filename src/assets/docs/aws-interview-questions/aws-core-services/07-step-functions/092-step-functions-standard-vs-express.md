# Step Functions Standard vs Express?

## Short answer
Standard workflows are long-running and fully auditable; Express workflows are short and high-volume.

## Key points
- Standard: up to a year, exactly-once execution, full history, task-token callbacks, billed per state transition.
- Express: up to five minutes, at-least-once (async) or at-most-once (sync), very high rate, billed by requests and duration.

## CWD context
Standard for CWD business workflows; Express for high-volume short transformations.
