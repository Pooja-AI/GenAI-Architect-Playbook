# How does Lambda concurrency work?

## Short answer
Lambda concurrency is the number of invocations running at the same time.

## Key points
- Concurrency ≈ requests per second × average duration.
- Each concurrent request uses its own execution environment.
- The account has a regional concurrency quota (default about 1,000, raisable) and a scaling-rate limit.

## CWD context
Estimate concurrency for peak load before launch.
