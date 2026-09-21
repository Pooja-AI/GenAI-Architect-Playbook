## What happens if a user asks for confidential HR information?

In CWD, I **don't let the LLM decide whether the user can access HR data**. The request goes through entitlement and policy checks first.

### CWD flow

```text
User
  ↓
"Show me confidential HR information"
  ↓
Entra ID Authentication
  ↓
Tenant + User + Role
  ↓
Entitlement / Policy Check
  ↓
     ┌───────────────┐
     │ Authorized?   │
     └───────┬───────┘
        NO   │   YES
        ↓        ↓
      BLOCK    HR Worker
        ↓        ↓
      Audit    MCP
                 ↓
          HR System
```

### Example

Suppose a normal Sales user asks:

> "Show me John's salary and performance review."

The entitlement service checks:

```text
User: U123
Role: Sales
Requested data: HR confidential
Resource: Employee HR record
Permission: DENIED
```

Then:

```text
Request
   ↓
Authorization = DENY
   ↓
No HR retrieval
No MCP call
No LLM context containing HR data
   ↓
Safe response
   ↓
Audit event
```

The system should **not retrieve the HR record first and filter it afterward**.

---

### What if the user is an HR-authorized user?

Then the system can allow the request, but still apply restrictions:

```text
HR User
   ↓
Entitlement ✓
   ↓
HR Worker
   ↓
MCP Authorization
   ↓
HR System
   ↓
Retrieve only permitted fields
   ↓
DLP / output policy
   ↓
User
```

For example, an HR user might be entitled to employee records but not payroll data.

So entitlement can be **resource- and field-level**, not just "HR user = everything."

---

### What security controls do I apply?

1. **Authentication** — identify the user.
2. **Tenant validation** — ensure the user belongs to the correct tenant.
3. **RBAC/ABAC** — check role and attributes.
4. **Resource entitlement** — determine whether this employee/data is accessible.
5. **RAG ACL filtering** — don't retrieve unauthorized HR documents.
6. **MCP authorization** — independently authorize HR tools.
7. **Data minimization** — return only necessary fields.
8. **DLP/output filtering** — detect sensitive information leaving the system.
9. **Audit logging** — record access decisions without logging sensitive content unnecessarily.
10. **HITL where required** — sensitive operations can require human approval.

### Important distinction

**HITL is not the primary authorization mechanism.**

```text
Authorization → "Is this user allowed?"
HITL           → "Should a human approve this sensitive action?"
```

Even if a human approves a workflow, the underlying authorization controls still apply.

### Interview-ready answer

> **“If a user asks for confidential HR information, I first authenticate the user and evaluate tenant, role, resource, and data-level entitlements before any HR data is retrieved. If the user isn't authorized, I block the request and don't call the HR MCP tool or place HR data into the LLM context. If the user is authorized, I still apply least-privilege access, field-level filtering, DLP, and auditing. The LLM never makes the authorization decision; the security and policy layers do.”**

### Strong interview line

> **“For confidential HR data, authorization happens before retrieval—not after the LLM has already seen the data.”**
