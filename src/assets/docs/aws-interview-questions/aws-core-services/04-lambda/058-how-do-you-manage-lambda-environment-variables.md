# How do you manage Lambda environment variables?

## Short answer
Use environment variables for non-secret configuration, managed per environment through IaC.

## Key points
- Encrypted at rest with KMS; size-limited.
- Dynamic or feature-flag configuration belongs in AppConfig or Parameter Store.
- Do not put secrets in plain environment variables.

## CWD context
Aliases and separate accounts keep environments apart.
