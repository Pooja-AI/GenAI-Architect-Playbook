## How do you prevent a Delegator from calling unauthorized Workers?

The key principle is:

> **The Delegator does not get unrestricted permission to call any Worker. Authorization is enforced outside the LLM through deterministic policies.**

### Step-by-step flow

```text
User Request
     ↓
Coordinator
     ↓
Delegator
     ↓
LLM proposes required capability
     ↓
Worker Registry
     ↓
Authorization / Policy Check
     ↓
Allowed Worker?
   ↙        ↘
 YES         NO
 ↓            ↓
Execute      Reject
Worker       request
```

### 1. Worker Registry defines what the Worker can do

For example:

```python
{
    "worker": "CustomerProfileWorker",
    "domain": "Sales",
    "capabilities": ["customer_profile"],
    "allowed_delegators": ["SalesDelegator"],
    "status": "ACTIVE"
}
```

So `ITDelegator` cannot simply call `CustomerProfileWorker`.

---

### 2. Delegator identity is authenticated

Each Delegator has a service identity, for example:

```text
SalesDelegator → Managed Identity / Service Principal
ITDelegator    → Managed Identity / Service Principal
```

When the Delegator calls a Worker or Worker service, the request carries its identity/token.

The Worker service can verify:

```text
Who is calling me?
Is this Delegator allowed?
What operation is being requested?
```

---

### 3. Authorization policy is checked

For example:

```text
SalesDelegator
     ↓
CustomerProfileWorker
     ↓
Policy Check
     ↓
Allowed? YES
```

But:

```text
ITDelegator
     ↓
CustomerProfileWorker
     ↓
Policy Check
     ↓
Allowed? NO
     ↓
Reject
```

This is typically enforced using mechanisms such as **Microsoft Entra ID, RBAC/ABAC, API authorization, and service-to-service identity** in your Azure architecture.

---

### 4. Don't trust the LLM

Suppose the Delegator LLM says:

```text
"Call HRConfidentialWorker"
```

The system does **not** automatically execute it.

Instead:

```text
LLM says:
HRConfidentialWorker
       ↓
Worker Registry
       ↓
Is it registered?
       ↓
Does SalesDelegator have permission?
       ↓
Is the operation allowed?
       ↓
NO
       ↓
BLOCK
```

So even if the LLM is manipulated or makes a mistake, the authorization layer prevents the call.

---

### 5. Worker should also enforce authorization

Don't rely only on the Delegator.

Use **defense in depth**:

```text
Delegator
   ↓
Authorization Check #1
   ↓
Worker
   ↓
Authorization Check #2
   ↓
Enterprise API
```

For example:

```text
SalesDelegator
      ↓
Can SalesDelegator call ContractWorker?
      ↓ YES
ContractWorker
      ↓
Can this request access Contract C123?
      ↓ YES
Contract System
```

This protects against a compromised or incorrectly configured Delegator.

---

### 6. MCP tools also need authorization

If the Worker uses MCP:

```text
Delegator
   ↓
Worker
   ↓
MCP Client
   ↓
MCP Server
   ↓
Salesforce
```

The MCP server/tool layer should also enforce:

* authenticated identity
* allowed tool
* allowed operation
* required permissions
* resource-level authorization

So a Worker cannot simply bypass security by calling a different MCP tool.

---

### 7. Example from your CWD

Suppose:

```text
SalesDelegator
 ├── CustomerProfileWorker
 └── ContractWorker

ITDelegator
 ├── IncidentWorker
 └── TicketWorker
```

If `SalesDelegator` tries:

```text
SalesDelegator → IncidentWorker
```

the policy can return:

```json
{
  "allowed": false,
  "reason": "Worker not authorized for this Delegator"
}
```

The Delegator stops execution and logs the event.

---

### 8. Audit everything

For every Worker call, record:

```text
request_id
delegator_id
worker_id
user_id/service_identity
capability
tool
timestamp
authorization_result
status
```

Example:

```text
REQ-123
SalesDelegator
ContractWorker
Operation: get_contract
Authorization: ALLOWED
Result: SUCCESS
```

This gives you traceability and helps investigate unauthorized attempts.

---

## Complete security model

```text
                 User
                  ↓
          Microsoft Entra ID
                  ↓
             Coordinator
                  ↓
             Delegator
                  ↓
        ┌──────────────────┐
        │ Worker Registry   │
        │ Policy Validation │
        │ Authorization     │
        └────────┬─────────┘
                 ↓
              Worker
                 ↓
          MCP Authorization
                 ↓
          Enterprise System
```

### The important principle

**Don't rely on one security check.**

Use:

1. **Identity** — Who is calling?
2. **Registry** — Does this Worker exist and support the capability?
3. **Authorization** — Is this Delegator allowed to call it?
4. **Resource authorization** — Can it access this particular customer/data?
5. **MCP/tool authorization** — Is this operation allowed?
6. **Audit logging** — Record the decision.

### Interview-ready explanation

> **"We prevent unauthorized Worker calls using deterministic authorization rather than trusting the Delegator LLM. Each Delegator has a service identity, and the Worker Registry defines which Delegators are allowed to invoke each Worker. Before execution, we validate the Worker, capability, identity, and authorization policy. We also enforce authorization at the Worker and MCP/tool layers for defense in depth. If the authorization check fails, the call is blocked and audited."**

**One line to memorize:**

> **"LLM proposes, Registry identifies, authorization validates, and the Worker/MCP layer enforces."**
