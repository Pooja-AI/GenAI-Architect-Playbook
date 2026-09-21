## Can the LLM decide whether the user has permission?

**No.** The LLM can **understand the request**, but it should **never be the authority that decides permissions**.

### CWD flow

```text
User
  ↓
Coordinator / LLM
  ↓
Understand intent
  ↓
Security / Entitlement Service
  ↓
Is user authorized?
  ├── NO  → Block + Audit
  └── YES → Delegator → Worker → MCP → Enterprise System
```

### Why not let the LLM decide?

LLMs are probabilistic. A model could incorrectly reason:

> "The user appears to be an HR manager, so I'll provide the salary information."

That is not a security decision.

Instead:

```text
LLM:
"What does the user want?"
        ↓
Policy engine:
"Is the user allowed?"
        ↓
MCP:
"Is this specific tool/action allowed?"
```

### Example

User:

> "Show me employee John's salary."

The LLM determines:

```text
Intent = GetEmployeeSalary
Employee = John
```

Then the authorization layer checks:

```text
User = U123
Tenant = T001
Resource = John's HR record
Action = READ_SALARY
Permission = DENY
```

Result:

```text
DENY
 ↓
No HR MCP call
No salary data retrieved
Audit event
```

### What the LLM **can** do

The LLM can:

* classify intent
* extract entities
* select a candidate capability/tool
* generate a response

### What the LLM **cannot** do

The LLM should not:

* grant permissions
* modify roles
* bypass RBAC
* decide tenant access
* override MCP authorization
* determine whether confidential data can be returned

### Interview-ready answer

> **“No, I never use the LLM as the authorization authority. The LLM can understand the user's intent and identify the required capability, but an external authorization layer determines whether the user is entitled to access that resource or perform that action. In CWD, authorization is enforced before RAG retrieval and independently again at the MCP layer. This follows the principle that the LLM can recommend an action, but it cannot grant itself permission.”**

**Strong interview line:**

> **“The LLM decides what it wants to do; the policy layer decides whether it is allowed to do it.”**
