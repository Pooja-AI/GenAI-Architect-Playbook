# Authorization in RAG Systems

Authorization determines *what* a given authenticated user is allowed to retrieve and see within a RAG system — a critical layer beyond simple authentication.

## Core Principle
Retrieval should respect the same permission model as the underlying source systems (e.g., if a user can't open a document in SharePoint, the RAG system shouldn't surface its content either).

## Implementation Patterns
- **Permission-aware indexing** — capture access control metadata (user groups, roles, document-level permissions) at ingestion time and attach it to each indexed chunk.
- **Query-time filtering** — apply the requesting user's permissions as a metadata filter during retrieval, ensuring restricted chunks are excluded before they ever reach the LLM.
- **Real-time permission checks** — for highly dynamic permission systems, query the source system's ACL at request time rather than relying solely on cached metadata, trading some latency for accuracy.
- **Group/role-based access** — map users to roles or groups and filter based on group membership rather than per-user rules, for scalability.

## Common Pitfall
Applying authorization only *after* generation (e.g., filtering the final answer) is insufficient — the LLM may already have incorporated unauthorized content into its response. Authorization must happen at or before retrieval.
