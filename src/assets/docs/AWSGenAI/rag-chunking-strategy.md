# RAG Chunking Strategy

## Overview
Chunking is the process of splitting large documents into smaller, retrievable units before embedding. Chunk size and boundaries directly determine retrieval quality: chunks that are too large dilute relevance signal and waste context tokens; chunks that are too small lose surrounding context and fragment ideas across multiple pieces.

## Common Chunking Strategies

### Fixed-Size Chunking
Split text every N tokens (e.g., 500) with a fixed overlap (e.g., 50 tokens) to preserve continuity across boundaries.
- **Pros**: simple, predictable, cheap to compute
- **Cons**: ignores semantic boundaries, may cut sentences or ideas in half

### Recursive Character/Token Splitting
Split first on larger structural units (paragraphs, then sentences, then words) recursively until chunks fit the target size.
- **Pros**: respects natural language structure better than naive fixed-size
- **Cons**: still not semantically aware

### Semantic Chunking
Use an embedding model to measure similarity between adjacent sentences; create a new chunk boundary when semantic similarity drops below a threshold (i.e., topic shifts).
- **Pros**: chunks align with actual topic boundaries, improving retrieval precision
- **Cons**: more compute-intensive; requires a similarity threshold tuning step

### Document-Structure-Aware Chunking
Use native structure — Markdown headers, HTML tags, PDF sections — as chunk boundaries. Especially effective for technical docs, contracts, and structured reports.
- **Pros**: preserves logical sections (e.g., a whole clause of a contract)
- **Cons**: requires structure-aware parsers; inconsistent for unstructured or scanned text

### Sliding Window with Overlap
Similar to fixed-size but with a deliberately generous overlap (20-30%) so that ideas spanning a boundary appear fully in at least one chunk.

## Choosing Chunk Size
Rules of thumb:
- **256–512 tokens**: good default for dense factual retrieval (FAQs, policy docs)
- **800–1200 tokens**: better for narrative or contextual content where surrounding sentences matter
- **Table/structured data**: chunk by logical row groups or keep tables intact as a single chunk with a text summary

Always validate empirically with retrieval evaluation (see rag-evaluation.md) rather than picking a size purely by intuition.

## Metadata Enrichment
Every chunk should carry:
- Source document ID and title
- Section/page number
- Last-updated timestamp
- Access control metadata (department, classification level)
- A short auto-generated summary (helps hybrid keyword search and reranking)

## Overlap Trade-offs
More overlap improves recall (less chance of splitting a key fact) but increases storage and embedding cost, and can cause duplicate content to be retrieved, wasting context tokens. 10–20% overlap is a common sweet spot.

## Handling Special Content
- **Tables**: convert to Markdown or a flattened key-value text representation before chunking; raw table extraction often embeds poorly
- **Code**: chunk by function/class boundaries, not arbitrary line counts
- **Long-form legal/contract text**: chunk by clause/section number to preserve legal meaning

## Anti-Patterns
- Chunking after embedding (must chunk first)
- Ignoring document structure entirely for structured content
- Using the same chunk size for every content type in a heterogeneous corpus
- Not re-chunking when the underlying document changes materially

## Summary
Chunking strategy is one of the highest-leverage decisions in a RAG system — often more impactful than model choice. Start with recursive, structure-aware chunking with modest overlap, then iterate using retrieval evaluation metrics on real queries.
