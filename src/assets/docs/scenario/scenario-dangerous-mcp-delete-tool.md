## Strong Interview Answer

> **“I would never expose a destructive MCP tool like `delete_record` directly to an autonomous agent with unrestricted access. I would put authorization, validation, approval, and audit controls around the tool. The agent can propose the deletion, but the security layer—not the LLM—must decide whether it is allowed.”**

### Enterprise Design

```text
User
  |
  v
Agent
  |
  | "Delete employee record 123"
  v
MCP Tool Gateway
  |
  +--> Authentication
  |
  +--> Authorization / RBAC
  |
  +--> Policy Validation
  |
  +--> Input Validation
  |
  +--> Approval Check
  |
  +--> Audit Logging
  |
  v
Delete API
  |
  v
Database
```

### 1. Use least privilege

Don't expose:

```text
delete_database()
```

Instead expose a narrowly scoped operation:

```text
delete_employee_record(employee_id)
```

And ideally restrict **which records** the agent can operate on.

For example:

```text
Agent:
    Can read customer records
    Can request deletion
    Cannot directly delete arbitrary records
```

---

### 2. Separate "request deletion" from "execute deletion"

This is one of my preferred designs for high-risk actions.

Instead of:

```text
Agent → delete_record() → Database
```

use:

```text
Agent
  |
  v
request_delete(record_id)
  |
  v
Policy Engine
  |
  v
Human Approval
  |
  v
execute_delete()
```

For high-impact operations, the agent creates a **pending action** rather than executing immediately.

---

### 3. Add authorization outside the LLM

The agent saying:

> "The user is authorized to delete this record."

means nothing by itself.

I would validate:

```text
User Identity
      +
User Role
      +
Resource
      +
Action
      ↓
Policy Engine
      ↓
ALLOW / DENY
```

Example:

```text
Employee → DELETE payroll record → DENY
HR Admin → DELETE permitted record → MAYBE ALLOW
System Admin → DELETE → Policy dependent
```

The actual MCP server/tool should enforce this independently.

---

### 4. Require confirmation for destructive actions

For irreversible operations:

```text
Agent:
"I found customer record 8472.
Deleting it will permanently remove the record.
Do you want to continue?"
```

User:

```text
Confirm
```

Then:

```text
Agent → MCP → Policy → Delete
```

I would distinguish:

```text
Low risk       → automatic
Medium risk    → explicit confirmation
High risk      → human approval
Irreversible   → approval + strong controls
```

---

### 5. Use soft delete where possible

Instead of immediately doing:

```sql
DELETE FROM customers WHERE id = 8472;
```

prefer:

```sql
UPDATE customers
SET deleted = true
WHERE id = 8472;
```

Then retain the record for a defined recovery/retention period.

This provides:

```text
Delete request
      ↓
Soft delete
      ↓
Recovery window
      ↓
Permanent deletion
```

For regulated data, retention/legal requirements would determine whether this is appropriate.

---

### 6. Validate the tool parameters

Never allow the agent to construct unrestricted database commands.

Bad:

```text
execute_sql("DELETE FROM employees ...")
```

Better:

```text
delete_record(
    record_id="8472",
    reason="duplicate record"
)
```

The MCP server validates:

```text
record_id → valid?
record exists → yes?
user authorized → yes?
deletion allowed → yes?
reason provided → yes?
approval required → yes/no?
```

---

### 7. Add guardrails against agent loops

Suppose the agent repeatedly calls:

```text
delete_record(123)
delete_record(123)
delete_record(123)
```

The MCP layer should protect itself.

For example:

```text
max destructive actions / request
idempotency key
rate limiting
duplicate-action detection
transaction boundaries
```

So even if the agent behaves incorrectly, the tool doesn't become dangerous.

---

### 8. Audit every destructive action

I would log:

```text
User
Agent
MCP tool
Record ID
Action
Reason
Timestamp
Approval
Policy decision
Result
```

Example:

```json
{
  "user": "user123",
  "agent": "CustomerAgent",
  "tool": "delete_record",
  "record_id": "8472",
  "action": "DELETE",
  "approval": "approved",
  "policy": "ALLOW",
  "timestamp": "..."
}
```

This is critical for enterprise governance and incident investigation.

---

# MCP-Specific Architecture

I would structure the MCP server like this:

```text
                 Agent
                   |
                   v
            MCP Client
                   |
                   v
          MCP Server / Gateway
                   |
        ┌──────────┴───────────┐
        |                      |
     Read Tools          Destructive Tools
        |                      |
        |                Policy Check
        |                      |
        |                Approval Check
        |                      |
        |                 Audit Logger
        |                      |
        └──────────┬───────────┘
                   ↓
              Backend API
                   ↓
               Database
```

The important point is:

> **MCP provides the tool interface; it should not be treated as the authorization boundary by itself.**

The backend must still enforce authorization.

---

## Example: Safe MCP Tool

Instead of exposing:

```python
delete_record(id)
```

I would conceptually expose:

```python
request_record_deletion(
    record_id,
    reason
)
```

The server performs:

```text
1. Authenticate caller
2. Validate record_id
3. Check authorization
4. Evaluate deletion policy
5. Determine approval requirement
6. Create deletion request
7. Log audit event
8. Execute only after approval
```

For a high-risk enterprise system, the actual deletion might require a separate privileged service rather than giving the general-purpose agent direct database deletion capability.

---

# ⭐ 30-Second Interview Answer

> **“I would treat a delete-capable MCP tool as a high-risk capability and apply least privilege. I wouldn't give the agent unrestricted `delete_record` access. The MCP server would authenticate the user, enforce RBAC/ABAC and resource-level authorization, validate the parameters, and apply a policy engine. For high-risk or irreversible operations, the agent would create a deletion request and require explicit user or human approval before execution. I'd prefer soft delete where possible, add idempotency and rate limits to prevent repeated actions, and audit every destructive operation. Most importantly, authorization must be enforced by the tool/backend—not by the LLM prompt.”**

### Key interview phrase

> **“The agent can recommend or request a destructive action; the security layer decides whether it can actually execute it.”**
