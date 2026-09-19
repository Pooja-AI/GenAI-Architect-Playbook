# RAG Latency Optimization

## Overview
A RAG request typically involves multiple sequential steps — query embedding, vector search, optional reranking, prompt construction, and LLM generation — each adding latency. For interactive applications, total round-trip time is often the biggest UX constraint on RAG adoption.

## Where Latency Comes From
1. **Query embedding** — usually fast (tens of ms) but adds a network round trip
2. **Vector search** — scales with index size and ANN parameters; typically 10–100ms for well-tuned indexes
3. **Reranking** — cross-encoder reranking adds meaningful latency (can be 100ms+ for larger candidate sets)
4. **Prompt construction** — negligible compute but context size affects the next step
5. **LLM generation** — usually the dominant cost, especially for longer outputs; scales with both input context length (RAG context) and output length

## Optimization Techniques

### Streaming Responses
Stream tokens back to the user as they're generated rather than waiting for the full response — this doesn't reduce total generation time but dramatically improves perceived latency (time-to-first-token).

### Parallelize Independent Steps
If using multi-query expansion or querying multiple data sources, issue those retrieval calls concurrently rather than sequentially.

### Reduce Context Size
Send only the minimum necessary retrieved context — better retrieval precision (via reranking) means fewer, more relevant chunks, which reduces both LLM input processing time and cost.

### Semantic Caching
Cache full responses (or retrieved context) for semantically similar repeated queries, bypassing the entire pipeline for cache hits. See semantic-caching.md.

### Model Selection and Routing
Use a smaller, faster model for straightforward queries and reserve larger models for complex reasoning — a routing layer can classify query complexity cheaply before dispatching.

### Prompt Caching
Some LLM providers (including Bedrock) support prompt caching for repeated static prefixes (e.g., system instructions, or a stable knowledge base excerpt), avoiding reprocessing the same tokens on every call.

### Precompute When Possible
For predictable, high-frequency queries (e.g., FAQ-style questions), precompute and cache the full answer rather than running the pipeline live.

### Reduce Reranking Candidate Set
Tune the reranker's input candidate count (e.g., rerank top 20 instead of top 100) to balance quality gains against added latency.

## Measuring Latency
Break down and monitor each pipeline stage separately (via distributed tracing, e.g., AWS X-Ray) rather than only tracking end-to-end latency — this makes it possible to identify which stage to optimize rather than guessing.

## Latency Budgets
Set an explicit latency budget per stage based on your UX requirements, e.g.:
- Embedding: 50ms
- Retrieval: 100ms
- Reranking: 150ms
- Generation (to first token): 300ms
- Total target: under 1s to first token

## Trade-offs
Nearly every latency optimization trades off against some quality or cost dimension — smaller models are faster but less accurate; less context is faster but risks missing information; caching is fast but can serve stale answers. Latency optimization should be done in tandem with quality evaluation, not in isolation.

## Summary
Latency in RAG is a multi-stage problem best addressed with streaming, targeted caching, careful context sizing, and stage-level monitoring rather than a single silver-bullet fix.
