# How would you implement TTL?

## Short answer
Use TTL to expire ephemeral data automatically.

## Key points
- Container default TTL or per-item ttl property.
- Ideal for idempotency keys, old checkpoints and temporary session data.
- Deletion happens in the background using spare throughput.

## CWD context
Align TTL with retention policy and privacy commitments.
