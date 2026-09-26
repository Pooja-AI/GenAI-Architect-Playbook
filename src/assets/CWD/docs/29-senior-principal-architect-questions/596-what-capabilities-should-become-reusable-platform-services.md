### What capabilities should become reusable platform services?

Anything that is **common across multiple AI applications** should become a platform service.

* **Identity & access** → Entra ID, RBAC/ABAC, authorization.
* **Agent Registry** → agent discovery, metadata, lifecycle.
* **Model Registry / AI Gateway** → approved models, routing, fallback.
* **Prompt Registry** → versioning, approval, rollback.
* **Tool/MCP Gateway** → tool discovery, authorization, auditing.
* **RAG service** → ingestion, indexing, retrieval, reranking.
* **Guardrails** → prompt-injection, PII, content and policy checks.
* **Observability** → logs, metrics, traces, cost/token monitoring.
* **Evaluation service** → quality, groundedness, safety, regression testing.
* **Workflow/reliability services** → queues, retries, DLQ, circuit breakers.
* **Secrets/configuration** → Key Vault/Secrets Manager and centralized configuration.
* **CI/CD & deployment templates** → standardized build, security scanning, canary, rollback.

**Interview answer:**

> “I would turn cross-cutting capabilities into reusable platform services—identity, agent/model/prompt/tool registries, MCP and RAG services, guardrails, evaluation, observability, reliability, secrets, and CI/CD. Applications would consume these services through standard interfaces instead of implementing them independently. This improves consistency, security, and development speed across the enterprise.”
