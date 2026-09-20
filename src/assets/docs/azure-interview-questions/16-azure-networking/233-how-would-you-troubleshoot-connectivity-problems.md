# How would you troubleshoot connectivity problems?

## Short answer
Troubleshoot connectivity in a fixed order: DNS, network rules, routing, service settings, identity.

## Key points
- Does the name resolve to the private IP? Is the DNS zone linked?
- Effective NSG rules, route tables and Firewall logs.
- Private endpoint approved; service firewall settings.
- A 403 is usually identity or RBAC, not network.
- Tools: Network Watcher connection troubleshoot, IP flow verify, next hop and flow logs.

## CWD context
Test from the same subnet as the failing workload.
