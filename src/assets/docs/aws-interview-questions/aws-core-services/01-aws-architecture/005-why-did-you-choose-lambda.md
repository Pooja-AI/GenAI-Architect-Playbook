# Why did you choose Lambda?

## Short answer
Lambda suits short, stateless, event-driven work with automatic scaling and pay-per-use pricing.

## Key points
- API authorisers, S3 event handlers, SQS consumers for light Workers, small tool endpoints, glue between services.
- Scales automatically from zero; minimal operations.
- Limited by a 15-minute maximum duration and statelessness.

## CWD context
Lambda is glue and small tasks; the long-running agent runtime is not on Lambda.
