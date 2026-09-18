# Reranking

Reranking is a second-stage retrieval step that reorders an initial set of candidate chunks using a more accurate (but more expensive) relevance model, improving the precision of the final top-k results sent to the LLM.

## Why Rerank?
Initial retrieval (vector or hybrid search) is optimized for speed across large indexes and uses relatively simple similarity metrics. A reranker — typically a **cross-encoder** model that jointly processes the query and each candidate together — can capture more nuanced relevance signals, at the cost of being too slow to run over the entire index.

## Typical Pipeline
1. Retrieve a broad candidate set (e.g., top 50–100) using fast vector/hybrid search.
2. Score each candidate with a cross-encoder reranker.
3. Keep only the top-k (e.g., top 5) highest-scoring candidates for the final prompt.

## Trade-offs
- Adds latency (rerankers are more compute-intensive per document).
- Significantly improves precision, especially when the initial retrieval is noisy.
- Common reranker choices include Cohere Rerank, BGE-reranker, and cross-encoder models from sentence-transformers.
