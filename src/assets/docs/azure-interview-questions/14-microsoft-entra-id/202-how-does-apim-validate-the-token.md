# How does APIM validate the token?

## Short answer
APIM validates tokens with the validate-jwt policy.

## Key points
- Fetches signing keys from the Entra OpenID configuration.
- Verifies signature, issuer, audience, expiry and required claims or roles; returns 401 on failure.
- Optionally checks the tenant ID claim.
- Backends should still verify identity (zero trust).

## CWD context
Do not rely on network position alone.
