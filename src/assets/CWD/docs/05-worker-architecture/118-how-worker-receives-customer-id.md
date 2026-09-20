## Should every Worker have its own prompt?

**No. Every Worker does not need a prompt.**

A prompt is needed **only if that Worker uses an LLM**.

### Example

```text id="6c2w4d"
CustomerProfileWorker
    ↓
MCP → Salesforce
    ↓
No LLM → No prompt needed
```

But:

```text id="2u6q7k"
CustomerSummaryWorker
    ↓
Retrieve customer data
    ↓
LLM
    ↓
Prompt → Generate summary
```

### If a Worker uses an LLM

Its prompt should be **specific to that Worker’s capability**.

For example:

```text
Worker: CustomerSummaryWorker

Prompt:
"Summarize the following customer information.
Include key business details, recent activity,
and open issues. Do not invent information."
```

### In CWD

Prompts can be managed through a **Prompt Registry** rather than hardcoding them inside every Worker.

```text
Worker
  ↓
Prompt Registry
  ↓
Worker-specific prompt
  ↓
LLM
```

This makes prompts easier to **version, test, update, and monitor**.

**Interview-ready:**

> “No, every Worker doesn't need its own prompt. Only LLM-based Workers need prompts, and those prompts should be specific to the Worker’s capability. We can manage them centrally through a Prompt Registry for versioning and governance.”

**One-line memory:**
**No LLM → no prompt. LLM Worker → capability-specific prompt.**
