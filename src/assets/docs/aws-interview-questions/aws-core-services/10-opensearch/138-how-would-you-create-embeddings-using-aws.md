# How would you create embeddings using AWS?

## Short answer
Create embeddings with Bedrock embedding models, at ingestion and at query time.

## Key points
- Titan Text Embeddings (configurable dimensions) or Cohere Embed; call through the Bedrock runtime API.
- Batch calls and handle throttling with backoff; Knowledge Bases can do this automatically.
- A custom embedding model can be hosted on SageMaker.

## CWD context
Use the same model and version for documents and queries.
