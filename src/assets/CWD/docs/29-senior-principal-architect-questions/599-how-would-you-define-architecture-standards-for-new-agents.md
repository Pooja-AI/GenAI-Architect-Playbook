### How would you define architecture standards for new agents?

I would create a **standard Agent Architecture Template + checklist** that every new agent must follow.

* **Interface:** standard A2A/API contract.
* **Identity & security:** Entra ID, RBAC/ABAC, least-privilege permissions.
* **Tools:** MCP-based integration with tool allowlists.
* **LLM:** approved models through the Model Registry.
* **Prompts:** versioned prompts through the Prompt Registry.
* **Data/RAG:** approved data sources with ACL filtering.
* **Reliability:** timeout, retry, circuit breaker, DLQ where applicable.
* **Observability:** correlation ID, traces, logs, metrics, token/cost tracking.
* **Evaluation:** accuracy, groundedness, safety, latency, and cost.
* **Deployment:** CI/CD, testing, approval, canary, rollback.

**Interview answer:**

> “I would define a standard architecture template and governance checklist for every new agent. It would cover identity, A2A communication, MCP tools, approved models and prompts, data access, reliability, observability, evaluation, security, and deployment. A new agent would need to pass these standards and approval gates before moving to production.”
