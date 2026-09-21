# Where would you use NAT Gateway?

## Short answer
Use NAT for outbound internet access that endpoints cannot provide.

## Key points
- Calls from Workers and MCP servers to Salesforce, ServiceNow and other SaaS APIs.
- Fixed Elastic IPs for vendor allow-lists.
- One NAT per AZ; optionally Network Firewall for egress control.

## CWD context
Use VPC endpoints for S3, ECR, Bedrock and similar to cut NAT cost.
