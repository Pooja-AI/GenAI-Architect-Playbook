# What Is Chunking?

Chunking is the process of splitting large documents into smaller, manageable pieces (chunks) before embedding and indexing them for retrieval.

## Why Chunk?
- Embedding models have input length limits.
- Smaller chunks produce more precise, focused embeddings.
- Retrieval returns only the relevant passage, not an entire document, keeping prompts concise.

## Basic Approaches
- **Fixed-size chunking** — split text every N tokens or characters.
- **Sentence/paragraph-based chunking** — split along natural language boundaries.
- **Recursive chunking** — try splitting on larger boundaries (sections) first, falling back to smaller ones (sentences) as needed.
- **Semantic chunking** — group text based on topical similarity rather than fixed size.

## Trade-offs
Chunking choices directly affect retrieval quality: too coarse and irrelevant text dilutes the match; too fine and important context gets lost. See `chunk-size.md` and `chunking-strategies.md` for deeper guidance.
