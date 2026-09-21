# How do you secure cross-service communication?

## Short answer
Secure cross-service communication with identity, resource policies and private paths.

## Key points
- SigV4 IAM authentication between services; resource policies on queues, buckets and keys.
- VPC endpoints with endpoint policies; TLS.
- aws:SourceArn and SourceAccount conditions prevent confused-deputy problems.

## CWD context
Do not rely on network position alone.
