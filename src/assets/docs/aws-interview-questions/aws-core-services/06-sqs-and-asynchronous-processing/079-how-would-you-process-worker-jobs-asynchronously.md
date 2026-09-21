# How would you process Worker jobs asynchronously?

## Short answer
Process Worker jobs asynchronously with a job message, a result store and a completion signal.

## Key points
- Delegator sends a message with correlation ID, idempotency key, tenant and a payload pointer; the API returns 202 and a job ID.
- Worker long-polls, runs the task through MCP, stores the result and signals completion.
- The LangGraph run resumes from its checkpoint; failures go to the DLQ.

## CWD context
Put large payloads in S3 and send the reference.
