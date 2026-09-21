# Why SQS instead of synchronous API calls?

## Short answer
SQS decouples producers from consumers, absorbing spikes and surviving failures.

## Key points
- Durable buffering; retries; independent scaling.
- Avoids the API Gateway timeout for long work.
- Trade-offs: extra latency, eventual consistency and the need to track job status.

## CWD context
Use it for long or side-effecting work, not short reads.
