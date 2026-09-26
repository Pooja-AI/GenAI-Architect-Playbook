For your **CWD architecture**, answer this in 6 areas:

### How do you govern agents?

1. **Agent Registry**

   * Maintain approved agents, versions, owners, capabilities, and allowed tools.
   * Coordinator/Delegator can only select **registered agents**.

2. **Identity & Access**

   * Use **Entra ID + RBAC/Managed Identity**.
   * Each agent gets only the permissions it needs.

3. **Tool Governance**

   * Maintain an allowlist of MCP tools per Worker.
   * Validate tool inputs and enforce authorization before execution.

4. **Prompt & Model Governance**

   * Version prompts and models.
   * Test changes through evaluation before production.
   * Maintain approval/version history.

5. **Observability & Audit**

   * Track `user → Coordinator → Delegator → Worker → MCP tool`.
   * Use correlation IDs, App Insights, Log Analytics, and Langfuse.

6. **Safety & Lifecycle**

   * Apply content/security guardrails, PII/DLP checks, rate limits, human approval for sensitive actions, and agent version/deprecation policies.

### Interview answer

> **"I govern agents through an Agent Registry, identity and RBAC, tool allowlists, prompt and model versioning, evaluation gates, observability, and audit controls. Every agent has an owner, defined capabilities, approved tools, and permissions. Only registered and approved agents can participate in the workflow, and sensitive actions require additional authorization or human approval."**
