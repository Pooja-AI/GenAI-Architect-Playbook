# When would you use SageMaker instead of Bedrock?

## Short answer
Use SageMaker when you need a custom, cheap, fast or self-controlled model.

## Key points
- Custom-trained or fine-tuned models; open-source models not offered on Bedrock.
- Strict latency or cost for a narrow task; deterministic outputs.
- Batch scoring at scale; control of the container and hardware.
- Bedrock Custom Model Import is a middle path for some models.

## CWD context
A small classifier is often better than an LLM for routing.
