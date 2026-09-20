In your **CWD (Coordinator → Delegator → Worker)** architecture, synchronous means the calling component **waits for the response before continuing**.

### Synchronous components in CWD

A typical synchronous flow is:

```text
User
  ↓
FastAPI
  ↓
Coordinator
  ↓
Delegator
  ↓
Worker
  ↓
MCP Tool
  ↓
Salesforce / ServiceNow
```

For example, for a **Customer Briefing** request:

```text
User
  ↓
Coordinator
  ↓
Sales Delegator
  ├── Salesforce Worker
  └── Customer Worker
  ↓
Coordinator
  ↓
Final Response
```

### What is synchronous?

**1. FastAPI → Coordinator**

The API request waits for the Coordinator to complete the workflow.

**2. Coordinator → Delegator**

The Coordinator invokes the appropriate Delegator and waits for its result.

**3. Delegator → Worker**

When a Worker is required for the current execution path, the Delegator waits for its result.

**4. Worker → MCP Tool**

The Worker calls an MCP tool and waits for the tool response.

For example:

```text
Salesforce Worker
      ↓
MCP Server
      ↓
Salesforce API
      ↓
Customer data
      ↓
Worker
```

The Worker needs the Salesforce response before it can produce its result.

### But Workers can execute in parallel

This is an important distinction.

Suppose the Sales Delegator needs:

```text
Salesforce Worker
ServiceNow Worker
```

These two Workers may be **independent**, so we can execute them concurrently:

```text
                  ┌── Salesforce Worker ──→ Result
Sales Delegator ──┤
                  └── ServiceNow Worker ──→ Result
                                      ↓
                                  Aggregation
```

The Delegator/Coordinator waits for the required results, but the Workers themselves don't necessarily execute one after another.

So:

> **Synchronous does not necessarily mean sequential.**

You can have **synchronous waiting with parallel execution**.

### Interview answer

> **“In CWD, the request path from FastAPI to the Coordinator, Delegator, Worker, and required MCP tool calls is generally synchronous from the workflow's perspective because the workflow needs the results to continue. However, independent Workers are executed concurrently to reduce latency. Once their results are available, the Delegator or Coordinator aggregates and validates them before producing the final response.”**

### Simple way to remember

```text
Synchronous = "I need your result before I can continue."

Parallel = "I can ask multiple components at the same time."

Asynchronous = "I don't need to wait for your result right now."
```

For your CWD interview, **“synchronous + parallel Workers”** is an important architectural distinction.
