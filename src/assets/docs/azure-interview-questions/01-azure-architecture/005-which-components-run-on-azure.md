# Which components run on Azure?

## Short answer
Every CWD component runs on Azure except the enterprise source systems (Salesforce, ServiceNow, Oracle, Snowflake), which are reached through MCP.

## Key points
- Application tier: FastAPI gateway, Coordinator, Delegators, Workers, MCP servers on Container Apps; Functions for triggers.
- AI tier: Azure OpenAI, AI Foundry, Azure AI Search, Azure ML endpoints.
- Data tier: ADLS Gen2, Cosmos DB, Redis, Data Factory / Databricks.
- Platform tier: APIM, Service Bus, Key Vault, Entra ID, Monitor, Azure DevOps.

## CWD context
Data from external systems is ingested (batch) or fetched live (MCP) depending on freshness needs.
