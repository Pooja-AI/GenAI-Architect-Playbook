# How do you validate requests?

## Short answer
Validate requests at the gateway before they reach the backend.

## Key points
- validate-content against a JSON schema; validate-parameters and headers.
- Import OpenAPI definitions; enforce body size and content type.
- Cap prompt length to control cost and abuse.

## CWD context
Rejected requests cost almost nothing.
