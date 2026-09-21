## What is a correlation ID?

A **correlation ID is a unique ID assigned to one business request so I can track that request across all CWD components.**

Think of it as the **tracking number for the entire workflow**.

### CWD example

User asks:

> “Give me a Customer Briefing for C12345.”

I create:

```text id="p4x6tq"
correlation_id = CWD-5001
```

That same ID is carried through:

```text id="1w8f8k"
User
 ↓
Coordinator        correlation_id=CWD-5001
 ↓
Sales Delegator    correlation_id=CWD-5001
 ↓
Customer Worker    correlation_id=CWD-5001
 ↓
MCP                correlation_id=CWD-5001
 ↓
Salesforce         correlation_id=CWD-5001
```

So if something fails, I can search logs and traces for:

```text
CWD-5001
```

and see the entire workflow.

### Why is it useful?

Suppose the user sees:

> “Customer briefing failed.”

I search:

```text
correlation_id = CWD-5001
```

and find:

```text
Coordinator       ✓
Sales Delegator   ✓
Customer Worker   ✓
MCP               ✓
Salesforce        ✗ timeout
```

Now I know exactly which request and which component caused the problem.

### Correlation ID vs Trace ID vs Task ID

This is important in interviews:

| ID                 | Purpose                                      |
| ------------------ | -------------------------------------------- |
| **Correlation ID** | Tracks the **overall business workflow**     |
| **Trace ID**       | Connects technical distributed-tracing spans |
| **Task ID**        | Identifies an individual agent task          |
| **Span ID**        | Identifies one specific operation            |

Example:

```text id="b9x3k1"
Correlation ID = CWD-5001
Trace ID       = TR-9001

Coordinator
   ↓
Task ID = TASK-1001
   ↓
Sales Delegator
   ↓
Task ID = TASK-1002
   ↓
Customer Worker
   ↓
Span ID = SPAN-301
   ↓
MCP → Salesforce
```

### Interview-ready answer

> **“A correlation ID is a unique identifier that I assign to a business request and propagate across the CWD workflow. For example, when a Customer Briefing request enters the Coordinator, I generate `CWD-5001` and propagate it through the Delegator, Worker, MCP, and downstream systems. This allows me to correlate logs, errors, metrics, and traces for the same business transaction and quickly troubleshoot failures.”**

### Easy memory

> **Correlation ID = one business request → one tracking ID.**

**Strong interview line:**

> **“If a production issue occurs, I should be able to search by one correlation ID and reconstruct the entire CWD request path.”**
