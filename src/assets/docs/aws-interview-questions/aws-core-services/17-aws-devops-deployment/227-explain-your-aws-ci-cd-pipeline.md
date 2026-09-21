# Explain your AWS CI/CD pipeline.

## Short answer
The pipeline moves a change from commit to production through automated gates.

## Key points
- Source → CodeBuild: lint, unit tests, dependency and secret scans, container build and image scan.
- Evaluation stage: golden-dataset checks for prompts and agents; fail on regression.
- Deploy to dev → integration and end-to-end tests → staging with canary, load and security tests → manual approval → production with blue-green or canary and alarm-based rollback.
- Artifacts encrypted with KMS; cross-account deploy roles.

## CWD context
Evaluation is a quality gate alongside tests.
