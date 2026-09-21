# How would you secure the CI/CD pipeline?

## Short answer
Secure the pipeline like production, because it can deploy anything.

## Key points
- Separate least-privilege roles for build and deploy; cross-account deploy roles with conditions.
- No long-lived keys: OIDC federation for external CI; KMS-encrypted artifacts.
- Image scanning and signing; dependency and secret scanning; branch protection and required reviews; approval for production.
- Isolated build networks; audit through CloudTrail.

## CWD context
A compromised pipeline is a compromised production.
