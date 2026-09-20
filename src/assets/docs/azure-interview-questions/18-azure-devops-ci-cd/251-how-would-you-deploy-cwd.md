# How would you deploy CWD?

## Short answer
Deploy CWD as infrastructure as code plus per-component container releases.

## Key points
- Bicep or Terraform provisions the infrastructure.
- Pipeline builds an image per component and updates Container Apps revisions per environment.
- APIM configuration as code; Functions deployed as packages.
- Config from App Configuration and Key Vault references; expand-and-contract migrations; smoke tests.

## CWD context
The same image is promoted; only configuration differs.
