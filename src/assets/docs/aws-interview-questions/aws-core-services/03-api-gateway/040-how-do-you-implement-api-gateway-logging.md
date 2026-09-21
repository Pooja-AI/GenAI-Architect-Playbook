# How do you implement API Gateway logging?

## Short answer
Enable structured access logging and be careful with execution logs.

## Key points
- Access logs in JSON to CloudWatch Logs: request ID, status, latency, integration latency, identity.
- Execution logs at ERROR level in production, since data logging can leak sensitive content.
- X-Ray tracing; log retention; Logs Insights queries.

## CWD context
Return the request ID to clients so support can find the trace.
