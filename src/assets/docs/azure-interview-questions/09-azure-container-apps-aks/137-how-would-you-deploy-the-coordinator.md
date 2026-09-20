# How would you deploy the Coordinator?

## Short answer
Deploy the Coordinator as a stateless, zone-redundant Container App.

## Key points
- Image from ACR; minimum replicas of two or more; internal ingress behind APIM.
- Managed identity, Key Vault secret references, liveness and readiness probes.
- LangGraph checkpoints in Cosmos DB so any replica can resume a run.
- Graceful shutdown; revisions for safe releases.

## CWD context
Statelessness is what allows horizontal scaling and safe restarts.
