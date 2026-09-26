### How do you implement Human-in-the-Loop?

I implement **HITL as a controlled checkpoint before a high-risk action**.

```text id="q4w7kp"
Agent
  ↓
Decide Action
  ↓
Risk / Policy Check
  ↓
High Risk?
  ↓
Pause Workflow
  ↓
Human Approval
  ↙       ↘
Approve   Reject
  ↓         ↓
Execute    Stop
MCP Tool
```

### In CWD

* **LangGraph** pauses the workflow using an interrupt/checkpoint.
* Store the current **task/run state**.
* Send approval request to an authorized reviewer.
* Reviewer sees **action, parameters, reason, and risk**.
* Approval/rejection is recorded.
* On approval, workflow **resumes from the checkpoint** and executes the MCP tool.
* On rejection, workflow stops or takes an alternative path.

**Interview answer:**

> “We implement HITL by placing an approval checkpoint before high-risk tool execution. LangGraph can interrupt and persist the workflow state. We send the proposed action and parameters to an authorized reviewer. If approved, the workflow resumes from the checkpoint and invokes the MCP tool; if rejected, we stop or take an alternative path. The approval decision is also audited with the task and correlation IDs.”
