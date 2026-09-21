# CloudWatch vs CloudTrail vs X-Ray?

## Short answer
CloudWatch shows performance, CloudTrail shows who did what, and X-Ray shows the request path.

## Key points
- CloudWatch: metrics, logs and alarms.
- CloudTrail: API audit trail of account activity.
- X-Ray: distributed tracing and latency breakdown.

## CWD context
Example: X-Ray finds a slow Bedrock call, CloudWatch shows throttles, CloudTrail shows who changed the quota or policy.
