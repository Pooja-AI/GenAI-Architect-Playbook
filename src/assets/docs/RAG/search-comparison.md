# Search Approaches Compared

| Approach | How It Matches | Strengths | Weaknesses |
|---|---|---|---|
| **Keyword (BM25/lexical)** | Exact term overlap, term frequency | Precise on exact terms, IDs, names; fast, well-understood | Misses synonyms/paraphrasing |
| **Semantic (vector)** | Embedding similarity | Captures meaning, handles paraphrasing | Can miss exact matches, less interpretable |
| **Hybrid** | Combines both via fusion (e.g., RRF) | Best of both worlds | More complex to tune and operate |
| **Reranking (cross-encoder)** | Deep relevance scoring on retrieved candidates | Highest precision on top results | Higher latency, applied after initial retrieval |

## Choosing an Approach
- Start with **hybrid search** as a strong default for most RAG applications.
- Add a **reranker** on top of hybrid results when retrieval precision on the top few results is critical (e.g., when only 3–5 chunks fit in the prompt).
- Use pure keyword search only for narrow, exact-match use cases (e.g., searching by SKU or ID).
- Use pure semantic search when the corpus is conversational/natural language with little need for exact term matching.
