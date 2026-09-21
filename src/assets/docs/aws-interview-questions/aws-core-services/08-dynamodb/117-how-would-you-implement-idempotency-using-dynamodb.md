# How would you implement idempotency using DynamoDB?

## Short answer
Implement idempotency with a conditional put keyed by the operation ID.

## Key points
- attribute_not_exists on the key so the first writer wins.
- Store in-progress or completed status, the result and a TTL; duplicates return the stored result.
- Handle expired in-progress locks; Powertools uses this pattern.

## CWD context
Use it for all write tools.
