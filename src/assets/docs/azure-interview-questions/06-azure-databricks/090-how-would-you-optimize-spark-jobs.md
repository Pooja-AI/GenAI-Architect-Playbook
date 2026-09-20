# How would you optimize Spark jobs?

## Short answer
Optimise Spark by reducing data movement and skew.

## Key points
- Reduce shuffles, tune partitions (adaptive query execution helps), broadcast small joins.
- Use built-in functions rather than Python UDFs.
- Handle skewed keys; compact small files.
- Right-size clusters and monitor in the Spark UI.

## CWD context
Measure before tuning; most gains come from a few stages.
