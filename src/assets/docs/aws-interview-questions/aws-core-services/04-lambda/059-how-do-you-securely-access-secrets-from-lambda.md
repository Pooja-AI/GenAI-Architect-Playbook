# How do you securely access secrets from Lambda?

## Short answer
Fetch secrets from Secrets Manager at runtime, with a scoped role and caching.

## Key points
- Execution role allows GetSecretValue on the specific secret and kms:Decrypt.
- Use the SDK with caching or the Parameters and Secrets Lambda Extension.
- Reach Secrets Manager through a VPC endpoint when the function is in a VPC.
- Never log secret values.

## CWD context
Cache at initialisation to reduce latency and cost.
