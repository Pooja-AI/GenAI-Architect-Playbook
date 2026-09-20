# How would you secure the endpoint?

## Short answer
Secure the endpoint with network isolation, identity and least privilege.

## Key points
- Disable public network access; use private endpoints or managed VNet.
- Entra token auth rather than keys; RBAC on the workspace and endpoint.
- Managed identity for storage and Key Vault access; private registry.
- Validate inputs; avoid logging sensitive payloads.

## CWD context
Only Worker identities may invoke the endpoint.
