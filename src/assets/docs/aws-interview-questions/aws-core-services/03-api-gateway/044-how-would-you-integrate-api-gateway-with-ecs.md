# How would you integrate API Gateway with ECS?

## Short answer
Integrate with ECS privately through a VPC Link to an internal load balancer.

## Key points
- VPC Link connects API Gateway to a private ALB or NLB (or Cloud Map for HTTP APIs).
- ECS tasks stay in private subnets with security groups allowing only the load balancer.
- Health checks and TLS between layers.

## CWD context
The backend has no public IP.
