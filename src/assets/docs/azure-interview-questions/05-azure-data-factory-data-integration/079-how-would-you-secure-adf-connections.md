# How would you secure ADF connections?

## Short answer
Secure ADF with private connectivity, managed identities and Key Vault.

## Key points
- Managed VNet integration runtime and managed private endpoints; public access disabled.
- Secrets in Key Vault; managed identity to Azure targets.
- Self-hosted integration runtime with outbound-only connections for on-premises sources.
- Least-privilege RBAC and source accounts; audit logs.

## CWD context
Source-system service accounts get read-only scopes.
