# Explain S3 → Glue → SageMaker Training.

## Short answer
The flow is raw S3 → Glue curation → versioned curated dataset → SageMaker training → model artifact → evaluation → registry.

## Key points
- Glue outputs a versioned dataset; the training job reads it as a channel.
- The artifact lands in S3 and is evaluated before registration.
- SageMaker Pipelines or Step Functions orchestrates.

## CWD context
Each stage's output is immutable and traceable.
