# How would you promote a model from dev → test → production?

## Short answer
Promote by deploying the same registered version through each stage with tests and approvals.

## Key points
- Separate accounts; registry shared or artifacts copied.
- CI/CD (CodePipeline or SageMaker Projects) deploys the version to each stage.
- Endpoint configuration per environment; approval between stages.

## CWD context
Promote by version, never by retraining or copying by hand.
