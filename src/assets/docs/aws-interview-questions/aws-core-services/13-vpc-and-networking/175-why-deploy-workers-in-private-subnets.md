# Why deploy Workers in private subnets?

## Short answer
Deploy Workers in private subnets to remove inbound exposure and control outbound access.

## Key points
- No public IPs; smaller attack surface.
- Outbound to enterprise systems through NAT with fixed IPs for allow-listing, or private links.
- Egress filtering to limit data exfiltration.

## CWD context
Workers hold access to sensitive systems, so their network path should be tightly controlled.
