### Is CWD autonomous?

**Partially autonomous — not fully autonomous.**

CWD can autonomously:

* Understand user intent.
* Create an execution plan.
* Select Delegators and Workers.
* Select authorized MCP tools.
* Execute multi-step tasks.
* Run independent tasks in parallel.
* Retry transient failures and adapt based on results.

But **high-risk actions require controls**, such as:

* Authorization checks.
* Tool allowlists.
* Human approval for sensitive/destructive operations.
* Policy and security validation.

**Interview answer:**

> “CWD is partially autonomous. It can independently reason, plan, delegate tasks, select authorized tools, execute workflows, and handle recoverable failures. However, we don't give it unrestricted autonomy. Sensitive or high-impact actions require authorization, policy checks, and human approval. So I would describe CWD as a governed autonomous agentic system rather than a fully autonomous system.”
