# How would you create correlation IDs?

## Short answer
A correlation ID is one identifier carried through every log and message for a request.

## Key points
- Generated or accepted at the edge, from the API Gateway request ID or a header.
- Propagated in headers, SQS message attributes, Step Functions input and LangGraph state.
- Included in every log line; returned to the client; stored on the run record.

## CWD context
Support should be able to start from a user-supplied request ID.
