# How do you implement resource-based policies?

## Short answer
Resource-based policies attach to the resource and name who may access it.

## Key points
- Examples: S3 buckets, SQS queues, KMS keys, Lambda functions, secrets, ECR.
- Enable cross-account access without role switching.
- Evaluated together with identity-based policies.

## CWD context
Use them to add a second lock on sensitive resources.
