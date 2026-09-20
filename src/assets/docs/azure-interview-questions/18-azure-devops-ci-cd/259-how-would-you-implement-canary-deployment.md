# How would you implement canary deployment?

## Short answer
Canary exposes a small share of traffic to the new version and expands as evidence accumulates.

## Key points
- Weighted routing in Container Apps, APIM, Azure ML deployments or feature flags per tenant.
- Watch SLO, quality and cost; auto-promote or auto-roll back.
- Start with internal or low-risk tenants.

## CWD context
Include quality metrics in the canary decision, not only errors.
