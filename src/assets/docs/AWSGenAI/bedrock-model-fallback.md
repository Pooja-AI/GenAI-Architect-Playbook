# Bedrock Model Fallback

## Overview
Model fallback is a resilience pattern where, if a primary model or region becomes unavailable, rate-limited, or returns persistent errors, the application automatically routes the request to a secondary model or region to maintain availability.

## Why Fallback Matters
Even with retry logic, sustained outages, extended throttling, or region-level service disruptions can exhaust retry budgets. For availability-critical applications (customer-facing chat, transaction processing), a hard failure is often worse than a degraded response from a fallback model.

## Fallback Strategies

### Same Model, Different Region
If a specific AWS region hosting a Bedrock model experiences issues, route the request to the same model deployed in a different region. Requires multi-region IAM setup and awareness of any data residency constraints that might restrict which regions are eligible.

### Different Model, Same Provider
Fall back from a primary model to a smaller or different model from the same provider family if the primary is unavailable or over-throttled — often preserves similar behavior with less latency/cost, though output quality/style may shift slightly.

### Different Provider Entirely
Fall back to an entirely different foundation model (e.g., from Claude to Titan or Llama) as a last resort. Requires prompt engineering that's been validated to work reasonably across providers, since prompt structures and system-instruction handling can differ.

## Implementation Pattern
1. Define an ordered list of fallback targets (model + region combinations) per use case
2. Wrap the primary invocation in retry logic (see bedrock-retries-throttling.md)
3. If retries are exhausted or a non-retryable service-level error occurs, invoke the next fallback target
4. Log every fallback event with context (why the primary failed, which fallback was used) for monitoring and incident review
5. Optionally, notify users transparently if response quality/behavior may differ under fallback (for high-stakes use cases)

## Testing Fallback Paths
Fallback logic is only as reliable as its testing — regularly simulate primary model failures (e.g., via chaos engineering practices or feature flags that force fallback) to confirm the fallback path actually works and produces acceptable output, rather than discovering it's broken during a real outage.

## Trade-offs to Manage
- **Consistency**: fallback models may produce stylistically different or lower-quality outputs — decide whether this is acceptable for your use case or whether some tasks should fail closed (return an error) rather than fail open with degraded output
- **Cost**: fallback to a different provider/model may have very different cost characteristics — monitor cost impact during extended fallback periods
- **Guardrails compatibility**: ensure Guardrails and safety configurations are equivalently applied across all fallback targets, not just the primary

## Health-Check-Driven Routing
For sophisticated setups, maintain a lightweight health-check signal (recent error rate, latency) per model/region and proactively route new requests away from a degraded target before it fully fails, rather than reactively falling back only after individual request failures.

## Summary
Model fallback is an important availability pattern for production generative AI applications, but must be deliberately designed, tested, and monitored — including how quality, cost, and safety guarantees are preserved (or explicitly relaxed) when operating in a fallback state.
