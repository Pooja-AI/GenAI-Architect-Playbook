# Explain your Azure CI/CD pipeline.

## Short answer
The pipeline is a multi-stage Azure Pipelines YAML that builds once and promotes the same artifact.

## Key points
- CI: lint, unit tests, dependency and secret scans, container build and image scan, push to ACR, Bicep what-if, prompt and agent evaluation on the golden set.
- CD: dev → integration and end-to-end tests → staging (canary, load, security) → approval gate → production.
- Environments with approvals; workload identity federation; infrastructure as code.

## CWD context
Evaluation is a quality gate alongside tests.
