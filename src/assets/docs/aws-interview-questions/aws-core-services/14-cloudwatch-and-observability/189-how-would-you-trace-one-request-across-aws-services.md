# How would you trace one request across AWS services?

## Short answer
Trace a request with the X-Ray trace header propagated across every hop.

## Key points
- API Gateway active tracing; ADOT or the X-Ray SDK in ECS; Lambda active tracing.
- SQS carries the trace header as a system attribute; Step Functions integrates with X-Ray.
- Custom spans around Bedrock, MCP and OpenSearch calls; service map in CloudWatch.

## CWD context
Test asynchronous hops; they are where traces usually break.
