# Why use Managed Identity with Key Vault?

## Short answer
Managed identity solves the bootstrap problem: you need a credential to fetch credentials.

## Key points
- Passwordless authentication to the vault.
- Scoped by RBAC and fully audited.
- Nothing to rotate for the bootstrap step.

## CWD context
Any static password for reaching the vault would defeat the purpose.
