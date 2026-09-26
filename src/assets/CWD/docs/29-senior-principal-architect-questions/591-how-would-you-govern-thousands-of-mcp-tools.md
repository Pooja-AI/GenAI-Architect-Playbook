### How would you govern thousands of MCP tools?

I would treat MCP tools as **enterprise-managed APIs** with centralized registration, authorization, and lifecycle governance.

* **MCP Tool Registry** → unique tool ID, owner, description, schema, version, risk level.
* **Tool categorization** → read-only, write, destructive, sensitive.
* **Allowlisting** → each Worker/Agent gets only the tools it needs.
* **Authentication & authorization** → Entra/IAM + least privilege.
* **Input validation** → JSON Schema/Pydantic before execution.
* **Approval** → sensitive/destructive tools require additional approval or HITL.
* **Versioning** → don't silently change a production tool contract.
* **Observability** → usage, latency, failures, cost, and audit logs.
* **Lifecycle** → review, deprecate, and remove unused tools.
* **Discovery** → agents discover only tools they are authorized to use.

**Interview answer:**

> “For thousands of MCP tools, I would create a centralized Tool Registry and governance layer. Every tool would have an owner, schema, version, risk classification, and permissions. Agents would receive only an allowlisted subset of tools based on least privilege. Sensitive tools would require additional approval, and all executions would be validated, traced, audited, and monitored. This gives us scalable tool discovery without losing security or governance.”
