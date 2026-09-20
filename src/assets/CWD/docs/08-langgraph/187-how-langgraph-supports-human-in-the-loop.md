## How does LangGraph support Human-in-the-Loop (HITL)?

**LangGraph supports Human-in-the-Loop by allowing a workflow to pause at a specific point, wait for human input/approval, and then resume from the saved state.**

This is very useful in your **CWD enterprise architecture** when an AI agent wants to perform a sensitive action.

### CWD example

Suppose a Worker identifies a request to **create/update a ServiceNow ticket**.

Instead of allowing the AI to execute it immediately:

```text
User
 ↓
Coordinator
 ↓
IT Delegator
 ↓
Incident Worker
 ↓
MCP
 ↓
Create ServiceNow Ticket?
 ↓
┌──────────────────────┐
│ Human Approval       │
│ Approve / Reject     │
└──────────────────────┘
 ↓
Approved
 ↓
MCP Tool
 ↓
ServiceNow
```

---

## 1. Pause the workflow

LangGraph can interrupt execution before a sensitive operation.

Conceptually:

```python
from langgraph.types import interrupt

def approval_node(state):
    approval = interrupt({
        "message": "Approve ServiceNow ticket creation?",
        "customer_id": state["customer_id"],
        "ticket": state["ticket"]
    })

    return {
        "approval": approval
    }
```

At this point, the graph pauses.

The human sees something like:

```text
Customer: C12345

Action:
Create ServiceNow incident

Description:
Customer ABC Corp has 3 open incidents.

Approve?
[ Yes ] [ No ]
```

---

## 2. Persist the state

The workflow state should be checkpointed before/around the interruption.

For example:

```text
State
 ├── customer_id = C12345
 ├── intent = incident
 ├── ticket = {...}
 └── status = waiting_for_approval
```

The checkpoint allows the workflow to remain paused without losing its progress.

---

## 3. Human provides a decision

Suppose the human selects:

```text
APPROVE
```

The workflow resumes with that decision.

Conceptually:

```python
app.invoke(
    Command(resume="approve"),
    config
)
```

Then the graph continues:

```text
Human Approval
      ↓
Approved
      ↓
Incident Worker
      ↓
MCP
      ↓
ServiceNow
```

If the human rejects:

```text
Human Approval
      ↓
Rejected
      ↓
Stop / Alternative Path
```

---

# Where should HITL be used in CWD?

You don't want humans involved in every normal operation.

Use HITL for **high-risk or irreversible actions**, such as:

* Creating/deleting enterprise records
* Sending external communications
* Updating critical customer information
* Financial transactions
* Privileged operations
* Production configuration changes
* Sensitive data access
* Low-confidence AI decisions

For read-only operations:

```text
Worker → MCP → Salesforce
```

may not need approval.

For destructive operations:

```text
Worker → MCP → Delete Record
             ↑
        Human Approval
```

approval may be required.

---

# HITL with CWD

A good architecture is:

```text
                    ┌── Sales Delegator
                    │
Coordinator ────────┤
                    └── IT Delegator
                           ↓
                      Incident Worker
                           ↓
                     Validation Node
                           ↓
                    Risk/Policy Check
                           ↓
                    ┌──────────────┐
                    │ HITL         │
                    │ Approval     │
                    └──────────────┘
                       ↓       ↓
                    Approve   Reject
                       ↓         ↓
                     MCP      Stop
                       ↓
                  ServiceNow
```

The important point is that **HITL is a workflow control point**, not a replacement for security authorization.

Even if a human approves an action, the MCP server should still perform its own authorization checks.

---

## HITL vs Authorization

These are different.

**Authorization:**

> "Is this agent allowed to perform this operation?"

**Human approval:**

> "Has an authorized human approved this particular action?"

For example:

```text
Worker requests delete_ticket
        ↓
Authorization
        ↓
Allowed?
        ↓ YES
Human Approval
        ↓
Approved?
        ↓ YES
MCP Tool
        ↓
ServiceNow
```

This gives you **defense in depth**.

---

## Interview-ready answer

> **“LangGraph supports human-in-the-loop by allowing the workflow to interrupt at a defined point, persist the current state through checkpointing, wait for human input or approval, and then resume the workflow with the human's decision. In our CWD architecture, I would use HITL for high-risk operations such as creating, updating, or deleting sensitive enterprise records. For example, before an Incident Worker uses an MCP tool to create a ServiceNow ticket, the workflow can pause for approval. Once approved, it resumes and executes the MCP call. Authorization and security checks still happen independently.”**

### Easy memory

**Interrupt → Persist → Human decides → Resume**

And for CWD:

> **LangGraph controls the HITL workflow; MCP controls the tool execution; authorization controls whether the action is permitted.**
