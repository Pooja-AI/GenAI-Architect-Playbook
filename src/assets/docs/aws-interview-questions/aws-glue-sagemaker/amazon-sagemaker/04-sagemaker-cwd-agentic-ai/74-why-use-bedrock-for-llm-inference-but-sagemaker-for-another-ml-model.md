# Why use Bedrock for LLM inference but SageMaker for another ML model?

## Short answer
Use Bedrock for general language work and SageMaker for custom models with different lifecycles and economics.

## Key points
- Bedrock: prompts, evaluation, per-token cost, no training.
- SageMaker: data, training, registry, endpoints, instance cost.
- A narrow prediction task with labelled data is usually cheaper and more predictable on SageMaker.

## CWD context
Two lifecycles, two governance paths, one Worker interface.
