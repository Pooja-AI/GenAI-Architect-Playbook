# Choosing Chunk Size

Chunk size is one of the most impactful tuning parameters in a RAG system.

## Small Chunks (e.g., 100–256 tokens)
- Pros: precise retrieval, less irrelevant text per chunk.
- Cons: may lose surrounding context, can fragment ideas across multiple chunks.

## Large Chunks (e.g., 512–1024+ tokens)
- Pros: preserves more context, fewer chunks needed.
- Cons: less precise matching, more noise in retrieved results, higher token cost.

## General Guidance
- Start around 300–500 tokens for general text as a baseline.
- Use smaller chunks for dense, fact-heavy content (FAQs, glossaries).
- Use larger chunks for narrative or procedural content where context matters.
- Always test empirically with your own evaluation set — optimal size varies by domain and embedding model.

## Related
Chunk size is often paired with **chunk overlap** to avoid cutting sentences or ideas at boundaries.
