# How would you integrate SageMaker with CI/CD?

## Short answer
Integrate SageMaker with CI/CD through SageMaker Projects and standard pipelines.

## Key points
- Code changes trigger pipeline runs; registry approval triggers deployment.
- Infrastructure as code for endpoints; tests and approvals; cross-account deployment.
- Same CodePipeline patterns as the rest of CWD.

## CWD context
One delivery approach for services and models keeps operations consistent.
