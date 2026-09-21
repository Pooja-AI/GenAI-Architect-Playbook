# What role does SageMaker play alongside Bedrock?

## Short answer
Bedrock and SageMaker are complementary: Bedrock serves foundation models, SageMaker serves your own models.

## Key points
- Bedrock: general language and generative tasks through an API, no training.
- SageMaker: custom-trained models with full lifecycle control.

## CWD context
A single workflow may call both, for example a classifier then an LLM.
