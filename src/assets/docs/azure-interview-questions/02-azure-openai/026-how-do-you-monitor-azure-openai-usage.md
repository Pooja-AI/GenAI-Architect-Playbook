# How do you monitor Azure OpenAI usage?

## Short answer
Monitor Azure OpenAI through platform metrics, diagnostic logs and application-level custom dimensions.

## Key points
- Azure Monitor metrics: request count, processed prompt tokens, generated tokens, PTU utilisation.
- Diagnostic settings to Log Analytics; APIM token-metric policy with tenant and agent dimensions.
- Application Insights custom dimensions for agent, Worker, prompt and model version.
- Dashboards, budgets and alerts in Azure Monitor and Cost Management.

## CWD context
Tag every call with tenant, agent and prompt version so cost and quality can be sliced later.
