# S3 SSE-S3 vs SSE-KMS?

## Short answer
SSE-S3 is simple and free; SSE-KMS gives control and auditability.

## Key points
- SSE-S3: AWS-managed keys, no per-key control or audit trail.
- SSE-KMS: key policies, CloudTrail audit of key use, revocation and cross-account control; KMS request cost and quotas (reduced with Bucket Keys).

## CWD context
Use SSE-KMS for sensitive enterprise documents.
