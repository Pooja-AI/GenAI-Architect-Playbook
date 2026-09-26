### Why multi-agent instead of single-agent?

For CWD, we used **multi-agent** because the platform handles different enterprise domains and responsibilities.

* **Coordinator** → understands intent and creates the plan.
* **Delegator** → manages a specific domain, such as Sales or IT.
* **Workers** → perform specialized tasks using specific tools.
* Agents can execute tasks **in parallel**.
* Each agent has **limited tools and permissions**, improving security and governance.
* Individual agents can be **developed, tested, scaled, and monitored independently**.

**Interview answer:**

> “We chose multi-agent because CWD has multiple enterprise domains and specialized capabilities. Instead of one agent having access to every tool and responsibility, we separated responsibilities into Coordinator, Delegators, and specialized Workers. This gives us better modularity, parallel execution, security, governance, and independent scalability.”
