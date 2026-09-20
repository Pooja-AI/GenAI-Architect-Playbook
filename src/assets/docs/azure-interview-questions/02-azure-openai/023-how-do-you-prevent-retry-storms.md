# How do you prevent retry storms?

## Short answer
A retry storm happens when many clients retry at once and overload a service that is already struggling.

## Key points
- Add jitter so retries spread out.
- Use retry budgets that cap retries as a percentage of traffic.
- Use circuit breakers to fail fast while a backend recovers.
- Retry at one layer only; honour Retry-After; shed load with rate limits and queues.

## CWD context
APIM token-limit and circuit-breaker policies protect Azure OpenAI from CWD's own retries.
