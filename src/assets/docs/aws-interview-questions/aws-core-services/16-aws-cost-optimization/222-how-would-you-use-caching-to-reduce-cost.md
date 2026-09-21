# How would you use caching to reduce cost?

## Short answer
Caching reduces cost by avoiding repeated expensive work.

## Key points
- ElastiCache for embeddings, responses and semantic cache; Bedrock prompt caching.
- API Gateway caching for idempotent GETs; CloudFront.
- Savings ≈ hit rate × cost avoided; guard against stale answers with TTL and versioning.

## CWD context
Report cache savings as a KPI.
