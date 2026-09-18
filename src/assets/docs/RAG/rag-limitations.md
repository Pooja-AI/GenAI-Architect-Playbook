# Limitations of RAG

While powerful, RAG is not a silver bullet.

- **Retrieval quality caps generation quality** — if the retriever misses the right chunk, the LLM can't answer correctly, no matter how good the model is.
- **No true reasoning over the full corpus** — RAG retrieves a small subset of documents; it can't reason across an entire large dataset the way a database query can (e.g., "count all customers who...").
- **Chunking loses structure** — tables, code, and multi-step procedures can be broken awkwardly across chunks.
- **Latency overhead** — retrieval and reranking add extra steps compared to a plain LLM call.
- **Still can hallucinate** — models may ignore retrieved context or blend it incorrectly with parametric knowledge.
- **Embedding drift** — as an embedding model is updated, old and new vectors may become incompatible, requiring re-indexing.
- **Context window limits** — only a limited number of retrieved chunks can fit in the prompt.

RAG works best for lookup-style, fact-grounded question answering — not for aggregate analytics, complex multi-hop reasoning, or tasks that require the entire corpus at once.
