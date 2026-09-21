# How do you authorize users?

## Short answer
Authorise coarsely at the gateway and finely in CWD.

## Key points
- Scopes and claims in the JWT; Lambda authoriser returns a cached policy and context.
- Customer-level and document-level entitlements are enforced in the backend and in OpenSearch filters.
- Amazon Verified Permissions (Cedar) is an option for central policy.

## CWD context
Forward the validated identity to the backend as request context.
