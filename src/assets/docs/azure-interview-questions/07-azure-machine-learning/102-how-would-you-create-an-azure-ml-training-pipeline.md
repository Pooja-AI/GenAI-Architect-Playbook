# How would you create an Azure ML training pipeline?

## Short answer
Build the training pipeline from reusable components with a gated registration step.

## Key points
- Components: data prep, train, evaluate, register.
- Parameterised YAML pipeline using the v2 CLI or SDK; caching between runs.
- Triggered by schedule, new data or drift alert.
- Register only if metrics beat the current model.

## CWD context
Pipelines are stored in Git and run by Azure DevOps.
