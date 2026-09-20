# How would you privately access Azure AI Search?

## Short answer
Use a private endpoint for the search service and shared private links for indexer access to sources.

## Key points
- Private DNS zone for Azure AI Search; public access disabled.
- Indexers reach ADLS or Cosmos via managed shared private links.
- RBAC and managed identity for callers.

## CWD context
Apply the same pattern to every dependency.
