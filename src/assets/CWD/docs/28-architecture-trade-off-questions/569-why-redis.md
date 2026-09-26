### Why Redis?

In CWD, Redis was mainly used for **fast, temporary state and caching**.

* **Low-latency** → faster than querying a persistent database for every request.
* **Session/state management** → store active conversation or workflow state.
* **Caching** → cache repeated LLM/RAG/tool results where appropriate.
* **Idempotency** → store request/idempotency keys to detect duplicate requests.
* **Distributed locking** → prevent multiple workers from processing the same task.
* **TTL support** → automatically expire temporary data.

**Interview answer:**

> “We used Redis for low-latency, temporary state and caching. It helped us manage active sessions, workflow state, idempotency keys, and cached results. We used a persistent store such as Cosmos DB for durable state, while Redis handled fast-access data with TTL and high-throughput requirements.”
