# How would you store embeddings?

## Short answer
Store embeddings as a knn_vector field in the same document as the chunk text and metadata.

## Key points
- Dimension must match the model; keep the model name and version in metadata.
- Keep a source copy in S3 so the index is rebuildable.
- Lower dimensions or quantisation reduce memory cost.

## CWD context
The index is derived; S3 is the source of truth.
