# How would you encrypt S3 data?

## Short answer
Encrypt S3 data at rest with SSE-KMS using customer-managed keys, and in transit with TLS.

## Key points
- Default bucket encryption; Bucket Keys reduce KMS request cost.
- Key policies limit who can decrypt; separate keys per data classification.
- Enforce encryption through bucket policy.

## CWD context
Encryption is the default; access control is the real protection.
