# How would you implement bucket policies?

## Short answer
Bucket policies are resource-based rules that define who may access a bucket and under which conditions.

## Key points
- Deny requests that are not over TLS; restrict to a VPC endpoint or organisation.
- Allow specific roles and prefixes; require encryption headers or a specific KMS key.
- Explicit deny overrides allow; validate with IAM Access Analyzer.

## CWD context
Keep policies in IaC and review them.
