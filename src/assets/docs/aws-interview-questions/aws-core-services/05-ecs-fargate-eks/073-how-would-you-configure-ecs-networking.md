# How would you configure ECS networking?

## Short answer
Run tasks in awsvpc mode in private subnets with security groups and endpoints.

## Key points
- One ENI and security group per task; subnets across AZs; no public IPs.
- VPC endpoints for ECR, S3, CloudWatch Logs, Secrets Manager, STS and Bedrock; NAT only for what needs the internet.
- Security group rules only from the load balancer and to required endpoints.

## CWD context
Endpoints reduce NAT cost and keep traffic private.
