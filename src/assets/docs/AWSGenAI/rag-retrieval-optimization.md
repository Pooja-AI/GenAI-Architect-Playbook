# RAG Retrieval Optimization

## Overview
Even with good chunking and embeddings, raw top-k similarity search often returns suboptimal results. Retrieval optimization techniques improve precision and recall beyond naive vector search.

## Query Transformation
- **Query rewriting**: use an LLM to rewrite a vague or conversational query into a more retrieval-friendly form before embedding it
- **Multi-query expansion**: generate several paraphrased versions of the query, retrieve for each, then merge/deduplicate results — improves recall for ambiguous phrasing
- **HyDE (Hypothetical Document Embeddings)**: have the LLM generate a hypothetical answer to the query first, then embed *that* hypothetical answer and search with it — often better matches the phrasing of real documents than the raw question does

## Reranking
Initial retrieval (vector or hybrid) is optimized for recall over a large candidate set (e.g., top 50). A cross-encoder reranker then scores each (query, chunk) pair jointly — far more accurate than independent embedding similarity — and reorders to produce the final top-k (e.g., top 5) sent to the LLM. Bedrock offers reranking via Cohere Rerank; this step consistently improves answer quality in production RAG systems.

## Metadata Filtering and Boosting
Combine semantic search with structured filters (date range, document type, department) to narrow the candidate pool before ranking, and boost recency or authoritative sources (e.g., official policy docs over old drafts).

## Parent-Child / Small-to-Big Retrieval
Embed and search on small, precise chunks (e.g., single sentences or paragraphs) for accuracy, but return the larger parent chunk or full section to the LLM for generation — this balances retrieval precision with generation context completeness.

## Iterative / Agentic Retrieval
For complex multi-hop questions, allow the system to retrieve, evaluate whether the retrieved context is sufficient, and issue follow-up retrieval queries if not — rather than a single fixed retrieval pass. This is often implemented as an agent loop with a "retrieve" tool.

## Deduplication
Overlapping chunks or near-duplicate documents can dominate the top-k with redundant content. Apply similarity-based deduplication (e.g., discard a chunk if its embedding is >0.95 cosine similar to one already selected) to maximize information diversity in the context window.

## Measuring Improvement
Track before/after metrics for each optimization:
- Recall@k and nDCG on a labeled eval set
- Downstream answer accuracy/groundedness (does the optimization actually improve final answers, not just retrieval metrics in isolation?)
- Added latency cost of each technique (reranking and multi-query expansion both add round trips)

## Practical Rollout Order
1. Start with hybrid search + basic top-k
2. Add reranking (highest ROI per unit effort in most systems)
3. Add query rewriting for conversational/chat interfaces
4. Add HyDE or multi-query expansion for domains with high query ambiguity
5. Add agentic iterative retrieval only for genuinely multi-hop use cases (it's the most expensive in latency)

## Summary
Retrieval optimization is where most of the incremental quality gains in mature RAG systems come from, since embedding models and vector databases have converged in quality. Reranking and query transformation typically deliver the best return relative to added complexity and latency.
