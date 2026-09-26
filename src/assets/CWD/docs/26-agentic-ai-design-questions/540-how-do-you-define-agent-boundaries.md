### How do you define agent boundaries?

I define boundaries using **responsibility + permissions + tools + data + risk**.

* **Responsibility** → clearly define what the agent is allowed to do.
* **Tools** → allowlist only required MCP tools.
* **Data** → restrict access to approved datasets/knowledge sources.
* **Permissions** → least-privilege RBAC/ABAC.
* **Actions** → define read/write/destructive limits.
* **Domain** → keep the agent within its business domain.
* **Risk limits** → high-risk actions require HITL.
* **Time/cost limits** → token, execution-time, and budget limits.
* **Escalation** → outside boundary → stop or hand off to another agent/human.

**Example:**

```text id="4n4x3p"
Sales Worker
  ├── Can: read Salesforce customer data
  ├── Can: create customer briefing
  ├── Cannot: access HR data
  ├── Cannot: delete customer records
  └── Cannot: approve financial transactions
```

**Interview answer:**

> “I define agent boundaries through a combination of responsibility, data access, tool permissions, and risk policies. Each agent gets only the capabilities and tools required for its role. Actions outside its domain are blocked or delegated, and high-risk operations require human approval. This gives us clear separation of responsibility and prevents agents from operating beyond their intended scope.”
