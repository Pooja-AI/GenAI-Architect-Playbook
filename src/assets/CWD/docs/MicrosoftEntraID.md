# Microsoft Entra ID

**Microsoft Entra ID** is Microsoft's cloud identity and access management platform. In an enterprise Agentic AI system like your **CWD**, Entra ID answers two fundamental questions:

> **Authentication:** Who is making this request?
> **Authorization:** What is this user/application/agent allowed to access or do?

For CWD, Entra ID is the **identity and access-control foundation**.

---

# 1. Where Entra ID fits in CWD

```text
                    User
                      │
                      ▼
              Microsoft Teams
                      │
                      ▼
                Entra ID
          Authentication / Token
                      │
                      ▼
              API Management
                      │
                      ▼
                 Coordinator
                      │
                Delegator
                      │
                  Worker
                      │
             ┌────────┴────────┐
             ▼                 ▼
        Azure Services    Enterprise APIs
```

The important point:

**CWD agents should not invent or decide user permissions.**

The identity and authorization system should enforce them.

---

# 2. Authentication vs Authorization

This is one of the most common interview questions.

### Authentication

> **Who are you?**

Example:

```text
Pooja logs into Teams
        ↓
Entra ID authenticates Pooja
        ↓
Access token issued
```

### Authorization

> **What are you allowed to do?**

Example:

```text
Pooja
 ↓
Authenticated
 ↓
Has Quality Engineering role
 ↓
Can access Quality documents
 ↓
Cannot access HR documents
```

### Easy interview statement

> **Authentication establishes identity; authorization determines permissions.**

---

# 3. OAuth 2.0

OAuth 2.0 is a framework for **delegated authorization**.

It allows an application to obtain an access token to call another resource/API.

Example:

```text
User
 ↓
Teams / CWD
 ↓
Entra ID
 ↓
Access Token
 ↓
Microsoft Graph
```

The token represents authorized access to the target API.

---

# 4. OpenID Connect vs OAuth 2.0

Another interview question.

### OAuth 2.0

Primarily about:

> **Authorization / access to APIs**

### OpenID Connect (OIDC)

Built on OAuth 2.0 and adds:

> **Authentication / identity**

Simple:

```text
OAuth 2.0
   ↓
"Can this application access the API?"

OIDC
   ↓
"Who is this user?"
```

---

# 5. Access Token

After authentication/authorization, the application receives an **access token** for a resource/API.

Conceptually:

```text
User
 ↓
Entra ID
 ↓
Access Token
 ↓
CWD
 ↓
API
```

The API validates the token and determines whether the request is authorized.

The token can contain claims such as:

```text
user identity
tenant
audience
roles
scopes
expiration
```

Don't think of the token as simply "the user's password."

---

# 6. ID Token vs Access Token

Very important.

### ID Token

Used by the application to understand:

> **Who authenticated?**

### Access Token

Used to call:

> **A specific API/resource.**

Simple:

```text
ID Token
   ↓
Identity information

Access Token
   ↓
API authorization
```

Never send an ID token to an API that expects an access token.

---

# 7. Application Identity

Not every request comes directly from a human.

CWD contains services such as:

```text
Coordinator
Delegator
Worker
MCP Server
RAG Service
```

These applications also need identities.

For example:

```text
Equipment Worker
       ↓
Application Identity
       ↓
Entra ID
       ↓
Azure Resource
```

This allows Azure to determine:

> "Which application is making this request?"

---

# 8. Managed Identity

For Azure-hosted workloads, **Managed Identity** is one of the preferred ways for an application to authenticate to Azure resources without storing credentials in code.

Example:

```text
CWD Worker
    │
    ▼
Managed Identity
    │
    ▼
Entra ID
    │
    ▼
Azure AI Search
```

The Worker doesn't need to store a client secret.

---

# 9. Managed Identity Types

Two important types:

### System-assigned managed identity

Identity is tied to the Azure resource.

```text
Container App
     ↓
System Identity
```

If the resource is deleted, the identity is also deleted.

### User-assigned managed identity

Identity exists independently and can be assigned to multiple resources.

```text
                User Assigned Identity
                 /       |       \
                /        |        \
        Worker A      Worker B    Function
```

Useful when several workloads need the same controlled identity.

---

# 10. Service Principal / Application Identity

An enterprise application registered in Entra ID can have an application identity represented through a service principal in a tenant.

Conceptually:

```text
Application Registration
        ↓
Application Identity
        ↓
Service Principal
        ↓
Tenant
```

Older designs often use:

```text
Client ID + Client Secret
```

For Azure workloads, prefer **Managed Identity / workload identity** when practical because it reduces secret management.

---

# 11. RBAC

**RBAC = Role-Based Access Control.**

It determines what an identity can do to a resource.

Example:

```text
Equipment Worker
       ↓
Managed Identity
       ↓
Azure RBAC
       ↓
Azure AI Search
       ↓
Allowed operations
```

Roles can define permissions such as:

* Reader
* Contributor
* Service-specific roles
* Custom roles

The exact role should follow **least privilege**.

---

# 12. Least Privilege

Very important for Agentic AI.

Don't do:

```text
CWD Worker
   ↓
Owner access
   ↓
Everything
```

Instead:

```text
Equipment Worker
   ↓
Minimal identity
   ↓
Only required resources
   ↓
Only required operations
```

For example, a worker that only reads equipment telemetry should not have permission to delete data.

---

# 13. User Identity Propagation

This is especially important for your CWD architecture.

Suppose a user asks:

> "Show me the failure-analysis reports for Product X."

Flow:

```text
User
 ↓
Teams
 ↓
Entra ID
 ↓
User Token
 ↓
CWD
 ↓
Quality Worker
 ↓
Azure AI Search
```

The system should preserve the user's identity/authorization context.

Conceptually:

```text
userId
tenantId
roles/groups
scopes
correlationId
```

The Worker can then retrieve data according to the user's permissions.

---

# 14. Delegated Permissions

With **delegated permissions**, an application acts **on behalf of a signed-in user**.

Example:

```text
Pooja
  ↓
Teams
  ↓
CWD
  ↓
Microsoft Graph
  ↓
SharePoint
```

The operation is performed in the user's context.

This is useful when the answer should respect the user's existing Microsoft 365 permissions.

---

# 15. Application Permissions

With **application permissions**, the application acts as itself rather than on behalf of a signed-in user.

Example:

```text
Scheduled Ingestion Service
        ↓
Application Identity
        ↓
Entra ID
        ↓
Microsoft Graph
        ↓
SharePoint
```

Useful for:

* Background ingestion
* Scheduled processing
* Service-to-service operations
* Automated workloads

But application permissions must be tightly governed because they can be broader than a user's delegated access.

---

# 16. Delegated vs Application Permissions

|                | Delegated                | Application                  |
| -------------- | ------------------------ | ---------------------------- |
| Runs as        | User + app               | App itself                   |
| User signed in | Usually yes              | Not required                 |
| User context   | Yes                      | No                           |
| Background job | Less suitable            | Very suitable                |
| Example        | User searches SharePoint | Nightly SharePoint ingestion |

Interview answer:

> **"Delegated permissions are appropriate when the application needs to act on behalf of the signed-in user, while application permissions are appropriate for trusted background services acting as themselves."**

---

# 17. Entra ID + Microsoft Graph

For your Microsoft 365 integration:

```text
CWD Worker
    ↓
Entra ID
    ↓
Access Token
    ↓
Microsoft Graph
    ↓
Teams / SharePoint / OneDrive / Outlook
```

For example:

> "Find my recent failure-analysis documents."

The Microsoft 365 Worker can access appropriate Graph resources using the authorized identity.

---

# 18. Entra ID + Azure AI Search

For permission-aware RAG:

```text
User
 ↓
Entra ID
 ↓
Identity / Groups / Entitlements
 ↓
CWD RAG Worker
 ↓
Azure AI Search
 ↓
ACL Filtering
 ↓
Authorized Documents
 ↓
LLM
```

The critical rule:

> **Do not retrieve confidential content and then ask the LLM to decide whether the user should see it.**

Authorization must happen **before the content reaches the LLM**.

---

# 19. Entra ID + CWD Agents

Every major component can have a controlled identity.

```text
                 Entra ID
                    │
       ┌────────────┼────────────┐
       ▼            ▼            ▼
 Coordinator    Delegator      Worker
       │            │            │
       ▼            ▼            ▼
   Identity      Identity     Identity
```

Each component should receive only the permissions it needs.

---

# 20. Agent Authorization

This is a critical Agentic AI interview topic.

Suppose the user says:

> "Delete this equipment record."

The LLM might understand the request.

But the LLM should **not** decide:

> "Yes, the user is authorized."

Instead:

```text
User
 ↓
Entra Authentication
 ↓
CWD Authorization / Policy
 ↓
Worker
 ↓
Tool
 ↓
Backend Authorization
 ↓
Execute
```

For a high-risk action:

```text
LLM
 ↓
Request Action
 ↓
Policy Engine
 ↓
Authorization
 ↓
Human Approval if required
 ↓
Tool
 ↓
Enterprise API
```

---

# 21. Agent Identity vs User Identity

This is another strong interview question.

There can be **two identities** involved:

```text
Human User
     +
Agent/Application
```

Example:

```text
Pooja
  ↓
Entra ID
  ↓
CWD
  ↓
Equipment Worker
  ↓
Managed Identity
  ↓
Equipment API
```

The system should know:

* **Who requested the operation?**
* **Which agent performed it?**
* **Which tool was used?**
* **Which API was called?**

For auditing:

```text
userId
agentId
workerId
toolId
resource
action
timestamp
correlationId
```

---

# 22. Confused Deputy Problem

This is a very good Solution Architect interview topic.

Imagine:

```text
Normal User
   ↓
CWD Agent
   ↓
Privileged Worker
   ↓
Sensitive Data
```

If the Worker has broad privileges, a normal user might indirectly get access to something they shouldn't.

That's a **confused-deputy risk**.

Mitigation:

* Don't give agents excessive permissions.
* Enforce user authorization.
* Use least privilege.
* Validate resource access.
* Use tool-level policies.
* Separate read/write identities.
* Audit every action.
* Require approval for sensitive operations.

---

# 23. Entra ID + MCP

Your CWD MCP architecture can look like:

```text
CWD Worker
     ↓
MCP Client
     ↓
MCP Server
     ↓
Entra ID Authentication
     ↓
Authorization
     ↓
Enterprise API
```

For example:

```text
Equipment Worker
      ↓
Equipment MCP Server
      ↓
Entra ID
      ↓
Equipment API
```

The MCP server should validate the caller and enforce the permissions for the requested tool.

---

# 24. Entra ID + API Management

Your architecture becomes:

```text
User
 ↓
Entra ID
 ↓
Teams
 ↓
Front Door / WAF
 ↓
APIM
 ↓
CWD Coordinator
 ↓
Delegator
 ↓
Worker
 ↓
APIM
 ↓
Enterprise API
```

Entra ID handles **identity**.

APIM handles **API governance**.

They complement each other.

### Entra ID

> Who are you and what identity/permissions do you have?

### APIM

> Can this API request pass the required gateway policies?

---

# 25. Entra ID + Key Vault

Another common interview question.

```text
CWD Worker
    ↓
Managed Identity
    ↓
Entra ID
    ↓
RBAC
    ↓
Key Vault
    ↓
Secret
```

Remember:

> **Managed Identity = application identity**
> **Key Vault = secure secret storage**

Don't put:

```text
API key
password
client secret
connection string
```

inside:

* Source code
* Docker image
* Prompt
* Agent memory
* Configuration files committed to Git

when a secure identity-based approach is available.

---

# 26. CWD ServiceNow Example

User asks:

> **"Create a ServiceNow ticket for the confirmed equipment failure."**

Secure workflow:

```text
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
Equipment / IT Delegator
 ↓
RCA Worker
 ↓
Policy Check
 ↓
ServiceNow Worker
 ↓
MCP
 ↓
APIM
 ↓
ServiceNow API
```

For a high-impact action:

```text
Policy
 ↓
Human Approval
 ↓
Teams Adaptive Card
 ↓
Approve
 ↓
ServiceNow API
```

Every step is audited.

---

# 27. Entra ID + Teams

For your Teams architecture:

```text
Employee
   ↓
Microsoft Teams
   ↓
Entra ID
   ↓
Authentication
   ↓
CWD
```

The CWD receives the authenticated user's identity context and uses it to enforce access to enterprise capabilities.

---

# 28. Important Entra ID Concepts to Master

For your Solution Architect interview, know these:

```text
Microsoft Entra ID
│
├── Authentication
│
├── Authorization
│
├── OAuth 2.0
│
├── OpenID Connect
│
├── Access Tokens
│
├── ID Tokens
│
├── Scopes
│
├── App Roles
│
├── Application Registration
│
├── Service Principals
│
├── Managed Identity
│
├── Workload Identity
│
├── RBAC
│
├── Delegated Permissions
│
├── Application Permissions
│
├── Conditional Access
│
├── MFA
│
├── Groups
│
├── Roles
│
└── Least Privilege
```

For Agentic AI, add:

```text
User Identity
Agent Identity
Tool Authorization
Identity Propagation
Policy Enforcement
Human Approval
Audit / Traceability
```

---

# 29. Complete CWD Identity Architecture

```text id="2n4q7k"
                         USER
                           │
                           ▼
                  Microsoft Teams
                           │
                           ▼
                     ENTRA ID
                           │
                 Authentication
                           │
                     Access Token
                           │
                           ▼
                   API Management
                           │
                           ▼
                     COORDINATOR
                           │
                           ▼
                      DELEGATOR
                           │
                           ▼
                       WORKER
                           │
                 ┌─────────┴─────────┐
                 ▼                   ▼
              MCP Tool           RAG Worker
                 │                   │
                 ▼                   ▼
              APIM / API       Azure AI Search
                 │                   │
                 ▼                   ▼
           Enterprise Data    Authorized Content
```

Two identity paths may coexist:

```text
User Identity
     ↓
"What is this user allowed to access?"

Agent Identity
     ↓
"What is this workload technically allowed to access?"
```

**Both must be controlled.**

---

# 30. Strong Interview Answer

> **"I use Microsoft Entra ID as the identity foundation for my CWD architecture. For human users, Entra ID provides authentication and issues tokens that allow the application to establish the user's identity and authorized access. For service-to-service communication, I prefer managed identities or workload identities so Coordinator, Delegator and Worker services don't need embedded credentials.**
>
> **I use RBAC and least-privilege permissions to control what each workload can access. When the operation needs to run in the user's context, such as accessing SharePoint through Microsoft Graph, I use delegated permissions and propagate the user's authorization context. For background services such as document ingestion, application permissions can be used with tightly controlled scope.**
>
> **For agentic workflows, I distinguish user identity from agent identity. The user establishes who requested the operation, while the agent's identity determines what the workload can technically access. Authorization is enforced outside the LLM through Entra ID, RBAC, API policies and backend controls. For high-risk actions such as ServiceNow updates or destructive operations, I add policy validation and potentially human approval. I also propagate user, agent, worker, tool and correlation IDs for complete auditing and traceability."**

---

# Final Mental Model

```text
              ENTRA ID
                  │
       ┌──────────┴──────────┐
       ▼                     ▼
   USER IDENTITY        APP IDENTITY
       │                     │
       ▼                     ▼
 Authentication          Managed Identity
       │                     │
       └──────────┬──────────┘
                  ▼
             AUTHORIZATION
                  │
             RBAC / Roles
             Scopes / ACL
             Policies
                  │
                  ▼
             CWD AGENTS
                  │
        ┌─────────┼─────────┐
        ▼         ▼         ▼
     RAG       MCP/API   Enterprise
    Worker      Tools      Systems
```

### The 5 things to remember

**1. Entra ID → Identity**
**2. OAuth/OIDC → Token-based access/authentication**
**3. RBAC → Permissions**
**4. Managed Identity → Secure application identity**
**5. CWD → Never trust the LLM as the authorization boundary**

> **"The user identity tells us who requested the action, the agent identity tells us which workload is acting, Entra ID and RBAC control access, and policy/backend authorization determine whether the requested operation can actually execute."**
