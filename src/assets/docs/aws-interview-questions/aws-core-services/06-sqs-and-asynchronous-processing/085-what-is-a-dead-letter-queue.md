# What is a Dead Letter Queue?

## Short answer
A dead-letter queue collects messages that repeatedly fail processing.

## Key points
- Configured through a redrive policy with maxReceiveCount.
- Set retention longer than the source queue; FIFO needs a FIFO DLQ.
- Alarm when visible messages exceed zero; investigate, then redrive.

## CWD context
A DLQ with no owner is hidden data loss.
