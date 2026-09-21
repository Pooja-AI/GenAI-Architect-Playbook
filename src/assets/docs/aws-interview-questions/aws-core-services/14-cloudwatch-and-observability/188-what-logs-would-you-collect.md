# What logs would you collect?

## Short answer
Collect structured application logs plus service and security logs, without sensitive content.

## Key points
- Application logs with correlation ID, tenant, agent, tool, status, duration, model and prompt version, token counts.
- API Gateway access logs, ALB logs, Step Functions and WAF logs, VPC Flow Logs, CloudTrail.
- Bedrock invocation logs with care for sensitive content.

## CWD context
Log document IDs and scores, not document content.
