# How does a user authenticate?

## Short answer
Users authenticate with OIDC authorisation code flow plus PKCE through MSAL.

## Key points
- Entra performs MFA and Conditional Access checks.
- The client receives an access token whose audience is the CWD API.
- The token is sent as a Bearer token to APIM.

## CWD context
Never build custom login; use the standard flow.
