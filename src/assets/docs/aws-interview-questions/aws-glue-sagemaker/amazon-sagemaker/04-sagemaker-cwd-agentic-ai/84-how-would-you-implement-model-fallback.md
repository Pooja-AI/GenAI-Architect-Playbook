# How would you implement model fallback?

## Short answer
Implement model fallback as an ordered chain, monitored and evaluated.

## Key points
- Primary model → previous stable version or smaller model → rule, default or cached result → human escalation.
- A circuit breaker switches paths; multi-variant or separate endpoints.
- Evaluate the fallback quality and log every use.

## CWD context
Silent quality drops are worse than visible failures.
