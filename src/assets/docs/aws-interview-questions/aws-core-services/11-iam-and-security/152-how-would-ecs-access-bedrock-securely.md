# How would ECS access Bedrock securely?

## Short answer
Give the ECS task role permission to invoke only approved Bedrock models, over a VPC endpoint.

## Key points
- bedrock:InvokeModel and streaming actions scoped to approved model or inference-profile ARNs; permission to apply the specific guardrail.
- Interface VPC endpoint for the Bedrock runtime with an endpoint policy.
- Security groups; no internet path.

## CWD context
This makes "only approved models" a technical control.
