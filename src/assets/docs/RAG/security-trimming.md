# Security Trimming in RAG

Security trimming ensures that a RAG system only retrieves and surfaces documents the requesting user is authorized to access — critical for enterprise deployments with sensitive or access-controlled content.

## Why It's Necessary
Without security trimming, a RAG system could leak confidential information (e.g., HR records, legal documents, another team's private files) to users who shouldn't see them, simply because those documents scored high in similarity search.

## Implementation Approaches
- **Metadata-based ACL filtering** — attach access control metadata (user groups, roles, permissions) to each chunk, and filter retrieval results to only those the requesting user's identity is permitted to access (see `acl-filtering.md`).
- **Pre-query filtering** — apply permission filters before running vector search, so restricted content is never even considered.
- **Index-per-tenant isolation** — in multi-tenant systems, maintain separate indexes per tenant/customer to guarantee strict isolation.
- **Real-time permission checks** — query the source system's permission model (e.g., SharePoint, Google Drive ACLs) at query time for up-to-date access decisions, rather than relying solely on cached metadata.

## Key Principle
Security trimming should happen **before or during retrieval**, not just at the final answer stage — the LLM should never even see content the user isn't authorized to view.
