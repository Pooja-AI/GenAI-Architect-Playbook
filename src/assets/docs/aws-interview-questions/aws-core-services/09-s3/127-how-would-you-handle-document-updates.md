# How would you handle document updates?

## Short answer
Handle updates by detecting the change, re-processing and replacing old chunks.

## Key points
- S3 event on the new version; compare ETag, version ID or hash.
- Deterministic chunk IDs (documentId#n) so upserts replace; delete chunks no longer present.
- ACL-only changes update metadata without re-embedding.

## CWD context
Record document version and ingest time on each chunk.
