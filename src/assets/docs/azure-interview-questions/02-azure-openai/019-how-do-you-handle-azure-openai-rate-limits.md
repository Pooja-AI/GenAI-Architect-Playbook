# How do you handle Azure OpenAI rate limits?

## Short answer
Azure OpenAI returns HTTP 429 with a Retry-After header when a deployment exceeds its TPM/RPM quota.

## Key points
- Honour Retry-After; use exponential backoff with jitter.
- Spread load across multiple deployments and regions using an APIM backend pool with circuit breaker.
- Use PTU for steady baseline load and Standard deployments for spillover.
- Apply per-tenant token limits at APIM and queue non-interactive work.
- Reduce tokens per request.

## CWD context
Throttling is a capacity-planning signal, not just an error to retry.
