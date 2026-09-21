# How would you secure traffic between services?

## Short answer
Secure service-to-service traffic with layered controls.

## Key points
- Security groups referencing security groups; private subnets.
- TLS everywhere, including internal hops; IAM or JWT authentication between services.
- Endpoint policies, NACLs for coarse denies, Flow Logs, Network Firewall for egress.
- PrivateLink to expose MCP servers across accounts.

## CWD context
Authenticate every call; do not trust the network.
