# How would you design multi-AZ CWD?

## Short answer
Design multi-AZ by spreading every tier across at least two, preferably three, AZs with headroom.

## Key points
- Subnets in each AZ; ALB cross-zone; ECS desired count across AZs with spread placement.
- NAT per AZ with per-AZ routes; ElastiCache replication group with Multi-AZ.
- Capacity headroom (N+1) so losing an AZ does not overload the rest.
- Test with AWS Fault Injection Service.

## CWD context
Cost of headroom is the price of surviving an AZ loss.
