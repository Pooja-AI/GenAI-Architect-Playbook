# How do you monitor latency?

## Short answer
Monitor latency per stage, not just end to end, and track time-to-first-token as well as total time.

## Key points
- Application Insights dependency durations for each LLM, search and tool call.
- Percentiles (p50, p95, p99) rather than averages.
- Tokens per second, queue time and PTU utilisation as leading indicators.
- Alerts on p95 breaches and on sudden change after a release.

## CWD context
A latency drop or spike after a deployment usually points to a prompt or model change.
