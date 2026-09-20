# How do you reduce Azure OpenAI cost?

## Short answer
Reduce cost by sending fewer, smaller and cheaper calls, and by choosing the right pricing model.

## Key points
- Model tiering and routing; prompt shrinking; cap output tokens.
- Exact and semantic caching, plus prompt caching for a stable prompt prefix.
- Batch deployments for offline work; PTU when load is steady and high.
- Avoid unnecessary LLM calls by using rules first; fewer but better retrieved chunks.
- Per-tenant budgets and cost-per-request dashboards.

## CWD context
Measure cost per request before optimising; the biggest lever is usually model routing.
