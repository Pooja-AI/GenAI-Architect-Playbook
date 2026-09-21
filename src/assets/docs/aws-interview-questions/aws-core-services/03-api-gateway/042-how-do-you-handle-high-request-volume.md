# How do you handle high request volume?

## Short answer
Handle high volume with automatic gateway scaling plus protection of the backend.

## Key points
- Raise account quotas in advance; cache idempotent GET responses; CloudFront in front.
- Throttle to protect backends; buffer with SQS for async work.
- Scale ECS behind it; load test.

## CWD context
The gateway scales; the bottlenecks are usually Bedrock quota and backend capacity.
