# What are the single points of failure?

## Short answer
Single points of failure are any single instance, region or quota that the whole request path depends on.

## Key points
- Single-region deployment.
- One Azure OpenAI deployment / region quota.
- Single AI Search replica or one Redis node.
- One instance of the Coordinator or an MCP server.
- One Service Bus namespace or one APIM unit.
- Shared Key Vault, DNS or a single CI/CD pipeline.

## CWD context
Also name non-technical ones such as a single on-call owner or an untested failover runbook.
