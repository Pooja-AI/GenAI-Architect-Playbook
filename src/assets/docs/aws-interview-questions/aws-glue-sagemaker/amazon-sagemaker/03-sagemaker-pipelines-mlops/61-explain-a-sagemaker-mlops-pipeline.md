# Explain a SageMaker MLOps pipeline.

## Short answer
A SageMaker MLOps pipeline is an automated DAG from data processing to a registered, deployable model.

## Key points
- Processing → training → evaluation → condition on metrics → register as pending approval → deploy after approval → monitor.
- Triggered by schedule, EventBridge or CodePipeline; parameterised with caching.

## CWD context
The pipeline definition lives in Git.
