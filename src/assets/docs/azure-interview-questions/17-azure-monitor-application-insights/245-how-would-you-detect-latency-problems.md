# How would you detect latency problems?

## Short answer
Detect latency problems by comparing percentiles with SLOs and drilling into the trace.

## Key points
- p95 and p99 per operation against baseline and release markers.
- Waterfall by dependency: LLM, search, MCP, Cosmos.
- Queue age, time-to-first-token, throttling and scale limits.
- SLO burn-rate alerts.

## CWD context
Averages hide the tail; alert on percentiles.
