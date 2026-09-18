# Diagnosing Poor Retrieval

When a RAG system fails to retrieve the right information, the root cause is usually one (or more) of the following.

## Chunking Issues
- Chunks too large (diluted relevance signal) or too small (lost context).
- Chunking that splits tables, code, or key facts awkwardly across boundaries.
- **Fix**: experiment with chunk size/overlap, use structure-aware or semantic chunking (see `chunking-strategies.md`).

## Embedding Mismatch
- Embedding model not well suited to the domain (e.g., generic model on highly technical/legal text).
- Query phrasing very different from document phrasing (vocabulary mismatch).
- **Fix**: try a domain-specific or higher-quality embedding model; add query expansion or contextual retrieval.

## Search Configuration
- k too small, missing relevant chunks; k too large, drowning signal in noise.
- Pure vector search missing exact-match terms (IDs, names).
- **Fix**: tune k, add hybrid search, add a reranker.

## Index/Data Issues
- Stale index — source documents updated but not re-indexed.
- Missing content — the knowledge base genuinely doesn't contain the answer.
- **Fix**: audit ingestion pipeline freshness; check for content gaps via zero-result query analysis.

Always verify with a manual inspection of retrieved chunks for a sample of failing queries before making changes — guessing at fixes without this diagnosis wastes effort.
