**Task completion rate** is the share of tasks the agent finished successfully from the user's point of view. Where routing and tool-call accuracy check the steps, this checks whether the goal was achieved.

**How it's calculated**
Task completion rate = successfully completed tasks ÷ total tasks attempted.

Decide what counts as success before measuring:
- **Outcome checks:** the ticket really is closed, the record was updated, or the answer contains the required facts. Where possible verify the state in the target system rather than trusting the agent's message.
- **LLM-as-judge:** a judge compares the final result with the task's success criteria.
- **Human review:** for a sample, especially ambiguous or high-risk tasks.

**Useful variants**
- **Strict vs partial completion:** score 1, 0.5 and 0, or count partial completions separately, for multi-step tasks.
- **First-attempt completion:** without retries, fallbacks or human help.
- **Completion within limits:** within the latency, cost and step budget.
- **Escalation rate:** correctly handing off to a human counts differently from failing silently.

**Example**
- Task: "Create a ServiceNow incident for customer X and email them the ticket number."
- The incident is created but the email is never sent. Under strict scoring this is a failure. Under partial scoring it is 0.5.

**How it differs from related metrics**
- **Routing accuracy and tool-call accuracy:** diagnose why a task failed.
- **Answer relevance and faithfulness:** score the text, not whether the goal was met.
- **Agent trajectory evaluation:** judges the path. An agent can complete a task by a wasteful or unsafe path, so read completion together with trajectory and safety.

**Why it matters for CWD**
It is the headline outcome metric for an agentic system, and the one business owners understand. Slice it by intent, Delegator and tenant to find where CWD is weak. Track the completion rate alongside cost and latency per task.

**Ways to improve it**
- Fix the biggest failure cause found in the breakdown (routing, tool arguments, timeouts, missing permissions).
- Add validation and retries for transient errors, with idempotent tools.
- Ask clarifying questions instead of guessing.
- Resume from checkpoints instead of restarting failed runs.

**Caveat:** Reported success can be wrong, because an agent may claim it finished when it hasn't. Verify against the real system state, and audit a sample by hand.
