# How would you monitor AWS cost per request?

## Short answer
Monitor cost per request by tagging everything and combining token and compute costs.

## Key points
- Cost allocation tags per tenant, agent and environment.
- Application inference profiles for Bedrock cost by tenant or agent.
- Custom metric: tokens × price per model plus a share of compute; log cost per request.
- Cost and usage reports with Athena; budgets per tenant.

## CWD context
Unit economics should be visible on a dashboard.
