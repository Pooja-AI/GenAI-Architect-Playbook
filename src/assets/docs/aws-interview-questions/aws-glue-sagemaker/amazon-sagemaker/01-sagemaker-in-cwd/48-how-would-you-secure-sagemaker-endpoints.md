# How would you secure SageMaker endpoints?

## Short answer
Secure endpoints with network isolation, least-privilege identity and encryption.

## Key points
- VPC-only deployment, interface endpoint with policy, no public access.
- IAM limited to InvokeEndpoint on specific endpoints; KMS for volumes, artifacts and outputs.
- Private ECR images; input validation; CloudTrail; no sensitive payloads in logs.

## CWD context
Only Worker roles may invoke.
