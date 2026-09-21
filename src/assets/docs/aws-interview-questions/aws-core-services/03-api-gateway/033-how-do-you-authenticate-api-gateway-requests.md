# How do you authenticate API Gateway requests?

## Short answer
Authenticate with a JWT or Cognito authoriser against your identity provider.

## Key points
- HTTP API JWT authoriser or REST Cognito authoriser validate signature, issuer, audience and expiry.
- Lambda authoriser for custom logic; IAM (SigV4) for service-to-service; mutual TLS on custom domains.
- API keys identify clients for usage plans but are not authentication.

## CWD context
Federate enterprise identity (for example Entra ID or Okta) through OIDC.
