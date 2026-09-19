# RAG Troubleshooting

## Overview
This is a practical diagnostic guide for common RAG failure symptoms, mapping observed problems to likely root causes and fixes.

## Symptom: Answers Are Confidently Wrong
**Likely causes:**
- Retrieval returned irrelevant chunks but the model answered anyway instead of admitting uncertainty
- No relevance threshold/fallback configured
**Fixes:** add explicit grounding instructions, implement a similarity-score threshold with an "I don't know" fallback, add groundedness scoring as a post-generation check.

## Symptom: Correct Document Exists But Isn't Retrieved
**Likely causes:**
- Chunking split the relevant fact away from the surrounding context that made it retrievable
- Query phrasing is lexically very different from the document's phrasing (pure vector search gap)
- Embedding model is poorly suited to the domain's vocabulary
**Fixes:** review and adjust chunking strategy, add hybrid search, try query rewriting/HyDE, evaluate a domain-specific embedding model.

## Symptom: Answers Mix Up Information From Multiple Sources
**Likely causes:**
- Too many chunks retrieved, diluting context and confusing attribution
- Missing clear delimiters between chunks in the prompt
- Conflicting versions of a document both present in the index
**Fixes:** reduce top-k with better precision (reranking), use clear structural delimiters and per-chunk source labels in the prompt, deduplicate/version-control the knowledge base to remove stale documents.

## Symptom: Latency Is Too High
**Likely causes:**
- Vector index not using ANN (still doing brute-force search)
- Sequential retrieval calls that could be parallelized
- Excessive context size increasing LLM processing time
**Fixes:** see rag-latency-optimization.md — enable ANN indexing, parallelize independent retrieval calls, tighten context via better precision, add semantic caching for repeat queries.

## Symptom: A User Sees Content They Shouldn't Have Access To
**Likely causes:**
- Missing or misconfigured security trimming filters
- Stale ACL metadata not synced with the identity provider
**Fixes:** audit filter enforcement in the retrieval query path (see rag-security-trimming.md), add automated access-control tests, implement periodic ACL metadata reconciliation.

## Symptom: Retrieval Quality Degraded Over Time
**Likely causes:**
- Knowledge base has grown and old chunking/index parameters no longer fit the corpus size or diversity
- New content types were added without adjusting the ingestion pipeline
- Embedding model was silently changed/updated without full re-embedding
**Fixes:** re-run retrieval evaluation regularly, treat embedding model version as pinned and explicit, re-chunk/re-index newly added content types appropriately.

## Symptom: The System Works in Testing But Fails on Real User Queries
**Likely causes:**
- Golden dataset doesn't reflect real query distribution (too clean, too narrow)
- Real users ask multi-part, ambiguous, or conversational questions the test set didn't cover
**Fixes:** mine real production query logs (with privacy safeguards) to expand and diversify the golden dataset, add conversational/multi-turn test cases.

## Symptom: Costs Are Higher Than Expected
**Likely causes:**
- Over-retrieval (too many/too-large chunks per query)
- No caching for repeated queries
- Using an oversized model for simple queries
**Fixes:** tighten retrieval precision, add semantic caching, implement model routing by query complexity.

## General Debugging Workflow
1. Reproduce the failure with a specific query
2. Inspect exactly what was retrieved (log raw chunks, not just the final answer)
3. Determine whether the failure is a retrieval problem (wrong/missing context) or a generation problem (right context, wrong answer)
4. Fix at the appropriate layer and add a regression test case to the golden dataset

## Summary
Most RAG failures trace back to either imprecise retrieval or insufficiently grounded generation. Systematic logging of retrieved context alongside generated answers is the single most valuable debugging tool for diagnosing which layer is at fault.
