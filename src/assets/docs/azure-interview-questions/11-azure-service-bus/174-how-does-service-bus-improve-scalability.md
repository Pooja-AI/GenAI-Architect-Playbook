# How does Service Bus improve scalability?

## Short answer
Service Bus improves scalability by buffering load and letting consumers scale independently.

## Key points
- Absorbs spikes (load levelling) and applies natural backpressure.
- Competing consumers scale out with KEDA.
- Topics allow parallel processing paths.
- Sessions or per-tenant queues protect fairness.

## CWD context
Producers are never blocked by slow consumers.
