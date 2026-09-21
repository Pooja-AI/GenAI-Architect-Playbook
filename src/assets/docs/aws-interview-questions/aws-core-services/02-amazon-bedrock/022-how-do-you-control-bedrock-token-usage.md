# How do you control Bedrock token usage?

## Short answer
Control token usage before the call, and measure it after.

## Key points
- Set maxTokens and stop sequences; count or estimate input tokens.
- Trim history with a rolling summary; limit retrieved chunks by rerank score.
- Read the usage field in each response and record it; per-tenant budgets in DynamoDB or Redis.
- Prompt caching for stable prefixes.

## CWD context
Track prompt tokens per stage to see where they go.
