### When should an agent ask for human approval?

An agent should request **Human-in-the-Loop (HITL)** approval when an action has **high business, financial, security, privacy, or irreversible impact**.

* **Financial actions** → payments, refunds, purchases.
* **Destructive actions** → delete records, terminate resources.
* **Sensitive data** → confidential HR/PII access.
* **External communication** → sending important customer/legal messages.
* **Production changes** → deployments or configuration changes.
* **Low confidence** → agent cannot reliably determine the correct action.
* **Policy violation risk** → action requires an exception.

**CWD example:**

```text
Agent
  ↓
"Delete customer record?"
  ↓
Risk Check
  ↓
High Risk
  ↓
Human Approval
  ↓
Execute MCP Tool
```

**Interview answer:**

> “An agent should ask for human approval when an action is high-impact, irreversible, sensitive, or outside its defined policy. For example, deleting enterprise data, making financial changes, accessing restricted information, or sending a critical external communication. I would also trigger HITL when the agent has low confidence or encounters a policy exception. The approval should happen before the tool executes the action.”
