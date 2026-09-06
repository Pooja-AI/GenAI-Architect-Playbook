# Human Approval and Intervention in CWD

> **Human-in-the-loop (HITL) execution allows CWD to pause autonomous agent execution at controlled approval gates, present the required context and risk information to an authorized human, capture the decision, and then safely continue, modify, or terminate the workflow.**

This is especially important when CWD performs actions where **autonomous execution should not be the final authority**.

Examples include:

* high-risk operational changes
* sensitive data access
* financial or business-critical decisions
* production changes
* security actions
* exception handling
* low-confidence decisions
* policy exceptions
* irreversible operations
* actions with significant business impact

The key principle is:

> **CWD should remain autonomous for routine execution, but introduce human authority where risk, policy, uncertainty, or business responsibility requires it.**

---

# 1. Why Human Approval Is Needed

A typical autonomous CWD workflow is:

```text
User Request
     │
     ▼
Coordinator
     │
     ▼
Delegator
     │
     ▼
Worker
     │
     ▼
Tool / Enterprise System
     │
     ▼
Result
```

For low-risk operations, this may be sufficient.

For a high-risk operation:

```text
Worker
  │
  ▼
Risk / Approval Required
  │
  ▼
HUMAN APPROVAL
  │
  ├── Approve
  ├── Reject
  └── Request Changes
  │
  ▼
Continue / Modify / Stop
```

The human becomes an **explicit control point in the workflow**, rather than an informal reviewer outside the system.

---

# 2. Human Approval as a State Transition

Human intervention fits naturally into the CWD execution-state model.

Instead of:

```text
Worker → Tool → Success
```

the workflow becomes:

```text
Worker
   │
   ▼
Approval Required
   │
   ▼
WAITING_FOR_APPROVAL
   │
   ▼
Human Decision
   │
   ├── APPROVED
   ├── REJECTED
   └── CHANGES_REQUESTED
```

The workflow state might contain:

```python
state = {
    "status": "WAITING_FOR_APPROVAL",

    "approval_required": True,

    "approval": {
        "request_id": "approval-123",
        "reason": "High-risk production operation",
        "requested_by": "coordinator",
        "required_role": "authorized_approver",
        "status": "PENDING"
    }
}
```

This state is then checkpointed.

---

# 3. Approval Gate

An approval gate is a controlled workflow point where CWD must obtain authorization before proceeding.

```text
                    Workflow
                       │
                       ▼
                 Risk Evaluation
                       │
                ┌──────┴──────┐
                ▼             ▼
             Low Risk      High Risk
                │             │
                ▼             ▼
             Continue     Approval Gate
                              │
                              ▼
                         Human Review
                              │
                    ┌─────────┼─────────┐
                    ▼         ▼         ▼
                 Approve    Reject    Modify
                    │         │         │
                    ▼         ▼         ▼
                 Continue    Stop    Replan
```

The approval gate should be **deterministic and policy-controlled**, not merely an LLM recommendation.

---

# 4. Where Can Approval Be Introduced?

Human approval can exist at multiple levels of CWD.

### Coordinator level

For enterprise-wide high-impact decisions:

```text
Coordinator
    │
    ▼
Risk Assessment
    │
    ▼
Human Approval
```

### Delegator level

For domain-specific decisions:

```text
Delegator
    │
    ▼
Domain Validation
    │
    ▼
Approval
```

### Worker level

Immediately before a sensitive tool/action:

```text
Worker
   │
   ▼
Prepare Action
   │
   ▼
Approval Gate
   │
   ▼
MCP Tool
```

The closer the approval is to the actual side effect, the more directly it can protect the operation.

---

# 5. Example: High-Risk Production Operation

Suppose CWD determines that a production configuration needs to be changed.

The workflow could be:

```text
User Request
      │
      ▼
Coordinator
      │
      ▼
Delegator
      │
      ▼
Worker
      │
      ▼
Analyze Configuration
      │
      ▼
Generate Proposed Change
      │
      ▼
Validation
      │
      ▼
Risk Assessment
      │
      ▼
APPROVAL GATE
      │
      ▼
Authorized Human
      │
      ▼
Approved?
   ┌──┴──┐
  Yes    No
   │      │
   ▼      ▼
Execute  Stop
   │
   ▼
Validate
   │
   ▼
Complete
```

The agent can prepare the action, but the authorized human controls whether the high-risk action proceeds.

---

# 6. Human Approval Request

The approval request should contain enough information for the human to make an informed decision.

For example:

```json
{
  "approval_id": "approval-123",
  "workflow_id": "wf-456",
  "task_id": "task-789",

  "requested_action": "Apply production configuration change",

  "reason": "Configuration drift detected",

  "risk_level": "HIGH",

  "impact": {
    "environment": "production",
    "systems_affected": 3
  },

  "evidence": [
    "Configuration comparison",
    "Validation results",
    "Risk analysis"
  ],

  "proposed_action": "...",

  "rollback_plan": "...",

  "expires_at": "...",

  "required_role": "production_approver"
}
```

The human should not have to reconstruct the reasoning from raw logs.

---

# 7. Approval Decision

A human decision becomes part of execution state.

### Approved

```python
state["approval"] = {
    "status": "APPROVED",
    "approved_by": "authorized_user",
    "decision_time": "...",
    "decision_reason": "Validated and approved"
}
```

Workflow:

```text
APPROVED
   │
   ▼
Continue
   │
   ▼
Execute Action
```

### Rejected

```text
REJECTED
   │
   ▼
Stop / Recover
```

### Changes Requested

```text
CHANGES_REQUESTED
       │
       ▼
Return to Planning
       │
       ▼
Modify Plan
       │
       ▼
Validate
       │
       ▼
Approval Again
```

---

# 8. Human Intervention Is More Than Approval

HITL does not necessarily mean only:

```text
Approve / Reject
```

It can also include:

```text
┌─────────────────────────┐
│ Human Intervention      │
├─────────────────────────┤
│ Approve                 │
│ Reject                  │
│ Modify parameters       │
│ Provide missing input   │
│ Select alternative      │
│ Override recommendation │
│ Resolve exception       │
│ Request re-analysis     │
└─────────────────────────┘
```

This is useful when the agent has sufficient information to prepare a decision but not enough authority or certainty to finalize it.

---

# 9. Exception Handling

Human intervention is particularly useful when automated recovery cannot safely resolve an exception.

For example:

```text
Worker
  │
  X
Failure
  │
  ▼
Retry
  │
  X
Failure
  │
  ▼
Alternate Worker
  │
  X
Failure
  │
  ▼
Human Escalation
```

The state becomes:

```text
status = WAITING_FOR_HUMAN
exception = "Unable to complete task automatically"
```

The human can then decide:

```text
Continue
Retry
Change approach
Skip task
Cancel workflow
```

---

# 10. Human Approval + Checkpointing

This is one of the most important relationships.

```text
Agent Execution
      │
      ▼
Approval Required
      │
      ▼
Persist State
      │
      ▼
CHECKPOINT
      │
      ▼
Workflow Paused
      │
      │
      │ Human reviews
      │
      ▼
Decision
      │
      ▼
Update State
      │
      ▼
Resume
```

Without checkpointing, a long-running workflow would have to retain all execution context while waiting.

With checkpointing:

```text
State → Checkpoint → Pause → Human Decision → Restore → Continue
```

Therefore:

> **Checkpointing provides the persistence mechanism that allows human approval to become a durable workflow state rather than an external interruption.**

---

# 11. Human Approval + Conditional Routing

Approval naturally becomes a conditional edge in the StateGraph.

Conceptually:

```python
def approval_router(state):

    if state["approval"]["status"] == "APPROVED":
        return "execute"

    if state["approval"]["status"] == "REJECTED":
        return "terminate"

    if state["approval"]["status"] == "CHANGES_REQUESTED":
        return "replan"

    return "wait"
```

Graphically:

```text
              Approval Gate
                    │
             ┌──────┼───────┐
             ▼      ▼       ▼
          APPROVE  REJECT  CHANGE
             │      │       │
             ▼      ▼       ▼
          Execute  Stop    Replan
```

This is exactly where the earlier concepts of **State + Nodes + Edges + Conditional Routing** come together.

---

# 12. Approval Timeout

Human approvals can take time.

Therefore the workflow needs an expiration policy.

```text
Approval Requested
       │
       ▼
WAITING
       │
       ├── Approved → Continue
       │
       ├── Rejected → Stop
       │
       └── Timeout → Escalate / Cancel
```

For example:

```python
if current_time > state["approval"]["expires_at"]:
    state["status"] = "APPROVAL_TIMEOUT"
```

The system might then:

```text
Timeout
   │
   ├── Escalate
   ├── Request another approver
   ├── Cancel
   └── Return to queue
```

---

# 13. Authorized Approver

A critical enterprise requirement is that **not every human can approve every action**.

Approval should be governed by:

```text
User Identity
     │
     ▼
Role
     │
     ▼
Permission
     │
     ▼
Resource / Action
     │
     ▼
Approval Authority
```

For example:

```text
Production Change
       │
       ▼
Required Role:
Production Approver
       │
       ▼
Identity / RBAC Check
       │
       ▼
Authorized?
```

The agent should never be allowed to simply designate itself as approved.

---

# 14. Separation of Recommendation and Authorization

This is a fundamental CWD principle.

The LLM may say:

```text
"Based on the analysis, I recommend executing the change."
```

But that does not mean:

```text
Authorization = Granted
```

Instead:

```text
LLM
 │
 └── Recommendation
        │
        ▼
CWD Policy
        │
        ▼
Approval Required?
        │
        ▼
Authorized Human
        │
        ▼
Approval
        │
        ▼
Execution
```

Therefore:

> **Reasoning does not equal authorization.**

---

# 15. Sensitive Data Decisions

Human approval can also protect sensitive data operations.

Example:

```text
Worker
  │
  ▼
Request Sensitive Dataset
  │
  ▼
Policy Evaluation
  │
  ▼
Approval Required
  │
  ▼
Authorized Reviewer
  │
  ├── Approve
  └── Reject
```

The human approval should not bypass the underlying authorization model.

Instead:

```text
Identity
   +
Policy
   +
Approval
   =
Authorized Execution
```

---

# 16. Validation Gate

Human review can occur after automated validation.

```text
Worker
   │
   ▼
Generate Result
   │
   ▼
Automated Validation
   │
   ├── Failed → Recovery
   │
   └── Passed
          │
          ▼
     Human Review
          │
          ▼
       Approval
```

This gives CWD a layered validation model:

```text
Worker Validation
       +
Policy Validation
       +
Human Validation
       =
Controlled Execution
```

---

# 17. Human Review for Low-Confidence Decisions

Not every workflow needs human approval.

CWD can introduce a gate based on confidence or risk.

Conceptually:

$$
HumanReview =
f(Risk, Confidence, Policy, Impact)
$$

For example:

```text
Risk Low + Confidence High
        │
        ▼
Automatic Execution
```

while:

```text
Risk High OR Confidence Low
        │
        ▼
Human Review
```

The exact thresholds should be defined by enterprise policy rather than allowing the LLM to arbitrarily choose them.

---

# 18. Human-in-the-Loop State Machine

The overall lifecycle can be modeled as:

```text
                 RUNNING
                    │
                    ▼
             Approval Required
                    │
                    ▼
              WAITING_FOR_HUMAN
                    │
          ┌─────────┼─────────┐
          ▼         ▼         ▼
      APPROVED    REJECTED  CHANGES
          │         │         │
          ▼         ▼         ▼
       EXECUTE     STOP      REPLAN
          │                   │
          │                   ▼
          │                VALIDATE
          │                   │
          │                   ▼
          │             Approval Again
          │
          ▼
       COMPLETE
```

This gives human interaction a **formal place in the workflow lifecycle**.

---

# 19. Human Approval Across CWD

The complete architecture looks like:

```text
                         USER
                           │
                           ▼
                    ┌─────────────┐
                    │ Coordinator │
                    └──────┬──────┘
                           │
                       Planning
                           │
                           ▼
                    ┌─────────────┐
                    │  Delegator  │
                    └──────┬──────┘
                           │
                           ▼
                        Worker
                           │
                    ┌──────┴──────┐
                    │             │
                 Low Risk      High Risk
                    │             │
                    │             ▼
                    │       Approval Gate
                    │             │
                    │             ▼
                    │       Human Reviewer
                    │             │
                    │       ┌─────┴─────┐
                    │       ▼           ▼
                    │    Approve      Reject
                    │       │           │
                    └───────┤           ▼
                            ▼          Stop
                         Execute
                            │
                            ▼
                       MCP / Tool
                            │
                            ▼
                        Validation
                            │
                            ▼
                        Aggregate
                            │
                            ▼
                      Final Response
```

---

# 20. Human Approval and A2A

When Coordinator delegates to a Delegator, approval requirements can be propagated as part of the task context.

```text
Coordinator
    │
    │ A2A Task
    │
    ├── objective
    ├── constraints
    ├── authorization context
    ├── risk level
    └── approval requirement
           │
           ▼
       Delegator
```

The Delegator can then determine whether a Worker operation requires human approval.

However, the approval decision itself should remain controlled by the appropriate authorization and policy mechanisms.

---

# 21. Human Approval and MCP

For sensitive tool actions, the approval gate can sit immediately before the MCP invocation.

```text
Worker
  │
  ▼
Prepare Tool Request
  │
  ▼
Policy Check
  │
  ▼
Approval Gate
  │
  ▼
Human Approval
  │
  ▼
MCP
  │
  ▼
Enterprise System
```

This creates a strong control boundary:

> **The Worker may prepare the action, but the governed execution path requires approval before the side effect occurs.**

---

# 22. Human Override

In exceptional situations, an authorized human may override an agent recommendation.

For example:

```text
Agent Recommendation
       │
       ▼
Human Review
       │
       ▼
Override
       │
       ▼
Modified Decision
       │
       ▼
Validation
       │
       ▼
Continue
```

But an override should itself be:

* authorized
* recorded
* attributable
* auditable
* policy-controlled

The system should capture:

```text
who
what
when
why
workflow
task
original recommendation
human decision
result
```

---

# 23. Audit Trail

Human decisions should become part of the execution history.

Example:

```text
Workflow: wf-12345

10:01  Worker generated recommendation
10:02  Policy required human approval
10:02  Approval request created
10:08  Authorized reviewer approved
10:08  Worker execution resumed
10:09  Tool executed
10:10  Validation passed
10:11  Workflow completed
```

This provides traceability for enterprise operations.

---

# 24. Human Approval + Observability

Observability should capture the complete approval lifecycle.

Useful fields include:

```text
workflow_id
task_id
approval_id
approval_required
risk_level
approver_role
approval_status
approval_timestamp
decision_reason
previous_node
next_node
execution_result
```

This allows operations teams to answer:

> Why was this workflow paused?

> Who approved it?

> What exactly was approved?

> Which action occurred after approval?

> Did the workflow execute the approved action or something different?

---

# 25. Human Approval and Security

Human approval must not become a security bypass.

A safe model is:

```text
                Identity
                   │
                   ▼
                 Policy
                   │
                   ▼
              Risk Analysis
                   │
                   ▼
            Approval Required?
                   │
                   ▼
          Authorized Approver
                   │
                   ▼
              Approval
                   │
                   ▼
             Final Policy
                   │
                   ▼
               Execute
```

Even after approval, execution should remain constrained by the applicable security and policy controls.

---

# 26. Human Approval and Checkpoint Recovery

Suppose the workflow is paused:

```text
Worker
  │
  ▼
Approval Required
  │
  ▼
Checkpoint
  │
  ▼
WAITING
```

The runtime can restart.

```text
Runtime Restart
      │
      ▼
Restore Checkpoint
      │
      ▼
WAITING_FOR_APPROVAL
```

When approval arrives:

```text
Approval Event
      │
      ▼
Update State
      │
      ▼
Resume Graph
      │
      ▼
Next Node
```

This is what makes human approval compatible with **durable long-running execution**.

---

# 27. End-to-End Example

Consider:

> “Deploy the recommended production configuration change.”

### Step 1 — Coordinator

```text
Intent = Production Deployment
Risk = HIGH
```

### Step 2 — Delegator

```text
Task = Prepare Deployment
```

### Step 3 — Worker

```text
Analyze Current Configuration
Generate Proposed Change
Validate Change
```

### Step 4 — Approval Gate

```text
Risk = HIGH
Policy = Human Approval Required
```

State:

```text
status = WAITING_FOR_APPROVAL
```

### Step 5 — Checkpoint

```text
Checkpoint:
- Proposed change
- Validation result
- Risk assessment
- Approval status
- Current node
```

### Step 6 — Human

```text
APPROVED
```

### Step 7 — Resume

```text
Checkpoint
    │
    ▼
Restore
    │
    ▼
Approval = APPROVED
    │
    ▼
Execute Deployment
```

### Step 8 — Validation

```text
Deployment
    │
    ▼
Post-deployment validation
    │
    ▼
SUCCESS
```

### Step 9 — Final State

```text
status = COMPLETED
approval_status = APPROVED
deployment_status = SUCCESS
```

---

# 28. Core Responsibility Model

| Component         | Human-in-the-Loop Responsibility           |
| ----------------- | ------------------------------------------ |
| **LLM**           | Explain/recommend; not final authorization |
| **StateGraph**    | Pause/resume and represent approval paths  |
| **Coordinator**   | Global approval orchestration              |
| **Delegator**     | Domain-level approval handling             |
| **Worker**        | Prepare/validate sensitive operation       |
| **Policy**        | Determine when approval is mandatory       |
| **Identity/RBAC** | Determine who can approve                  |
| **Checkpointing** | Persist paused workflow state              |
| **A2A**           | Propagate approval requirements/context    |
| **MCP**           | Execute approved tool operation            |
| **Observability** | Record approval and intervention history   |

---

# 29. Complete HITL Pattern

The CWD enterprise pattern becomes:

```text
                 REQUEST
                    │
                    ▼
              COORDINATOR
                    │
                    ▼
                PLANNING
                    │
                    ▼
               DELEGATOR
                    │
                    ▼
                 WORKER
                    │
                    ▼
            Risk / Policy Check
                    │
             ┌──────┴──────┐
             ▼             ▼
          Low Risk      High Risk
             │             │
             │             ▼
             │       Approval Gate
             │             │
             │             ▼
             │        Checkpoint
             │             │
             │             ▼
             │       Human Review
             │             │
             │       ┌─────┼─────┐
             │       ▼     ▼     ▼
             │    Approve Reject Change
             │       │     │     │
             │       │     │     ▼
             │       │     │   Replan
             │       │     │
             └───────┼─────┘
                     ▼
                  Execute
                     │
                     ▼
                   MCP
                     │
                     ▼
                Enterprise System
                     │
                     ▼
                 Validation
                     │
                     ▼
                 Aggregate
                     │
                     ▼
               Final Response
```

---

# 30. Final Definition

> **Human approval and intervention in CWD provide governed human control points within autonomous agent workflows. CWD dynamically introduces approval gates for high-risk, sensitive, uncertain, or exceptional operations; persists the workflow state while waiting; validates the identity and authority of the approver; records the human decision; and then uses StateGraph-controlled transitions to continue, modify, recover, or terminate execution.**

### Core Formula

$$
\boxed{
HITL =
Risk/Policy\ Detection
+
Approval\ Gate
+
Checkpoint
+
Authorized\ Human\ Decision
+
Controlled\ Resume
}
$$

And the core workflow is:

$$
\boxed{
Execute
\rightarrow
Detect\ Risk
\rightarrow
Pause
\rightarrow
Checkpoint
\rightarrow
Human\ Decision
\rightarrow
Validate
\rightarrow
Resume/Reject/Replan
}
$$

### Core CWD Principle

> **CWD should be autonomous by default for approved low-risk operations, but human-controlled at defined risk boundaries. StateGraph provides the pause/resume workflow, checkpointing preserves execution context, Policy determines when approval is required, Identity/RBAC determines who can approve, and the Coordinator–Delegator–Worker architecture ensures the approved decision is propagated and executed through governed paths.**

This gives CWD the balance of **agent autonomy + human authority + policy enforcement + durable execution + auditability** required for enterprise-grade agentic systems.
