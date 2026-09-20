# How do you prevent duplicate processing?

## Short answer
Prevent duplicate processing by combining broker duplicate detection with idempotent consumers.

## Key points
- Service Bus is at-least-once; duplicates are possible.
- Enable duplicate detection on send by MessageId within a window.
- Consumer stores an idempotency key using a conditional write; settle after success.

## CWD context
Broker features reduce duplicates; only idempotency eliminates their effect.
