# How would you optimize S3 costs?

## Short answer
Optimise S3 with lifecycle rules, storage classes and hygiene.

## Key points
- Transition to infrequent-access or archive classes; Intelligent-Tiering for unknown patterns.
- Expire non-current versions and incomplete multipart uploads.
- Parquet and compression; avoid huge numbers of tiny objects.
- Gateway endpoint to avoid NAT charges; Storage Lens for visibility.

## CWD context
Versioning without lifecycle rules quietly grows cost.
