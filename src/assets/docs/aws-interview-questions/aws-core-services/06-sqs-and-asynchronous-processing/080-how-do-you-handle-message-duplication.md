# How do you handle message duplication?

## Short answer
Standard SQS delivers at least once, so duplicates can occur.

## Key points
- Causes: retries, and visibility timeout expiring before processing finishes.
- FIFO deduplication IDs help within a window.
- Always make consumers idempotent.

## CWD context
Broker features reduce duplicates; only idempotency removes their effect.
