# Why use Secrets Manager?

## Short answer
Secrets Manager is the central store with rotation, versioning and audit for credentials.

## Key points
- Fine-grained IAM, KMS encryption, cross-region replication.
- Managed rotation for supported databases and custom rotation through Lambda.
- Native integration with ECS and Lambda; CloudTrail audit.

## CWD context
Use it for enterprise-system credentials that need rotation.
