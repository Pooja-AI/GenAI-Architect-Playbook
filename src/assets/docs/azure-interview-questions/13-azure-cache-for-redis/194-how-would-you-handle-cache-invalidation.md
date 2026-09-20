# How would you handle cache invalidation?

## Short answer
Combine TTL with event-driven invalidation and versioned keys.

## Key points
- TTL as the baseline.
- Events (for example DocumentUpdated) delete related keys.
- Version keys by prompt, model or index version.
- Prevent cache stampede with locks or jittered TTLs.

## CWD context
Invalidation rules should be explicit for each cached item type.
