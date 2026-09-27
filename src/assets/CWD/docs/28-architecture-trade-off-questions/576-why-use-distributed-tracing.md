### Why use distributed tracing?

Because CWD is a **distributed multi-agent system**. One user request can travel through many services.

```text
User
 ↓
Coordinator
 ↓
Delegator
 ↓
Worker
 ↓
MCP
 ↓
Salesforce / ServiceNow
```

Distributed tracing lets us follow **one request end-to-end** using a **correlation/trace ID**.

* Find **where latency** is occurring.
* Identify **which service failed**.
* Track LLM, RAG, MCP, and downstream calls.
* Understand retries and dependencies.
* Troubleshoot production issues faster.

**Interview answer:**

> “We used distributed tracing because CWD has multiple agents, services, and downstream systems. We propagate a correlation ID across the entire request and trace Coordinator → Delegator → Worker → MCP → enterprise systems. This helps us quickly identify latency, failures, retries, and bottlenecks at the exact layer where they occur.”
