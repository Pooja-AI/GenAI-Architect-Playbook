# Vector Database Selection

## Overview
A vector database stores embeddings and supports fast similarity search (nearest neighbor search) at scale. Choosing the right one affects latency, cost, operational overhead, and how easily you can implement filtering, multi-tenancy, and hybrid search.

## Options on AWS

### Amazon OpenSearch Service / Serverless
- Full-text + vector (k-NN) search in one engine — ideal for hybrid search
- Serverless option removes cluster management burden
- Mature filtering, aggregation, and access-control features
- Best for teams already using OpenSearch/Elasticsearch or needing hybrid search out of the box

### Amazon Aurora PostgreSQL with pgvector
- Adds vector search to a familiar relational database
- Great when you need transactional consistency between vectors and relational metadata (e.g., orders, users) in the same query
- HNSW and IVFFlat indexing supported; performance is solid at moderate scale but can lag purpose-built vector engines at very large scale

### Amazon Bedrock Knowledge Bases
- Fully managed RAG layer: handles chunking, embedding, storage (using OpenSearch Serverless or Aurora under the hood), and retrieval APIs
- Fastest path to production; less flexibility for custom chunking/reranking logic
- Best for teams that want to minimize infrastructure ownership

### Third-Party / Self-Managed (Pinecone, Weaviate, Milvus, Qdrant)
- Deployable on EC2/EKS or consumed as SaaS
- Often has the most advanced ANN algorithms and best raw query latency at scale
- Adds operational or vendor-management overhead

## Selection Criteria

| Criterion | Consideration |
|---|---|
| Scale | Millions vs billions of vectors changes index type (HNSW vs IVF/PQ) |
| Latency SLA | Sub-100ms requirements favor purpose-built engines with tuned ANN |
| Hybrid search need | OpenSearch natively supports BM25 + vector fusion |
| Metadata filtering | Must support pre-filtering (not post-filtering) for security trimming |
| Operational maturity | Serverless/managed options reduce SRE burden |
| Cost model | Per-node vs per-query vs storage-based pricing varies widely |
| Data residency | Self-hosted may be required for strict compliance |

## Index Types
- **HNSW (Hierarchical Navigable Small World)** — fast, high recall, higher memory usage; good default for most workloads
- **IVF (Inverted File Index)** — clusters vectors, faster to build, slightly lower recall, better for very large datasets
- **Product Quantization (PQ)** — compresses vectors to save memory at some accuracy cost, often combined with IVF

## Filtering Strategy
Pre-filtering (apply metadata filters before the ANN search) is essential for correct security trimming and multi-tenant isolation — post-filtering (search first, then discard results) can leak the *existence* of documents through result-count side channels and wastes compute.

## Migration and Portability
Avoid heavy lock-in by keeping raw documents and chunk metadata in S3 as the source of truth, treating the vector store as a derived, rebuildable index. This makes it far easier to switch vector databases or re-embed with a new model.

## Summary
There is no universally "best" vector database — the right choice depends on scale, latency needs, filtering requirements, and how much operational ownership your team wants. Bedrock Knowledge Bases and OpenSearch Serverless cover the majority of enterprise AWS use cases with the least operational burden.
