# Gateway endpoint vs interface endpoint?

## Short answer
Gateway endpoints are route-table based and free; interface endpoints are ENI-based and charged.

## Key points
- Gateway: S3 and DynamoDB only; not reachable from on-premises or other VPCs.
- Interface: private IPs in your subnets, security-group controlled, many services, reachable over Direct Connect or VPN; hourly and per-GB charges.

## CWD context
Use gateway endpoints for S3 and DynamoDB where possible.
