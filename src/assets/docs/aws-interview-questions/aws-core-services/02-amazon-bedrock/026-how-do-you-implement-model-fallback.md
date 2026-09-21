# How do you implement model fallback?

## Short answer
Implement fallback as an ordered chain from best quality to safest availability.

## Key points
- Primary model → cross-region inference profile or other region → smaller or alternate provider model → cached or degraded response.
- The Converse API keeps calls uniform; a circuit breaker stops repeated failures.
- Evaluate fallback models so their quality is known; log every fallback.

## CWD context
Prompts must work across the models in the chain.
