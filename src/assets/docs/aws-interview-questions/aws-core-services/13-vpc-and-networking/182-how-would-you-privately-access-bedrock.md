# How would you privately access Bedrock?

## Short answer
Access Bedrock privately through interface endpoints for the runtime API.

## Key points
- Endpoint for bedrock-runtime (and the control plane or agent runtime endpoints if used) in private subnets.
- Security group allowing 443 from workloads; private DNS enabled; endpoint policy limiting models.
- No NAT needed for Bedrock traffic.

## CWD context
Combine with IAM restrictions on approved model ARNs.
