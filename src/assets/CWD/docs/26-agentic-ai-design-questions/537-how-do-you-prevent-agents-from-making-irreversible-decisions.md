### How do you prevent agents from making irreversible decisions?

Use **policy enforcement + tool controls + human approval** before execution.

* **Classify tools by risk** → read-only, write, destructive, privileged.
* **Allowlist tools** → agent gets only the tools it needs.
* **Policy engine** → block prohibited actions automatically.
* **Human approval** → required for destructive/irreversible operations.
* **Authorization** → verify user and agent permissions before execution.
* **Input validation** → validate parameters with schema/Pydantic.
* **Dry-run/preview** → show the intended change before execution when possible.
* **Audit trail** → record who requested, who approved, and what executed.
* **Idempotency** → prevent accidental duplicate actions.

```text
Agent Decision
      ↓
Risk Check
      ↓
Policy + Authorization
      ↓
High Risk?
   ↙       ↘
 Yes       No
 ↓          ↓
HITL      Execute
 ↓
Approved
 ↓
MCP Tool
```

**Interview answer:**

> “I prevent agents from making irreversible decisions by separating decision-making from execution. The agent can propose an action, but the tool layer enforces authorization, policy, risk classification, and parameter validation. Destructive or high-impact actions require human approval before the MCP tool is executed. We also use allowlists, audit logs, and dry-run capabilities where possible.”
