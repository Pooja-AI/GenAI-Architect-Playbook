# Bedrock Retries and Throttling

## Overview
Like any API-based service, Bedrock enforces rate limits (requests per minute, tokens per minute) that vary by model and account tier. Production applications must handle throttling gracefully with proper retry logic to maintain reliability without overwhelming the service or degrading user experience.

## Why Throttling Happens
- Per-model, per-account request and token-per-minute quotas
- Shared on-demand capacity pools during high-demand periods
- Sudden traffic spikes exceeding provisioned/reserved capacity

Bedrock signals throttling via a `ThrottlingException` (typically mapped to an HTTP 429-equivalent) that calling code must detect and handle explicitly.

## Retry Strategy: Exponential Backoff with Jitter
The standard resilient pattern:
1. On a throttling exception, wait a base delay (e.g., 100ms)
2. Double the delay on each subsequent retry (exponential backoff)
3. Add random jitter to avoid synchronized retry storms across concurrent clients
4. Cap the maximum delay and maximum retry count to avoid indefinite hangs

```
delay = min(max_delay, base_delay * 2^attempt) + random_jitter
```

AWS SDKs (boto3, AWS SDK for JavaScript, etc.) include built-in retry logic with configurable backoff — use it rather than hand-rolling retry logic where possible.

## Distinguishing Retryable vs. Non-Retryable Errors
- **Retryable**: throttling, transient network errors, some 5xx service errors
- **Non-retryable**: validation errors (malformed request), authentication/authorization errors, content policy violations — retrying these wastes time and doesn't resolve the underlying issue

Correctly classifying errors prevents wasted retry attempts on errors that will never succeed.

## Requesting Quota Increases
For workloads with legitimate high, sustained volume, request a service quota increase via AWS Service Quotas rather than relying purely on retry logic to absorb the gap — retries are for transient spikes, not a substitute for adequate provisioned capacity.

## Provisioned Throughput as an Alternative
For predictable high-volume workloads, Provisioned Throughput reserves dedicated model capacity, largely eliminating throttling risk for that reserved volume (see bedrock-cost-optimization.md for the cost trade-off analysis).

## Client-Side Mitigations
- **Request queuing**: buffer requests through SQS during traffic spikes rather than hammering the API directly and relying entirely on retries
- **Circuit breakers**: temporarily stop sending requests to a consistently failing dependency to avoid cascading failures and wasted retry cycles
- **Graceful degradation**: fall back to a cached or simpler response path if retries are exhausted, rather than surfacing a raw error to the end user

## Monitoring
Track throttling rate, retry count distribution, and end-to-end latency including retry delays as first-class CloudWatch metrics. A rising throttling rate is an early warning sign to request quota increases or consider Provisioned Throughput before it becomes a user-facing reliability issue.

## Multi-Region / Multi-Model Fallback
For critical availability requirements, combine retry logic with a fallback strategy (see bedrock-model-fallback.md) — if retries against a primary model/region are exhausted, failover to a secondary model or region rather than failing the request entirely.

## Summary
Robust Bedrock integrations require exponential backoff with jitter for transient throttling, clear separation of retryable vs. non-retryable errors, and proactive capacity planning (quota increases or Provisioned Throughput) rather than relying on retries alone to absorb sustained high volume.
