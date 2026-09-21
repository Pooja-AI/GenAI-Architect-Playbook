# How would you deploy a custom model to SageMaker?

## Short answer
Deploy a custom model by packaging the artifact and container, then creating a model, endpoint configuration and endpoint.

## Key points
- Model artifact in S3 and an inference container (prebuilt or custom in ECR).
- Configure instance type, count and variants; deploy from the Model Registry through a pipeline.
- VPC configuration, KMS, autoscaling and testing.

## CWD context
Deploy a specific registered version, never "latest".
