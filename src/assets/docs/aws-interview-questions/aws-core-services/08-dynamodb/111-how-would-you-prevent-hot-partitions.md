# How would you prevent hot partitions?

## Short answer
Prevent hot partitions with good key design, and detect them early.

## Key points
- High-cardinality keys, write-sharding suffixes, no monotonic time-based partition keys.
- Adaptive capacity helps but has per-partition limits.
- Cache hot reads (DAX or Redis); use Contributor Insights and throttling metrics.

## CWD context
One huge tenant is the classic hot-key trap.
