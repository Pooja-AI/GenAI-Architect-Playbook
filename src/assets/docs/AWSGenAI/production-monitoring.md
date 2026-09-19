# Production Monitoring

## Overview
Production monitoring for generative AI applications is the ongoing, real-time and near-real-time practice of tracking operational health, quality, safety, and cost metrics after deployment — closing the loop from pre-deployment evaluation into continuous, live visibility into actual system behavior under real usage.

## Monitoring Categories

### Operational Health
Standard application health metrics — request volume, latency (p50/p95/p99), error rate, availability — tracked with the same rigor as any production service, using the observability infrastructure described in genai-observability.md.

### Quality Signals
Ongoing, sampled automated evaluation of live production traffic — groundedness scoring (see groundedness-evaluation.md), hallucination indicators (see hallucination-evaluation.md), and task-completion proxies — providing continuous quality visibility rather than relying solely on pre-deployment offline evaluation, since real production traffic inevitably includes cases and edge conditions not fully anticipated by any pre-deployment test set.

### User Feedback Signals
Explicit feedback (thumbs up/down ratings, satisfaction surveys) and implicit behavioral signals (follow-up question rate, conversation abandonment, escalation to human support) that indicate real user-perceived quality, complementing automated quality metrics with genuine user experience signal.

### Safety and Guardrail Metrics
Track guardrail intervention rate (how often content filters, PII redaction, or topic restrictions actually trigger) and any detected prompt injection attempts — both to understand the baseline "normal" rate (informing tuning to avoid excessive false positives) and to detect anomalous spikes that might indicate an emerging attack pattern or a data/content issue.

### Cost Metrics
Ongoing token usage and cost tracking (see token-usage-monitoring.md and llm-cost-monitoring.md) as a standard part of production monitoring, not a separate, occasional review.

## Building Effective Dashboards
Combine operational, quality, safety, and cost metrics into unified dashboards accessible to both engineering and relevant business/product stakeholders — quality and safety metrics shouldn't be siloed away from the operational dashboards engineers check regularly, since cross-cutting issues (e.g., a deployment that's operationally healthy but has quietly regressed quality) are easy to miss if quality metrics live in a separate, less frequently reviewed location.

## Alerting Strategy
Define alerts across all monitoring categories, not just traditional operational thresholds:
- Standard operational alerts (error rate, latency spikes)
- Quality degradation alerts (groundedness score dropping below a threshold, hallucination indicator rate increasing)
- Safety alerts (unusual spike in guardrail interventions or detected injection attempts)
- Cost alerts (unexpected spend growth, see llm-cost-monitoring.md)

Avoid alert fatigue by carefully calibrating thresholds and ensuring each alert is genuinely actionable, rather than over-alerting on normal variance and training the team to ignore alerts.

## Continuous Improvement Loop
Production monitoring findings should systematically feed back into:
- Golden dataset expansion (see golden-dataset.md) — new failure patterns discovered in production become new test cases
- Prompt and configuration refinement, validated through the regression testing process before redeployment
- Guardrail policy tuning based on observed false-positive/false-negative patterns

## Summary
Production monitoring provides continuous, real-world visibility across operational health, quality signals, user feedback, safety metrics, and cost — closing the loop from pre-deployment evaluation into an ongoing feedback cycle that drives systematic improvement, and requiring genuinely integrated (not siloed) dashboards and alerting across all these dimensions to be effective.
