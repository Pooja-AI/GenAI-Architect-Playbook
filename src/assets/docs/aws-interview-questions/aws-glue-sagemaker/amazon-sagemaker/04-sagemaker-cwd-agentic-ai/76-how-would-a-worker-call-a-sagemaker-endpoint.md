# How would a Worker call a SageMaker endpoint?

## Short answer
A Worker calls the endpoint through a private runtime endpoint, or through an MCP tool that wraps it.

## Key points
- Task role with InvokeEndpoint on the specific endpoint; interface VPC endpoint.
- Typed schema, backoff retries, circuit breaker and correlation ID via custom attributes.
- Validate the response before using it.

## CWD context
An MCP wrapper gives a uniform, governed interface across tools.
