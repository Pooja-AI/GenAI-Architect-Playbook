# How would you design the DynamoDB partition key?

## Short answer
Choose a high-cardinality partition key that spreads load and matches your access pattern.

## Key points
- Example: SESSION#{sessionId}, optionally prefixed by tenant.
- Avoid a tenant-only key for large tenants.
- Use write sharding for unavoidable hot keys.

## CWD context
Design from the queries backwards.
