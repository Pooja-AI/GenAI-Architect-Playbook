# How do you distribute traffic across containers?

## Short answer
Distribute traffic with an Application Load Balancer across AZs.

## Key points
- Path- and host-based routing, weighted target groups, connection draining.
- Cross-zone balancing; NLB for TCP needs.
- Service-to-service traffic through Service Connect or an internal ALB.

## CWD context
Keep external and internal load balancers separate.
