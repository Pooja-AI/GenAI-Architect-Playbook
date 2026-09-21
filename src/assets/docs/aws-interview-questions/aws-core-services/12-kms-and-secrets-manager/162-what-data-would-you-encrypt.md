# What data would you encrypt?

## Short answer
Encrypt everything at rest, and prioritise the data that is sensitive or hard to replace.

## Key points
- Documents in S3, tenant data in DynamoDB, queues and backups.
- Logs (they can contain sensitive text), secrets, model artifacts and evaluation datasets.
- Embeddings and the vector index can reveal source text, so treat them as sensitive.
- TLS in transit.

## CWD context
Encryption complements access control; it does not replace it.
