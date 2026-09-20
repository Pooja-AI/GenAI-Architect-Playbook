# How would you integrate Databricks with Azure AI Search?

## Short answer
Publish Databricks output to AI Search as chunk documents with deterministic IDs.

## Key points
- Databricks produces chunks, embeddings and metadata.
- Push with the Search SDK or REST in batches using managed identity, or land in ADLS and use an indexer.
- Use merge-or-upload, handle deletes and throttle batch size.
- Trigger from ADF and monitor failures and retries.

## CWD context
Record the embedding model version in each document.
