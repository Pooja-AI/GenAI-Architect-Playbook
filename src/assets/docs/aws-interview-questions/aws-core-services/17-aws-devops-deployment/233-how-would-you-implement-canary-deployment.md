# How would you implement canary deployment?

## Short answer
Canary exposes a small share of traffic to the new version and expands as evidence accumulates.

## Key points
- CodeDeploy canary configurations, ALB weighted target groups, Lambda alias weights, API Gateway canary stages.
- AppConfig gradual rollout for prompts, model IDs and configuration, with automatic rollback.
- Watch quality metrics as well as errors.

## CWD context
Start with internal or low-risk tenants.
