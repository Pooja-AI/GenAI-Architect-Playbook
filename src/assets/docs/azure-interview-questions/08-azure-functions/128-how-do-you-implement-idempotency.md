# How do you implement idempotency?

## Short answer
Make handlers idempotent with a stored idempotency key and conditional writes.

## Key points
- Key from message ID or business operation ID.
- Insert-if-not-exists in Cosmos DB or Redis before doing the side effect.
- Pass idempotency keys or external IDs to downstream systems; prefer upserts.

## CWD context
Assume every message can arrive twice.
