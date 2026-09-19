# Enterprise RAG Architecture

## Overview
An enterprise-grade RAG system is far more than "embed documents, search, generate." It must handle multi-tenant security, high query volume, diverse document types, compliance auditing, and observability — all while staying cost-effective. This document lays out a reference architecture for production RAG on AWS.

## Reference Architecture Layers

### 1. Ingestion Layer
- **Sources**: S3 buckets, SharePoint, Confluence, databases, ticketing systems
- **Connectors**: AWS Glue jobs or custom Lambda crawlers pull documents on a schedule or via event triggers (S3 event notifications)
- **Preprocessing**: text extraction (Textract for scanned PDFs), normalization, PII redaction (Comprehend) before chunking

### 2. Chunking & Embedding Layer
- Documents are split using a chunking strategy suited to content type (see rag-chunking-strategy.md)
- Chunks are embedded via Bedrock (Titan Embeddings, Cohere Embed) or SageMaker-hosted models
- Metadata (source, ACLs, timestamp, department) is attached to every chunk

### 3. Vector Storage Layer
- Amazon OpenSearch Serverless, Aurora pgvector, or Bedrock Knowledge Bases (which manages the vector store internally)
- Metadata filters enable security trimming and multi-tenant isolation at query time

### 4. Retrieval & Orchestration Layer
- API Gateway + Lambda (or ECS/EKS for heavier workloads) receives user queries
- Applies query rewriting, hybrid search (vector + keyword), and reranking
- Enforces per-user/per-tenant filters before returning chunks

### 5. Generation Layer
- Bedrock invokes the chosen foundation model with the augmented prompt
- Guardrails apply content filtering, PII masking, and topic restrictions
- Streaming response returned to the client

### 6. Observability & Feedback Layer
- CloudWatch + X-Ray trace each request end-to-end
- Retrieval quality and hallucination metrics logged for evaluation pipelines
- User feedback (thumbs up/down) fed back into golden datasets

## Data Flow Diagram (textual)
```
S3/SharePoint → Glue/Lambda ETL → Chunker → Embedding Model → Vector DB
                                                                  ↑
User Query → API GW → Lambda (query rewrite) → Hybrid Search ────┘
                                                     ↓
                                        Reranker → Prompt Builder
                                                     ↓
                                        Bedrock LLM → Guardrails → Response
```

## Multi-Tenancy Patterns
Three common isolation strategies:
1. **Metadata filtering** — single index, tenant_id field filtered at query time (cheapest, needs careful enforcement)
2. **Namespace/collection per tenant** — logical separation within the same vector DB
3. **Physically separate indices** — strongest isolation, highest cost, used for regulated industries

## Scaling Considerations
- Vector search latency grows with index size; use approximate nearest neighbor (ANN) indexes (HNSW) and shard by tenant or time
- Cache frequent queries (semantic caching) to reduce redundant LLM calls
- Decouple ingestion from serving so a heavy re-indexing job never impacts query latency

## Security Checklist
- Encrypt data at rest (KMS) and in transit (TLS)
- Enforce IAM least-privilege on Lambda execution roles
- Apply row/document-level ACL filters before, not after, retrieval
- Log every retrieval for audit trails (who saw what document)

## Cost Drivers
- Embedding generation (one-time + incremental re-embedding)
- Vector storage (OpenSearch nodes or serverless OCU-hours)
- LLM inference tokens (input context dominates cost in RAG, since retrieved chunks are appended to every prompt)

## Summary
Enterprise RAG architecture is a data engineering problem as much as an AI problem. Getting ingestion, security trimming, and observability right is usually a bigger driver of production success than model selection.
