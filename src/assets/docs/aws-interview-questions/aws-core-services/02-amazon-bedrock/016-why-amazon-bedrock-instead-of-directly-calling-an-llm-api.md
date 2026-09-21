# Why Amazon Bedrock instead of directly calling an LLM API?

## Short answer
Bedrock gives multiple models behind IAM, PrivateLink and CloudTrail, rather than a separate vendor API with keys and a separate trust boundary.

## Key points
- IAM authentication instead of API keys; private connectivity through VPC endpoints.
- One Converse API across providers, so models are swappable.
- Guardrails, logging, quotas, Provisioned Throughput and cross-region inference.
- Trade-off: new model versions can appear later than at the model provider, and quotas are per region.

## CWD context
The security and audit story is the main reason, not convenience.
