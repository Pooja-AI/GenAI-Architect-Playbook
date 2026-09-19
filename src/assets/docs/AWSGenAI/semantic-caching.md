# Semantic Caching

## Overview
Semantic caching stores previous query-response pairs (or retrieved context) indexed by embedding, so that a new query which is semantically similar to a past query — even if worded differently — can be served from cache instead of running the full retrieval-and-generation pipeline again.

## How It Differs From Traditional Caching
Traditional caching (e.g., a key-value cache keyed on exact string match) only helps with literally identical repeat queries. Semantic caching recognizes that "What's the refund policy?" and "How do I get my money back?" are asking the same thing, and can return the same cached answer for both.

## Architecture
1. On each new query, embed it using the same embedding model used for the knowledge base
2. Search a cache store (often a small, fast vector index — Redis with vector search, or a dedicated cache table) for prior queries above a similarity threshold (e.g., cosine similarity > 0.95)
3. On a hit, return the cached response (optionally with a "cached" indicator and confidence score)
4. On a miss, run the full RAG pipeline and store the new query/response pair in the cache

## Choosing a Similarity Threshold
This is the most important tuning parameter:
- **Too high (e.g., 0.99)**: cache rarely hits, minimal benefit
- **Too low (e.g., 0.85)**: risk of returning an answer to a subtly different, potentially incorrect question — a serious quality risk, especially for factual or numeric queries

Threshold should be validated with a labeled set of "should match" and "should not match" query pairs specific to your domain, not just a generic default.

## Cache Invalidation
Semantic caches must be invalidated when underlying knowledge changes — a cached answer summarizing a policy is wrong the moment that policy updates. Strategies:
- **TTL-based expiry** — simplest, appropriate for less time-sensitive content
- **Event-driven invalidation** — when a source document changes, invalidate cache entries linked to it via a document-ID tag
- **Version tagging** — tag cache entries with the underlying index/document version and treat all entries from a prior version as immediately stale

## What to Cache
- **Full response caching**: fastest for repeat queries but highest risk of staleness and lowest granularity
- **Retrieved-context caching**: cache the retrieval step only, still run generation fresh — a good middle ground that saves the more expensive retrieval/reranking latency while keeping generation adaptive to conversational context
- **Embedding caching**: cache the query embedding itself for identical repeated queries — minor optimization but essentially free

## Risks and Failure Modes
- Serving an outdated or subtly wrong answer due to an overly permissive similarity threshold
- Cache poisoning if a bad or hallucinated response gets cached and reused repeatedly
- Silent staleness if invalidation isn't wired up to the ingestion pipeline

## Monitoring
Track cache hit rate, average latency saved, and — critically — periodically sample cache hits for a human or automated evaluator to confirm the cached answer is still accurate for the new query, not just "close enough" by embedding distance.

## When Semantic Caching Pays Off Most
High-traffic, relatively stable knowledge domains (FAQs, product documentation, onboarding content) benefit enormously. Highly dynamic or personalized content (per-user data, real-time information) benefits far less and carries more staleness risk.

## Summary
Semantic caching is a powerful latency and cost optimization for RAG systems with repetitive query patterns, but it introduces a genuine accuracy risk that must be actively managed through careful threshold tuning and invalidation strategy — it is not a "free" optimization.
