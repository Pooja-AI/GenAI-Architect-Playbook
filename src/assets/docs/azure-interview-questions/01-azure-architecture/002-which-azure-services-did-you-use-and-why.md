# Which Azure services did you use and why?

## Short answer
Each service was picked for one clear job, favouring managed PaaS, private networking and identity-based access.

## Key points
- Azure OpenAI / AI Foundry: LLM reasoning, embeddings, evaluation and governance.
- Azure AI Search: hybrid retrieval with document-level security filters.
- API Management: one secured front door with authentication, rate limits and versioning.
- Container Apps (AKS if needed) for Coordinator, Delegators, Workers and MCP servers; Azure Functions for event-driven glue.
- Service Bus for async Worker execution; Cosmos DB for durable state; Redis for cache.
- Entra ID, Key Vault and Private Link for security; Azure Monitor for observability; Azure DevOps for CI/CD.

## CWD context
For every service, be ready to say what you rejected and why (Functions vs Container Apps, Cosmos vs SQL, and so on).

## Interview tip
Lead with the job each service does, not the product name.
