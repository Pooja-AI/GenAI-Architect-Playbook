# AWS CloudWatch for GenAI Applications

## Overview
Amazon CloudWatch is the primary observability service underlying the monitoring, logging, and alerting practices described throughout this knowledge base's LLMOps & Observability section — providing metrics collection, log aggregation, dashboards, and alarming for GenAI applications running on AWS.

## Core CloudWatch Capabilities for GenAI

### Metrics
CloudWatch collects both standard AWS service metrics (Lambda invocation count/duration/errors, Bedrock invocation metrics) and custom application-emitted metrics (token usage, groundedness scores, cache hit rate) — see genai-observability.md and token-usage-monitoring.md for the specific GenAI metrics worth tracking.

### Logs and Logs Insights
CloudWatch Logs aggregates log output from Lambda, ECS, EKS, and other AWS services, with CloudWatch Logs Insights providing a query language for ad hoc analysis — essential for investigating specific incidents by querying structured log data (e.g., finding all requests where groundedness score fell below a threshold within a specific time window).

### Dashboards
Custom CloudWatch dashboards combine metrics and log-derived data into unified visualizations — build dedicated GenAI-specific dashboards covering operational health, quality signals, cost, and safety metrics together, as recommended in production-monitoring.md, rather than relying solely on generic default AWS service dashboards.

### Alarms
CloudWatch Alarms trigger notifications (via SNS) or automated actions when metrics cross defined thresholds — implementing the alerting strategy described in production-monitoring.md across operational, quality, safety, and cost dimensions.

## Custom Metrics for GenAI-Specific Signals
Beyond standard AWS service metrics, emit custom metrics for GenAI-specific quality and safety signals:
- Groundedness/hallucination indicator scores from sampled evaluation (see hallucination-evaluation.md)
- Guardrail intervention rate (see bedrock-guardrails.md)
- Agent iteration count distribution (relevant to loop detection, see preventing-agent-loops.md)
- Cache hit rate for semantic caching (see semantic-caching.md)

Emit these via the CloudWatch PutMetricData API (directly or via the embedded metric format for more efficient, structured emission) from application code at the point where these signals are computed.

## Structured Logging Best Practices
Log in a structured format (JSON) including consistent fields — request/trace ID, timestamp, relevant identifiers (tenant, feature, model version) — enabling effective CloudWatch Logs Insights querying and correlation with X-Ray traces (see agent-tracing.md) for full end-to-end debugging.

## Integration with X-Ray
CloudWatch and X-Ray work together — X-Ray provides distributed tracing across the full request path, while CloudWatch provides metrics and log aggregation; correlating trace IDs between the two systems enables jumping from an anomalous metric or alarm directly to the specific traces that explain it.

## Cost Considerations
CloudWatch charges for custom metrics, log ingestion/storage, and dashboard usage — for high-volume GenAI applications generating substantial log and metric data, apply appropriate log retention policies and consider sampling strategies for very high-cardinality or high-volume custom metrics to manage CloudWatch costs alongside the broader LLM cost monitoring described in llm-cost-monitoring.md.

## Anomaly Detection
CloudWatch's anomaly detection capability can automatically establish expected metric baselines and alert on statistically significant deviations, useful for catching subtle quality or cost anomalies that might not be caught by simple static threshold alarms, particularly for metrics with natural variability (e.g., daily/weekly usage patterns).

## Summary
CloudWatch provides the foundational metrics, logging, dashboarding, and alerting infrastructure for GenAI application observability on AWS — requiring deliberate custom metric instrumentation for GenAI-specific quality and safety signals beyond standard AWS service metrics, and working in tandem with X-Ray for comprehensive distributed tracing across complex RAG and agentic system request paths.
