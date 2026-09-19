# LLM Cost Monitoring

## Overview
LLM cost monitoring provides visibility into generative AI spend at a granularity that supports both financial planning and targeted optimization — building on the token usage monitoring foundation described in token-usage-monitoring.md, translated into actual cost figures and attributed to the parts of the business/application driving that spend.

## Cost Monitoring Dimensions

### Cost by Model
Different models have different per-token pricing (see bedrock-model-selection.md); tracking cost broken down by which model handled each request reveals whether expensive premium models are being used appropriately or overused for tasks a cheaper model could handle equally well.

### Cost by Feature/Application
Attribute spend to specific product features or applications (e.g., "customer support chatbot" vs. "internal document summarization tool") to understand which parts of the business are driving GenAI cost and to support accurate cost allocation for budgeting and chargeback purposes.

### Cost by Customer/Tenant
For multi-tenant SaaS applications, understanding per-tenant cost is important both for unit economics (is this tenant profitable given their usage level?) and for detecting anomalous usage that might indicate a bug, abuse, or an opportunity to discuss usage-based pricing tiers.

### Cost Trend Over Time
Track cost trends to distinguish expected, revenue-correlated growth (more users, more usage) from unexpected growth that might indicate inefficiency (a regression in context size, an increase in unnecessary retries, a routing bug sending more traffic to an expensive model than intended).

## Implementation Approach
1. Capture token usage per request with the attribution tags described in token-usage-monitoring.md (feature, tenant, model)
2. Apply current per-token pricing (input/output, per model) to compute cost per request
3. Aggregate into CloudWatch metrics or a dedicated cost-tracking data store, broken down by the relevant dimensions
4. Build dashboards and set budget alerts at appropriate granularity (overall, per-feature, per-tenant depending on business needs)
5. Use AWS Cost Explorer and cost allocation tags at the account/resource level as a complementary, higher-level view alongside application-level token-based cost attribution

## Budget Alerting
Set proactive alerts for:
- Approaching or exceeding a defined budget threshold for a specific time period
- Unusual day-over-day or week-over-week cost growth not explained by corresponding usage growth
- A specific feature or tenant's cost spiking unexpectedly, which might indicate a bug (e.g., an agent loop issue, see preventing-agent-loops.md) rather than legitimate increased usage

## Connecting Cost to Business Value
Raw cost figures are most useful when connected to business value metrics — cost per successful task completion, cost per resolved customer inquiry, cost per user — rather than viewed in isolation, since this framing supports more meaningful decisions about whether a given cost level is justified by the value delivered, rather than treating cost minimization as an end in itself independent of the quality/value trade-off (see cost-latency-quality-tradeoff.md).

## Using Cost Data to Drive Optimization
Cost monitoring findings should directly feed into the optimization techniques described in bedrock-cost-optimization.md — a feature found to be disproportionately expensive relative to its usage/value might be a candidate for model right-sizing, context trimming, or caching improvements, while a tenant with anomalous usage might warrant investigation for a bug or abuse pattern.

## Summary
LLM cost monitoring extends token usage tracking into actionable financial visibility — broken down by model, feature, tenant, and time trend — supporting proactive budget alerting and, critically, connecting cost figures to business value metrics so cost data drives genuinely informed optimization decisions rather than undifferentiated cost-cutting pressure.
