# How would private workloads access AWS services?

## Short answer
Private workloads reach AWS services through VPC endpoints, keeping traffic on the AWS network.

## Key points
- Gateway endpoints for S3 and DynamoDB; interface endpoints (PrivateLink) for most other services.
- Private DNS makes the normal service hostname resolve to the endpoint.
- Endpoint policies restrict actions and resources.

## CWD context
Fall back to NAT only for services without an endpoint.
