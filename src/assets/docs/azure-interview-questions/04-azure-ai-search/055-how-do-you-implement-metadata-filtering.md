# How do you implement metadata filtering?

## Short answer
Metadata filtering narrows retrieval to the right slice of data before ranking.

## Key points
- Filterable fields such as tenant_id, source_system, doc_type, department, language and date.
- OData $filter combined with keyword and vector queries.
- Filters give relevance (only relevant sources) and safety (tenant isolation).

## CWD context
Decide filterable fields at index design time; changing them requires re-indexing.
