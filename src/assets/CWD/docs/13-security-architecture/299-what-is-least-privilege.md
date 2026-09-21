## What is Least Privilege?

**Least privilege means giving a user, agent, or application only the minimum permissions required to perform its job—nothing more.**

### CWD example

Suppose CWD has these Workers:

```text id="x9k3p7"
Customer Worker
   → customer.read

Incident Worker
   → incident.read

Ticket Worker
   → ticket.create
```

The **Customer Worker** does not need:

```text
❌ incident.delete
❌ ticket.create
❌ customer.delete
❌ admin
```

It gets only what it needs.

### Why is this important?

Imagine the Customer Worker is compromised.

With least privilege:

```text id="m2c8v1"
Compromised Customer Worker
        ↓
Can access customer.read
        ↓
Cannot access:
- Incident administration
- Ticket creation
- Customer deletion
- Other restricted systems
```

So the **blast radius is limited**.

### Least privilege in CWD

I apply it at multiple levels:

```text id="q7f4n2"
User
 ↓
Only required roles/scopes
 ↓
Coordinator
 ↓
Only authorized Delegators
 ↓
Worker
 ↓
Only required MCP tools
 ↓
Enterprise System
 ↓
Only required data/resources
```

For example, an Incident Worker might be allowed to call:

```text
get_incidents(customer_id)
```

but not:

```text
delete_incident()
create_admin_user()
delete_customer()
```

### Least privilege + Managed Identity + RBAC

These work together:

```text id="v5r8k2"
Managed Identity
      ↓
Who is the workload?
      ↓
RBAC
      ↓
What can it do?
      ↓
Entitlement / ACL
      ↓
What data can it access?
```

### Interview-ready answer

> **“Least privilege means giving each user, agent, Worker, or service only the minimum permissions required for its specific responsibility. In CWD, for example, an Incident Worker may have permission to read incidents but not create or delete customer records. I apply least privilege to users, workload identities, Delegators, Workers, MCP tools, and data access. Combined with RBAC and entitlement checks, this limits the blast radius if an identity or agent is compromised.”**

**Easy memory:**
**Right identity → Right permission → Right tool → Right data → Nothing extra.**
