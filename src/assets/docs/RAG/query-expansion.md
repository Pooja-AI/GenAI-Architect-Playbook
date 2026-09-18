# Query Expansion

Query expansion improves retrieval by reformulating or augmenting the original user query before searching, helping capture relevant documents that use different terminology than the original question.

## Common Techniques
- **Synonym expansion** — add related terms to broaden matching.
- **LLM-based rewriting** — ask an LLM to rephrase or expand the query into a more search-friendly form (e.g., turning a vague question into a more explicit one).
- **Hypothetical Document Embeddings (HyDE)** — have the LLM generate a hypothetical answer to the query, then embed *that* answer and use it to search, since answer-like text often matches document text better than question-like text.
- **Query decomposition** — break a complex multi-part question into simpler sub-queries, retrieve for each, then combine results.

## Why It Helps
User queries are often short, ambiguous, or phrased very differently from how the answer appears in source documents. Expansion bridges that gap, improving recall without requiring changes to the underlying index.

## Trade-off
Expansion adds an extra LLM call (latency and cost) before retrieval even begins, so it's typically reserved for cases where baseline retrieval quality is insufficient.
