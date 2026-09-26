### How do you control agent planning?

Use **bounded planning** rather than allowing the agent to create unlimited steps.

* **Define allowed capabilities** → agent can plan only within its responsibility.
* **Plan schema** → require structured steps, not free-form execution.
* **Policy validation** → validate the plan before execution.
* **Tool allowlist** → plan can reference only approved tools.
* **Maximum steps/depth** → prevent infinite or overly complex plans.
* **Risk checks** → high-risk steps require approval.
* **Budget limits** → control tokens, time, and tool calls.
* **Checkpointing** → persist state and validate progress between steps.
* **Re-planning rules** → allow replanning only when a defined condition occurs.

```text
User Request
     ↓
Coordinator
     ↓
Generate Plan
     ↓
Validate Plan
 ┌───┴────────┐
Valid        Invalid
 ↓              ↓
Execute       Reject / Replan
 ↓
Checkpoint
 ↓
Next Step
```

**Interview answer:**

> “We control agent planning by constraining what the agent is allowed to plan and execute. The Coordinator generates a structured plan, which is validated against agent capabilities, tool permissions, security policies, and execution limits before running. We also enforce maximum steps, tool-call budgets, timeouts, and checkpoints. For high-risk actions, the plan pauses for human approval before execution.”
