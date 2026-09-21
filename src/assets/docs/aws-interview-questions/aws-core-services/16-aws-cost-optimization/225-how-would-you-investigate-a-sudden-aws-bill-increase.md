# How would you investigate a sudden AWS bill increase?

## Short answer
Investigate a bill increase from broad to narrow, then link it to a change.

## Key points
- Cost Explorer by service, usage type, account and tag; day-over-day comparison; Cost Anomaly Detection.
- Usual suspects: Bedrock tokens (loops, retry storms, prompt growth after a release), NAT data, log ingestion, cross-AZ or cross-region transfer, OpenSearch OCUs, runaway scaling, forgotten resources.
- Correlate with deployments and changes; mitigate with rate limits, disabling a feature or rollback; add guardrails.

## CWD context
Set budgets and anomaly alerts before the next spike.
