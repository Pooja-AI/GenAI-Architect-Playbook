# How would Lambda retrieve secrets?

## Short answer
Lambda retrieves secrets at initialisation with a scoped role and caching.

## Key points
- GetSecretValue via the SDK or the Parameters and Secrets extension.
- Refresh the cache on authentication failure to pick up rotation.
- VPC endpoint if in a VPC; never log values.

## CWD context
The role should allow only that function's secrets.
