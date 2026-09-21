# How would you reduce OpenSearch costs?

## Short answer
Reduce OpenSearch cost by capping capacity and storing less.

## Key points
- OCU limits and reduced redundancy in dev and test.
- Lower embedding dimensions, quantisation or disk-based vectors; store only needed fields.
- Share collections sensibly; delete stale documents; cache frequent queries.

## CWD context
The OCU baseline dominates small workloads.
