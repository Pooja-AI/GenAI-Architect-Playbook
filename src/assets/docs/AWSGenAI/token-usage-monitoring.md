# Token Usage Monitoring

## Overview
Token usage — the count of input and output tokens processed by an LLM — is the primary unit of both cost and latency in generative AI systems. Systematic monitoring of token usage is essential for cost management, capacity planning, and detecting anomalies (like runaway agent loops) before they become significant problems.

## Why Token-Level Monitoring Matters
Unlike traditional application metrics (request count, response time), token usage directly and non-linearly drives cost — a single request with an unusually large retrieved context or an agent loop that runs many extra iterations can consume disproportionately more tokens (and cost) than a typical request, making per-request token tracking far more informative than aggregate request-count-based monitoring alone.

## What to Track

### Per-Request Token Breakdown
Input tokens (system prompt, retrieved context, conversation history, user query) and output tokens, tracked separately since they're typically priced differently and driven by different factors.

### Aggregate Usage Over Time
Total token consumption trended over time (daily, weekly) to understand overall usage growth and identify unexpected spikes.

### Distribution, Not Just Averages
Track percentile distributions (p50, p95, p99) of token usage per request, not just the mean — a small number of very high-token-usage requests (e.g., from unusually long conversations or documents) can disproportionately drive cost even if they're a small fraction of total request volume.

### Attribution by Dimension
Break down token usage by feature, endpoint, user segment, or (for multi-agent systems) by individual agent — enabling targeted investigation and cost optimization rather than only having an undifferentiated aggregate number.

### Context Component Breakdown
For RAG and agentic systems specifically, track how much of the input token budget is consumed by each component — system instructions, retrieved context, conversation history — to identify where context optimization efforts (see context-window-optimization.md) would have the most impact.

## Anomaly Detection
Set up alerting on:
- Sudden spikes in per-request token usage (potentially indicating a retrieval configuration bug returning too much context, or an agent loop consuming excessive iterations)
- Unusual growth in aggregate usage not explained by corresponding growth in request volume (potentially indicating a prompt change that increased average context size, or a caching failure causing redundant processing)
- Requests approaching or exceeding expected context window limits, which may indicate truncation is occurring silently and degrading quality

## Implementation on AWS
- Capture token usage metrics from Bedrock's response metadata (most Bedrock model responses include token counts) and emit them as CloudWatch custom metrics, tagged with relevant dimensions (feature, agent, user segment) for later breakdown
- Build CloudWatch dashboards specifically for token usage trends, distributions, and attribution breakdowns, distinct from general operational dashboards
- Configure CloudWatch alarms on the anomaly patterns described above

## Relationship to Cost Monitoring
Token usage monitoring is the foundational data source for cost monitoring and optimization (see llm-cost-monitoring.md and bedrock-cost-optimization.md) — since cost is essentially token usage multiplied by per-token pricing (which varies by model and input/output type), granular token usage visibility is a prerequisite for granular, actionable cost visibility.

## Summary
Token usage monitoring — tracking per-request breakdowns, distributions (not just averages), attribution by dimension, and context component composition — provides the foundational visibility needed for cost management, capacity planning, and early detection of anomalies like runaway agent loops or unexpectedly bloated retrieval context.
