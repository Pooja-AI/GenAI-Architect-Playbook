## How do you implement entitlement-first security?

**Entitlement-first security means we check what the user is allowed to access *before* we retrieve data, select sensitive tools, or execute actions.**

In CWD, the LLM/agent should **never discover data first and then decide whether the user can see it**.

### CWD flow

```text
User
  ↓
Entra ID Authentication
  ↓
Identity + Tenant + Roles
  ↓
Entitlement Check  ← FIRST
  ↓
Coordinator
  ↓
Delegator
  ↓
Worker
  ↓
RAG / MCP
  ↓
Enterprise Data / Action
```

The important principle is:

```text
NO ENTITLEMENT
      ↓
NO DATA
      +
NO TOOL
      +
NO ACTION
```

---

### 1. Establish the user's identity

For example:

```json
{
  "user_id": "U123",
  "tenant_id": "T001",
  "roles": ["sales_user"],
  "groups": ["customer-support"]
}
```

This comes from the authenticated identity/token—not from the LLM.

---

### 2. Resolve entitlements

I determine what this user is actually allowed to access.

For example:

```text
User U123
   │
   ├── Tenant: T001
   ├── Department: Sales
   ├── Customers: C12345, C67890
   ├── Data: CRM
   ├── Data: Incidents
   └── Actions: Read Customer
```

The entitlement service/policy layer can use **RBAC + ABAC + resource-level permissions**.

---

### 3. Check entitlement before RAG retrieval

This is critical for CWD.

Suppose the user asks:

> "Give me a briefing for customer C12345."

Before searching:

```text
User U123
   ↓
Can U123 access C12345?
   ↓
      YES
       ↓
Azure AI Search
       ↓
tenant_id = T001
customer_id = C12345
ACL = U123 allowed
       ↓
Retrieve
```

If the user isn't entitled:

```text
U123 → C12345
        ↓
     DENIED
        ↓
Don't retrieve data
```

This is stronger than retrieving the document and filtering afterward.

---

### 4. Apply ACL filtering during RAG

Every indexed document/chunk contains security metadata.

```json
{
  "tenant_id": "T001",
  "customer_id": "C12345",
  "allowed_groups": ["sales"],
  "classification": "internal"
}
```

The retrieval query includes security filters:

```text
tenant_id = T001
AND customer_id = C12345
AND user/group entitlement = allowed
```

So unauthorized documents don't enter the LLM context.

**This is extremely important:** authorization happens **before the data becomes model context**.

---

### 5. Apply entitlement to MCP tools

Suppose the Customer Worker wants:

```text
MCP → Salesforce.get_customer()
```

The MCP server checks:

```text
Is user authorized?
Is Worker authorized?
Is tenant correct?
Is customer authorized?
Is this tool allowed?
Are these parameters allowed?
```

Only then:

```text
ALLOW → Salesforce
```

Otherwise:

```text
BLOCK → Audit
```

---

### 6. Differentiate read vs write permissions

For example:

```text
Sales Worker
 ├── get_customer       → READ
 ├── get_opportunities   → READ
 └── update_customer     → WRITE
```

A user might have:

```text
get_customer       ✓
get_opportunities  ✓
update_customer    ✗
```

The LLM cannot elevate the user's permission simply by requesting the write tool.

---

### 7. Enforce entitlement at multiple layers

I would use defense in depth:

```text
             Entra ID
                ↓
        Identity / Tenant
                ↓
       Entitlement Policy
                ↓
          Coordinator
                ↓
           Delegator
                ↓
             Worker
                ↓
       RAG ACL Filtering
                ↓
         MCP Authorization
                ↓
      Enterprise Application
```

Even if one layer has a bug, another layer can prevent unauthorized access.

---

## Example: CWD Customer Briefing

User asks:

> "Get customer C12345's CRM information and open incidents."

### Authorized user

```text
U123
 ↓
Tenant = T001
 ↓
Entitlement check
 ↓
CRM access ✓
Incident access ✓
 ↓
Coordinator
 ↓
 ┌─────────────────────┐
 ↓                     ↓
Sales Delegator     IT Delegator
 ↓                     ↓
Customer Worker    Incident Worker
 ↓                     ↓
MCP Salesforce     MCP ServiceNow
 ↓                     ↓
CRM data           Incident data
 └──────────┬──────────┘
            ↓
       Coordinator
            ↓
      Validate/Aggregate
            ↓
          User
```

### Unauthorized user

```text
U456
 ↓
Entitlement check
 ↓
Customer C12345 = NOT ALLOWED
 ↓
BLOCK
```

The system should **not** retrieve the customer's Salesforce records and then ask the LLM whether it should show them.

---

## Entitlement vs authentication vs authorization

A useful interview distinction:

| Concept        | Question                                                           |
| -------------- | ------------------------------------------------------------------ |
| Authentication | **Who are you?**                                                   |
| Authorization  | **What are you allowed to do?**                                    |
| Entitlement    | **Which specific resource/data/action are you allowed to access?** |

Example:

```text
Authentication:
U123 is Pooja.

Authorization:
U123 can use Customer Worker.

Entitlement:
U123 can access Customer C12345,
but not Customer C99999.
```

### Interview-ready answer

> **“I implement entitlement-first security by resolving the authenticated user's tenant, identity, roles, and resource entitlements before allowing data retrieval or tool execution. In CWD, the entitlement context flows from the Coordinator through the Delegator and Worker, but authorization is independently enforced at the RAG and MCP layers. For RAG, tenant and ACL filters are applied before documents enter the LLM context. For MCP, we validate user entitlement, worker permission, tool permission, resource entitlement, and business policy before executing Salesforce or ServiceNow operations. This prevents unauthorized data from ever reaching the model and prevents the LLM from bypassing security controls.”**

### Strong interview line

> **“Don't retrieve and then authorize. Authorize first, then retrieve.”**

### Easy memory

**Identity → Entitlement → Retrieve → Execute → Audit**
