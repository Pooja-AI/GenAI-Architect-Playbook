# Explain the end-to-end request flow in Azure.

## Short answer
A request travels Front Door → APIM → CWD API → Coordinator → Delegator → Worker → MCP tool or AI Search → back through validation and aggregation.

## Key points
- Auth: the user signs in with Entra ID; APIM validates the JWT, applies rate limits and adds a correlation ID.
- Plan: the Coordinator loads session state, classifies intent with Azure OpenAI, builds the plan and validates Delegators against the Agent Registry.
- Execute: Delegators fan out to Workers (in-process for short work, via Service Bus for long work); Workers query AI Search with ACL filters or call MCP tools.
- Respond: results are validated and aggregated, a grounded answer with citations is generated, output guardrails run, state is saved to Cosmos DB and the trace goes to Application Insights.
- Long-running work returns 202 Accepted plus a status endpoint.

## CWD context
The synchronous path is the user-facing critical path; anything slow or with side effects goes async.
