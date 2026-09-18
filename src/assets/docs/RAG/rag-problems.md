# Common Problems in RAG Systems

RAG looks simple in theory but has many failure points in practice.

## Retrieval Problems
- **Poor chunking** — chunks too large lose precision, too small lose context.
- **Embedding mismatch** — query and document embeddings don't align semantically.
- **Missing results** — relevant information split across multiple chunks or documents.

## Generation Problems
- **Hallucination despite context** — model ignores retrieved content and makes things up.
- **Context overload** — too many retrieved chunks dilute the signal and confuse the model.
- **Conflicting sources** — retrieved documents disagree with each other.

## System Problems
- **Latency** — retrieval, reranking, and generation all add up.
- **Cost** — embedding, storage, and reranking calls scale with data volume.
- **Stale indexes** — knowledge base not kept in sync with source documents.
- **Security** — unauthorized users retrieving documents they shouldn't access.

Addressing these problems typically requires better chunking strategies, hybrid search, reranking, evaluation pipelines, and careful prompt engineering.
