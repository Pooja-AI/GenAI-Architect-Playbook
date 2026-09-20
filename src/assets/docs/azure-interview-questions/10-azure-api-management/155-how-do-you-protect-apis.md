# How do you protect APIs?

## Short answer
Protect APIs with layered controls.

## Key points
- WAF at Front Door or Application Gateway; validate-jwt; IP restrictions.
- Rate limits, quotas and request validation; restricted CORS.
- Private networking, TLS 1.2 or higher, backend mutual TLS.
- Secrets in Key Vault named values; Defender for APIs; logging and alerts.

## CWD context
Assume the internet-facing layer is under constant probing.
