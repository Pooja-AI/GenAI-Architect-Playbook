# Diagnosing High Cost in RAG

RAG systems accumulate cost across several stages — embedding, storage, retrieval infrastructure, reranking, and LLM generation — and identifying the biggest driver is the first step to reducing spend.

## Cost Breakdown to Investigate
- **Embedding generation** — cost per document at ingestion, and per query at search time.
- **Vector database storage/compute** — scales with corpus size, dimensionality, and query volume.
- **Reranking** — cross-encoder rerankers can be relatively expensive per call, especially over large candidate sets.
- **LLM generation** — usually the largest cost driver, scaling with both input context size (number/size of retrieved chunks) and output length.

## Common Cost Reduction Strategies
- **Reduce k** or context size sent to the LLM without hurting quality (test empirically).
- **Cache** embeddings and frequent query results.
- **Use smaller/cheaper embedding models** where domain performance allows.
- **Reduce embedding dimensionality** via quantization or Matryoshka embeddings if supported.
- **Batch ingestion** embedding calls rather than one-off requests.
- **Right-size the LLM** — use a smaller/cheaper model for simpler queries, reserving larger models for complex questions.
- **Reduce reranking scope** — rerank fewer candidates, or skip reranking for low-stakes queries.

Track cost per query over time as a monitoring metric (see `rag-monitoring.md`) to catch cost regressions early.
