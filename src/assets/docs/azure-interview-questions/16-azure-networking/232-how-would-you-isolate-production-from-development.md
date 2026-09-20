# How would you isolate production from development?

## Short answer
Isolate environments with separate subscriptions, networks, identities and data.

## Key points
- Separate VNets (no peering, or controlled peering), Key Vaults, registries and Azure OpenAI deployments.
- Separate Entra app registrations and RBAC; Azure Policy per environment.
- No production data in dev without masking; pipeline approvals for prod.

## CWD context
A mistake in dev must not be able to reach production.
