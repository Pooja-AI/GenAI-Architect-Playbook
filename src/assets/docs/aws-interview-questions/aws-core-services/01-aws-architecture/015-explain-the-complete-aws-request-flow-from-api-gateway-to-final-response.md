# Explain the complete AWS request flow from API Gateway to final response.

## Short answer
A request flows from the client through API Gateway to the Coordinator, out to Workers and tools, and back through validation.

## Key points
- Client → CloudFront/WAF → API Gateway (authoriser, throttling, validation, request ID) → VPC Link → ALB → ECS Coordinator.
- The Coordinator loads state (DynamoDB / Redis), classifies intent with a small Bedrock model and builds a plan.
- Delegators call Workers: short reads synchronously; long or write jobs through SQS or Step Functions.
- Workers query OpenSearch with ACL filters or call MCP tools; results are validated and aggregated.
- Bedrock (with Guardrails) generates the grounded answer; state is saved; traces go to X-Ray and CloudWatch; long work returns 202 and a status endpoint.

## CWD context
The synchronous path is the user-facing critical path; everything slow goes async.
