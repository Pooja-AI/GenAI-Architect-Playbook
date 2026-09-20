# How does CWD access Key Vault?

## Short answer
CWD accesses Key Vault with managed identity, RBAC and a private endpoint.

## Key points
- Key Vault Secrets User role on the specific vault.
- Key Vault references in Container Apps and Functions settings, or SDK with caching.
- Separate vaults per environment and sensitivity.

## CWD context
Grant read of secrets only, not management.
