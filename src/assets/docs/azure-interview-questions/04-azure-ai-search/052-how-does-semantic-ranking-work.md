# How does semantic ranking work?

## Short answer
Semantic ranking is a second-stage reranker that reads the query and top results and reorders them by meaning.

## Key points
- Takes roughly the top 50 results from BM25 or hybrid retrieval.
- Uses Microsoft deep-learning language models to produce a reranker score (0 to 4), plus captions and answers.
- Needs a semantic configuration naming title, content and keyword fields.
- Adds some latency; use the score to drop low-relevance chunks.

## CWD context
Feed the LLM the reranked, thresholded top chunks, not the raw top-k.
