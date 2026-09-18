# Low-Latency RAG

Some RAG applications (real-time chat, voice assistants, customer support) require tight latency budgets, often under 1–2 seconds end-to-end.

## Where Latency Comes From
1. Query embedding generation.
2. Vector/hybrid search.
3. Optional reranking.
4. Prompt construction.
5. LLM generation (often the largest contributor, especially for longer responses).

## Techniques to Reduce Latency
- **Parallelize** retrieval steps (e.g., run vector and keyword search concurrently) rather than sequentially.
- **Cache** embeddings for common queries and frequently retrieved chunks.
- **Tune ANN parameters** (e.g., lower `ef_search`) to trade a small amount of recall for faster search.
- **Skip reranking** for latency-critical paths, or use a lighter/faster reranker model.
- **Stream generation** so users see tokens as they're produced rather than waiting for the full response.
- **Use smaller/faster LLMs** for latency-sensitive use cases where response quality trade-offs are acceptable.
- **Pre-fetch or pre-compute** likely retrievals for predictable query patterns.

## Measuring Latency
Track p50/p95/p99 latency at each pipeline stage separately, not just end-to-end, to identify the actual bottleneck to optimize.
