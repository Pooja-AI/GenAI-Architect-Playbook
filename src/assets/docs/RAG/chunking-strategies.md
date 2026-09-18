# Chunking Strategies

Different content types benefit from different chunking approaches.

## Fixed-Size Chunking
Split every N tokens/characters, often with overlap. Simple and fast, but ignores document structure.

## Recursive Character Splitting
Try splitting on large separators first (e.g., `\n\n`), then smaller ones (sentences, words) only if a chunk is still too big. Preserves natural boundaries better than naive fixed-size splitting.

## Sentence/Paragraph-Based
Chunk along sentence or paragraph boundaries so each chunk is a coherent unit of thought.

## Semantic Chunking
Use embeddings to detect topic shifts and split where meaning changes, rather than at a fixed length.

## Structure-Aware Chunking
Respect document structure — headings, sections, tables, code blocks — so each chunk stays self-contained and coherent (e.g., never split a table row).

## Document-Specific Strategies
- **Markdown/HTML** — split by headers.
- **Code** — split by function/class boundaries.
- **Tables** — keep rows intact, optionally repeat header row in each chunk.
- **Transcripts** — split by speaker turn or time segment.

Choosing the right strategy is often more impactful on retrieval quality than the embedding model itself.
