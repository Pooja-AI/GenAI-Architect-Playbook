# GenAI Observability

## Overview
GenAI observability extends traditional application observability (logs, metrics, traces) with dimensions specific to LLM-based systems — token usage, prompt/response content, retrieval quality, groundedness, and reasoning traces — providing the visibility needed to understand, debug, and continuously improve generative AI application behavior in production.

## Observability Pillars for GenAI

### Logging
Capture full request/response pairs (with appropriate PII redaction, see pii-prevention.md), including the exact prompt sent to the model, retrieved context (for RAG), and the raw model response — essential for debugging specific incidents and building evaluation datasets from real production data.

### Metrics
Quantitative, aggregatable signals tracked over time:
- Request volume, latency (p50/p95/p99), and error rate
- Token usage (input/output) and associated cost (see token-usage-monitoring.md and llm-cost-monitoring.md)
- Quality signals: groundedness scores, user satisfaction ratings, escalation/fallback rates
- Retrieval metrics: recall/precision proxies computed from sampled evaluation, cache hit rate

### Tracing
End-to-end visibility into the full path a single request takes through the system — retrieval calls, model invocations, tool calls, and (for agentic systems) the full reasoning loop — correlated via a shared trace/request ID (see agent-tracing.md for the agent-specific deep dive).

## GenAI-Specific Observability Needs

### Prompt and Retrieval Context Visibility
Unlike traditional application logging (which might log a simple request/response), GenAI observability needs visibility into the *constructed* prompt (including retrieved context, conversation history, and system instructions) since the actual input the model sees is often assembled dynamically and understanding failures requires seeing that constructed input, not just the original user query.

### Quality Metric Instrumentation
Beyond standard operational metrics, GenAI systems need instrumentation for quality-specific signals — automated groundedness scoring on sampled production traffic, tracking hallucination indicators, and correlating these with other operational metrics to catch, for example, a groundedness regression that coincides with a recent prompt or model change.

### Cost Attribution
Given the direct, usage-scaling cost of LLM token consumption, observability should support cost attribution by feature, team, or user segment — not just aggregate spend — enabling targeted cost optimization efforts (see llm-cost-monitoring.md and bedrock-cost-optimization.md).

## Implementation on AWS
- **CloudWatch** for metrics and log aggregation
- **X-Ray** for distributed tracing across the full request path spanning API Gateway, Lambda/ECS orchestration, Bedrock invocations, and vector store queries
- **Custom dashboards** (CloudWatch dashboards or QuickSight) combining operational and quality metrics for a unified view
- **Structured logging** with consistent, parseable formats (e.g., JSON) including trace IDs, enabling correlation across CloudWatch Logs Insights queries and X-Ray traces

## Alerting
Define alerts not just on traditional operational thresholds (error rate, latency) but on quality-related signals — a sudden drop in average groundedness score, a spike in fallback/escalation rate, or unusual cost growth — since these often indicate problems (a bad deployment, a knowledge base issue, degraded model behavior) that traditional operational metrics alone wouldn't surface.

## Summary
GenAI observability builds on traditional logging/metrics/tracing practices while adding essential visibility into constructed prompts, retrieval context, quality signals like groundedness, and granular cost attribution — implemented on AWS primarily through CloudWatch and X-Ray, instrumented specifically to catch the failure modes unique to generative AI systems.
