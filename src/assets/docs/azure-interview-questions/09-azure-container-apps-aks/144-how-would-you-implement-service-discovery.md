# How would you implement service discovery?

## Short answer
Service discovery has two levels: network-level and agent-level.

## Key points
- Container Apps environment provides internal DNS per app name; AKS uses Services and DNS.
- Agent-level discovery uses the Agent Registry (capabilities, endpoints, status).
- External traffic enters only through APIM.

## CWD context
Never hard-code Delegator endpoints; resolve through the registry.
