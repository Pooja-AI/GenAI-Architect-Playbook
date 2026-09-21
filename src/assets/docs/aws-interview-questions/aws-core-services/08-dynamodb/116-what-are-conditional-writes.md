# What are conditional writes?

## Short answer
A conditional write succeeds only if a condition on the existing item is true.

## Key points
- ConditionExpression such as attribute_not_exists(pk) or a version or status check.
- Failure returns ConditionalCheckFailedException.
- Enables idempotency, locks and safe state transitions without extra reads.

## CWD context
The building block for exactly-once effects.
