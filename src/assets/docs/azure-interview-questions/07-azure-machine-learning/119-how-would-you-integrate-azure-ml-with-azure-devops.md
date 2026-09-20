# How would you integrate Azure ML with Azure DevOps?

## Short answer
Integrate Azure ML with Azure DevOps through pipelines that run the Azure ML CLI or SDK.

## Key points
- Service connection with workload identity federation.
- CI: lint, unit tests, pipeline validation; trigger training; register the model.
- CD: deploy to staging, integration tests, approval gate, deploy to production.
- All definitions in Git.

## CWD context
Same pipeline structure as the rest of CWD, so operations stay consistent.
