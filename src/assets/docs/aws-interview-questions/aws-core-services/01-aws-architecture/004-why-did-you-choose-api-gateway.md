# Why did you choose API Gateway?

## Short answer
API Gateway is the managed front door that offloads authentication, throttling, validation and logging from the CWD backend.

## Key points
- Cognito or JWT authorisers, Lambda authorisers, IAM (SigV4).
- Throttling, usage plans, request validation and WAF integration (REST APIs).
- Custom domains, stages, access logs and metrics.
- Private integrations to ECS through VPC Link.

## CWD context
The backend receives only authenticated, validated, rate-limited traffic.
