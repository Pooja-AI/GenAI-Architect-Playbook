# Explain the AWS network architecture for CWD.

## Short answer
CWD runs in a multi-AZ VPC with public, private and isolated tiers, and private endpoints for AWS services.

## Key points
- Public subnets hold only the load balancer (if internet-facing) and NAT gateways, one per AZ.
- Private subnets hold ECS services, Lambda in VPC and MCP servers; isolated subnets hold data stores such as ElastiCache.
- Gateway endpoints (S3, DynamoDB) and interface endpoints (Bedrock runtime, Secrets Manager, KMS, SQS, ECR, CloudWatch Logs, STS).
- Security groups per tier, VPC Flow Logs, Direct Connect or VPN to on-premises sources, separate VPCs or accounts per environment.

## CWD context
API Gateway reaches ECS through a VPC Link, so the backend has no public address.
