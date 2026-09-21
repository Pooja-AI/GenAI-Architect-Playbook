# How would you implement vector search?

## Short answer
Implement vector search with a knn_vector field, HNSW and embeddings from Bedrock.

## Key points
- Vector search collection; index mapping with dimension matching the embedding model and a similarity space such as cosine.
- Embed chunks at ingestion, embed the query with the same model, and run a k-NN query.
- Tune k, ef_search and use filters; consider quantisation to cut memory.

## CWD context
Record the embedding model version in each document.
