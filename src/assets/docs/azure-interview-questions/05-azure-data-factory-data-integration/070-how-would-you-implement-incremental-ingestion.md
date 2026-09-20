# How would you implement incremental ingestion?

## Short answer
Incremental ingestion loads only what changed since the last successful run.

## Key points
- Store a watermark in a control table; look up, copy changes, then update the watermark on success only.
- Or use CDC, delta tokens or change tracking.
- Use idempotent upserts (Delta MERGE) and a small overlap window.

## CWD context
Update the watermark last so a failed run is simply repeated.
