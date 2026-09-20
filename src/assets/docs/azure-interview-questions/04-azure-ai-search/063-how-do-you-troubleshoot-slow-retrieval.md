# How do you troubleshoot slow retrieval?

## Short answer
Troubleshoot slow retrieval by splitting the time into stages.

## Key points
- Query embedding, search execution, semantic reranking and network.
- Check throttling percentage, replica count, index size, filter selectivity and top-k.
- Compare with and without semantic ranking; test in Search Explorer.
- Check region distance and client-side overhead.

## CWD context
Use a trace ID to see the retrieval span inside the full request.
