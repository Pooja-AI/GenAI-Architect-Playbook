# Standard queue vs FIFO queue?

## Short answer
Standard queues favour throughput; FIFO queues favour ordering and deduplication.

## Key points
- Standard: very high throughput, at-least-once, best-effort ordering.
- FIFO: ordering per message group, deduplication within a window, lower throughput.

## CWD context
Default to standard with idempotent consumers; use FIFO only for per-entity ordering.
