# How would SageMaker support the CWD ML pipeline?

## Short answer
SageMaker supports the ML pipeline from prepared data to a monitored endpoint.

## Key points
- Glue prepares data in S3; Processing and Training jobs build the model.
- Evaluation, Model Registry, endpoint deployment, Model Monitor and retraining triggers.
- SageMaker Pipelines orchestrates the steps.

## CWD context
The same governance applies to models as to prompts.
