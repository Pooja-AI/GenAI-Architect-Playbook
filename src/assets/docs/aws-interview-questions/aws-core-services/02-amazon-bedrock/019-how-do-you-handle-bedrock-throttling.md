# How do you handle Bedrock throttling?

## Short answer
Bedrock returns ThrottlingException when you exceed the model's request or token quota.

## Key points
- Retry with exponential backoff and jitter (SDK adaptive retry mode).
- Cross-region inference profiles for more throughput; quota increases; Provisioned Throughput for steady baseline.
- Queue non-interactive work in SQS; enforce per-tenant limits; reduce tokens.

## CWD context
Throttling is a capacity-planning signal, not just an error to retry.
