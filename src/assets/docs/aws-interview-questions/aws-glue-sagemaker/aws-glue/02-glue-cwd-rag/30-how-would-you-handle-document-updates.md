# How would you handle document updates?

## Short answer
Handle updates with change detection and upserts that replace old chunks.

## Key points
- Detect by hash, ETag or version ID; deterministic chunk IDs.
- Re-embed only changed chunks; delete obsolete ones.
- Separate path for ACL-only changes; avoid partial states by writing new before removing old.

## CWD context
Store version and ingest time on each chunk.
