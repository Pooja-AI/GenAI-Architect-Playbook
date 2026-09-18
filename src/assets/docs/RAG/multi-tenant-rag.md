# Multi-Tenant RAG

Multi-tenant RAG systems serve multiple distinct customers or organizations from a shared infrastructure while keeping each tenant's data strictly isolated.

## Isolation Strategies
- **Index-per-tenant** — each tenant gets a completely separate vector index. Strongest isolation, but higher infrastructure overhead at scale with many small tenants.
- **Shared index with tenant metadata filtering** — all tenants share one index, but every chunk is tagged with a tenant ID, and every query is filtered to that tenant's data. More efficient, but requires airtight filter enforcement to prevent data leakage.
- **Namespace-based isolation** — many vector databases support logical namespaces within a shared cluster, balancing isolation and operational simplicity.

## Key Risks
- **Data leakage** — a bug in filter logic could expose one tenant's data to another; this must be tested rigorously and enforced at the infrastructure level, not just the application level.
- **Noisy neighbors** — one tenant's heavy indexing or query load impacting others' latency on shared infrastructure.
- **Per-tenant customization** — different tenants may need different chunking strategies, embedding models, or access rules, complicating a fully shared pipeline.

## Recommendation
For regulated industries or high-security requirements, prefer stronger isolation (separate indexes or namespaces) even at higher infrastructure cost.
