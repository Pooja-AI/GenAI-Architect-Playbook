# Which services should be private?

## Short answer
Make every PaaS data and AI service private, and expose only the edge.

## Key points
- Azure OpenAI, AI Search, Cosmos DB, Redis, Service Bus, Key Vault, Storage, ACR, Azure ML.
- Databricks with VNet injection; ADF managed private endpoints.
- Container Apps with internal ingress.

## CWD context
Turn off public network access on each service once the private endpoint works.
