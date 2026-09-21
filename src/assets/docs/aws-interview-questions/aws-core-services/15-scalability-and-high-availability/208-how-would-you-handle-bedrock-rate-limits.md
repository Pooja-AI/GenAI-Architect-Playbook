# How would you handle Bedrock rate limits?

## Short answer
Handle Bedrock rate limits with capacity planning, distribution and graceful degradation.

## Key points
- Request quota increases early, backed by usage data.
- Cross-region inference profiles and Provisioned Throughput for baseline.
- Per-tenant token budgets, queued and rate-limited consumers, backoff with jitter.
- Smaller-model fallback, caching, and batch inference for offline work.

## CWD context
Quotas are per account and region, so plan them like any other capacity.
