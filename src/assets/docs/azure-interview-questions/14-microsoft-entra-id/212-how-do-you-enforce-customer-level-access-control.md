# How do you enforce customer-level access control?

## Short answer
Enforce customer-level access by validating every customer ID against the user's entitlements before any tool runs.

## Key points
- Entitlements come from CRM roles, territories or an entitlement service.
- Apply as query filters and tool pre-checks; deny and audit on mismatch.
- Never trust a customer ID produced by the LLM.
- Negative tests for cross-customer access.

## CWD context
This is the core of "entitlement-first" security.
