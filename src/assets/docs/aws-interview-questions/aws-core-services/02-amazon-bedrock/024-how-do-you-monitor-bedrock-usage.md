# How do you monitor Bedrock usage?

## Short answer
Monitor Bedrock with CloudWatch metrics, invocation logging and cost attribution.

## Key points
- Metrics: invocations, input and output tokens, latency, throttles, errors.
- Model invocation logging to S3 or CloudWatch Logs, with care for sensitive content.
- Application inference profiles and tags for per-tenant or per-agent cost; custom metrics from response usage.
- AWS Budgets and Cost Explorer alerts.

## CWD context
Tag every call so cost and quality can be sliced later.
