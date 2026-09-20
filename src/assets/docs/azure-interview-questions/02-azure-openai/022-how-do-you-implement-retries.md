# How do you implement retries?

## Short answer
Retry only transient failures (429, 5xx, timeouts), never client errors or content-filter blocks.

## Key points
- Exponential backoff with jitter, honour Retry-After, cap attempts (3 to 5) and set an overall deadline.
- Use the SDK's built-in retries but avoid stacking retries at SDK, APIM and LangGraph at once.
- LLM calls are read-only, so retries are safe; tool calls with side effects need idempotency keys.

## CWD context
Decide which single layer owns retries and document it.
