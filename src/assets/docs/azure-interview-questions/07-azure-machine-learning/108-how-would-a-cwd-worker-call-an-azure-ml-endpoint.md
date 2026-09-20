# How would a CWD Worker call an Azure ML endpoint?

## Short answer
A Worker (or an MCP tool wrapping the model) calls the endpoint over the private network with an Entra token.

## Key points
- Managed identity with token-based endpoint auth instead of keys.
- Typed request and response schema, timeout, retry with backoff and a circuit breaker.
- Validate the response before using it; propagate the correlation ID.

## CWD context
Wrapping the endpoint in an MCP tool gives a uniform, governed interface.
