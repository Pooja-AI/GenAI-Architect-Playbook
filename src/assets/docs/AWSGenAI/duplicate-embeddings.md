# Duplicate Embeddings

## Overview
Duplicate or near-duplicate content in a RAG knowledge base — whether from genuinely duplicated source documents, overlapping chunk boundaries, or multiple versions of the same document — creates embedded chunks that are redundant, wasting storage and retrieval capacity, and potentially degrading generation quality by cluttering retrieved context with repetitive information.

## Sources of Duplication
- **Genuinely duplicate source documents**: the same document ingested multiple times, whether from multiple source systems containing copies or from re-ingestion bugs
- **Multiple versions of the same document**: different drafts or versions of a policy/document, where older versions should ideally be archived or superseded rather than persisting alongside the current version
- **Chunking overlap**: deliberate overlap between adjacent chunks (see rag-chunking-strategy.md) creates chunks that are partially duplicate content by design — necessary for context preservation but requiring awareness that some redundancy is intentional
- **Cross-document content reuse**: boilerplate content (standard disclaimers, common sections) repeated verbatim across many different documents

## Why Duplication Matters
- **Wasted retrieval slots**: if multiple near-duplicate chunks all rank highly for a given query, the top-k retrieved context may contain redundant information rather than diverse, complementary content, reducing the effective information density available to the generation step
- **Increased storage and embedding cost**: unnecessary duplicate embeddings consume storage and incurred embedding generation cost without adding retrieval value
- **Conflicting-version risk**: if duplicate content includes outdated versions alongside current ones, retrieval might surface stale information (see data-quality.md's consistency dimension)

## Detection Techniques

### Exact-Match Deduplication
Hash-based comparison (e.g., content hash) to identify byte-for-byte identical documents or chunks — fast and simple, but only catches true duplicates, not near-duplicates with minor variations.

### Near-Duplicate Detection via Embedding Similarity
Compare chunk embeddings pairwise (or via approximate nearest-neighbor search against the existing index) and flag pairs above a high similarity threshold (e.g., >0.95 cosine similarity) as likely near-duplicates warranting review or automatic consolidation.

### MinHash / Locality-Sensitive Hashing
For very large corpora where pairwise comparison is computationally prohibitive, MinHash-based techniques provide an efficient approximate method for identifying near-duplicate documents at scale, commonly used in large-scale deduplication pipelines (often implemented via distributed processing, see apache-spark.md).

## Remediation Strategies

### At Ingestion Time
Detect and skip re-ingesting exact duplicates before they reach the chunking/embedding stages, avoiding unnecessary downstream processing.

### Version Consolidation
For detected near-duplicates representing different versions of the same underlying document, implement logic to retain only the current/authoritative version in the active index, archiving or removing outdated versions rather than allowing both to persist and compete in retrieval.

### Retrieval-Time Deduplication
As a complementary safeguard even after ingestion-time deduplication, apply deduplication logic to the retrieved candidate set at query time (see rag-retrieval-optimization.md) — discarding highly similar chunks from the final context sent to the model, maximizing information diversity within the context budget.

## Balancing Deduplication with Legitimate Overlap
Be careful not to over-aggressively deduplicate legitimately overlapping chunks (e.g., the intentional overlap from chunking strategy) or genuinely similar-but-distinct content that happens to share substantial wording — tune similarity thresholds based on empirical evaluation rather than an arbitrarily chosen cutoff, validating that deduplication improves rather than harms actual retrieval quality metrics.

## Summary
Duplicate and near-duplicate content in a RAG knowledge base wastes retrieval capacity and storage cost, and risks surfacing outdated information — addressed through exact-match and near-duplicate detection techniques applied both at ingestion time and, as a complementary safeguard, at retrieval time, with careful threshold tuning to avoid over-aggressively removing legitimately overlapping or similar-but-distinct content.
