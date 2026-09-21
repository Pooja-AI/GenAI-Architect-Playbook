# How do you version model configurations?

## Short answer
Version the whole model configuration as one immutable unit.

## Key points
- Model or inference-profile ARN, temperature, max tokens, system-prompt version, guardrail ID and version.
- Store in AppConfig, Parameter Store or Git; Bedrock Prompt Management versions prompts; guardrail versions are immutable.
- Stamp the config version on every trace.

## CWD context
This lets you reproduce exactly what produced a given answer.
