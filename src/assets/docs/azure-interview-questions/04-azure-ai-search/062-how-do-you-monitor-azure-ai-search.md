# How do you monitor Azure AI Search?

## Short answer
Monitor AI Search with platform metrics, diagnostic logs and separate retrieval-quality metrics.

## Key points
- Metrics: search latency, queries per second, throttled query percentage, storage.
- Diagnostic logs to Log Analytics; indexer status and failures.
- Alerts on throttling and latency.
- Recall@k, precision@k and context precision tracked from evaluation.

## CWD context
Healthy infrastructure metrics do not prove good retrieval; track both.
