# How would you handle sudden traffic spikes?

## Short answer
Handle sudden spikes by absorbing, scaling quickly and degrading gracefully.

## Key points
- WAF and API throttling; SQS as a buffer for async work.
- Fast target-tracking, scheduled or predictive scaling; provisioned concurrency; pre-warmed capacity.
- Protect Bedrock with token budgets, cross-region inference and cache or smaller-model fallback.

## CWD context
Rehearse the spike in a load test.
