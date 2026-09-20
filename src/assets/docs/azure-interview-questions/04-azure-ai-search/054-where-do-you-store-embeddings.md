# Where do you store embeddings?

## Short answer
Store embeddings in the AI Search index as vector fields next to the chunk text and metadata.

## Key points
- Raw and curated documents stay in ADLS Gen2; the index is rebuildable from them.
- Store embedding model and version in metadata.
- Compression reduces storage cost.

## CWD context
The index is a derived store; ADLS is the source of truth.
