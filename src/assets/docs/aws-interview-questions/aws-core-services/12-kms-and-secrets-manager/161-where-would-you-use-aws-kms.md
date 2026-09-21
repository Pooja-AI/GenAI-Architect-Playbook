# Where would you use AWS KMS?

## Short answer
Use KMS wherever data at rest or secrets need controlled, auditable encryption.

## Key points
- S3, DynamoDB, SQS, OpenSearch, CloudWatch Logs, Secrets Manager, ECR, SageMaker volumes and artifacts.
- Envelope encryption for application-level fields; asymmetric keys for signing.

## CWD context
One key per data classification keeps access decisions clear.
