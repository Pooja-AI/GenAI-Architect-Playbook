# How would you monitor API Gateway?

## Short answer
Monitor API Gateway with metrics, access logs and WAF metrics.

## Key points
- Count, 4XX, 5XX, Latency and IntegrationLatency; throttle counts.
- Access logs for per-route analysis; WAF blocked and allowed requests.
- Alarms on 5XX rate and p95 latency.

## CWD context
A gap between Latency and IntegrationLatency shows gateway overhead.
