# How would you monitor Azure OpenAI?

## Short answer
Monitor Azure OpenAI through platform metrics, gateway metrics and alerts.

## Key points
- Requests, prompt and generated tokens, latency, 429 count and PTU utilisation.
- APIM token metrics per tenant and agent; content-filter block counts.
- Alerts on throttling, latency and token spikes.

## CWD context
Rising 429s mean capacity planning is due.
