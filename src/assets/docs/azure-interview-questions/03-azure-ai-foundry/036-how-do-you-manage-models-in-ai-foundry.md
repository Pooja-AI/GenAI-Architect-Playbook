# How do you manage models in AI Foundry?

## Short answer
Manage models as versioned, governed deployments defined in code.

## Key points
- Deployments per project and environment with pinned model versions.
- Track retirement dates and upgrade policy (auto-update versus pinned).
- RBAC and quotas; deployment definitions in IaC.
- Model inventory with approval status.

## CWD context
Never let production silently upgrade to a new model version without evaluation.
