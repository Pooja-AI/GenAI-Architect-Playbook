# Scalable RAG

Scaling a RAG system to millions of documents and high query volume introduces challenges beyond what a small prototype needs to handle.

## Indexing at Scale
- Use ANN indexes (e.g., HNSW, IVF) rather than brute-force search once the corpus grows beyond tens of thousands of vectors.
- Consider sharding the index across multiple nodes for very large corpora.
- Batch embedding generation during ingestion to maximize throughput.

## Query-Time Scaling
- Cache embeddings for frequent or repeated queries.
- Use approximate search parameters tuned for the latency/recall trade-off your application needs.
- Load-balance retrieval and generation requests across multiple service replicas.

## Infrastructure Choices
- Managed vector databases can simplify horizontal scaling compared to self-hosted solutions.
- Separate read and write paths so heavy ingestion jobs don't degrade query latency for users.

## Cost at Scale
- Storage and compute costs grow with corpus size and dimensionality — consider dimensionality reduction or quantization (e.g., product quantization) for very large indexes.
- Monitor reranking and LLM generation costs, which typically dominate total spend at high query volumes.
