# How do you generate embeddings?

## Short answer
Generate embeddings with an Azure OpenAI embedding model, at ingestion and at query time, using the same model.

## Key points
- Integrated vectorisation (skillset embedding skill and index vectorizer) or a custom ingestion pipeline in Databricks / Functions.
- Batch calls and handle 429 with backoff.
- Record model and version per chunk; reduce dimensions where supported to save space.

## CWD context
Changing the embedding model means re-embedding everything, so plan a blue-green index.
