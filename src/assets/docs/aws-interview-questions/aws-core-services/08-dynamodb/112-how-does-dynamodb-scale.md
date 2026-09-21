# How does DynamoDB scale?

## Short answer
DynamoDB scales horizontally by splitting partitions automatically.

## Key points
- On-demand mode absorbs spikes; provisioned mode uses auto scaling.
- Global tables replicate across regions.
- Practical scale depends on key distribution.

## CWD context
For known extreme spikes, pre-warm capacity or plan ahead.
