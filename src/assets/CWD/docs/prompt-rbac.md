# Role-Based Access Control for Enterprise Prompt Management

## 1. Core Principle

In an enterprise AI platform, prompt management should use **Role-Based Access Control (RBAC)** to control who can create, view, modify, approve, publish, deploy, rollback, and retire prompts.

Instead of giving every user full access:

```text
User
  │
  ▼
Assigned Role
  │
  ▼
Permissions
  │
  ▼
Prompt Operation
  │
  ▼
Policy Decision
  │
  ├── ALLOW
  └── DENY
```

The fundamental principle is:

> **Users receive permissions through roles, and roles are separated according to responsibility so that prompt authors cannot automatically approve or deploy their own production prompts.**

---

# 2. Why RBAC Is Important for Prompts

A production prompt can affect:

* model behavior
* business decisions
* customer interactions
* sensitive data
* enterprise tools
* automated workflows
* downstream systems

Therefore, unrestricted access creates significant risk.

Bad design:

```text
Everyone
   │
   ├── Create
   ├── Modify
   ├── Approve
   ├── Deploy
   ├── Rollback
   └── Retire
```

Better design:

```text
Prompt Author
     ↓
Create / Edit

Evaluator
     ↓
Test / Evaluate

Security
     ↓
Security Review

Business Owner
     ↓
Business Approval

Release Manager
     ↓
Publish / Deploy

Operations
     ↓
Rollback

Governance
     ↓
Retire / Override
```

This creates **separation of duties**.

---

# 3. Prompt Lifecycle Operations

A Prompt Registry may expose operations such as:

```text
CREATE
VIEW
MODIFY
VERSION
SUBMIT_FOR_REVIEW
EVALUATE
SECURITY_REVIEW
APPROVE
PUBLISH
DEPLOY
ROLLBACK
SUSPEND
DEPRECATE
RETIRE
```

These should not all be granted to the same role.

---

# 4. Example Enterprise Roles

A practical role model could contain:

| Role                | Primary Responsibility           |
| ------------------- | -------------------------------- |
| Prompt Author       | Create and modify prompts        |
| Prompt Reviewer     | Review prompt quality            |
| AI Evaluator        | Run and assess evaluations       |
| Security Reviewer   | Security/privacy review          |
| Business Owner      | Approve business behavior        |
| Prompt Publisher    | Publish approved versions        |
| Deployment Manager  | Promote to environments          |
| Prompt Operator     | Monitor and rollback             |
| AI Governance Admin | Governance and lifecycle control |
| Prompt Admin        | Registry administration          |

These are logical roles. The actual enterprise implementation can map them to existing identity groups.

---

# 5. Permission Model

Think of access as:

```text
User
 +
Role
 +
Permission
 +
Resource
 +
Environment
 +
Policy
 =
Authorization Decision
```

For example:

```text
Alice
  ↓
Prompt Author
  ↓
modify_prompt
  ↓
shipment-delay-analysis
  ↓
DEV
  ↓
ALLOW
```

But:

```text
Alice
  ↓
Prompt Author
  ↓
deploy_prompt
  ↓
shipment-delay-analysis
  ↓
PROD
  ↓
DENY
```

---

# 6. Create Permission

Prompt Authors need permission to create new prompts.

```text
Prompt Author
      │
      ▼
CREATE
      │
      ▼
Prompt Registry
      │
      ▼
DRAFT
```

Example:

```json
{
  "operation": "create_prompt",
  "resource": "shipment-delay-analysis",
  "environment": "DEV",
  "decision": "ALLOW"
}
```

Creating a prompt does **not** mean the author can publish it.

---

# 7. View Permission

Viewing can also be controlled.

Not every user should necessarily see every prompt.

For example:

```text
Public Prompt
    ↓
Broad visibility

Internal Prompt
    ↓
Employees / authorized teams

Restricted Prompt
    ↓
Specific domain/team

Confidential Prompt
    ↓
Explicit authorization
```

This is important because prompts themselves can contain sensitive business logic or instructions.

For example:

```text
Prompt
+
System instructions
+
Security policies
+
Internal business rules
```

should not automatically be visible to everyone.

---

# 8. Modify Permission

Modification should be tightly controlled.

A typical rule is:

```text
DEV
  ↓
Author can modify

TEST
  ↓
Limited modification

UAT
  ↓
No direct editing

PROD
  ↓
Immutable
```

Instead of modifying:

```text
PROD v2.3.0
```

the author creates:

```text
v2.4.0
```

This preserves version history.

---

# 9. Approval Permission

Approval should be separated from authoring.

For example:

```text
Author
  │
  ├── creates v2.4.0
  │
  ▼
Reviewer
  │
  ▼
Security
  │
  ▼
Business Owner
  │
  ▼
Approved
```

The author should not normally be able to say:

```text
"I created it, therefore I approve it."
```

This is a classic separation-of-duties control.

---

# 10. Business Approval

The business owner determines whether the prompt represents the intended business behavior.

For example:

```text
Logistics Prompt
       │
       ▼
Logistics Business Owner
       │
       ├── APPROVE
       └── REJECT
```

The business owner should not necessarily have permission to modify the underlying prompt.

Their responsibility is primarily:

```text
Business Intent
       ↓
Business Approval
```

rather than:

```text
Business Approval
+
Technical Deployment
```

---

# 11. Security Approval

Security reviewers evaluate:

* data sensitivity
* prompt injection risk
* unauthorized behavior
* sensitive information exposure
* tool permissions
* external integrations
* policy compliance
* privacy/security requirements

Example:

```text
Prompt v2.4.0
     │
     ▼
Security Review
     │
     ├── PASS
     └── FAIL
```

Security approval should be recorded against the exact version.

```text
prompt_id = shipment-delay-analysis
version   = 2.4.0
security_approval = SEC-10082
```

---

# 12. Publish Permission

Publishing means making a prompt version available as an approved artifact for downstream use.

For example:

```text
DRAFT
  ↓
TESTED
  ↓
APPROVED
  ↓
PUBLISHED
```

Only authorized users or release automation should be able to publish.

Important distinction:

```text
Approved
   ≠
Published
   ≠
Deployed
```

Approval means the version has passed governance.

Publishing means it is available as an approved artifact.

Deployment means it is active in a specific runtime environment.

---

# 13. Deploy Permission

Deployment should be even more restricted.

For example:

```text
Prompt Author
     │
     └── DEV deployment

Release Manager
     │
     ├── TEST
     ├── UAT
     └── PROD
```

The exact model depends on organizational policy.

A production deployment should require:

```text
Approved Version
       +
Passed Evaluation
       +
Security Approval
       +
Business Approval
       +
Deployment Gate
       ↓
PROD
```

---

# 14. Rollback Permission

Rollback is a privileged operation.

Why?

Because rollback changes active production behavior.

Example:

```text
PROD
 v2.4.0
   │
   │ production regression
   ▼
ROLLBACK
   │
   ▼
v2.3.0
```

Only authorized operators or automated incident workflows should perform production rollback.

A rollback should be audited:

```json
{
  "operation": "rollback",
  "prompt_id": "shipment-delay-analysis",
  "from_version": "2.4.0",
  "to_version": "2.3.0",
  "actor": "prompt-operations",
  "reason": "Regression detected"
}
```

---

# 15. Retire Permission

Retirement removes a prompt version from active lifecycle use.

Example:

```text
ACTIVE
  ↓
DEPRECATED
  ↓
RETIRED
```

Retirement should be controlled because an old prompt may still be referenced by:

* workflows
* agents
* applications
* historical executions
* audit records
* recovery processes

Therefore, retirement should include impact analysis.

```text
Retire Request
      ↓
Find Consumers
      ↓
Check Active Workflows
      ↓
Check Dependencies
      ↓
Approval
      ↓
RETIRE
```

---

# 16. Recommended RBAC Matrix

A practical starting point:

| Operation        | Author | Reviewer | Evaluator | Security | Business Owner | Publisher | Deployment | Operator | Governance |
| ---------------- | -----: | -------: | --------: | -------: | -------------: | --------: | ---------: | -------: | ---------: |
| View             |      ✓ |        ✓ |         ✓ |        ✓ |              ✓ |         ✓ |          ✓ |        ✓ |          ✓ |
| Create           |      ✓ |        — |         — |        — |              — |         — |          — |        — |          ✓ |
| Modify DEV       |      ✓ |        ✓ |         — |        — |              — |         — |          — |        — |          ✓ |
| Evaluate         |      — |        — |         ✓ |        — |              — |         — |          — |        — |          ✓ |
| Security Review  |      — |        — |         — |        ✓ |              — |         — |          — |        — |          ✓ |
| Business Approve |      — |        — |         — |        — |              ✓ |         — |          — |        — |          ✓ |
| Publish          |      — |        — |         — |        — |              — |         ✓ |          ✓ |        — |          ✓ |
| Deploy TEST/UAT  |      — |        — |         — |        — |              — |         ✓ |          ✓ |        — |          ✓ |
| Deploy PROD      |      — |        — |         — |        — |              — |         — |          ✓ |        — |          ✓ |
| Rollback PROD    |      — |        — |         — |        — |              — |         — |          — |        ✓ |          ✓ |
| Retire           |      — |        — |         — |        — |              ✓ |         — |          — |        — |          ✓ |

This is an **illustrative enterprise RBAC model**; actual permissions should be aligned with the organization's security and compliance requirements.

---

# 17. Environment-Based Access

RBAC should normally be combined with environment restrictions.

```text
                 Prompt
                   │
       ┌───────────┼───────────┐
       ▼           ▼           ▼
      DEV         UAT         PROD
       │           │           │
       ▼           ▼           ▼
   Author       Reviewer    Deployment
   access        access       only
```

For example:

```json
{
  "role": "prompt-author",
  "permissions": {
    "create": ["DEV"],
    "modify": ["DEV"],
    "view": ["DEV", "TEST"],
    "deploy": []
  }
}
```

This prevents an author from directly editing production artifacts.

---

# 18. Resource-Level Access

Role alone may not be sufficient.

Suppose two teams exist:

```text
Logistics Team
Finance Team
```

The Logistics author should not automatically modify:

```text
finance-credit-decision
```

Use resource-level restrictions:

```text
User
 ↓
Role
 ↓
Domain
 ↓
Prompt
```

Example:

```text
Prompt Author
   +
Domain = Logistics
   ↓
Can modify:
logistics/*
```

but:

```text
finance/*
```

is denied.

---

# 19. Combining RBAC With Scope

A robust authorization model is:

```text
Authorization
=
Identity
+
Role
+
Permission
+
Environment
+
Domain
+
Prompt Classification
+
Policy
```

For example:

```text
User = Alice
Role = Prompt Author
Permission = modify_prompt
Environment = DEV
Domain = Logistics
Risk = Medium

→ ALLOW
```

But:

```text
User = Alice
Role = Prompt Author
Permission = deploy_prompt
Environment = PROD

→ DENY
```

And:

```text
User = Alice
Role = Prompt Author
Permission = modify_prompt
Environment = DEV
Domain = Finance
Alice Scope = Logistics

→ DENY
```

---

# 20. Risk-Based Access

Prompt classification can influence RBAC.

For example:

```text
LOW RISK
   ↓
Standard approval

MEDIUM RISK
   ↓
Business approval

HIGH RISK
   ↓
Security + Business + Governance

CRITICAL
   ↓
Multi-party approval + Human Oversight
```

Thus:

```text
Prompt Classification
       ↓
Access Policy
       ↓
Required Roles
       ↓
Required Approvals
```

---

# 21. Separation of Duties

This is one of the most important enterprise security concepts.

Avoid:

```text
Same person
   ↓
Create
   ↓
Approve
   ↓
Deploy
```

Prefer:

```text
Author
  ↓
Create

Evaluator
  ↓
Evaluate

Security
  ↓
Review

Business Owner
  ↓
Approve

Release Manager
  ↓
Deploy

Operations
  ↓
Rollback
```

This reduces the possibility of unauthorized changes reaching production.

---

# 22. Four-Eyes Principle

For high-risk prompts, require two or more authorized people.

```text
High-Risk Prompt
       │
       ▼
Security Reviewer
       +
Business Owner
       │
       ▼
Approved
```

For critical prompts:

```text
Security
    +
Business
    +
AI Governance
    +
Human Approval
        │
        ▼
     Deploy
```

The exact approval quorum should be defined by enterprise policy.

---

# 23. Service Accounts and CI/CD

Human users should not necessarily perform every deployment manually.

A production architecture can use:

```text
Human Approval
      │
      ▼
CI/CD Pipeline
      │
      ▼
Prompt Registry
      │
      ▼
Deployment
```

The deployment service identity receives only the required permission:

```text
deploy_prompt_to_prod
```

It does not need:

```text
modify_prompt_content
approve_prompt
change_security_policy
```

This is least privilege.

---

# 24. RBAC + Prompt Registry

The Prompt Registry can enforce:

```text
User
 │
 ▼
Identity Provider
 │
 ▼
Role
 │
 ▼
Policy Engine
 │
 ▼
Prompt Registry
 │
 ├── View
 ├── Create
 ├── Modify
 ├── Approve
 ├── Publish
 ├── Deploy
 ├── Rollback
 └── Retire
```

The registry should not simply trust:

```json
{
  "role": "admin"
}
```

provided by the client.

Identity and authorization should come from trusted enterprise identity and policy infrastructure.

---

# 25. Example Authorization Policy

Conceptually:

```python
def authorize(user, operation, prompt):
    if operation == "create":
        return (
            user.has_role("prompt-author")
            and prompt.environment == "DEV"
        )

    if operation == "modify":
        return (
            user.has_role("prompt-author")
            and prompt.environment == "DEV"
            and user.domain == prompt.domain
        )

    if operation == "approve":
        return (
            user.has_role("business-owner")
            and user.domain == prompt.domain
        )

    if operation == "deploy_prod":
        return (
            user.has_role("deployment-manager")
            and prompt.status == "approved"
            and prompt.security_approved
            and prompt.evaluation_passed
        )

    if operation == "rollback":
        return user.has_role("prompt-operator")

    if operation == "retire":
        return (
            user.has_role("governance-admin")
            or user.has_role("business-owner")
        )

    return False
```

In a production architecture, these decisions should normally be centralized in an enterprise IAM/policy layer rather than embedded entirely in application code.

---

# 26. RBAC + Audit Trail

Every privileged operation should generate an audit event.

```json
{
  "timestamp": "2026-09-06T15:20:00Z",
  "actor": "user-123",
  "role": "deployment-manager",
  "operation": "deploy",
  "prompt_id": "shipment-delay-analysis",
  "version": "2.4.0",
  "environment": "PROD",
  "decision": "ALLOW",
  "approval_id": "APR-90821",
  "correlation_id": "CORR-7890"
}
```

This allows auditors to determine:

```text
WHO?
WHAT?
WHICH PROMPT?
WHICH VERSION?
WHEN?
WHERE?
WHY?
WHICH APPROVAL?
WHAT WAS THE RESULT?
```

---

# 27. Runtime Authorization Is Separate

An important distinction:

```text
Prompt Management Authorization
        ≠
Prompt Runtime Authorization
```

Prompt management controls:

```text
Who can modify the prompt?
Who can approve it?
Who can deploy it?
```

Runtime authorization controls:

```text
Which agent can use it?
Which user can invoke it?
Which data can it access?
Which tools can it call?
Which capabilities can it execute?
```

Therefore:

```text
                IAM / Policy
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
 Prompt Management        Runtime Execution
          │                   │
      Registry              CWD
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
                  Agent                Worker
                                        │
                                        ▼
                                      MCP
```

---

# 28. RBAC + CWD

In your CWD architecture:

```text
                    User
                     │
                     ▼
               API Gateway
                     │
                     ▼
                Coordinator
                     │
                     ▼
               Authorization
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
    Agent Registry         Prompt Registry
          │                     │
          ▼                     ▼
     Eligible Agent        Approved Prompt
          │                     │
          └──────────┬──────────┘
                     ▼
                 Delegator
                     │
                     ▼
                  Worker
                     │
                     ▼
               Policy / IAM
                     │
                     ▼
                    MCP
```

This creates authorization at both:

**control plane**

and

**execution plane**.

---

# 29. Important Anti-Patterns

### Anti-pattern 1 — Everyone is Admin

```text
All users
   ↓
Admin
```

This violates least privilege.

---

### Anti-pattern 2 — Author Can Approve Own Prompt

```text
Author
  ↓
Create
  ↓
Approve
```

This weakens separation of duties.

---

### Anti-pattern 3 — Approval Without Version

Bad:

```text
Prompt approved = TRUE
```

Better:

```text
prompt_id = shipment-delay-analysis
version = 2.4.0
approval = APR-90821
```

---

### Anti-pattern 4 — Production Editing

Never allow routine direct modification:

```text
PROD prompt
    ↓
Edit
    ↓
Save
```

Instead:

```text
PROD v2.3
    ↓
Create v2.4
    ↓
Test
    ↓
Approve
    ↓
Deploy
```

---

### Anti-pattern 5 — Client-Supplied Roles

Do not trust:

```json
{
  "role": "admin"
}
```

from an application request.

Roles should come from trusted identity/authorization infrastructure.

---

### Anti-pattern 6 — RBAC Without Domain Scope

A Logistics Prompt Author should not automatically have access to every enterprise prompt.

---

# 30. Recommended Enterprise Permission Hierarchy

Think of permissions at multiple levels:

```text
                    User
                     │
                     ▼
                    Role
                     │
                     ▼
                 Permission
                     │
                     ▼
                  Resource
                     │
                     ▼
                 Environment
                     │
                     ▼
              Prompt Classification
                     │
                     ▼
                   Policy
                     │
                     ▼
                Authorization
```

This is stronger than simple:

```text
User → Admin / User
```

---

# 31. Complete Example

Suppose:

```text
Prompt:
shipment-delay-analysis v2.4.0

Classification:
Risk = HIGH
Sensitivity = CONFIDENTIAL
Criticality = HIGH
Domain = Logistics
```

The lifecycle could be:

```text
Prompt Author
    │
    ├── Create
    └── Modify DEV
            │
            ▼
       AI Evaluator
            │
            └── Evaluation PASS
                    │
                    ▼
             Security Reviewer
                    │
                    └── APPROVED
                            │
                            ▼
             Logistics Business Owner
                            │
                            └── APPROVED
                                    │
                                    ▼
                     Deployment Manager
                                    │
                                    ▼
                              UAT → PROD
                                    │
                                    ▼
                             Prompt Operator
                                    │
                            rollback if needed
```

Every step generates an audit event.

---

# 32. Final Enterprise Mental Model

```text
                PROMPT REGISTRY
                      │
                      ▼
                Access Request
                      │
                      ▼
                 Identity
                      │
                      ▼
                    Role
                      │
                      ▼
                 Permission
                      │
                      ▼
             Resource / Domain
                      │
                      ▼
                Environment
                      │
                      ▼
             Prompt Risk Profile
                      │
                      ▼
                  Policy
                      │
              ┌───────┴───────┐
              ▼               ▼
            ALLOW             DENY
              │
              ▼
        Prompt Operation
```

The essential separation is:

```text
CREATE / MODIFY
       ↓
Prompt Author

EVALUATE
       ↓
AI Evaluator

SECURITY APPROVE
       ↓
Security Reviewer

BUSINESS APPROVE
       ↓
Business Owner

PUBLISH / DEPLOY
       ↓
Release / Deployment Manager

ROLLBACK
       ↓
Operations

RETIRE
       ↓
Governance
```

---

# 33. Final Formula

```text
Prompt RBAC
=
Identity
+
Roles
+
Permissions
+
Resource Scope
+
Domain Scope
+
Environment Scope
+
Prompt Classification
+
Policy
+
Separation of Duties
+
Auditability
```

And the authorization decision can be expressed as:

```text
Authorized Operation
=
Authenticated Identity
AND
Role Allows Operation
AND
Resource Is In Scope
AND
Environment Is Allowed
AND
Prompt Risk Policy Is Satisfied
AND
Required Approvals Exist
AND
Enterprise Policy Allows Action
```

# Final Definition

> **Role-Based Access Control for enterprise prompt management is the governed authorization model that assigns users and service identities specific prompt-management permissions through roles, scopes those permissions by prompt, domain, environment, and risk, separates authoring from approval and deployment responsibilities, and records every privileged lifecycle operation for auditability and compliance.**

### Architect one-liner

> **RBAC answers “who is allowed to perform which prompt lifecycle operation, on which prompt, in which environment, under which policy.”**

And in your CWD architecture:

```text
Agent Registry → WHO can perform the work?
Prompt Registry → WHICH prompt is approved?
RBAC / IAM     → WHO can manage that prompt?
Policy Engine  → IS this operation allowed?
LangGraph      → WHAT happens next?
MCP            → WHAT enterprise capability can be invoked?
```

The most important enterprise rule is:

> **No single role should automatically have unrestricted create → approve → publish → deploy → rollback → retire authority for production prompts.**
