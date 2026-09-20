For your **CWD architecture**, `delete_customer` should be treated as a **high-risk MCP tool**. I would never allow the LLM to directly execute deletion.

### 1. Secure architecture

```text
User
 ↓
Entra ID
 ↓
Coordinator
 ↓ A2A
Delegator
 ↓ A2A
Worker
 ↓
MCP Client
 ↓
MCP Server
 ↓
Authentication
 ↓
Authorization
 ↓
Input Validation
 ↓
Policy / Risk Check
 ↓
HITL Approval
 ↓
Idempotency Check
 ↓
Salesforce API
 ↓
Audit + Monitoring
```

The key principle:

> **The LLM can request deletion, but only the trusted MCP Server can authorize and execute it.**

---

## 2. Define a very restricted tool schema

I wouldn't expose a generic deletion API.

```python
from pydantic import BaseModel, Field

class DeleteCustomerRequest(BaseModel):
    customer_id: str = Field(
        pattern=r"^C[0-9]+$",
        min_length=2,
        max_length=20
    )

    reason: str = Field(
        min_length=10,
        max_length=500
    )

    idempotency_key: str
```

Example:

```json
{
  "customer_id": "C123",
  "reason": "Customer requested account deletion",
  "idempotency_key": "run-789-delete-C123"
}
```

The MCP Server rejects malformed arguments **before Salesforce is called**.

---

## 3. Authenticate the caller

The MCP Server validates the identity/token of the calling Worker.

```python
caller = authenticate(request.token)

if not caller:
    raise Unauthorized()
```

We identify:

```text
User
Worker
Application
Tenant
Correlation ID
```

---

## 4. Authorize the operation

Next, check whether that Worker is actually allowed to delete customers.

```python
if not policy_engine.is_allowed(
    caller=caller,
    tool="delete_customer"
):
    raise Forbidden("Delete operation not permitted")
```

For example:

```text
Sales Worker
    ↓
delete_customer
    ↓
❌ Not authorized

Customer Admin Worker
    ↓
delete_customer
    ↓
✅ Potentially authorized
```

This prevents a prompt injection from simply convincing a Sales Worker to perform a privileged operation.

---

## 5. Check customer-level entitlement

Even an authorized Worker shouldn't necessarily be able to delete **any** customer.

```python
if not entitlement_service.can_delete(
    caller.user_id,
    customer_id
):
    raise Forbidden()
```

So we check both:

```text
Can this Worker use delete_customer?
             +
Can this user delete C123?
```

---

## 6. Require human approval

Because deletion is destructive, I'd introduce HITL.

```text
delete_customer(C123)
        ↓
Authorization
        ↓
Policy
        ↓
Human approval
        ↓
Salesforce deletion
```

The approval request should clearly show:

```text
Customer: C123
Requested by: user123
Operation: DELETE
Reason: Customer requested account deletion
```

The LLM should **not be able to approve its own request**.

---

## 7. Use idempotency

Suppose the Worker retries because of a timeout.

Without protection:

```text
Request 1 → DELETE C123
Request 2 → DELETE C123
Request 3 → DELETE C123
```

We use an idempotency key:

```python
if already_processed(idempotency_key):
    return previous_result
```

Example:

```text
run-789-delete-C123
```

This prevents duplicate processing.

---

## 8. Prefer soft delete when possible

For an enterprise system, I would normally prefer:

```text
Active
  ↓
Soft Deleted
  ↓
Retention Period
  ↓
Permanent Deletion
```

instead of immediately performing:

```text
DELETE FROM customer
```

This gives the business a recovery window.

---

## 9. Execute through a controlled backend

The MCP Server shouldn't allow the LLM to construct arbitrary Salesforce requests.

Bad:

```python
execute_salesforce_query(llm_generated_query)
```

Better:

```python
salesforce_client.delete_customer(
    customer_id=validated.customer_id
)
```

The backend integration itself knows exactly what operation is permitted.

---

## 10. Audit everything

Before and after execution, record:

```json
{
  "correlation_id": "run-789",
  "user": "user123",
  "worker": "CustomerAdminWorker",
  "tool": "delete_customer",
  "customer_id": "C123",
  "authorization": "approved",
  "approval_id": "APR-456",
  "status": "success",
  "timestamp": "..."
}
```

Don't log sensitive secrets or credentials.

---

# Simplified implementation

```python
async def delete_customer(request, token):

    # 1. Authenticate
    caller = authenticate(token)

    # 2. Validate input
    data = DeleteCustomerRequest.model_validate(request)

    # 3. Authorize tool
    authorize(caller, "delete_customer")

    # 4. Check resource entitlement
    authorize_customer_access(
        caller.user_id,
        data.customer_id,
        action="delete"
    )

    # 5. Policy check
    policy_engine.check(
        action="customer.delete",
        customer_id=data.customer_id
    )

    # 6. Idempotency
    existing = idempotency_store.get(
        data.idempotency_key
    )

    if existing:
        return existing

    # 7. HITL approval
    approval = await request_human_approval(
        caller=caller,
        customer_id=data.customer_id,
        reason=data.reason
    )

    if not approval.approved:
        audit("delete_denied")
        raise PermissionError("Deletion not approved")

    # 8. Execute controlled API operation
    result = await salesforce.delete_customer(
        data.customer_id
    )

    # 9. Store result for idempotency
    idempotency_store.save(
        data.idempotency_key,
        result
    )

    # 10. Audit
    audit(
        action="delete_customer",
        customer_id=data.customer_id,
        status="success"
    )

    return result
```

### Strong interview answer

> **“I would treat `delete_customer` as a high-risk MCP tool. The MCP Server would authenticate the caller, validate the tool arguments against a strict schema, verify Worker and customer-level authorization, and apply a policy check. Because deletion is destructive, I would require human approval and use an idempotency key to prevent duplicate execution during retries. The actual Salesforce operation would be performed through a controlled backend function rather than arbitrary LLM-generated queries. Finally, I would audit the complete operation using correlation IDs and monitor failures or suspicious activity. Ideally, I would use soft deletion and a retention period rather than immediate permanent deletion.”**

### Remember this sequence

**Auth → Validate → Authorize → Entitlement → Policy → HITL → Idempotency → Execute → Audit**

That sequence is a very strong way to explain **secure MCP tool execution** in an AI Architect interview.
