# How would you deploy Azure ML models?

## Short answer
Deploy Azure ML models as new deployments on a managed online endpoint, with traffic shifting.

## Key points
- Pipeline registers the model, deploys it to staging, runs tests.
- Canary traffic split, then promote; keep the old deployment for rollback.
- Approval gate; pinned model version; monitoring enabled.

## CWD context
The pipeline references an explicit model version.
