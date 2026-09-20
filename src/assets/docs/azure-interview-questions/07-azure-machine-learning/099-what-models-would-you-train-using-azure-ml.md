# What models would you train using Azure ML?

## Short answer
Train models for narrow tasks where a small model beats an LLM on cost, speed or consistency.

## Key points
- Intent or routing classifier and document / sensitivity classifier.
- Reranker or domain-tuned embeddings.
- Anomaly detection on telemetry.
- Ticket triage, propensity scoring and forecasting used by Workers.

## CWD context
Use only where evaluation shows a clear win over an LLM prompt.
