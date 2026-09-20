# How do you implement observability in CWD?

## Short answer
Observability in CWD means being able to explain any request end to end using logs, metrics and traces, plus GenAI-specific signals.

## Key points
- OpenTelemetry (Azure Monitor distro) across API, Coordinator, Delegators, Workers and MCP servers, into Application Insights and Log Analytics.
- Correlation IDs; token, model, prompt-version and retrieval telemetry.
- Workbooks or Grafana dashboards, alerts and sampled quality evaluation.

## CWD context
Uptime is not enough; quality and cost must be observable too.
