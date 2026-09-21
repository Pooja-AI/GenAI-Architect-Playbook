# How would you optimize OpenSearch cost?

## Short answer
Reduce OpenSearch cost by capping capacity and shrinking what is stored.

## Key points
- Set OCU limits; reduced redundancy for dev and test.
- Lower embedding dimensions, quantisation or disk-based vectors; store only needed fields.
- Share collections sensibly; delete stale documents; cache frequent queries.
- Consider a managed cluster with reserved instances for steady load.

## CWD context
The OCU baseline makes small workloads relatively expensive.
