# How would you handle SageMaker endpoint failures?

## Short answer
Handle endpoint failures with redundancy, retries, circuit breakers and fallbacks.

## Key points
- At least two instances across AZs with automatic replacement.
- Backoff retries on 5xx and throttling; circuit breaker.
- Fallback to the previous version, a simpler model, a rule or a cached result; queue for asynchronous retries.
- Deployment guardrails with automatic rollback.

## CWD context
Log every fallback so silent quality loss is visible.
