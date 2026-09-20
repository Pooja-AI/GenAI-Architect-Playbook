# Secrets vs certificates vs keys?

## Short answer
Secrets are opaque values, certificates are managed X.509 objects, and keys are cryptographic keys that never leave the vault.

## Key points
- Secrets: passwords, tokens, connection strings.
- Certificates: lifecycle and auto-renewal with CA integration.
- Keys: encrypt, sign and wrap operations, including customer-managed keys.

## CWD context
Use keys for encryption at rest, secrets for external credentials.
