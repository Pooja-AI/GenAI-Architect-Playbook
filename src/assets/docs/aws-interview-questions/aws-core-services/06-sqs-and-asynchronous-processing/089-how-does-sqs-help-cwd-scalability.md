# How does SQS help CWD scalability?

## Short answer
SQS helps scalability by decoupling and smoothing load.

## Key points
- Near-unlimited standard-queue throughput; multi-AZ durability.
- Consumers scale independently on backlog.
- Per-tenant queues or message groups protect fairness.

## CWD context
Producers are not blocked by slow consumers.
