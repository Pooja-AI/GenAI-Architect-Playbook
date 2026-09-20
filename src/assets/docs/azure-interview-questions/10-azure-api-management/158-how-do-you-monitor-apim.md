# How do you monitor APIM?

## Short answer
Monitor APIM with gateway logs, metrics and Application Insights.

## Key points
- Requests, failures, overall latency versus backend latency, capacity.
- Diagnostic settings to Log Analytics; analytics dashboards.
- Token metrics per tenant and agent for Azure OpenAI calls.
- Alerts on 5xx, latency and capacity.

## CWD context
Compare gateway latency with backend latency to locate delay.
