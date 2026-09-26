### What makes CWD agentic?

CWD is **agentic because the system can reason about a request, plan the work, dynamically select agents/tools, execute multiple steps, and adapt based on results**.

Key characteristics:

* **Intent understanding** → Coordinator determines what the user wants.
* **Planning & routing** → Coordinator selects the appropriate Delegator.
* **Delegation** → Delegator selects the right Workers.
* **Tool selection** → Workers dynamically choose MCP tools.
* **Multi-step execution** → Tasks can involve multiple dependent steps.
* **Parallel execution** → Independent Workers can run simultaneously.
* **State & memory** → Workflow state is maintained across steps.
* **Adaptation** → Results/errors can change the next action.
* **Human-in-the-loop** → Sensitive actions can require approval.

```text
User
 ↓
Coordinator → Understand + Plan
 ↓
Delegator → Delegate
 ↓
Workers → Decide + Execute
 ↓
MCP Tools → Enterprise Systems
 ↓
Results
 ↓
Agent adapts / continues
```

**Interview answer:**

> “CWD is agentic because it goes beyond simple request-response. The Coordinator understands the intent and creates a plan, Delegators dynamically delegate tasks to specialized Workers, and Workers select and invoke tools through MCP. The system maintains state, can execute tasks in parallel, handles failures and retries, and can adapt its next action based on intermediate results. That combination of reasoning, planning, tool use, delegation, and adaptive execution makes it agentic.”
