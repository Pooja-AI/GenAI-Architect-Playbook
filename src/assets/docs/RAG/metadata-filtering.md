# Metadata Filtering

Metadata filtering combines vector similarity search with structured filters on attributes attached to each chunk — such as document type, date, author, category, or access permissions.

## Example
"Find the most relevant chunks about *refund policy*, but only from documents tagged `department: support` and `updated_after: 2025-01-01`."

## Why It Matters
- **Precision** — narrows results to only relevant subsets, improving retrieval quality.
- **Access control** — restricts results to documents the requesting user is permitted to see (see `security-trimming.md`).
- **Freshness** — filters out outdated documents.
- **Multi-tenancy** — isolates data by tenant/customer in shared indexes.

## Implementation Approaches
- **Pre-filtering** — apply the metadata filter first, then search only within the filtered subset (can be slower on large filtered sets with some ANN indexes).
- **Post-filtering** — run vector search first, then filter results (risks returning fewer than k results if many matches get filtered out).
- Modern vector databases increasingly support efficient **filtered ANN search** that integrates filtering directly into the index traversal.
