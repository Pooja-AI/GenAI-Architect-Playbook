## Should Workers contain LLM logic?

**They can, but only when the specific Worker needs LLM capabilities.** It should not be mandatory for every Worker.

### When a Worker may use an LLM

For tasks that require **reasoning, summarization, classification, extraction, or natural-language generation**.

Example:

```text
CustomerBriefingWorker
      ↓
Retrieve customer data
      ↓
LLM summarizes the information
      ↓
Return structured summary
```

### When a Worker does NOT need an LLM

For deterministic tasks such as:

* Retrieve customer data from Salesforce
* Get incidents from ServiceNow
* Validate an ID
* Transform JSON
* Query a database

These are better handled with **APIs, MCP tools, or normal code**.

### Important distinction

```text
Coordinator → LLM: Understand intent / plan
Delegator   → LLM: Identify required capabilities (if needed)
Worker      → LLM: Perform capability-specific AI task (if needed)
Worker      → MCP/API: Access enterprise systems
```

**Interview-ready:**

> “Workers can contain LLM logic when their specific capability requires reasoning, summarization, extraction, or generation. But I don't put an LLM into every Worker. For deterministic operations like Salesforce or ServiceNow retrieval, I use MCP/API calls and normal business logic.”

**One-line memory:**
**LLM in Worker = capability-specific AI; not every Worker needs an LLM.**
