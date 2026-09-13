# Azure Managed Identity

**Azure Managed Identity** provides an Azure workload with an identity in **Microsoft Entra ID**, so the workload can authenticate to Azure resources **without storing passwords, API keys, client secrets, or certificates in application code**.

For your CWD architecture, think:

> **Managed Identity = secure identity for an agent/service to access another Azure resource.**

---

## 1. Why Managed Identity is needed

Without Managed Identity, an application might need:

```text
CWD Worker
   ↓
Client ID + Client Secret
   ↓
Azure AI Search
```

Now you have to manage:

* Secret storage
* Secret rotation
* Secret expiration
* Secret leakage risk
* Deployment configuration

With Managed Identity:

```text
CWD Worker
     ↓
Managed Identity
     ↓
Microsoft Entra ID
     ↓
Access Token
     ↓
Azure AI Search
```

**No application password is stored.**

---

# 2. How it works

Suppose your Equipment Worker runs in Azure Container Apps.

The Worker needs to read Azure AI Search.

### Step-by-step

```text
1. Equipment Worker starts
          ↓
2. Azure assigns Managed Identity
          ↓
3. Worker requests token from Entra ID
          ↓
4. Entra ID validates the workload identity
          ↓
5. Entra ID issues access token
          ↓
6. Worker calls Azure AI Search
          ↓
7. Azure AI Search validates token
          ↓
8. RBAC determines permission
          ↓
9. Search operation allowed
```

The important distinction:

> **Managed Identity authenticates the workload; RBAC determines what that identity can do.**

---

# 3. Simple CWD example

Your CWD has:

```text
Coordinator
Delegators
Workers
MCP Servers
RAG Services
```

Suppose:

**Quality Worker → Azure AI Search**

```text
Quality Worker
      ↓
Managed Identity
      ↓
Entra ID
      ↓
Access Token
      ↓
Azure AI Search
      ↓
RBAC
      ↓
Search
```

The Quality Worker doesn't need an Azure AI Search password.

---

# 4. Managed Identity types

There are two important types.

## System-assigned Managed Identity

Identity is created with the Azure resource.

```text
Container App
     │
     └── System-assigned Identity
```

Lifecycle:

```text
Create Container App
       ↓
Identity created
       ↓
Use identity
       ↓
Delete Container App
       ↓
Identity deleted
```

Good when the identity belongs to only one resource.

---

## User-assigned Managed Identity

Identity is created separately and can be assigned to multiple resources.

```text
             User-assigned Identity
                    │
          ┌─────────┼─────────┐
          ▼         ▼         ▼
       Worker A  Worker B   Function
```

Useful when you want a reusable identity across several workloads.

---

# 5. System-assigned vs User-assigned

|                    | System-assigned    | User-assigned           |
| ------------------ | ------------------ | ----------------------- |
| Lifecycle          | Tied to resource   | Independent             |
| Reusable           | No                 | Yes                     |
| Multiple workloads | Not ideal          | Good                    |
| Management         | Simple             | More control            |
| Common use         | Single application | Shared identity pattern |

### Interview answer

> **"I use system-assigned managed identity when the identity should have the same lifecycle as the workload. I use user-assigned managed identity when I need an independently managed identity that can be assigned to multiple workloads."**

---

# 6. Managed Identity + RBAC

Managed Identity by itself doesn't mean:

> "This application can access everything."

Instead:

```text
Managed Identity
       ↓
Entra ID
       ↓
Azure RBAC
       ↓
Specific Resource
```

Example:

```text
Equipment Worker Identity
        ↓
Azure RBAC
        ↓
Azure Storage
        ↓
Storage Blob Data Reader
```

Now the Worker can read blobs according to that role.

---

# 7. Managed Identity + Azure Blob Storage

CWD document worker needs to read documents.

```text
Document Worker
      ↓
Managed Identity
      ↓
Entra ID
      ↓
RBAC
      ↓
Blob Storage
      ↓
Read Document
```

Instead of:

```text
Storage Account
   ↓
Storage Key
   ↓
Application
```

Managed Identity eliminates the need to embed the storage key.

---

# 8. Managed Identity + Azure AI Search

For your RAG architecture:

```text
RAG Worker
    ↓
Managed Identity
    ↓
Entra ID
    ↓
RBAC
    ↓
Azure AI Search
    ↓
Search
```

This is useful for secure service-to-service authentication.

---

# 9. Managed Identity + Azure SQL

Example:

```text
Analytics Worker
      ↓
Managed Identity
      ↓
Entra ID
      ↓
Azure SQL
      ↓
Database Authorization
      ↓
Query
```

There are actually **two authorization layers** you should think about:

```text
Azure Layer
     ↓
Azure RBAC / Identity

Database Layer
     ↓
SQL permissions / roles
```

So having an identity doesn't automatically mean unrestricted database access.

---

# 10. Managed Identity + Key Vault

Another common architecture:

```text
CWD Worker
    ↓
Managed Identity
    ↓
Entra ID
    ↓
Key Vault
    ↓
Secret
```

The Worker authenticates to Key Vault using its identity.

This is much better than putting secrets inside:

```text
Code
Docker image
Git repository
Environment configuration
Prompt
Agent memory
```

---

# 11. Managed Identity + Azure Functions

Suppose an Equipment Worker calls an Azure Function.

```text
Equipment Worker
      ↓
Managed Identity
      ↓
Entra ID
      ↓
Azure Function
```

The Function can also have its own identity:

```text
Equipment Worker
      ↓
Function
      ↓
Function Managed Identity
      ↓
Entra ID
      ↓
Azure SQL
```

So you can establish:

```text
Worker → Function
Function → SQL
```

without hardcoded credentials.

---

# 12. Managed Identity + Container Apps

This is particularly relevant to your CWD deployment.

```text
Azure Container Apps
│
├── Coordinator
├── Quality Delegator
├── Equipment Delegator
├── RAG Worker
└── MCP Server
```

Each application can have a managed identity.

Example:

```text
Equipment Worker
      ↓
Managed Identity
      ↓
Azure AI Search

RAG Worker
      ↓
Managed Identity
      ↓
Azure AI Search

Document Worker
      ↓
Managed Identity
      ↓
Blob Storage
```

You can give each workload **only the permissions it needs**.

---

# 13. Managed Identity + AKS

For AKS, the modern pattern is **Microsoft Entra Workload ID**.

Conceptually:

```text
AKS Pod
   ↓
Workload Identity
   ↓
Microsoft Entra ID
   ↓
Access Token
   ↓
Azure Resource
```

Example:

```text
RCA Worker Pod
      ↓
Workload Identity
      ↓
Entra ID
      ↓
Azure AI Search
```

This avoids putting Azure credentials into Kubernetes secrets.

---

# 14. Managed Identity + MCP

This is very important for your CWD architecture.

```text
CWD Worker
     ↓
MCP Client
     ↓
MCP Server
     ↓
Managed Identity
     ↓
Entra ID
     ↓
Enterprise/Azure Resource
```

Example:

```text
Equipment Worker
      ↓
Equipment MCP Server
      ↓
Managed Identity
      ↓
Azure SQL
```

The MCP server can authenticate to the backend using its own managed identity.

---

# 15. Managed Identity + API Management

You can also use managed identities for API-to-Azure-resource authentication.

Example:

```text
CWD Worker
     ↓
APIM
     ↓
Managed Identity
     ↓
Azure Service
```

Or:

```text
Worker
  ↓
Managed Identity
  ↓
APIM / Enterprise API
```

The exact authentication pattern depends on whether the API expects Entra-issued tokens, subscription keys, OAuth, or another mechanism.

---

# 16. Managed Identity + Enterprise APIs

This is where you need to be careful.

Managed Identity works naturally with **Azure resources and Entra-integrated services**.

For an external enterprise system such as:

```text
Salesforce
ServiceNow
SAP
```

you cannot simply assume:

> "Managed Identity automatically authenticates to every API."

Instead, you may have:

```text
CWD Worker
      ↓
Managed Identity
      ↓
Entra ID
      ↓
APIM / Integration Layer
      ↓
OAuth / Enterprise Authentication
      ↓
ServiceNow
```

The integration layer can securely manage the authentication required by the target system.

---

# 17. Managed Identity vs Key Vault

This is a very common interview question.

### Managed Identity

> **Who is the application?**

### Key Vault

> **Where do I securely store secrets?**

Example:

```text
Worker
   ↓
Managed Identity
   ↓
Key Vault
   ↓
External API Secret
```

If the target supports Entra authentication directly, you may not need a secret at all.

---

# 18. Managed Identity vs Service Principal

Both represent application identities, but their operational model differs.

### Service Principal

Commonly associated with:

```text
Application
+
Credential
```

For example:

```text
Client ID
Client Secret
```

### Managed Identity

Azure manages the credential lifecycle.

```text
Azure Workload
      ↓
Managed Identity
      ↓
Entra ID
```

### Strong interview answer

> **"Managed Identity is essentially an Azure-managed workload identity that removes the need for applications to manage credentials themselves."**

---

# 19. Managed Identity vs API Key

### API Key

```text
Application
   ↓
API Key
   ↓
API
```

Problems:

* Secret management
* Rotation
* Leakage risk
* Difficult lifecycle management

### Managed Identity

```text
Application
   ↓
Managed Identity
   ↓
Entra ID
   ↓
Token
   ↓
Resource
```

Much stronger for Azure-native workloads.

---

# 20. Managed Identity does NOT replace authorization

This is extremely important.

Wrong:

> "The Worker has Managed Identity, therefore it can access the database."

Correct:

```text
Managed Identity
       ↓
Authentication
       ↓
RBAC / Resource permissions
       ↓
Authorization
       ↓
Allowed operation
```

Think:

> **Identity proves who you are. RBAC/policies determine what you can do.**

---

# 21. Agentic AI Security

In CWD, don't give every Worker broad permissions.

Bad:

```text
                    Azure
                      ↑
                      │
                Full Access
                      │
              All CWD Workers
```

Better:

```text
                     Azure
                       │
         ┌─────────────┼─────────────┐
         ▼             ▼             ▼
   Equipment       Quality        Finance
    Identity        Identity       Identity
       │               │              │
   Equipment       Quality        Finance
   resources       resources      resources
```

This is **least privilege**.

---

# 22. Read vs Write Permissions

You should also separate permissions by risk.

Example:

### Read

```text
Equipment Worker
 ↓
Managed Identity
 ↓
Equipment Data
 ↓
READ
```

### Write

```text
ServiceNow Worker
 ↓
Managed Identity / authorized identity
 ↓
ServiceNow
 ↓
CREATE INCIDENT
```

### Destructive

```text
Agent
 ↓
Policy
 ↓
Authorization
 ↓
Human Approval
 ↓
Delete
```

For agentic systems, write/destructive operations need stronger controls.

---

# 23. Managed Identity + CWD Complete Example

User asks:

> **"Analyze EQ-102 failure and create a ServiceNow ticket if confirmed."**

Architecture:

```text
User
 ↓
Teams
 ↓
Entra ID
 ↓
CWD Coordinator
 ↓
Equipment Delegator
 ↓
Equipment Worker
 ↓
MCP
 ↓
Equipment MCP Server
 ↓
Managed Identity
 ↓
Azure / Enterprise API
```

RAG:

```text
RAG Worker
 ↓
Managed Identity
 ↓
Azure AI Search
 ↓
Historical Failure Reports
```

Ticket:

```text
ServiceNow Worker
 ↓
Policy Check
 ↓
MCP
 ↓
APIM
 ↓
ServiceNow API
```

The system can maintain:

```text
userId
agentId
workerId
toolId
resource
action
correlationId
```

for auditing.

---

# 24. Complete Identity Flow

```text
                       ENTRA ID
                          │
            ┌─────────────┴─────────────┐
            ▼                           ▼
       Human Identity             Workload Identity
            │                           │
            ▼                           ▼
          User                    Managed Identity
            │                           │
            ▼                           ▼
       CWD Request                CWD Worker
            │                           │
            └─────────────┬─────────────┘
                          ▼
                    Authorization
                          │
                   RBAC / Policies
                          │
                          ▼
                 Azure / Enterprise
                    Resources
```

This is the architecture you should remember for interviews.

---

# 25. Strong Solution Architect Interview Answer

> **"In my CWD architecture, I use Azure Managed Identity for passwordless authentication between Azure-hosted workloads and Azure resources. For example, a CWD Worker running on Azure Container Apps can use its managed identity to obtain an Entra ID access token and securely access Azure AI Search, Blob Storage, Key Vault or other supported Azure services without storing client secrets or API keys in the application.**
>
> **I then use Azure RBAC and resource-level permissions to enforce least privilege. Different Workers can have different identities and permissions, so an Equipment Worker might have read access to equipment data while a ServiceNow Worker has only the permissions required for approved ticket operations.**
>
> **For AKS workloads, I would use Microsoft Entra Workload ID to provide workload identity to Kubernetes Pods. For enterprise APIs that don't natively support Entra authentication, I would use a governed integration layer such as API Management and securely manage whatever target-specific credentials are required.**
>
> **For agentic AI, I separate user identity from workload identity. The user's identity establishes who requested the operation, while the managed identity establishes which workload is making the service-to-service call. Authorization is enforced outside the LLM through Entra ID, RBAC, API policies and backend controls, with human approval for high-impact operations when required."**

---

# Final Mental Model

```text
             MANAGED IDENTITY
                    │
                    ▼
             "Who is my app?"
                    │
                    ▼
               Entra ID
                    │
             Access Token
                    │
                    ▼
              Authorization
             /      |       \
           RBAC   Policies   ACL
             \      |       /
                    ▼
             Azure Resource
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
      Search      Storage      SQL
```

### Remember these 6 lines

**Managed Identity → passwordless workload identity**

**Entra ID → issues identity/token**

**Access Token → proves authorized access to a resource/API**

**RBAC → controls permissions**

**Least Privilege → give each Worker only what it needs**

**Agentic AI → separate user identity from agent/workload identity**

> **Best one-line interview answer:**
> **"Managed Identity gives my CWD workloads a passwordless identity in Microsoft Entra ID, while RBAC and resource-level policies determine what each agent or service is actually allowed to access."**
