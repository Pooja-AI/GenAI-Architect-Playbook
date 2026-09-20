# How do you securely access Key Vault from Functions?

## Short answer
Access Key Vault from Functions with managed identity, not stored credentials.

## Key points
- Grant the Key Vault Secrets User role to the function's identity.
- Use Key Vault references in app settings or the SDK with DefaultAzureCredential.
- Private endpoint plus VNet integration; no secrets in code.

## CWD context
Version-less references pick up rotated secrets.
