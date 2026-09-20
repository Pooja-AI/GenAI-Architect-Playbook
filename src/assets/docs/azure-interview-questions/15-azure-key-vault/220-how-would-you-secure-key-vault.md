# How would you secure Key Vault?

## Short answer
Secure Key Vault with network, identity and recovery controls.

## Key points
- Private endpoint and disabled public access.
- RBAC authorisation; soft delete and purge protection.
- Separate vaults per environment; Defender for Key Vault; diagnostics.
- HSM-backed keys where required.

## CWD context
Treat vault deletion as a major-incident risk and protect it.
