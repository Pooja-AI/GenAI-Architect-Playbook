# How would you encrypt application secrets?

## Short answer
Encrypt application secrets with Secrets Manager backed by KMS, and use envelope encryption for fields.

## Key points
- A customer-managed key per environment.
- Envelope encryption: generate a data key, encrypt the data, store the encrypted data key.
- Access controlled by IAM and key policy.

## CWD context
Separate keys per environment prevent cross-environment access.
