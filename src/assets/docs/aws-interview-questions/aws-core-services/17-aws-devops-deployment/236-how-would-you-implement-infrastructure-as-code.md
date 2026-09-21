# How would you implement Infrastructure as Code?

## Short answer
Infrastructure as code defines all infrastructure in reviewed, versioned templates deployed only through the pipeline.

## Key points
- Git, pull-request review, static checks (cfn-lint, cdk-nag, checkov).
- Drift detection; modular constructs or modules; no console changes in production.
- Terraform needs remote state with locking.

## CWD context
Manual console changes are the main source of environment drift.
