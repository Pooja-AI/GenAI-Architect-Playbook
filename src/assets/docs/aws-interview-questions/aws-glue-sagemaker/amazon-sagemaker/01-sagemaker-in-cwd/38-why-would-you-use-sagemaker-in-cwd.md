# Why would you use SageMaker in CWD?

## Short answer
SageMaker provides the build, train, deploy and monitor lifecycle for custom ML models that Bedrock does not cover.

## Key points
- Classifiers, rerankers, anomaly detection, forecasting and fine-tuned or open-source models.
- Managed training, pipelines, registry, endpoints and monitoring.
- VPC, KMS and IAM controls.

## CWD context
Workers call SageMaker endpoints for scoring while Bedrock handles language tasks.
