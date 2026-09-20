# How would you prevent an untested model from reaching production?

## Short answer
Prevent untested models from reaching production with technical gates, not policy documents.

## Key points
- Production configuration may reference only approved models from the inventory.
- Pipeline verifies a passing evaluation report for that exact version.
- Azure Policy and RBAC restrict who can create production deployments; infrastructure changes only through IaC.
- Environment approvals and audit trail.

## CWD context
Make the safe path the only path.
