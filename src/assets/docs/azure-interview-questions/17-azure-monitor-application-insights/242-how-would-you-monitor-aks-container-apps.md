# How would you monitor AKS/Container Apps?

## Short answer
Monitor containers with platform metrics, logs and application telemetry.

## Key points
- Replica count, restarts, CPU, memory, requests and status codes.
- Console and system logs in Log Analytics; Container Insights, Prometheus and Managed Grafana on AKS.
- Alerts on restarts, out-of-memory kills, maximum replicas reached and 5xx.

## CWD context
Hitting the maximum replica count is an early warning of overload.
