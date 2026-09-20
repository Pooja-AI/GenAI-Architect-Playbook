# Why use Managed Identity instead of credentials?

## Short answer
Managed identity removes stored secrets and their lifecycle risk.

## Key points
- No credentials to store, rotate or leak.
- Short-lived tokens managed by the platform.
- Scoped by RBAC and auditable.

## CWD context
Use managed identity for Azure-to-Azure and Key Vault for external systems only.
