# How would you manage AWS configuration across environments?

## Short answer
Manage configuration per environment through IaC parameters, AppConfig and Parameter Store.

## Key points
- AppConfig for runtime configuration and feature flags with validators, gradual rollout and rollback, including prompt and model versions.
- Parameter Store paths such as /cwd/{env}/...; Secrets Manager per environment.
- Schema validation; no environment-specific code branches.

## CWD context
Runtime config changes need the same discipline as code changes.
