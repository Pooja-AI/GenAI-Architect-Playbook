# How would caching reduce Azure OpenAI cost?

## Short answer
Every cache hit avoids an Azure OpenAI call.

## Key points
- Embedding cache removes repeated embedding calls.
- Response and semantic caches skip generation for repeated questions.
- Savings ≈ hit rate × average cost per call.
- Guard against stale answers with TTL and versioning.

## CWD context
Report savings as a KPI.
