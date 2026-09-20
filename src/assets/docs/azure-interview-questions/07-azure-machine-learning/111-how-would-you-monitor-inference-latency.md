# How would you monitor inference latency?

## Short answer
Monitor inference latency at the endpoint and inside the scoring code.

## Key points
- Endpoint metrics: latency, request count, errors, CPU and memory.
- Application Insights logs for model time versus network time.
- Alerts on p95 latency; correlation IDs across the stack.

## CWD context
Rising queueing time usually means under-provisioned instances.
