# How do you monitor queue depth?

## Short answer
Monitor queue depth and age, not just message counts.

## Key points
- Metrics: active, dead-lettered and scheduled messages; throttled requests; server errors.
- Alert on rising backlog, old messages and any DLQ messages.
- KEDA scales consumers on queue length; dashboards show trends.

## CWD context
Oldest-message age is a better SLO signal than depth alone.
