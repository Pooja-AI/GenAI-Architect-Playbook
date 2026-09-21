# How would you handle a sudden 100× traffic spike?

## Short answer
Survive a 100× spike by absorbing, scaling, protecting and degrading gracefully.

## Key points
- Absorb: WAF and API throttling, then the async pattern with SQS as a buffer.
- Scale: consumers on backlog; DynamoDB on-demand; OpenSearch OCUs; request quota increases in advance.
- Protect Bedrock: cross-region inference, token budgets per tenant, smaller model or cache fallback.
- Pre-scale for known events; shed non-critical work; load test.

## CWD context
Say which limit breaks first (usually Bedrock quota) and how you would handle it.
