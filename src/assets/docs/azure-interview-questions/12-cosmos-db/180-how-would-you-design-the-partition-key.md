# How would you design the partition key?

## Short answer
Choose a high-cardinality, evenly distributed key that appears in most queries.

## Key points
- Good: sessionId, or hierarchical tenantId + sessionId.
- Avoid: low-cardinality keys (a big tenant becomes hot) and monotonic keys such as date only.
- Cross-partition queries cost more; a logical partition is limited to 20 GB.

## CWD context
Model the access patterns first, then choose the key.
