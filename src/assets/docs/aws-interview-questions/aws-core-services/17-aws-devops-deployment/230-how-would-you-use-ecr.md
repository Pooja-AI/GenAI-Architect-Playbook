# How would you use ECR?

## Short answer
ECR is the private registry that stores and secures CWD's container images.

## Key points
- One repository per component; scanning (basic or enhanced with Inspector).
- Immutable tags such as commit SHA; lifecycle policies to expire old images.
- Cross-region and cross-account replication; pulls through IAM and VPC endpoints.

## CWD context
Never deploy a mutable tag such as latest.
