# How would you implement optimistic concurrency?

## Short answer
Use ETag-based optimistic concurrency to prevent lost updates.

## Key points
- Each item has an _etag; send If-Match on replace.
- A conflict returns 412 Precondition Failed; re-read and retry.
- Combine with idempotency keys and patch operations.

## CWD context
Needed when several Workers update the same run state.
