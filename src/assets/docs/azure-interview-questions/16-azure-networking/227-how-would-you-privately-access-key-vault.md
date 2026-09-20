# How would you privately access Key Vault?

## Short answer
Use a private endpoint for the vault and disable public access.

## Key points
- Private DNS zone for Key Vault, linked to the VNet.
- Callers use managed identity from inside the VNet.
- Allow trusted Azure services only where required.

## CWD context
Keep vault access limited to the specific subnets that need it.
