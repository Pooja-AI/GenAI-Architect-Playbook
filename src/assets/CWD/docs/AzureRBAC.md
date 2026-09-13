# Azure RBAC — Advanced

**Azure RBAC (Role-Based Access Control)** is Azure's authorization system for controlling **who or what can perform which actions on which Azure resources**.

For your CWD architecture:

> **Entra ID identifies the user/workload; Azure RBAC determines what that identity is allowed to do on Azure resources.**

---

# 1. The Core RBAC Model

Remember this formula:

```text id="x4m8qa"
WHO
 │
 ▼
Security Principal
 │
 ▼
ROLE
 │
 ▼
PERMISSIONS
 │
 ▼
RESOURCE
```

Example:

```text id="k7p2vz"
Equipment Worker
      ↓
Managed Identity
      ↓
"Storage Blob Data Reader"
      ↓
Read Blob Data
      ↓
Azure Storage
```

So RBAC answers:

> **"Can this identity perform this operation on this resource?"**

---

# 2. Authentication vs RBAC

This distinction is critical.

### Entra ID

```text
"Who are you?"
```

### RBAC

```text
"What are you allowed to do?"
```

Example:

```text id="m5y8tp"
Equipment Worker
      ↓
Managed Identity
      ↓
Entra ID
      ↓
Authenticated
      ↓
Azure RBAC
      ↓
Storage Blob Data Reader
      ↓
READ allowed
```

---

# 3. Four Important RBAC Components

Azure RBAC has four major concepts:

```text id="q9c4hw"
1. Security Principal
2. Role Definition
3. Scope
4. Role Assignment
```

Let's understand each.

---

# 4. Security Principal

A **security principal** is the identity receiving permissions.

It can be:

* User
* Group
* Service principal
* Managed identity

For CWD:

```text id="w3n7ka"
Security Principals
│
├── Human User
├── Coordinator Identity
├── Delegator Identity
├── Worker Identity
└── MCP Server Identity
```

Example:

```text id="r6b2cx"
RCA Worker
    ↓
Managed Identity
    ↓
Security Principal
```

---

# 5. Role Definition

A **role definition** describes what actions are allowed.

Examples:

* Reader
* Contributor
* Owner
* Storage Blob Data Reader
* Key Vault-related roles
* Azure AI Search-related roles

Conceptually:

```text id="v7q2mz"
Role Definition
     ↓
Allowed Actions
     ↓
Read
Write
Delete
Manage
```

---

# 6. Role Assignment

A **role assignment** connects:

```text
Identity + Role + Scope
```

Example:

```text id="n5r8yc"
Equipment Worker
      +
Storage Blob Data Reader
      +
Equipment Storage Account
```

That creates the authorization relationship.

---

# 7. Scope

Scope defines **where the permission applies**.

Azure RBAC can be assigned at different levels:

```text id="x2v6hp"
Management Group
      ↓
Subscription
      ↓
Resource Group
      ↓
Resource
```

Example:

```text id="j4m9qa"
Subscription
   │
   ├── Resource Group A
   │      ├── Storage
   │      └── Search
   │
   └── Resource Group B
          ├── SQL
          └── Key Vault
```

You can grant permissions at an appropriate scope rather than giving access to the entire subscription.

---

# 8. Scope Inheritance

If a role is assigned at a higher scope, it can apply to resources underneath that scope.

Example:

```text id="p8z3kd"
Resource Group
      │
      ├── Storage
      ├── AI Search
      └── Key Vault
```

If an identity receives a role at the Resource Group level, the permission can flow to resources within that scope, subject to Azure RBAC behavior and the specific resource permissions.

Therefore:

> **Assign at the lowest practical scope.**

That's a least-privilege principle.

---

# 9. Built-in Roles vs Custom Roles

### Built-in Roles

Microsoft provides predefined roles.

Examples:

```text
Reader
Contributor
Owner
```

And many service-specific roles.

### Custom Roles

You can create a custom role when built-in roles are too broad or don't match your requirements.

Example:

```text id="a6v9wr"
Equipment Worker Custom Role

Allowed:
  Read equipment data
  Read equipment telemetry

Not allowed:
  Delete data
  Modify configuration
  Manage resources
```

---

# 10. Reader vs Contributor vs Owner

Very important.

### Reader

Can view resources.

```text
READ
```

### Contributor

Can generally manage resources but cannot grant RBAC permissions through the role itself.

```text
READ
WRITE/MANAGE
```

### Owner

Can manage resources **and manage access**.

```text
READ
WRITE/MANAGE
ACCESS CONTROL
```

So don't casually give `Owner` to an AI agent.

---

# 11. Why Owner Is Dangerous for Agents

Imagine:

```text id="r3y7mc"
CWD Worker
    ↓
Owner
    ↓
Azure Subscription
```

The Worker could potentially have extremely broad administrative capability.

That's a major security problem.

Better:

```text id="t6p2nx"
CWD Worker
    ↓
Specific Role
    ↓
Specific Resource
    ↓
Specific Operations
```

---

# 12. CWD Worker-Level RBAC

Imagine your CWD has:

```text
Equipment Worker
Quality Worker
Supply Chain Worker
IT Worker
```

Don't give all Workers identical permissions.

Instead:

```text id="q1f7mv"
Equipment Worker
    ↓
Equipment Identity
    ↓
Equipment Data
    ↓
READ

Quality Worker
    ↓
Quality Identity
    ↓
Quality Data
    ↓
READ/ANALYZE

IT Worker
    ↓
IT Identity
    ↓
ServiceNow Integration
    ↓
Approved Operations
```

This provides workload isolation.

---

# 13. RBAC + Managed Identity

This is the architecture you should remember:

```text id="b5t8qx"
CWD Worker
     ↓
Managed Identity
     ↓
Microsoft Entra ID
     ↓
Azure RBAC
     ↓
Azure Resource
```

Example:

```text id="z8m3pf"
RAG Worker
     ↓
Managed Identity
     ↓
Entra ID
     ↓
Azure AI Search Data Reader
     ↓
Azure AI Search
```

---

# 14. RBAC + Key Vault

Example:

```text id="g4w9ds"
ServiceNow Worker
       ↓
Managed Identity
       ↓
Entra ID
       ↓
Key Vault RBAC
       ↓
Allowed Secret
```

The Worker should **not** have permission to read every secret.

Better:

```text id="j8r3yp"
ServiceNow Worker
       ↓
Only ServiceNow credential

Salesforce Worker
       ↓
Only Salesforce credential
```

---

# 15. RBAC + Blob Storage

Suppose your document worker needs to read RAG source documents.

```text id="k6v4az"
Document Worker
      ↓
Managed Identity
      ↓
RBAC
      ↓
Storage Blob Data Reader
      ↓
Blob Storage
```

If the Worker only needs to read documents, don't give it write/delete permissions.

---

# 16. RBAC + Azure AI Search

For your CWD RAG architecture:

```text id="p5x8hn"
RAG Worker
      ↓
Managed Identity
      ↓
Entra ID
      ↓
RBAC
      ↓
Azure AI Search
```

The role should provide only the required search/data-plane operations.

Important distinction:

> **Azure RBAC can control access to Azure resources and service operations, while application-level authorization may still be required for individual business records/documents.**

---

# 17. RBAC + Azure SQL

For SQL:

```text id="y3q9mw"
Analytics Worker
       ↓
Managed Identity
       ↓
Entra ID
       ↓
Azure SQL Authentication
       ↓
Database Roles/Permissions
       ↓
SQL Data
```

This is an important advanced concept:

**Azure RBAC and database permissions aren't always the same thing.**

Azure RBAC controls Azure resource management/data-plane permissions where supported.

The database can additionally enforce:

* Database roles
* Table permissions
* Schema permissions
* Row-level security
* Stored procedure permissions

---

# 18. Management Plane vs Data Plane

This is an **advanced interview topic**.

### Management Plane

Controls the Azure resource itself.

Example:

```text
Create Storage Account
Delete Storage Account
Change configuration
```

### Data Plane

Controls access to the data inside the resource.

Example:

```text
Read Blob
Write Blob
Query data
Read Key Vault secret
```

Conceptually:

```text id="h7m2zx"
Azure Resource
│
├── Management Plane
│      └── Manage the resource
│
└── Data Plane
       └── Access the resource's data
```

A role that allows someone to manage a resource does not automatically mean they have the exact data-plane permissions you want for application access, and vice versa.

---

# 19. CWD Management Plane vs Data Plane

For AI agents, this distinction is especially important.

You might allow:

```text id="v4k8ps"
Agent
 ↓
Read equipment data
```

But definitely not:

```text id="x9n2qa"
Agent
 ↓
Delete storage account
```

Therefore:

> **AI workloads should normally receive narrowly scoped data-plane permissions, not broad Azure administrative permissions.**

---

# 20. User RBAC

RBAC isn't only for agents.

You can have:

```text id="s3m8vz"
Users
│
├── AI Developer
├── AI Operator
├── Data Engineer
├── Security Admin
└── Platform Admin
```

For example:

```text
AI Developer → manage development resources
AI Operator → monitor/run applications
Data Engineer → data resources
Security Admin → security configuration
Platform Admin → infrastructure
```

Use groups where possible rather than assigning many individual users manually.

---

# 21. Group-Based RBAC

Instead of:

```text id="w6n2kr"
Pooja → Role
John → Role
David → Role
Priya → Role
```

Use:

```text id="u8m4yc"
AI-Engineering-Group
        ↓
Azure Role
        ↓
Resource
```

Then users join/leave the group.

This simplifies:

* Administration
* Auditing
* Access reviews
* Employee onboarding/offboarding

---

# 22. RBAC + Agent Authorization

Here's the important Agentic AI architecture:

```text id="e5r9hx"
                 User
                   │
                   ▼
                Entra ID
                   │
              User Identity
                   │
                   ▼
             CWD Coordinator
                   │
                   ▼
                Worker
                   │
            Managed Identity
                   │
                   ▼
               Entra ID
                   │
                   ▼
                Azure RBAC
                   │
                   ▼
             Azure Resource
```

Notice:

**User authorization and workload authorization are related but separate concerns.**

---

# 23. User Identity vs Agent Identity

Suppose:

> User asks CWD to access a confidential document.

There are two questions:

### Question 1

Who is the user?

```text
Entra ID → User identity
```

### Question 2

Can the Worker access the underlying Azure resource?

```text
Managed Identity → RBAC
```

Then your application must ensure the Worker doesn't use its technical privileges to bypass the user's business authorization.

---

# 24. The "Confused Deputy" Problem

This is an excellent advanced interview topic.

Imagine:

```text id="r7c2xm"
Normal User
     ↓
CWD
     ↓
Highly Privileged Worker
     ↓
Confidential Data
```

The Worker has more privileges than the user.

If CWD doesn't enforce user-level authorization, the Worker could become a **privileged deputy** that unintentionally exposes data.

Solution:

```text id="p4y8nw"
User Identity
      ↓
Business Authorization
      ↓
Agent Authorization
      ↓
RBAC
      ↓
Backend Authorization
```

Don't allow:

> "The agent has access, so the user must have access."

---

# 25. RBAC + RAG Security

For your Agentic RAG:

```text id="a9m5zt"
User
 ↓
Entra ID
 ↓
User Entitlements
 ↓
CWD RAG Worker
 ↓
ACL Filter
 ↓
Azure AI Search
 ↓
Authorized Documents
 ↓
LLM
```

Here, Azure RBAC protects the search service/resource, while **document-level authorization/ACL filtering** protects individual enterprise content.

That's a very important distinction.

---

# 26. RBAC + MCP

Your MCP architecture:

```text id="q7d3vx"
Worker
 ↓
MCP Client
 ↓
MCP Server
 ↓
Managed Identity
 ↓
Entra ID
 ↓
RBAC
 ↓
Azure Resource
```

Example:

```text id="j4s8mn"
Equipment Worker
 ↓
Equipment MCP Server
 ↓
Managed Identity
 ↓
Azure SQL
 ↓
Read Equipment Data
```

The MCP server should expose only approved capabilities.

---

# 27. RBAC + APIM

Your enterprise API flow:

```text id="n6z2kc"
Worker
 ↓
APIM
 ↓
Enterprise API
```

You can combine:

```text
Entra ID
+
APIM policies
+
Backend authorization
```

For example:

```text id="m9f4bx"
Entra ID
 ↓
Identity
 ↓
APIM
 ↓
Token Validation
 ↓
Rate Limit
 ↓
Policy
 ↓
Enterprise API
```

RBAC isn't a replacement for API-level authorization policies.

---

# 28. RBAC + Service Bus

For asynchronous CWD workflows:

```text id="k3y8pd"
Coordinator
     ↓
Service Bus
     ↓
Worker
```

Workers can use managed identities to authenticate to Service Bus.

Conceptually:

```text id="r8m2qa"
Worker
 ↓
Managed Identity
 ↓
Entra ID
 ↓
Service Bus Data Receiver
 ↓
Queue
```

The Worker gets only the required messaging permissions.

---

# 29. Custom RBAC for CWD

Suppose your business requirement is:

> Equipment Worker can read equipment telemetry but cannot modify equipment configuration.

You could design a narrowly scoped authorization model:

```text id="v5q8ny"
Equipment Worker
      ↓
Equipment Data Reader
      │
      ├── Read telemetry
      ├── Read alarms
      └── Read maintenance history

      NOT allowed:
      ├── Delete
      ├── Modify configuration
      └── Manage Azure resources
```

This is much safer than `Contributor` or `Owner`.

---

# 30. RBAC Hierarchy for Enterprise AI

A good CWD security architecture:

```text id="b7x4mk"
                  ENTRA ID
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
   Human Identity           Workload Identity
        │                         │
        ▼                         ▼
 User Authorization        Managed Identity
        │                         │
        └────────────┬────────────┘
                     ▼
              Azure RBAC
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
      Search       Storage       SQL
        │            │            │
        ▼            ▼            ▼
   Data Access   Data Access   DB Permissions
```

---

# 31. RBAC Best Practices

For your Solution Architect interviews, remember these:

### 1. Least privilege

Give only required permissions.

### 2. Scope narrowly

Prefer:

```text
Resource
```

over:

```text
Subscription
```

when possible.

### 3. Use Managed Identity

Avoid long-lived credentials.

### 4. Prefer groups

For human access management.

### 5. Avoid Owner/Contributor for agents

Use service-specific data roles.

### 6. Separate read/write

Especially for agentic systems.

### 7. Protect high-impact operations

Use policy and human approval when appropriate.

### 8. Audit

Track:

```text
user
agent
worker
resource
action
timestamp
correlationId
```

### 9. Don't use LLM as authorization

The LLM can propose an action.

The security layer decides whether it is allowed.

---

# 32. Complete CWD Example

User asks:

> **"Get the latest equipment alarms for EQ-102."**

```text id="p7c3mw"
User
 ↓
Teams
 ↓
Entra ID
 ↓
Authentication
 ↓
CWD Coordinator
 ↓
Equipment Delegator
 ↓
Equipment Worker
 ↓
Managed Identity
 ↓
Entra ID
 ↓
Azure RBAC
 ↓
Equipment API / SQL
 ↓
Authorized Data
 ↓
Worker
 ↓
Response
```

For:

> **"Delete EQ-102 history."**

The architecture should be different:

```text id="m4z8qn"
User
 ↓
CWD
 ↓
Worker
 ↓
Policy
 ↓
Authorization
 ↓
Human Approval
 ↓
Write/Delete Tool
 ↓
Backend Authorization
 ↓
Execute
```

Don't let the LLM directly execute the destructive operation.

---

# 33. Strong Interview Answer

> **"I use Azure RBAC as the authorization layer for Azure resources in my CWD architecture. Entra ID provides the identity, while RBAC determines what that identity can do at a specific scope. The RBAC model consists of a security principal, role definition, scope and role assignment.**
>
> **For CWD workloads, I prefer Managed Identity so each Coordinator, Delegator, Worker or MCP service can authenticate without embedded credentials. I then assign narrowly scoped roles based on the workload's responsibilities. For example, an Equipment Worker might have read access to equipment data, while a document-processing Worker might have Blob read access. I would avoid giving agents broad Contributor or Owner permissions.**
>
> **I also distinguish management-plane permissions from data-plane permissions. An agent that needs to read Blob data shouldn't automatically be able to manage the Storage Account. For RAG, Azure RBAC protects access to the Azure AI Search service, while document-level ACLs and user entitlements ensure that the LLM only receives content the user is authorized to see.**
>
> **Finally, I separate user identity from workload identity. The user's identity determines who requested the operation, while the workload identity determines what the service can technically access. High-impact operations go through additional policy and potentially human approval. This gives CWD a least-privilege, auditable authorization model rather than relying on the LLM to make security decisions."**

---

# Final Mental Model

```text id="x8m3qp"
                 WHO?
                   │
                   ▼
             Entra ID
                   │
                   ▼
          Security Principal
                   │
                   ▼
              RBAC ROLE
                   │
                   ▼
                SCOPE
                   │
                   ▼
             PERMISSIONS
                   │
                   ▼
             AZURE RESOURCE
```

For **Agentic AI**:

```text id="q5n9yc"
User Identity
     +
Agent Identity
     ↓
Authorization
     ↓
Azure RBAC
     ↓
Resource/Data Permissions
     ↓
Policy
     ↓
Tool Execution
```

### ⭐ 7 lines to memorize

**Entra ID = Who are you?**

**Managed Identity = Identity for the workload**

**RBAC = What can you do?**

**Role = Set of permissions**

**Scope = Where those permissions apply**

**Least privilege = Give only what is required**

**LLM ≠ Security Boundary**

> **Best Solution Architect sentence:**
> **"I use Entra ID for identity, Managed Identity for passwordless workload authentication, Azure RBAC for least-privilege Azure authorization, application-level ACLs for business-data authorization, and policy controls for high-risk agent actions."**
