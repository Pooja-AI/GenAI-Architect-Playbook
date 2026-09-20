# Why Azure AI Search for CWD?

## Short answer
Azure AI Search is a managed retrieval engine that combines keyword, vector and semantic ranking with security filters, so CWD does not have to build and run that stack itself.

## Key points
- BM25 full-text, vector search, hybrid fusion and a semantic reranker in one service.
- Filterable metadata for tenant, source and ACL security trimming.
- Integrated ingestion: indexers, skillsets and integrated vectorisation.
- Enterprise features: private endpoints, RBAC and managed identity, replicas and partitions for scale, an SLA.

## CWD context
Compared with self-managed OpenSearch you trade some low-level control for much less operational work.
