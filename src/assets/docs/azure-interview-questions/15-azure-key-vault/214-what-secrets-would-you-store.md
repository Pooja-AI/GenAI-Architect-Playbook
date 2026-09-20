# What secrets would you store?

## Short answer
Store credentials for external systems and cryptographic material; prefer managed identity for Azure resources.

## Key points
- Salesforce, ServiceNow, Oracle and Snowflake credentials.
- Third-party API keys, webhook secrets, signing keys.
- Certificates for TLS or mutual TLS; customer-managed keys.

## CWD context
Non-secret configuration does not belong in Key Vault.
