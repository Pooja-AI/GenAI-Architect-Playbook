## How do you implement tenant isolation?

**Tenant isolation means one customer/organization (tenant) must never be able to access another tenant's data, agents, conversations, tools, or resources.**

In CWD, I implement isolation at **multiple layers**, not just at the database level.

### CWD tenant-isolation flow

```text
User
  ↓
Entra ID Authentication
  ↓
Extract tenant_id + user_id + roles
  ↓
Coordinator
  ↓
A2A → Delegator
  ↓
Worker
  ↓
MCP Authorization
  ↓
Enterprise Data
```

The key principle is:

```text
tenant_id = T001
       ↓
Must remain T001
through the entire workflow
```

### 1. Identify the tenant

When the user authenticates, I obtain the tenant identity from the trusted identity provider.

For example:

```json
{
  "user_id": "U123",
  "tenant_id": "T001",
  "roles": ["sales_user"]
}
```

I **don't allow the LLM to decide or freely modify `tenant_id`**.

---

### 2. Propagate tenant context

The `tenant_id` becomes part of the CWD workflow context.

```python
state = {
    "tenant_id": "T001",
    "user_id": "U123",
    "customer_id": "C12345",
    "intent": "CustomerBriefing"
}
```

It is propagated:

```text
Coordinator
    ↓ tenant_id=T001
Sales Delegator
    ↓ tenant_id=T001
Customer Worker
    ↓ tenant_id=T001
MCP Server
    ↓ tenant_id=T001
Salesforce
```

---

### 3. Enforce tenant authorization

Every important service validates the tenant.

For example:

```python
if request.tenant_id != authenticated_tenant_id:
    raise UnauthorizedError("Tenant mismatch")
```

I don't rely on the Coordinator or LLM alone.

The **MCP server and downstream data-access layer also enforce authorization**.

---

### 4. Tenant-aware data queries

For shared databases, every query is filtered by tenant.

```sql
SELECT *
FROM customer
WHERE customer_id = :customer_id
  AND tenant_id = :tenant_id;
```

So even if someone knows another customer's ID, the query won't return data from another tenant.

---

### 5. Tenant isolation in RAG

This is especially important in an enterprise GenAI system.

Every document/chunk gets tenant metadata:

```json
{
  "document_id": "DOC100",
  "tenant_id": "T001",
  "customer_id": "C12345",
  "classification": "internal"
}
```

During retrieval:

```text
User → Worker
         ↓
Azure AI Search
         ↓
tenant_id = T001
AND
user entitlement = allowed
         ↓
Retrieve documents
```

So the vector similarity search **cannot simply return the most similar document from another tenant**.

---

### 6. Tenant isolation in conversation/state

I also isolate:

* sessions
* tasks
* runs
* checkpoints
* agent memory
* Redis data
* Cosmos DB records
* cached responses

For example:

```text
Cache Key:

tenant:T001:user:U123:session:S001
```

Not:

```text
session:S001
```

Otherwise one tenant could accidentally receive another tenant's cached result.

---

### 7. Tenant isolation in MCP

The Worker may request:

```text
get_customer(customer_id=C12345)
```

But the MCP server also knows:

```text
authenticated tenant = T001
```

It verifies:

```text
T001 → C12345 → permitted?
```

Only then:

```text
MCP Server → Salesforce
```

This prevents a Worker from simply changing the tenant/customer parameter.

---

### 8. Tenant isolation in A2A

For Coordinator → Delegator communication:

```json
{
  "task_id": "TASK001",
  "tenant_id": "T001",
  "customer_id": "C12345",
  "intent": "CustomerBriefing"
}
```

The receiving Delegator validates that the authenticated caller is allowed to operate for `T001`.

I also avoid sending unnecessary tenant data or complete conversation state between agents.

---

### 9. Separate resources when required

There are different levels of isolation.

**Shared infrastructure:**

```text
Tenant A ─┐
Tenant B ─┼→ Shared service
Tenant C ─┘
       ↓
Strong tenant-level authorization
```

**Dedicated resources:**

```text
Tenant A → VNet/DB/Search A
Tenant B → VNet/DB/Search B
Tenant C → VNet/DB/Search C
```

For highly sensitive or regulated tenants, dedicated infrastructure can provide stronger isolation.

---

## What happens if a user changes `tenant_id`?

Suppose the authenticated user belongs to `T001` but sends:

```json
{
  "tenant_id": "T002",
  "customer_id": "C99999"
}
```

I don't trust that value.

```text
Authenticated tenant = T001
Request tenant       = T002
                     ↓
                 MISMATCH
                     ↓
                  BLOCK
                     ↓
                  AUDIT
```

The request should never reach Salesforce, ServiceNow, or the RAG layer.

---

## CWD implementation layers

| Layer       | Tenant isolation                                 |
| ----------- | ------------------------------------------------ |
| Identity    | Entra ID tenant/user identity                    |
| API         | Validate authenticated tenant                    |
| Coordinator | Create trusted tenant context                    |
| A2A         | Propagate + validate tenant context              |
| Delegator   | Enforce tenant boundary                          |
| Worker      | Never switch tenant implicitly                   |
| MCP         | Re-authorize tenant + tool access                |
| RAG         | Tenant/ACL metadata filtering                    |
| Database    | Tenant-aware queries / row-level security        |
| Cache       | Tenant-scoped cache keys                         |
| Memory      | Tenant-scoped sessions/checkpoints               |
| Storage     | Tenant-scoped paths/containers                   |
| Network     | Segmentation/private connectivity where required |
| DLP         | Prevent cross-tenant data leakage                |
| Audit       | Log tenant + user + action + decision            |

### Interview-ready answer

> **“I implement tenant isolation as a defense-in-depth control. The authenticated identity establishes the tenant, and I propagate a trusted tenant context through the Coordinator, A2A Delegators, Workers, and MCP. Every data access is tenant-scoped, including databases, RAG indexes, caches, memory, and storage. MCP independently validates the user's and agent's authorization before accessing enterprise systems. For RAG, tenant and ACL metadata filters are applied before documents reach the LLM. For highly sensitive tenants, I can use dedicated resources or environments. Most importantly, I never rely on the LLM to enforce tenant boundaries—the authorization and data layers enforce them.”**

### Easy memory

**Identify → Propagate → Validate → Filter → Isolate → Audit**

**Strong interview line:**

> **“Tenant ID is a security boundary, not just application metadata.”**
