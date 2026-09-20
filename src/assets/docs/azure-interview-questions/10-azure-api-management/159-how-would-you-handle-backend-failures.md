# How would you handle backend failures?

## Short answer
Handle backend failures with retries, circuit breakers, timeouts and fallback responses.

## Key points
- retry policy on transient statuses; backend circuit breaker with trip duration.
- Backend pools for failover; explicit forward-request timeout.
- Friendly error responses in on-error; do not retry non-idempotent methods blindly.

## CWD context
Circuit breakers stop APIM from hammering a failing backend.
