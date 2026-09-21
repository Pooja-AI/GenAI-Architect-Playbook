# How would you troubleshoot a production request using CloudWatch?

## Short answer
Troubleshoot a production request from the correlation ID outward.

## Key points
- Find the trace or service map segment that is slow or failing.
- Query logs across log groups by correlation ID in Logs Insights.
- Check metrics in the same window: throttles, 5XX, queue age; then recent deployments and prompt, model or config changes.
- Check quotas, mitigate (roll back, fall back, scale), verify, then do root-cause analysis.

## CWD context
Mitigate first, investigate second.
