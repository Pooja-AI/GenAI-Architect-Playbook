# How do you monitor API Gateway?

## Short answer
Monitor API Gateway with its CloudWatch metrics and alarms.

## Key points
- Count, 4XX, 5XX, Latency and IntegrationLatency (the gap shows gateway overhead).
- Cache hit metrics; detailed per-method metrics.
- Alarms on 5XX rate, p95 latency and throttling.

## CWD context
Compare Latency with IntegrationLatency to locate delay.
