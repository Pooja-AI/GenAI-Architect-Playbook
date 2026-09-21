# Where would you use Step Functions?

## Short answer
Use Step Functions for durable, visible orchestration of multi-step workflows across AWS services.

## Key points
- Ingestion pipelines, fan-out and fan-in of Workers, long-running approval flows using task tokens.
- Built-in retry, catch, timeout and service integrations (SQS, Lambda, ECS, Bedrock, DynamoDB).
- Not a replacement for LangGraph, which handles LLM reasoning graphs inside the agent.

## CWD context
Step Functions orchestrates infrastructure workflows; LangGraph orchestrates agent reasoning.
