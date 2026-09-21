# How do you perform zero-downtime deployment?

## Short answer
Achieve zero downtime with rolling or blue-green deployments and connection draining.

## Key points
- Rolling: minimum healthy 100 percent, maximum 200 percent; deployment circuit breaker with automatic rollback.
- Blue-green through CodeDeploy with a test listener and traffic shifting.
- Deregistration delay and SIGTERM handling; backward-compatible schema changes.

## CWD context
In-flight workflows resume from checkpoints.
