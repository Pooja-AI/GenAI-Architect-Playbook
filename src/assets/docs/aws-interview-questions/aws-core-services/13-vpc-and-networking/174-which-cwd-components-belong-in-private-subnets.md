# Which CWD components belong in private subnets?

## Short answer
Almost everything belongs in private subnets.

## Key points
- ECS Coordinator, Delegators, Workers and MCP servers; Lambda in VPC.
- ElastiCache, databases and SageMaker endpoints.
- Public: only the internet-facing edge and NAT gateways.

## CWD context
If a component does not need to be reached from the internet, it must not be reachable.
