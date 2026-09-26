### How would you prevent agent sprawl?

**Agent sprawl** means having too many agents doing overlapping or unnecessary work.

I would control it through **centralized governance and reuse**.

* **Agent Registry** → every agent must be registered.
* **Avoid duplicates** → check whether an existing agent already provides the capability.
* **Clear ownership** → every agent has an owner and business purpose.
* **Standard capabilities** → define what each agent is responsible for.
* **Approval process** → require architecture/governance approval for new agents.
* **Lifecycle management** → monitor usage and retire unused agents.
* **Reuse shared Workers/tools** instead of creating new agents unnecessarily.
* **Usage monitoring** → track calls, cost, errors, and business value.

**Interview answer:**

> “I would prevent agent sprawl by making the Agent Registry the central control point. Before creating a new agent, teams must check whether an existing agent can provide the capability. Each agent needs a clear purpose, owner, permissions, and approval. We also monitor usage and periodically retire duplicate or unused agents. The goal is to reuse existing agents, Workers, and tools rather than continuously creating new ones.”
