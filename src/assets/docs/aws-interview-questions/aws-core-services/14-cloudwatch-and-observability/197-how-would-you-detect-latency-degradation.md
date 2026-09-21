# How would you detect latency degradation?

## Short answer
Detect latency degradation with percentile alarms, anomaly detection and synthetic probes.

## Key points
- p95 and p99 on API Gateway Latency and ALB TargetResponseTime.
- Anomaly-detection bands; Bedrock InvocationLatency; SQS age.
- CloudWatch Synthetics canaries for end-to-end probing; release markers.

## CWD context
Averages hide the tail.
