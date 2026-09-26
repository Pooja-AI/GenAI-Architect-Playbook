### How do you prevent agent-to-agent loops?

Use **workflow controls and execution limits**.

* **Max hop/depth limit** → e.g., Coordinator → Delegator → Worker; don't allow unlimited delegation.
* **Visited-agent tracking** → maintain a `visited_agents` set in workflow state.
* **Cycle detection** → reject `A → B → A` patterns.
* **Clear agent boundaries** → each agent has defined responsibilities.
* **Allowed-agent matrix** → define which agents can call which other agents.
* **Task/TTL limit** → expire workflows that run too long.
* **Max tool/agent calls** → stop excessive recursive execution.
* **Correlation ID + tracing** → detect repeated calls in the same task.

```text
Agent A
   ↓
Agent B
   ↓
Agent A  ← detected
   ↓
STOP / ESCALATE
```

**Interview answer:**

> “We prevent agent-to-agent loops using a combination of maximum delegation depth, visited-agent tracking, cycle detection, and an allowed-agent communication matrix. We also enforce task timeouts and maximum agent-call limits. If a cycle such as A → B → A is detected, we stop the workflow and either return an error or escalate for review.”
