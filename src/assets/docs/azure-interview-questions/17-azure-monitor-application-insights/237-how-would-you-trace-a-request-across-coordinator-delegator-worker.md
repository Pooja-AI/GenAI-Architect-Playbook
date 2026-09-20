# How would you trace a request across Coordinator → Delegator → Worker?

## Short answer
Propagate W3C trace context through every hop so one trace spans the whole request.

## Key points
- Root span at APIM; traceparent forwarded over HTTP and in Service Bus message properties.
- Spans for Coordinator nodes, Delegator calls, Workers, MCP calls, LLM calls and search calls.
- Application Map and transaction search show the end-to-end picture; link spans across async hops.

## CWD context
Async hops are where traces most often break; test them.
