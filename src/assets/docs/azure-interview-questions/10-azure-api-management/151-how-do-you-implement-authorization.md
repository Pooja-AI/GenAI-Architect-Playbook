# How do you implement authorization?

## Short answer
Authorise coarsely at APIM and finely in CWD.

## Key points
- APIM checks roles, scopes and product / subscription access per operation.
- Customer-level and entitlement decisions are enforced in the backend.
- Use on-behalf-of for downstream calls.

## CWD context
The gateway is one layer, not the only layer.
