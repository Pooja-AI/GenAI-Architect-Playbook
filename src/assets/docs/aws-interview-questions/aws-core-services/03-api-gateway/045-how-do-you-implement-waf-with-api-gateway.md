# How do you implement WAF with API Gateway?

## Short answer
Attach AWS WAF to REST API stages, or place WAF on CloudFront or an ALB in front of HTTP APIs.

## Key points
- Managed rule groups, known-bad-input and IP-reputation rules, rate-based rules, bot control.
- WAF logs to S3, CloudWatch or Firehose.
- Start in count mode, tune, then block.

## CWD context
Tune rules against real traffic to avoid blocking legitimate long prompts.
