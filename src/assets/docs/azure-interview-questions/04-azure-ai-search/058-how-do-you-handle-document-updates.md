# How do you handle document updates?

## Short answer
Handle updates with change detection and idempotent upserts.

## Key points
- Detect changes by hash, ETag or last-modified time.
- Use deterministic chunk IDs (documentId#chunkNumber) so upserts replace old chunks.
- Delete chunks that no longer exist in the new version; re-embed only changed chunks.
- Handle ACL-only changes as a separate update path.

## CWD context
Store a version and ingest timestamp on each chunk for freshness checks.
