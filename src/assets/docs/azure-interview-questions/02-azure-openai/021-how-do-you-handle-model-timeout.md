# How do you handle model timeout?

## Short answer
Treat model timeouts as expected: set explicit timeouts, retry once, then degrade gracefully.

## Key points
- Set connect and read timeouts, plus a per-node timeout in LangGraph.
- Stream tokens so the user sees progress and time-to-first-token is measurable.
- Retry transient failures with backoff, then fall back to another deployment or smaller model.
- Return a partial or degraded answer with a clear message rather than hanging.

## CWD context
Monitor p95 latency and time-to-first-token separately.
