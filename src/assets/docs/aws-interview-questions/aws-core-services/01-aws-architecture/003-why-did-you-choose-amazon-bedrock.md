# Why did you choose Amazon Bedrock?

## Short answer
Bedrock provides managed access to foundation models from several providers through one API, secured with IAM and PrivateLink.

## Key points
- No model infrastructure to run; pay per token, with optional Provisioned Throughput.
- Guardrails, Knowledge Bases, prompt management, batch inference and model evaluation are built in.
- IAM authentication, CloudTrail audit, invocation logging; AWS states customer prompts are not used to train the models.
- Model choice can change without a platform change.

## CWD context
It keeps LLM access inside the same identity, network and audit model as the rest of CWD.
