# Where would you use S3?

## Short answer
Use S3 as the document lake and general object store.

## Key points
- Raw and curated documents, extracted text and chunks.
- Model artifacts, evaluation datasets, Bedrock batch input and output, log archives.
- Event source that triggers ingestion.

## CWD context
S3 is the source of truth for documents; OpenSearch is a derived index.
