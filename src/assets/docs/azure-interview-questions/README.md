# Azure CWD interview answers - how to use these files

Each file gives a short answer, key points and CWD context for one question. They are **draft reference answers**
written against the reference Azure architecture below. Edit them so they match what you actually built and can defend.

## Reference architecture assumed

Front Door / Application Gateway (WAF) -> API Management (Entra token validation, rate and token limits)
-> FastAPI service on Container Apps hosting the Coordinator (LangGraph) -> Delegators -> Workers
-> MCP servers for Salesforce, ServiceNow, SharePoint, Snowflake and Oracle.

- AI: Azure OpenAI managed through AI Foundry; Azure AI Search (hybrid, ACL filters); Azure ML for custom models.
- Data: Data Factory and Databricks into ADLS Gen2, then AI Search.
- State and messaging: Cosmos DB (state, checkpoints, registries), Azure Cache for Redis, Service Bus with DLQs.
- Security: Entra ID, managed identities, Key Vault, VNet with private endpoints.
- Operations: Azure Monitor / Application Insights, Azure DevOps with Bicep or Terraform.

## Things to check before an interview

- Replace generic statements with your real numbers (latency, cost, volumes, SLAs).
- Azure product names, limits and preview features change; verify against current Microsoft documentation.
- Where a question asks what *you* did, make sure the answer reflects your actual decisions.
