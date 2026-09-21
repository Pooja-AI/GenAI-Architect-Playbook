# How would you train a model using SageMaker?

## Short answer
Train a model with a training job that reads data from S3 and writes an artifact to S3.

## Key points
- Choose a container or algorithm, script, instance type and count, hyperparameters.
- Input channels for training and validation data; IAM role, VPC and KMS.
- Optional spot instances; metrics logged; register the resulting model.

## CWD context
Keep the job definition in code so it can be repeated.
