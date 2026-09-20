# Which Azure OpenAI models would you use?

## Short answer
Use a tiered set of models rather than one model for everything; check the current Azure OpenAI catalog for exact names.

## Key points
- Flagship model: planning, complex synthesis and hard reasoning.
- Mini / small model: intent classification, routing, extraction, summarisation, guardrail checks.
- Embedding model (text-embedding-3 family): RAG indexing and query embeddings.
- Optionally a reasoning (o-series) model for multi-step planning where quality justifies latency.

## CWD context
Model choice per task lives in config so it can change without code changes.
