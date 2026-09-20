# How would you manage dev/test/prod?

## Short answer
Manage environments with separate subscriptions, parameterised infrastructure and controlled promotion.

## Key points
- Per-environment parameter files or variable groups; Key Vault and App Configuration per environment.
- Same artifacts, different configuration; Azure Policy and approvals for higher environments.
- Masked data and cost limits in dev; clear naming conventions.

## CWD context
Configuration drift between environments is a major source of surprise.
