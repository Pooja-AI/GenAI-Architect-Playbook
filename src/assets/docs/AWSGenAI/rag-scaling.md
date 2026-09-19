# RAG Scaling

## Overview
A RAG prototype handling a few hundred documents and low query volume behaves very differently than a production system indexing millions of documents and serving thousands of queries per second. Scaling RAG touches ingestion throughput, vector index performance, and generation-layer concurrency.

## Ingestion Scaling
- Parallelize chunking and embedding using batch jobs (AWS Batch, Glue, or Step Functions fan-out) rather than sequential processing
- Use embedding model batch APIs where available to reduce per-call overhead
- Decouple ingestion from serving with a queue (SQS) so bursts of new documents don't overwhelm downstream systems
- Track ingestion lag as a first-class metric — how stale can the index get before it matters for your use case?

## Vector Index Scaling
- Move from brute-force exact search to ANN indexes (HNSW/IVF) once past roughly 100K–1M vectors, trading a small recall loss for large latency gains
- Shard indices by tenant, time period, or document type to keep individual index segments performant
- Use read replicas for high query-per-second workloads; most managed vector stores support horizontal read scaling independent of write scaling
- Monitor index build/merge time — large HNSW indexes can take significant time to rebuild after bulk updates

## Query-Layer Scaling
- Cache repeated or similar queries (semantic caching) to avoid redundant vector search and LLM calls
- Apply connection pooling and keep-alive to the vector store to avoid connection-establishment overhead per request
- Use asynchronous, non-blocking retrieval calls in the application layer so retrieval and any pre-processing can happen concurrently where possible

## Generation-Layer Scaling
- Bedrock and most managed LLM APIs handle underlying model scaling, but you still need to manage your own request concurrency, retries, and throttling (see bedrock-retries-throttling.md)
- Consider smaller/faster models for high-volume, lower-complexity queries and reserve larger models for complex queries (a routing pattern)
- Use provisioned throughput for predictable high-volume workloads where on-demand rate limits would bottleneck you

## Cost at Scale
At scale, the dominant costs shift: input token cost (retrieved context repeated on every query) often exceeds output token cost, so trimming unnecessary context (via better retrieval precision, not just more chunks) directly reduces cost. Storage and compute for the vector index become a real line item once in the billions of vectors.

## Multi-Region Considerations
For global user bases, consider region-local vector indices to reduce latency, with a strategy for keeping regional copies in sync (e.g., asynchronous replication from a canonical ingestion pipeline in one region).

## Load Testing
Simulate realistic query patterns (not just uniform random queries — real traffic has hot topics and bursty patterns) to validate p50/p95/p99 latency under load before going to production. Include cold-cache scenarios since semantic caching benefits disappear under a fully novel query workload.

## Summary
RAG scaling is a multi-dimensional problem spanning ingestion pipelines, vector index architecture, and generation throughput. Most scaling issues surface first in the vector index (naive exact search or lack of sharding) and in uncontrolled context growth driving up both latency and cost.
