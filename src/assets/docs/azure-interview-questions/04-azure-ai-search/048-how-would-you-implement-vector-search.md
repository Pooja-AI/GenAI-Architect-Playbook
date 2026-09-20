# How would you implement vector search?

## Short answer
Vector search stores embeddings in a vector field and finds nearest neighbours to the query embedding.

## Key points
- Define a vector field whose dimension matches the embedding model and a vector profile (HNSW for approximate, exhaustive KNN for exact).
- Embed the query with the same model, either client-side or through an integrated vectorizer.
- Use scalar or binary quantisation to cut storage and cost.
- Tune HNSW parameters and top-k against recall and latency.

## CWD context
Use the same embedding model and version for documents and queries.
