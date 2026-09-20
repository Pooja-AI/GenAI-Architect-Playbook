# How does APIM authenticate requests?

## Short answer
Authenticate with the validate-jwt policy against Entra ID.

## Key points
- Checks signature, issuer, audience, expiry and required claims or roles.
- Machine clients use OAuth client credentials or managed identity; subscription keys alone are weak.
- APIM calls backends with its own managed identity and forwards user identity.

## CWD context
Reject at the gateway before any backend work is done.
