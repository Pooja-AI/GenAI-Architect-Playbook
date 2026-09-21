# How would you design the CWD document ingestion pipeline?

## Short answer
The ingestion pipeline is event-driven: land, validate, extract, chunk, embed, index and record.

## Key points
- Sources land in a raw S3 prefix; an S3 event through EventBridge starts a Step Functions workflow.
- Extract text (Textract for scans and tables), chunk, add metadata and ACLs, embed with Bedrock, bulk upsert into OpenSearch.
- Record status in a DynamoDB manifest; failures go to a DLQ; Glue handles large batches.

## CWD context
Every step is idempotent so reruns are safe.
