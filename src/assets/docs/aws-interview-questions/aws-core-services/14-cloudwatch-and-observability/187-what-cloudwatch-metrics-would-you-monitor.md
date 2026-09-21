# What CloudWatch metrics would you monitor?

## Short answer
Track health, capacity, quality and cost at each layer.

## Key points
- API Gateway and ALB latency and errors; ECS CPU, memory and running tasks; Lambda errors, throttles and duration.
- SQS oldest-message age and DLQ; DynamoDB throttling; OpenSearch OCU and latency; Step Functions failures.
- Bedrock invocations, latency, tokens and throttles.
- Custom: agent success rate, loop-guard hits, groundedness, cost per request.

## CWD context
Pick a few SLO metrics and keep the rest for diagnosis.
