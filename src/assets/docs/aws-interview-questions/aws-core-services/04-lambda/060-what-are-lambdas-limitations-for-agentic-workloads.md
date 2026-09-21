# What are Lambda's limitations for agentic workloads?

## Short answer
Lambda's limits make it a poor host for long-running agent loops.

## Key points
- 15-minute maximum duration; synchronous API Gateway calls end at about 29 seconds.
- Stateless: state must live in DynamoDB or Redis.
- Payload limits (about 6 MB synchronous), no GPU, cold starts and concurrency limits.
- Cost is higher at sustained high load.

## CWD context
Use Fargate for the agent runtime and Step Functions for long workflows.
