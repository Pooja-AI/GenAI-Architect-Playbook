# How would you avoid hot partitions?

## Short answer
Avoid hot partitions with well-distributed keys and monitoring.

## Key points
- High-cardinality or hierarchical partition keys; synthetic key suffixes if needed.
- Watch normalised RU consumption per partition key range.
- Handle 429 with Retry-After; use autoscale.

## CWD context
A single very large tenant is the classic hot-key trap.
