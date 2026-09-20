# How would you asynchronously execute Workers?

## Short answer
Execute Workers asynchronously by sending job messages and resuming the workflow on completion.

## Key points
- The Delegator enqueues a job with correlation ID, idempotency key, tenant and a payload reference; the API returns 202.
- The Worker consumes, calls the MCP tool and stores the result.
- Completion is signalled through a reply queue or event; the LangGraph run resumes from its checkpoint.
- Timeouts and a DLQ cover failures.

## CWD context
Store large payloads in storage and send references, not bulk data.
