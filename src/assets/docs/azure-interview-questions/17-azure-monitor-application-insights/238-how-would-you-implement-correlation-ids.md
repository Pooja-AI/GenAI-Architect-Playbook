# How would you implement correlation IDs?

## Short answer
A correlation ID is one identifier carried through every log and message for a request.

## Key points
- Generated or accepted at APIM (or the trace ID from traceparent).
- Passed in headers, message properties and graph state; returned to the client for support.
- Stored on the run record and included in DLQ messages; query by operation ID in KQL.

## CWD context
Support engineers should be able to start from a user-supplied request ID.
