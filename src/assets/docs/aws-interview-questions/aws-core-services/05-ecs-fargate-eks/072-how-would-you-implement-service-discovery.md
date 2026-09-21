# How would you implement service discovery?

## Short answer
Use ECS Service Connect or Cloud Map for network discovery, and the Agent Registry for capability discovery.

## Key points
- Service Connect gives short service names, client-side load balancing and metrics.
- Cloud Map provides DNS-based discovery.
- The registry answers "which agent can do this and where is it".

## CWD context
Never hard-code Delegator endpoints.
