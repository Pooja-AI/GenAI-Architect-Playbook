# How would you secure S3?

## Short answer
Secure S3 with layered controls.

## Key points
- Block Public Access, TLS-only and VPC-endpoint conditions in bucket policies.
- Least-privilege IAM, SSE-KMS, versioning and Object Lock for critical data.
- CloudTrail data events, Macie for sensitive data discovery, access points.

## CWD context
Assume misconfiguration is the main risk and automate detection.
