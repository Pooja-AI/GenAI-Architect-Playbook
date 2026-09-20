# How would you implement incremental processing?

## Short answer
Process incrementally so each run only handles new or changed data.

## Key points
- Auto Loader with checkpoints for new files.
- Structured Streaming with an available-now trigger for batch-style incremental runs.
- Delta MERGE and change data feed to apply updates and deletes.

## CWD context
Checkpoints make restarts safe and avoid reprocessing.
