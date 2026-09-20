# How would you perform zero-downtime deployment?

## Short answer
Achieve zero downtime with revisions and health-gated traffic shifting.

## Key points
- Multiple-revision mode: deploy new revision, pass health checks, shift traffic gradually.
- Keep the old revision for instant rollback.
- Backward-compatible schema changes (expand, then contract).
- In-flight workflows resume from checkpoints.

## CWD context
Blue-green or canary via revision traffic weights.
