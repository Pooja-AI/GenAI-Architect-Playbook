### Interview answer

> **I would make CWD multi-tenant by treating `tenant_id` as a first-class security and isolation boundary across the entire request lifecycle—not just as a database column.**
>
> Every request would be authenticated, mapped to a tenant, and then the `tenant_id` would flow through **Coordinator → Delegator → Worker → MCP → enterprise systems**. Every data access, tool call, cache entry, vector search, workflow state, and audit record would be tenant-scoped.
>
> I would combine **logical isolation by default** with **stronger physical isolation for high-security tenants**.

### Multi-tenant CWD

```text
                         User
                          |
                          v
                 +----------------+
                 | Identity       |
                 | Entra / IAM    |
                 +----------------+
                          |
                    tenant_id = T1
                          |
                          v
                 +----------------+
                 | Tenant Context |
                 +----------------+
                          |
                          v
                    Coordinator
                          |
              +-----------+-----------+
              |                       |
              v                       v
       Sales Delegator          IT Delegator
              |                       |
          Workers                  Workers
              |                       |
              +-----------+-----------+
                          |
                          v
                     MCP Gateway
                          |
                          v
                Enterprise Systems
```

### 1. Tenant identification

At authentication time, I would establish:

```text
user_id
tenant_id
roles
permissions
claims
```

I would **not trust `tenant_id` supplied by the client request body**.

For example:

```json
{
  "user": "user123",
  "tenant_id": "tenant-A",
  "roles": ["sales_user"]
}
```

The backend derives the tenant context from the authenticated identity/token and propagates it internally.

---

### 2. Tenant-aware authorization

Every layer validates the tenant context.

```text
Request
   ↓
Authentication
   ↓
Tenant identification
   ↓
Authorization
   ↓
Coordinator
   ↓
Delegator
   ↓
Worker
   ↓
MCP Tool
```

A Worker should never simply ask:

> "Does this user have permission?"

It should effectively enforce:

> **Does this user, in this tenant, have permission to perform this operation on this resource?**

---

### 3. Tenant-isolated data

For shared databases:

```text
tenant_id | customer_id | data
----------|-------------|------
T1        | C101        | ...
T1        | C102        | ...
T2        | C201        | ...
T2        | C202        | ...
```

Every query must include tenant filtering.

```sql
SELECT *
FROM customer
WHERE tenant_id = :tenant_id
AND customer_id = :customer_id;
```

I would also enforce this at the data-access layer so developers don't accidentally omit the filter.

---

### 4. Tenant-aware RAG

This is particularly important for CWD.

I would store tenant information as metadata:

```text
document_id
tenant_id
department
classification
ACL
embedding
```

Search becomes:

```text
User Query
    ↓
Tenant + ACL filter
    ↓
Hybrid/vector search
    ↓
Reranking
    ↓
LLM
```

For example:

```text
tenant_id = T1
AND user has access
AND classification <= user's clearance
```

This prevents a user from Tenant A retrieving documents belonging to Tenant B.

---

### 5. Tenant-isolated MCP tools

The MCP layer should also receive tenant context.

```text
Worker
  |
  | tenant_id + user identity + authorization context
  v
MCP Gateway
  |
  v
MCP Server
  |
  v
Salesforce / ServiceNow / SharePoint
```

The MCP server should validate that the requested enterprise resource belongs to the appropriate tenant and that the user is authorized to access it.

**The tenant boundary must not disappear when the request crosses MCP.**

---

### 6. Tenant-aware cache

This is an easy place to accidentally create a security issue.

Bad:

```text
cache["customer_123"]
```

Better:

```text
cache["tenantA:customer_123"]
```

Even better, include relevant authorization context where required:

```text
tenantA:user123:customer123
```

Otherwise, one tenant could potentially receive cached information generated for another tenant.

---

### 7. Tenant-isolated workflow state

For your LangGraph/CWD workflow:

```text
workflow_id
tenant_id
user_id
request_id
status
checkpoint
```

Example:

```text
Tenant A
  └── Workflow 1001
       ├── Sales Worker → completed
       ├── IT Worker → completed
       └── Aggregation → completed

Tenant B
  └── Workflow 2001
       ├── Sales Worker → running
       └── IT Worker → failed
```

The checkpoint store must enforce tenant boundaries when reading or resuming workflows.

---

### 8. Tenant-aware observability

Every log, trace, and metric should contain:

```text
tenant_id
user_id
request_id
workflow_id
agent_id
worker_id
```

For example:

```text
tenant=T1
workflow=WF123
worker=ServiceNowWorker
latency=2.4s
tokens=1200
status=SUCCESS
```

But I would also be careful with **PII and sensitive business data in logs**.

---

### 9. Tenant-specific quotas and cost controls

One tenant shouldn't be able to consume all platform resources.

I would introduce:

```text
Tenant A
 ├── 10 requests/sec
 ├── 100 concurrent workflows
 ├── $500/day LLM budget
 └── 50 MCP calls/sec

Tenant B
 ├── 5 requests/sec
 ├── 50 concurrent workflows
 ├── $200/day LLM budget
 └── 20 MCP calls/sec
```

This provides **fairness, cost control, and noisy-neighbor protection**.

---

### 10. Different isolation levels

I would support multiple isolation models.

| Model                               | Example                   | Use                      |
| ----------------------------------- | ------------------------- | ------------------------ |
| **Shared application**              | Same Coordinator/Workers  | Most tenants             |
| **Shared DB + tenant partitioning** | `tenant_id` isolation     | Cost-efficient           |
| **Separate DB/schema**              | Tenant-specific storage   | Higher isolation         |
| **Dedicated infrastructure**        | Dedicated compute/network | Highly sensitive tenants |

So I wouldn't automatically give every tenant dedicated infrastructure because that increases operational cost.

### One important architectural principle

I would make **tenant context immutable after authentication**:

```text
JWT / Identity
      ↓
Tenant Context
      ↓
Coordinator
      ↓
Delegator
      ↓
Worker
      ↓
MCP
```

A Worker should **never be allowed to change `tenant_id`** based on LLM output or user input.

### Strong closing answer

> **“I would make tenant isolation a security boundary, not just a data attribute. Tenant identity would be established from authentication and propagated through the entire CWD execution path. I would enforce tenant-aware authorization, database and vector-store filtering, MCP authorization, cache and workflow isolation, tenant-aware observability, and per-tenant quotas and cost controls. For highly sensitive customers, I would support dedicated storage or infrastructure. The key principle is that tenant context is established once, trusted internally, and enforced at every boundary.”**
