# How would you implement metadata filtering?

## Short answer
Metadata filtering narrows retrieval to the right slice before ranking.

## Key points
- Keyword fields such as tenant_id, source, doc_type, department, dates and ACL principals.
- Apply filters inside the k-NN query so filtering happens during the search, not after.
- Decide filterable fields at design time.

## CWD context
Filters give both relevance and tenant isolation.
