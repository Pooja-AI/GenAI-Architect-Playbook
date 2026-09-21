# How do you make Lambda execution idempotent?

## Short answer
Make Lambda idempotent with a stored idempotency key and a conditional write.

## Key points
- DynamoDB conditional put (attribute_not_exists) keyed by request or message ID, with TTL.
- Powertools for AWS Lambda provides an idempotency utility.
- Pass idempotency tokens or use upserts downstream.

## CWD context
Assume every event can be delivered more than once.
