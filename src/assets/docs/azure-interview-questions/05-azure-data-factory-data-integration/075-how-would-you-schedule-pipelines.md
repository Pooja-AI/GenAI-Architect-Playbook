# How would you schedule pipelines?

## Short answer
Schedule pipelines with the trigger type that matches the pattern.

## Key points
- Schedule trigger for cron-style runs.
- Tumbling-window trigger for dependencies, backfill and non-overlapping windows.
- Storage or custom event triggers for event-driven ingestion.
- Parameterised pipelines with concurrency limits.

## CWD context
Use tumbling windows when correctness of each window matters.
