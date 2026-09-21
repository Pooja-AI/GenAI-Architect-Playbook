# How would you troubleshoot slow retrieval?

## Short answer
Troubleshoot slow retrieval by splitting the time into stages.

## Key points
- Query embedding (Bedrock), search execution, reranking and network.
- Check OCU saturation or throttling, index size, k and ef_search, filter selectivity and returned fields.
- Compare with and without filters and hybrid; use slow logs or the profile API.

## CWD context
Use the trace ID to see the retrieval span inside the full request.
