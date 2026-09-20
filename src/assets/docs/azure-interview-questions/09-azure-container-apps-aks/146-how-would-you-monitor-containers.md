# How would you monitor containers?

## Short answer
Monitor containers with platform metrics plus application telemetry.

## Key points
- Container Apps: replica count, CPU, memory, restarts, requests to Log Analytics.
- OpenTelemetry to Application Insights; Container Insights / Prometheus and Managed Grafana on AKS.
- Alerts on restarts, 5xx, reaching max replicas and queue backlog.

## CWD context
Alert when scale limits are hit, not only when things fail.
