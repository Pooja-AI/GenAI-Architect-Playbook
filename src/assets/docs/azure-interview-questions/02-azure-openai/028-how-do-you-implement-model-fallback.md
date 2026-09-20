# How do you implement model fallback?

## Short answer
Implement fallback as an ordered chain from best quality to safest availability.

## Key points
- Primary deployment → secondary region deployment → smaller or alternate model → cached or degraded response.
- Use APIM backend pools with priority and circuit breaker, plus an application-level model router.
- Evaluate the fallback models so quality on fallback is known, not assumed.
- Log every fallback event and tell the user when the answer is degraded.

## CWD context
Prompts must be compatible across the models in the chain.
