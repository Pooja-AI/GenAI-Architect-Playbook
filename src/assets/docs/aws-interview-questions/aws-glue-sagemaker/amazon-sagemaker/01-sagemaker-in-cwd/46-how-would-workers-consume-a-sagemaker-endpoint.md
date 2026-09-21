# How would Workers consume a SageMaker endpoint?

## Short answer
Workers invoke the endpoint through the SageMaker runtime over a private endpoint with their task role.

## Key points
- sagemaker:InvokeEndpoint scoped to that endpoint's ARN; interface VPC endpoint for the runtime.
- Typed payload, timeout, backoff retries and a circuit breaker; validate the response.
- Optionally wrap it in an MCP tool.

## CWD context
Pass the correlation ID so calls appear in traces.
