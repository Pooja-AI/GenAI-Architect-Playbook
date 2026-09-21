# How do you handle API Gateway timeout?

## Short answer
API Gateway integrations time out at roughly 29 seconds for REST APIs (limits can sometimes be raised) and about 30 seconds for HTTP APIs.

## Key points
- Design long agent runs asynchronously: return 202 with a job ID.
- Process through SQS or Step Functions; client polls a status endpoint or receives a push.
- Streaming options exist for token streaming; check current support.

## CWD context
Never let a long LLM workflow depend on a single synchronous API call.
