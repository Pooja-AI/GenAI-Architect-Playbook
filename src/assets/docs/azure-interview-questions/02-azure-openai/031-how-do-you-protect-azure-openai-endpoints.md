# How do you protect Azure OpenAI endpoints?

## Short answer
Protect Azure OpenAI by making it private, identity-only and observable.

## Key points
- Disable public network access and use a private endpoint.
- Use Entra ID with managed identity and RBAC (Cognitive Services OpenAI User); disable key-based auth.
- Front it with APIM for throttling and logging; apply content filters.
- Enable diagnostic logs; use Defender for Cloud; consider customer-managed keys.

## CWD context
Only the Coordinator and Workers' managed identities can call it.
