### How would you support thousands of agents?

I would build a **shared, scalable Agent Platform** instead of running each agent as a completely independent application.

* **Agent Registry** → centralized discovery, metadata, ownership, versions.
* **Stateless agent runtime** → horizontally scale agents using containers/AKS/Container Apps.
* **Shared platform services** → model gateway, MCP gateway, RAG, auth, observability.
* **Dynamic routing** → Coordinator/Agent Gateway routes requests to the right agents.
* **Queue-based execution** → Service Bus/SQS for asynchronous workloads and traffic spikes.
* **Per-agent/tenant quotas** → prevent noisy-neighbor problems.
* **Caching** → Redis for frequently accessed state/results.
* **Centralized governance** → permissions, approvals, evaluations, lifecycle.
* **Monitoring** → agent-level latency, errors, token usage, cost, and utilization.
* **Auto-scaling** → scale agent workers based on queue depth and traffic.

**Interview answer:**

> “To support thousands of agents, I would build a shared agent platform with centralized registry, discovery, governance, and a horizontally scalable stateless runtime. Common capabilities like model access, MCP, RAG, authentication, and observability would be platform services rather than duplicated inside every agent. Queues, autoscaling, quotas, caching, and per-agent monitoring would allow us to scale while controlling cost and preventing noisy neighbors.”
