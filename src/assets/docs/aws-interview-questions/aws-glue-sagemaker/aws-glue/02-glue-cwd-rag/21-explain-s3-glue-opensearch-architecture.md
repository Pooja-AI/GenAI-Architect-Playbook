# Explain S3 → Glue → OpenSearch architecture.

## Short answer
The flow is S3 raw documents → Glue processing → embeddings → OpenSearch, orchestrated by Step Functions.

## Key points
- Glue parses and cleans documents (Textract for scans), chunks them and adds metadata and ACLs.
- Embeddings are generated with Bedrock in throttled batches.
- Chunks are bulk-written to OpenSearch Serverless; a manifest in DynamoDB records status.
- Curated chunks are also saved back to S3.

## CWD context
Every step is idempotent so reruns are safe.
