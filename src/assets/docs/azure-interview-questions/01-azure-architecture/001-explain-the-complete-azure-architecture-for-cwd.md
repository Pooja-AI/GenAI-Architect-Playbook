# Explain the complete Azure architecture for CWD.

## Short answer
CWD on Azure is a layered, private, identity-based architecture: edge and API, orchestration, agents and tools, AI and data services, state and messaging, and a platform layer for security, observability and DevOps.

## Key points
- Edge: Front Door / Application Gateway (WAF) → API Management (Entra token validation, throttling, versioning).
- Orchestration: FastAPI service on Container Apps hosting the Coordinator (LangGraph), which routes to Delegators and Workers.
- Tools: Workers call MCP servers that wrap Salesforce, ServiceNow, SharePoint, Snowflake and Oracle instead of embedding those APIs.
- AI and data: Azure OpenAI (managed through AI Foundry) for reasoning and embeddings, Azure AI Search for RAG, Data Factory / Databricks into ADLS Gen2 for ingestion, Azure ML for custom models.
- State and async: Cosmos DB (session, workflow state, checkpoints), Redis (cache), Service Bus (async Worker jobs, DLQ).
- Platform: Entra ID and managed identities, Key Vault, VNet with private endpoints, Azure Monitor / Application Insights, Azure DevOps with Bicep or Terraform.

## CWD context
Everything sits inside a VNet with private endpoints; users reach it only through APIM.

## Interview tip
Draw it left to right following one request, then name the job of each box.
