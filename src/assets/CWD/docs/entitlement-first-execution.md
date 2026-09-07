Yes. This is one of the **most important security principles in CWD**.

The fundamental reason is:

> **A request can be technically valid and the agent can be capable of performing the operation, but the operation must not execute unless the user is entitled to perform it on the requested resource.**

In other words:

```text
Capability ≠ Authorization
Authentication ≠ Entitlement
Agent Access ≠ User Access
```

# 1. Why Authorization Must Come First

Consider:

```text id="8m6h7f"
User
  │
  │ "Show me confidential finance data"
  ▼
Coordinator
  │
  ▼
Finance Delegator
  │
  ▼
Finance Worker
  │
  ▼
MCP Tool
  │
  ▼
Finance Database
```

If authorization happens **after** the database call:

```text id="kq3kzj"
Database
   ↓
Sensitive Data
   ↓
Worker
   ↓
Authorization
   ↓
DENY
```

the system has already exposed sensitive information internally.

That is too late.

The correct architecture is:

```text id="h6q0av"
User
  ↓
Authenticate
  ↓
Determine Entitlements
  ↓
Authorize
  ↓
Coordinator
  ↓
Delegator
  ↓
Worker
  ↓
MCP Tool
  ↓
Enterprise Data
```

Therefore:

> **Authorization is a precondition for execution, not a post-execution check.**

---

# 2. Authentication vs Authorization vs Entitlement

These concepts are often confused.

| Concept        | Question                                                  |
| -------------- | --------------------------------------------------------- |
| Identity       | Who is this?                                              |
| Authentication | Can the identity be verified?                             |
| Role           | What responsibility does the user have?                   |
| Permission     | What operation can they perform?                          |
| Entitlement    | Which specific resources/data are they allowed to access? |
| Scope          | Within what boundary?                                     |
| Authorization  | Is this particular operation allowed right now?           |

For example:

```text id="jq4eq0"
User = Pooja
Role = SupplyChainAnalyst
Permission = shipment.read
Entitlement = Region:US
Scope = Manufacturing
```

The user might be allowed to read shipments in the US but not shipments belonging to another region or tenant.

---

# 3. The CWD Security Principle

A useful rule is:

```text id="jnd0fb"
User Authorization
       ↓
Agent Authorization
       ↓
Tool Authorization
       ↓
Resource Authorization
       ↓
Execution
```

Every layer answers a different question.

```text id="6x9b6c"
USER
 │
 ├── Am I authenticated?
 │
 ├── Am I entitled to this data?
 │
 ▼
COORDINATOR
 │
 ├── Can this workflow be executed?
 │
 ▼
DELEGATOR
 │
 ├── Can this domain task be executed?
 │
 ▼
WORKER
 │
 ├── Can this operation be performed?
 │
 ▼
MCP TOOL
 │
 ├── Can this tool be called?
 │
 ▼
DATA SOURCE
 │
 └── Can this resource be accessed?
```

---

# 4. Why Check Before the Coordinator?

The Coordinator is the first major decision point.

It should determine:

```text id="0rwjcv"
Who is the user?
What is the requested operation?
What domain is involved?
What resources are involved?
What data classification applies?
Is the user entitled?
Is the workflow allowed?
Is human approval required?
```

For example:

> "Delete shipment SHIP123."

The Coordinator should not immediately create a deletion plan.

Instead:

```text id="42ev9b"
Request
  ↓
Identify user
  ↓
Check permission
  ↓
Check shipment entitlement
  ↓
Check risk
  ↓
Is deletion allowed?
```

If not:

```text id="l2w44s"
STOP
```

This prevents unauthorized work from entering the execution graph.

---

# 5. Why Check Before the Delegator?

Suppose the Coordinator determines:

```text id="gl7k20"
Intent = financial_report
Domain = finance
```

It discovers:

```text id="8t7s1s"
Finance Delegator
```

But discovery does not mean access.

The Delegator should validate:

```text id="x1k7om"
Can this caller invoke me?
Can this user access this domain?
Can this task be performed?
What scope applies?
What data classification applies?
```

Otherwise an authorized Coordinator could accidentally become a **confused deputy** and use a privileged Delegator on behalf of an unauthorized user.

---

# 6. Why Check Before the Worker?

The Worker performs the actual specialized operation.

Example:

```text id="e7p4xs"
Tracking Worker
       ↓
get_tracking_events
       ↓
SHIP123
```

Before executing:

```text id="0yqpsf"
Is user entitled to SHIP123?
Is Worker authorized for shipment tracking?
Is this tenant correct?
Is this operation read-only?
Is the requested scope valid?
```

Only then:

```text id="p5c7ce"
Execute
```

This creates a **least-privilege execution boundary**.

---

# 7. Why Check Before the MCP Tool?

This is particularly important.

Suppose a Worker has access to:

```text id="g4uq8h"
get_tracking_events()
```

That does **not** mean every user is allowed to invoke it.

We need:

```text id="hr5k8w"
User entitlement
      +
Worker permission
      +
Tool permission
      +
Resource authorization
      ↓
ALLOW
```

For example:

```text id="h6sj2q"
Tracking Worker
       │
       ▼
get_tracking_events
       │
       ▼
SHIP123
       │
       ▼
Authorization
       │
    ┌──┴──┐
    ▼     ▼
  ALLOW  DENY
```

The MCP tool should also enforce authorization rather than trusting the Worker blindly.

---

# 8. Why Check Before the Enterprise Data Source?

The enterprise system is the ultimate resource boundary.

Examples:

```text id="2pr8v4"
SharePoint
SQL
ERP
CRM
SAP
Manufacturing database
HR system
Financial system
```

The strongest principle is:

> **Authorization should be enforced as close as possible to the protected resource, in addition to upstream controls.**

So even if something goes wrong upstream:

```text id="e8u3ll"
Coordinator bug
     ↓
Delegator bug
     ↓
Worker bug
     ↓
Tool bug
     ↓
Enterprise API
```

the enterprise system should ideally still enforce its own authorization.

This is defense in depth.

---

# 9. Authorization at Every Boundary

Think of CWD as multiple trust boundaries:

```text id="zq7t1a"
User
 ↓
[AUTHZ]
 ↓
Gateway
 ↓
[AUTHZ]
 ↓
Coordinator
 ↓
[AUTHZ]
 ↓
Delegator
 ↓
[AUTHZ]
 ↓
Worker
 ↓
[AUTHZ]
 ↓
MCP
 ↓
[AUTHZ]
 ↓
Enterprise System
```

The checks do not necessarily have identical logic.

They become increasingly resource-specific.

---

# 10. Entitlement Is More Specific Than Role

This distinction is critical.

Suppose:

```text id="i4k8f3"
Role:
Supply Chain Analyst

Permission:
shipment.read
```

That still doesn't answer:

> **Which shipments?**

Entitlement might say:

```text id="k6tqxm"
Tenant       = Manufacturing-A
Region       = US
BusinessUnit = Electronics
Classification = Internal
```

So:

```text id="8a1qvn"
User Permission
       +
Data Entitlement
       +
Resource ACL
```

determines what the user can actually access.

---

# 11. RAG Example

This is where the principle becomes extremely important.

Suppose a user asks:

> "Find documents about the confidential semiconductor project."

Incorrect:

```text id="q9m1sy"
User
 ↓
Vector Search
 ↓
Retrieve top 20 documents
 ↓
LLM decides what user can see
```

The LLM must not be the security boundary.

Correct:

```text id="r2x3e9"
User Identity
      ↓
User Entitlements
      ↓
Security / ACL Filter
      ↓
Authorized Search Space
      ↓
Vector / Keyword / Hybrid Search
      ↓
Authorized Chunks
      ↓
Reranking
      ↓
LLM
```

Therefore:

```text id="n4u8ly"
LLM sees only:

Relevant
   ∩
Authorized
   ∩
In-Scope
   ∩
Policy-Allowed
```

---

# 12. What Happens If We Authorize Too Late?

There are several risks.

### 1. Data leakage

Sensitive data may already have entered:

```text id="8s1y0h"
Worker context
LLM prompt
Redis
LangGraph state
logs
traces
```

Even if the final answer is denied.

### 2. Tool abuse

An unauthorized tool may already have executed.

For example:

```text id="7l1c0k"
delete_customer()
```

You cannot undo the security problem merely by returning:

```text
"Access denied."
```

### 3. Side effects

A tool may modify:

```text id="8w5c5z"
Production records
Financial records
Orders
Inventory
Customer data
```

Authorization after execution is useless.

### 4. Prompt injection exposure

Unauthorized content may enter the LLM context and influence reasoning.

### 5. Audit problems

You now have to explain:

> Why did the system access data that the user was not authorized to access?

---

# 13. Read vs Write Operations

Authorization is especially important for writes.

### Read

```text
User
 ↓
Authorization
 ↓
Retrieve data
```

### Write

```text
User
 ↓
Authorization
 ↓
Risk assessment
 ↓
Policy
 ↓
HITL if required
 ↓
Idempotency
 ↓
Execute
 ↓
Validate
 ↓
Audit
```

For example:

```text id="a9s0c8"
shipment.read
```

might be low risk.

Whereas:

```text id="6kqg9y"
shipment.reroute
shipment.cancel
shipment.delete
```

may require stronger controls.

---

# 14. Authorization Must Follow the User Through the Workflow

Suppose:

```text id="3q1xjp"
User
  ↓
Coordinator
  ↓
Shipping Delegator
  ↓
Tracking Worker
```

The Worker should know the relevant security context:

```json id="rq5i1n"
{
  "identity": {
    "user_id": "user-123",
    "tenant_id": "tenant-a"
  },
  "task": {
    "capability": "shipment_tracking",
    "shipment_id": "SHIP123"
  },
  "scope": {
    "region": "US",
    "business_unit": "electronics"
  },
  "correlation_id": "CORR-7890"
}
```

But the Worker should **not blindly trust user-provided claims**.

The authorization context should come from trusted identity/policy infrastructure.

---

# 15. Identity Propagation vs Authorization Propagation

These are related but different.

### Identity propagation

```text id="b7s8mt"
Who initiated this operation?
```

### Authorization evaluation

```text id="l9dfzq"
Is that identity allowed to perform this operation here?
```

Therefore:

```text id="7z4t4a"
User Identity
      ↓
Propagate trusted context
      ↓
Re-evaluate authorization
      ↓
Execute
```

Do not simply say:

> "Coordinator already approved it, so Worker doesn't need to check."

That creates a dangerous implicit-trust chain.

---

# 16. Preventing the Confused Deputy Problem

This is a major agentic-AI security concern.

Imagine:

```text id="7u1qsp"
User
  ↓
Coordinator
  ↓
Privileged Finance Agent
  ↓
Finance Database
```

The user may not have finance privileges.

But the Coordinator has access to the Finance Agent.

If the Finance Agent trusts the Coordinator's identity alone:

```text id="f7qj0a"
User has no permission
       ↓
Coordinator has permission
       ↓
Finance Agent executes
```

The Coordinator becomes a **confused deputy**.

Correct model:

```text id="q6t5s1"
User Authorization
        +
Agent Authorization
        +
Resource Authorization
```

must all pass.

---

# 17. Authorization Should Be Context-Aware

The same user may be allowed to perform one operation but not another.

Example:

```text id="7p2n4v"
User = SupplyChainAnalyst

shipment.read      → ALLOW
shipment.search    → ALLOW
shipment.reroute   → CONDITIONAL
shipment.delete    → DENY
```

The decision depends on:

```text id="r8qf5y"
User
Agent
Action
Resource
Tenant
Scope
Environment
Risk
Time/context
Policy
```

Therefore:

```text id="1i9b4e"
Authorization =
f(
 User,
 Agent,
 Action,
 Resource,
 Scope,
 Context,
 Risk,
 Policy
)
```

---

# 18. Continuous Authorization

Authorization should be reconsidered when the security context changes.

Examples:

```text id="o2c1d8"
Long-running workflow
       ↓
User privilege changes
       ↓
Workflow resumes
       ↓
Revalidate authorization
```

Another example:

```text id="n7s2h5"
Worker A
   ↓
fails
   ↓
Worker B
   ↓
retry
```

The system should not blindly assume Worker B has the same permissions.

It should verify:

```text id="4g5p4c"
Worker B
Capability ✓
Version ✓
Environment ✓
Authorization ✓
Scope ✓
Policy ✓
```

---

# 19. Zero Trust Connection

This directly implements Zero Trust.

```text id="8y9xpc"
Never Trust
     +
Always Verify
     +
Least Privilege
     +
Assume Breach
```

In CWD:

```text id="x4y7c2"
User
  ↓
Verify
  ↓
Coordinator
  ↓
Verify
  ↓
Delegator
  ↓
Verify
  ↓
Worker
  ↓
Verify
  ↓
Tool
  ↓
Verify
  ↓
Data
```

---

# 20. Security Decision Matrix

| Layer          | Primary question                             |
| -------------- | -------------------------------------------- |
| Gateway        | Is this caller authenticated?                |
| Coordinator    | Is this workflow authorized?                 |
| Agent Registry | Is this agent approved/capable?              |
| Delegator      | Is this domain task authorized?              |
| Worker         | Is this operation within Worker permissions? |
| MCP            | Is this tool invocation allowed?             |
| RAG            | Is the user entitled to these documents?     |
| Enterprise API | Is this resource/action authorized?          |
| Database       | Does resource-level access permit it?        |
| Audit          | Was the decision recorded?                   |

---

# 21. Complete Secure Execution Flow

```text id="wq7g6f"
                     USER REQUEST
                           │
                           ▼
                    Authentication
                           │
                           ▼
                    Trusted Identity
                           │
                           ▼
                    User Entitlements
                           │
                           ▼
                  ┌──────────────────┐
                  │   COORDINATOR    │
                  │                  │
                  │ Workflow Auth    │
                  │ Risk / Policy    │
                  └────────┬─────────┘
                           │
                           ▼
                         A2A
                           │
                           ▼
                  ┌──────────────────┐
                  │    DELEGATOR     │
                  │                  │
                  │ Domain Auth      │
                  │ Task Scope       │
                  └────────┬─────────┘
                           │
                           ▼
                    Worker Selection
                           │
                           ▼
                  ┌──────────────────┐
                  │      WORKER      │
                  │                  │
                  │ Task Auth        │
                  │ Data Entitlement │
                  │ Tool Permission  │
                  └────────┬─────────┘
                           │
                     ┌─────┴─────┐
                     ▼           ▼
                    RAG        MCP/API
                     │           │
              ACL/Entitlement    │
                     │      Tool Authorization
                     │           │
                     └─────┬─────┘
                           ▼
                  Enterprise Resource
                           │
                           ▼
                    Result Validation
                           │
                           ▼
                      Audit / DLP
                           │
                           ▼
                       RESPONSE
```

---

# 22. The Most Important Rule

The rule I would emphasize in an architecture review is:

> **Authorization must occur before any operation that could expose data, invoke a capability, or create a side effect.**

That means:

```text id="i4z6w7"
Before Coordinator workflow execution
Before Delegator task execution
Before Worker execution
Before MCP tool invocation
Before RAG context retrieval
Before enterprise data access
Before production modification
```

And for defense in depth, authorization should also be enforced **at the protected resource itself** whenever possible.

---

# 23. CWD Authorization Formula

A strong conceptual formula is:

```text id="v2o0u6"
AuthorizedExecution
=
AuthenticatedUser
∧
ValidAgentIdentity
∧
RoleAllowed
∧
PermissionAllowed
∧
EntitlementAllowed
∧
ScopeAllowed
∧
ResourceACLAllowed
∧
AgentAllowed
∧
ToolAllowed
∧
PolicyAllowed
∧
RiskAllowed
```

For RAG:

```text id="4h0k4k"
AuthorizedContext
=
RelevantEvidence
∩
UserEntitlements
∩
ResourceACL
∩
BusinessScope
∩
Policy
```

For tool execution:

```text id="f4psg2"
AuthorizedToolExecution
=
UserAuthorization
∧
AgentAuthorization
∧
ToolPermission
∧
ResourceAuthorization
∧
Policy
```

---

# 24. Interview-Ready Answer

> **“In CWD, user entitlement and authorization must be validated before Coordinator, Delegator, Worker, MCP tool, or enterprise data-source execution because authentication only establishes identity; it does not establish permission to perform a particular operation on a particular resource. We therefore apply authorization as a precondition at every important trust boundary. The Coordinator validates whether the user is allowed to initiate the workflow and whether the requested action is within policy. The Delegator validates domain and task scope, the Worker enforces least-privilege execution, and the MCP layer validates tool and resource permissions. For RAG, entitlements and ACLs are applied before retrieval results reach the LLM because the LLM must never be used as the security boundary. The enterprise data source should also enforce resource-level authorization as defense in depth. This prevents unauthorized data exposure, tool abuse, privilege escalation, confused-deputy attacks, and unauthorized side effects. The key principle is that authorization happens before execution, while protected resources independently enforce authorization as the final security boundary.”**

## Core mental model

```text id="c4q4ey"
          AUTHENTICATE
                │
                ▼
          IDENTIFY USER
                │
                ▼
       DETERMINE ENTITLEMENTS
                │
                ▼
       AUTHORIZE THE OPERATION
                │
                ▼
          AUTHORIZE AGENT
                │
                ▼
           AUTHORIZE TOOL
                │
                ▼
         AUTHORIZE RESOURCE
                │
                ▼
             EXECUTE
                │
                ▼
       VALIDATE + AUDIT
```

**Core definition:** **User entitlement and authorization in CWD must be validated before execution because they establish whether the requested operation is permissible for the authenticated user, through the selected agent and tool, against the specific resource and within the required scope. Authorization is therefore a pre-execution security gate at every CWD trust boundary, while enterprise data sources provide an additional resource-level enforcement layer.**
