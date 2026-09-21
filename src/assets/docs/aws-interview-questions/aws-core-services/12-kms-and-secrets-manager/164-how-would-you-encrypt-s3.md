# How would you encrypt S3?

## Short answer
Encrypt S3 with SSE-KMS using a customer-managed key as the bucket default.

## Key points
- Bucket Keys reduce KMS cost.
- Bucket policy denies unencrypted or wrongly encrypted uploads.
- Key policy allows only the ingestion and reader roles.

## CWD context
Enforce it in policy so a mistake cannot bypass it.
