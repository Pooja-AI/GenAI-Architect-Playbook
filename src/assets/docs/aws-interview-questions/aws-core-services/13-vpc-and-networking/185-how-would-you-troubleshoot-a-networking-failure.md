# How would you troubleshoot a networking failure?

## Short answer
Troubleshoot networking by tracing the path in a fixed order.

## Key points
- DNS resolution (private DNS and endpoint names), route tables, security groups on both ends, NACLs in both directions.
- Endpoint policies, NAT gateway health and port allocation, target group health.
- An AccessDenied error is IAM; a timeout is usually network.
- Tools: VPC Reachability Analyzer, Flow Logs, Network Access Analyzer, NAT metrics.

## CWD context
Test from the same subnet as the failing workload.
