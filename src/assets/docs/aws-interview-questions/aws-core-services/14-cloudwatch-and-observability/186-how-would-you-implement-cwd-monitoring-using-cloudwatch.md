# How would you implement CWD monitoring using CloudWatch?

## Short answer
Implement monitoring with structured logs, metrics, alarms, traces and dashboards in CloudWatch and X-Ray.

## Key points
- JSON logs in per-service log groups with retention; custom metrics through Embedded Metric Format.
- Alarms to SNS, Chatbot or on-call tools; dashboards per layer; Logs Insights queries.
- X-Ray or OpenTelemetry tracing with Application Signals; Container Insights and Lambda Insights.
- SLO-based alerting with composite alarms.

## CWD context
Monitor quality and cost as well as uptime.
