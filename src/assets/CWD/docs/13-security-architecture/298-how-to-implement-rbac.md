## How do you implement RBAC in CWD?

**RBAC (Role-Based Access Control)** means assigning permissions to a **role**, and assigning that role to a user, agent, or workload identity.

In CWD, I use RBAC to enforce **least privilege** at multiple layers.

### CWD authorization flow

```text id="q0w6re"
User / Agent Identity
        ↓
Microsoft Entra ID
        ↓
Role / Permission Check
        ↓
Coordinator
        ↓
Delegator
        ↓
Worker
        ↓
MCP Tool
        ↓
Enterprise Resource
```

### 1. Define roles

For example, in CWD:

```text id="z7y8k1"
SalesReader
 ├── customer.read
 └── opportunity.read

ITReader
 ├── incident.read
 └── knowledge.read

ITOperator
 ├── incident.read
 └── ticket.create

Admin
 └── administrative operations
```

I avoid giving every Worker an `Admin` role.

---

### 2. Assign roles to identities

For example:

```text id="d8k3p2"
User
 └── SalesReader

Customer Worker
 └── CustomerDataReader

Incident Worker
 └── IncidentReader

Ticket Worker
 └── TicketOperator
```

The identity can be a user, service principal, or managed identity depending on the component.

---

### 3. Check authorization before execution

Suppose the user asks:

> "Create a ServiceNow ticket for C12345."

CWD checks:

```text id="m2n9r4"
User authenticated?
       ↓ YES
Has ticket.create?
       ↓ YES
Worker allowed to create tickets?
       ↓ YES
Customer/resource entitlement valid?
       ↓ YES
MCP tool allowed?
       ↓ YES
       Execute
```

If the user only has:

```text
incident.read
```

then:

```text
ticket.create → DENY
```

---

### 4. Enforce RBAC at the MCP layer too

I don't rely only on the Coordinator.

```text id="j4s7v2"
Coordinator
    ↓ authorization
Delegator
    ↓ authorization
Worker
    ↓
MCP Server
    ↓ authorization
Enterprise System
```

The MCP Server independently checks whether the Worker is allowed to execute the requested tool.

This provides **defense in depth**.

---

### 5. Combine RBAC with data entitlement

RBAC answers:

> **"Can this identity perform this type of operation?"**

But we may also need:

> **"Can this user access this specific customer's data?"**

Example:

```text id="f3k8q1"
Role:
CustomerReader ✓

Requested:
customer_id = C12345

Customer entitlement:
C12345 → allowed ✓
```

If the customer isn't within the user's entitlement:

```text
RBAC → Allowed
Entitlement → Denied
```

So the operation is still rejected.

For RAG, the same principle applies through ACL/metadata filtering **before documents are provided to the LLM**.

---

### 6. Example in Azure

For Azure resources, CWD workloads can use **Managed Identity + Azure RBAC**.

```text id="v5c2m7"
Incident Worker
      ↓
Managed Identity
      ↓
Azure RBAC
      ↓
Key Vault / Storage / Search / other resource
```

Example conceptually:

```text
IncidentWorkerIdentity
       ↓
Key Vault Secrets User
       ↓
Specific Key Vault
```

Rather than:

```text
IncidentWorkerIdentity
       ↓
Subscription Owner ❌
```

The second violates least privilege.

---

### Interview-ready answer

> **“I implement RBAC by defining roles based on business capabilities and assigning those roles to authenticated users and workload identities. For example, a Customer Worker may have customer-read permissions, while an Incident Worker has incident-read permissions and a Ticket Worker has ticket-create permissions. Before executing an operation, we validate the identity, required role or scope, resource entitlement, and tool permission. I enforce authorization at multiple boundaries, including the API, Coordinator/agent layer, and MCP Server, rather than trusting a single check. For Azure resources, Managed Identity combined with Azure RBAC provides the workload identity and resource permissions. This follows least privilege and defense in depth.”**

### Easy memory

**Define role → Assign role → Check permission → Check data entitlement → Execute**

And remember:

> **RBAC = what you can do.**
> **Entitlement/ACL = what data you can access.**
