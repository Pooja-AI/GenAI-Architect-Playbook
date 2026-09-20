# Managed online endpoint vs batch endpoint?

## Short answer
Online endpoints serve real-time requests; batch endpoints score large datasets asynchronously.

## Key points
- Online: always-on, low latency, per-request.
- Batch: runs on a cluster, pay only while running, outputs to storage.

## CWD context
Online for Worker calls during a conversation; batch for nightly scoring.
