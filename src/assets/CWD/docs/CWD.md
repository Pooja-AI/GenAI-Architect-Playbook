## What is CWD?

**CWD stands for Coordinator, Delegator, and Worker.**

CWD is an enterprise AI orchestration platform designed to help business users complete complex tasks through a coordinated network of specialized AI agents.

Instead of building one large AI agent that performs every activity, CWD divides responsibilities into three layers:

- **Coordinator:** Understands the user’s request, creates the execution plan, and manages the overall workflow.
- **Delegator:** Represents a business domain and assigns tasks to the appropriate specialized agents.
- **Worker:** Executes specific business operations, such as retrieving data, calling enterprise APIs, performing analysis, or generating documents.

### Simple Example

A user asks:

> “Prepare a customer briefing document.”

CWD coordinates the process:

```text
User Request
     ↓
Coordinator
     ↓
Sales Delegator
     ↓
Customer Data Worker
     ↓
Sales Analysis Worker
     ↓
Document Generation Worker
     ↓
Final Customer Briefing