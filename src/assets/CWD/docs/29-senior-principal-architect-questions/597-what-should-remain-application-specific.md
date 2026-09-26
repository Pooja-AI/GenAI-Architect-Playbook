### What should remain application-specific?

The **business logic and use-case-specific behavior** should remain application-specific. The platform should provide the common capabilities.

Keep these application-specific:

* **Business rules** and domain logic.
* **Agent responsibilities** and workflow.
* **Prompts** specific to the use case.
* **RAG knowledge sources** and retrieval strategy.
* **Tool selection** required by that application.
* **LLM/model choice** when the use case has unique requirements.
* **Output format** and business-specific validation.
* **Human approval rules** for sensitive business actions.

**Example:**

```text
Platform standards
    ↓
Identity / Security / MCP / A2A
Observability / CI-CD / Evaluation
    ↓
Application-specific
    ↓
Sales Agent → Salesforce
IT Agent    → ServiceNow
HR Agent    → HR systems
```

**Interview answer:**

> “I would keep the common engineering capabilities centralized in the platform, while keeping business-specific behavior within the application. Things like business rules, agent responsibilities, prompts, knowledge sources, tool selection, output schemas, and approval workflows should remain application-specific. This gives us standardization without making the platform too rigid.”
