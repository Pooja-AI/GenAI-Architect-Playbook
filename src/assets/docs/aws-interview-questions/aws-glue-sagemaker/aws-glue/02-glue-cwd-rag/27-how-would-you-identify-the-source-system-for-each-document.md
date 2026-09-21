# How would you identify the source system for each document?

## Short answer
Set the source system at ingestion and validate it at write time.

## Key points
- Derived from the connector or S3 prefix (for example raw/{source}/).
- Recorded in catalogue tags and the manifest.
- Used for filtering, governance and citations.

## CWD context
Reject records with no source identity.
