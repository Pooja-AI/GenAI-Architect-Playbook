# How would you manage dev/test/prod environments?

## Short answer
Manage environments with separate accounts, parameterised IaC and controlled promotion.

## Key points
- Separate accounts under Organizations; SCPs per OU.
- Same IaC with per-environment parameters; AppConfig and SSM per environment.
- Separate KMS keys, secrets and network; masked data; budgets and auto-stop for non-production.

## CWD context
Promote the same artifact; never rebuild for production.
