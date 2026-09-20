# How does a Worker access Azure resources securely?

## Short answer
A Worker gets a token for its managed identity and calls Azure resources over private endpoints.

## Key points
- RBAC roles such as Search Index Data Reader, Cosmos DB data-plane roles and Service Bus Data Receiver.
- Enterprise systems are reached through MCP with credentials from Key Vault or OBO.

## CWD context
Each Worker's identity lists exactly what it may touch.
