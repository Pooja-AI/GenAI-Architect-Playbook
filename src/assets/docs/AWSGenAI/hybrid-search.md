# Hybrid Search

## Overview
Hybrid search combines traditional keyword-based search (typically BM25/TF-IDF) with vector-based semantic search, then fuses the two result sets into a single ranked list. This addresses weaknesses in each individual approach: keyword search excels at exact matches (product codes, names, acronyms) while vector search excels at conceptual/semantic matches even when wording differs.

## Why Pure Vector Search Isn't Enough
Vector search can fail on:
- Exact identifiers (SKU numbers, error codes, legal citations) — semantically "close" vectors may not include the exact literal match
- Rare or out-of-vocabulary terms poorly represented in the embedding model's training data
- Negation and precise numeric constraints ("under $50", "not applicable to EU customers") — embeddings often blur these nuances

Keyword search alone fails on:
- Paraphrased or conceptually similar but lexically different queries
- Synonyms and related concepts

## Fusion Techniques

### Reciprocal Rank Fusion (RRF)
Combine rankings from both search methods using the formula:
```
score(d) = Σ 1 / (k + rank_i(d))
```
where `rank_i(d)` is the document's rank in method i's result list, and k is a constant (commonly 60). RRF is simple, requires no score normalization, and works well in practice without extensive tuning.

### Weighted Score Combination
Normalize both score distributions (e.g., min-max scaling) and combine with a tunable weight: `final = α * vector_score + (1-α) * bm25_score`. Requires more calibration but allows fine control.

### Rerank-After-Fusion
Retrieve a larger candidate set (e.g., top 50) from each method, fuse, then apply a cross-encoder reranker on the top candidates to produce the final top-k — this typically gives the best precision at some added latency cost.

## Implementation on AWS
Amazon OpenSearch natively supports hybrid search: a single query can combine a `k-NN` clause with a standard `match` query, and OpenSearch's built-in normalization processor can fuse scores server-side, avoiding the need for a separate application-layer fusion step.

## When Hybrid Search Matters Most
- Technical documentation with product codes, API names, or version numbers
- Legal/compliance content with citations and exact clause references
- E-commerce search where SKUs and brand names must match exactly
- Any corpus with domain-specific jargon not well represented in general-purpose embedding training data

## Evaluation
Measure hybrid search improvements the same way as any retrieval system — Recall@k, MRR, nDCG — but build test sets that specifically include exact-match queries (to test keyword strength) and paraphrased queries (to test semantic strength), so you can see whether fusion actually improves both categories rather than just averaging out weaknesses.

## Common Pitfalls
- Fusing without normalizing scores, causing one method to dominate arbitrarily
- Only testing on semantic-heavy queries and concluding vector-only search is "good enough"
- Ignoring field-specific boosting (e.g., boosting exact matches in a "title" field higher than body text)

## Summary
Hybrid search is now considered a best practice, not an optional enhancement, for enterprise RAG. It closes the gap on the exact-match failure cases that pure vector search reliably misses, at a relatively low implementation cost when using an engine like OpenSearch that supports it natively.
