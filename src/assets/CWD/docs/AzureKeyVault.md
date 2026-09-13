# Azure Key Vault

**Azure Key Vault** is Azure's managed service for securely storing and controlling access to **secrets, encryption keys, and certificates**.

For your CWD architecture, think:

> **Key Vault = secure vault where applications retrieve sensitive credentials and cryptographic material without putting them in code, containers, prompts, or configuration files.**

---

# 1. What does Key Vault store?

There are three primary object types:

```text id="9h2m4p"
Azure Key Vault
│
├── Secrets
│    ├── API keys
│    ├── passwords
│    ├── connection strings
│    └── application credentials
│
├── Keys
│    ├── Encryption keys
│    └── Cryptographic keys
│
└── Certificates
     ├── TLS/SSL certificates
     └── Application certificates
```

---

# 2. Secrets

**Secrets** are sensitive values that applications need but should not hard-code.

Examples:

```text id="4f0x6a"
ServiceNow API credential
Salesforce client secret
Database connection string
Third-party API key
Storage credential
Application secret
```

Instead of:

```text id="c9q3h8"
CWD Worker
   ↓
Hard-coded API key
   ↓
ServiceNow
```

Use:

```text id="p6a4s2"
CWD Worker
   ↓
Managed Identity
   ↓
Entra ID
   ↓
Key Vault
   ↓
Secret
   ↓
API
```

---

# 3. Why Key Vault?

Without Key Vault:

```text id="g0m8vn"
API Key
   ↓
Source Code
   ↓
Git
   ↓
Docker Image
```

This creates significant security risk.

With Key Vault:

```text id="j5e7qd"
API Key
   ↓
Key Vault
      ↑
      │
Managed Identity
      │
CWD Worker
```

The application retrieves the secret **at runtime**.

---

# 4. Managed Identity + Key Vault

This is one of the most important combinations for your interview.

```text id="x5f3rz"
CWD Worker
     │
     ▼
Managed Identity
     │
     ▼
Microsoft Entra ID
     │
     ▼
Key Vault
     │
     ▼
Secret
```

### Step-by-step

1. CWD Worker runs in Azure.
2. Worker has Managed Identity.
3. Worker requests access to Key Vault.
4. Entra ID authenticates the workload.
5. Key Vault checks authorization.
6. Key Vault returns the permitted secret.
7. Worker uses the secret to call the required external API.

The application doesn't need to contain the secret.

---

# 5. Key Vault vs Managed Identity

This distinction is **very important**.

### Managed Identity

> **Who is my application?**

### Key Vault

> **Where is my secret stored?**

### RBAC

> **What is my application allowed to access?**

Together:

```text id="n8q4wx"
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

Interview sentence:

> **"Managed Identity provides passwordless application identity, while Key Vault securely stores secrets and cryptographic material."**

---

# 6. Key Vault + CWD

Your CWD can have many services:

```text id="6e2p9s"
CWD
│
├── Coordinator
├── Delegators
├── Workers
├── MCP Servers
├── RAG Services
└── Integration Services
```

Some may need credentials.

Instead of storing credentials in every service:

```text id="a1n7mc"
                Key Vault
              /     |      \
             /      |       \
       Worker A   Worker B   MCP
```

Each application gets only the secrets it needs.

---

# 7. API Keys

Suppose your Worker calls an external AI service or enterprise API requiring an API key.

Bad:

```text id="1r5b9z"
API_KEY = "xxxxxxxx"
```

Better:

```text id="6w3d7p"
Worker
 ↓
Managed Identity
 ↓
Key Vault
 ↓
API Key
 ↓
External API
```

The key is not embedded in the source code.

---

# 8. Connection Strings

Suppose a service requires a database connection string.

Instead of:

```text id="3u9v1k"
DATABASE_URL=...
```

inside source code, store the sensitive value in Key Vault.

```text id="c7h4ny"
Worker
 ↓
Managed Identity
 ↓
Key Vault
 ↓
Database Credential
 ↓
Database
```

Even better, when the database supports Entra authentication, prefer **identity-based authentication** rather than storing a database password at all.

---

# 9. Certificates

Key Vault can also manage certificates.

Example:

```text id="r3j6yc"
Application
     ↓
Key Vault
     ↓
TLS Certificate
     ↓
Secure HTTPS communication
```

Certificates can be used for:

* TLS/SSL
* Application authentication
* Certificate-based authentication
* Secure communication

Key Vault can help manage certificate lifecycle and renewal workflows.

---

# 10. Encryption Keys

Keys are different from secrets.

**Keys** are cryptographic keys used for operations such as:

* Encryption
* Decryption
* Signing
* Verification

Example:

```text id="m2c7vw"
Application
     ↓
Key Vault Key
     ↓
Encryption / Signing
```

You can keep sensitive cryptographic keys under centralized control rather than embedding them inside applications.

---

# 11. Secrets vs Keys vs Certificates

| Type            | Purpose                  | Example         |
| --------------- | ------------------------ | --------------- |
| **Secret**      | Store sensitive value    | API key         |
| **Key**         | Cryptographic operations | Encryption key  |
| **Certificate** | Identity/TLS             | SSL certificate |

Easy memory:

> **Secret = sensitive value**
> **Key = cryptography**
> **Certificate = identity/security certificate**

---

# 12. Key Vault + Azure Container Apps

For your CWD:

```text id="f7q1pd"
Azure Container Apps
│
├── Coordinator
├── Quality Worker
├── Equipment Worker
└── MCP Server
          │
          ▼
    Managed Identity
          │
          ▼
       Key Vault
```

Each Container App can have a managed identity.

Example:

```text id="3m5z8r"
Equipment Worker
     ↓
Managed Identity
     ↓
Key Vault
     ↓
Equipment API Credential
```

---

# 13. Key Vault + AKS

For AKS:

```text id="q7k1fd"
AKS Pod
   ↓
Workload Identity
   ↓
Entra ID
   ↓
Key Vault
   ↓
Secret
```

A common enterprise pattern is using the **Azure Key Vault provider for the Secrets Store CSI Driver** to make Key Vault secrets available to Kubernetes workloads without manually storing the secret in application code.

---

# 14. Key Vault + MCP

Your MCP architecture could be:

```text id="t4w8mn"
CWD Worker
    ↓
MCP Client
    ↓
MCP Server
    ↓
Managed Identity
    ↓
Key Vault
    ↓
Enterprise API Credential
    ↓
Enterprise API
```

For example:

```text id="u8v3pz"
ServiceNow MCP Server
       ↓
Managed Identity
       ↓
Key Vault
       ↓
ServiceNow credential
       ↓
ServiceNow API
```

The Worker/LLM should **never see the underlying credential unnecessarily**.

---

# 15. Key Vault + API Management

A common enterprise architecture:

```text id="p9j4kw"
CWD Worker
      ↓
APIM
      ↓
Enterprise API
```

If APIM or an integration component needs a secret:

```text id="f2c7ya"
APIM / Integration
       ↓
Managed Identity
       ↓
Key Vault
       ↓
Secret
```

This keeps credential management centralized.

---

# 16. Key Vault + ServiceNow

Suppose ServiceNow requires a credential.

```text id="v5d9kr"
ServiceNow Worker
       ↓
MCP
       ↓
APIM / Integration
       ↓
Key Vault
       ↓
ServiceNow Credential
       ↓
ServiceNow API
```

But if ServiceNow is configured for an Entra/OAuth-based integration, prefer a token-based identity flow rather than permanently storing a static password/API key.

---

# 17. Secret Rotation

One of Key Vault's important enterprise capabilities is supporting secret lifecycle management.

Imagine:

```text id="h8r2qf"
Old Secret
    ↓
Rotation
    ↓
New Secret
    ↓
Application retrieves latest version
```

Why?

Because credentials shouldn't remain unchanged indefinitely.

Typical rotation process:

```text id="6g5z1k"
Generate New Credential
        ↓
Store New Version
        ↓
Update External System
        ↓
Application Uses New Credential
        ↓
Retire Old Credential
```

For production, design rotation carefully so you don't create downtime.

---

# 18. Versioning

Key Vault objects can have versions.

Conceptually:

```text id="c2j6sp"
service-now-secret
       │
       ├── v1
       ├── v2
       └── v3
```

This helps with:

* Rotation
* Rollback
* Auditing
* Controlled migration

---

# 19. RBAC for Key Vault

Don't allow every Worker to read every secret.

Bad:

```text id="w3v9ka"
All Workers
     ↓
All Key Vault Secrets
```

Better:

```text id="n7c2yd"
Equipment Worker
     ↓
Only equipment-related secrets

ServiceNow Worker
     ↓
Only ServiceNow-related secrets

Salesforce Worker
     ↓
Only Salesforce-related secrets
```

This is **least privilege**.

---

# 20. Agentic AI Security

This becomes especially important with CWD.

Never do:

```text id="e2r7hm"
LLM
 ↓
Key Vault
 ↓
Give me all secrets
```

Instead:

```text id="z5c8qa"
LLM
 ↓
Worker
 ↓
Approved Tool
 ↓
Policy
 ↓
Managed Identity
 ↓
Key Vault
 ↓
Required Secret
```

The LLM should not have unrestricted access to Key Vault.

---

# 21. Secrets Should Not Enter Agent Memory

This is an important Agentic AI security principle.

Don't put:

```text id="r4m9tx"
API keys
Passwords
Client secrets
Certificates/private keys
```

into:

* Conversation history
* Agent memory
* Redis
* Vector database
* RAG documents
* Prompts
* LLM context

Instead:

```text id="s8q2wm"
Agent needs credential
       ↓
Controlled tool
       ↓
Key Vault
       ↓
Credential used internally
       ↓
Return business result
```

The agent ideally receives:

> "ServiceNow ticket created successfully."

not:

> "Here is the ServiceNow password."

---

# 22. Key Vault + RAG

Key Vault isn't a RAG database.

Correct architecture:

```text id="x6m3pv"
Documents
   ↓
Blob / SharePoint
   ↓
Azure AI Search
   ↓
RAG Worker
   ↓
LLM
```

Key Vault is used for **credentials required by the RAG infrastructure**.

For example:

```text id="b8z4yc"
RAG Worker
   ↓
Managed Identity
   ↓
Key Vault
   ↓
External credential if required
```

---

# 23. Key Vault + Azure OpenAI

If an integration requires a credential, Key Vault can protect it.

However, when Azure services support **Microsoft Entra authentication and managed identity**, prefer that approach over static API keys where supported.

Conceptually:

```text id="d4j8qa"
CWD Worker
      ↓
Managed Identity
      ↓
Entra ID
      ↓
Azure AI Service
```

If a static credential is genuinely required:

```text id="k5n7xp"
Worker
 ↓
Managed Identity
 ↓
Key Vault
 ↓
API Key
```

---

# 24. Key Vault + CI/CD

Your deployment pipeline should also avoid embedding secrets.

Bad:

```text id="m8r2vs"
GitHub
 ↓
Secret in source code
 ↓
Docker image
```

Better:

```text id="f3c9wb"
GitHub / Azure DevOps
          ↓
Secure authentication
          ↓
Azure
          ↓
Managed Identity
          ↓
Key Vault
```

For CI/CD, use secure identity federation/workload identity where supported instead of long-lived deployment credentials.

---

# 25. Key Vault + ACR

Your CWD deployment:

```text id="q8z5ka"
GitHub / Azure DevOps
       ↓
Build Docker Image
       ↓
ACR
       ↓
AKS / Container Apps
       ↓
Managed Identity
       ↓
Key Vault
```

Remember:

> **ACR stores container images. Key Vault stores secrets/keys/certificates.**

---

# 26. Key Vault vs Azure Storage

| Service         | Purpose                   |
| --------------- | ------------------------- |
| Blob Storage    | Files/documents/images    |
| ADLS Gen2       | Data lake                 |
| Azure AI Search | Search/RAG index          |
| Key Vault       | Secrets/keys/certificates |
| ACR             | Container images          |

Don't use Blob Storage as a general-purpose secret vault.

---

# 27. Complete CWD Security Pattern

For your project, the clean architecture is:

```text id="m3x7pz"
                    CWD
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
   Coordinator   Delegator      Worker
                                  │
                             Managed Identity
                                  │
                                  ▼
                              Entra ID
                                  │
                         ┌────────┴────────┐
                         ▼                 ▼
                      Key Vault          RBAC
                         │
               ┌─────────┼─────────┐
               ▼         ▼         ▼
             Secrets    Keys    Certificates
```

Then:

```text id="s4k9bn"
Worker
  │
  ├── Key Vault → Credential
  │
  ├── AI Search → RAG
  │
  ├── Blob → Documents
  │
  ├── SQL → Structured data
  │
  └── APIM → Enterprise APIs
```

---

# 28. Strong Interview Example

**Question: How would you secure credentials in your CWD multi-agent platform?**

> **"I would use Azure Key Vault as the centralized secret, key and certificate management service. I would avoid storing API keys, passwords or connection strings in source code, Docker images, prompts or agent memory. Azure-hosted CWD workloads such as Container Apps or AKS Pods would use Managed Identity or Microsoft Entra Workload ID to authenticate to Key Vault. RBAC and least-privilege permissions would ensure that each Worker can access only the secrets it requires.**
>
> **For example, a ServiceNow Worker could retrieve its required integration credential from Key Vault through its managed identity, while an Equipment Worker would have access only to equipment-related credentials. Where the target Azure service supports Entra authentication, I would prefer passwordless managed identity rather than storing a static secret. I would also enable secret versioning, rotation, auditing and monitoring. For high-risk agentic workflows, the LLM would never have direct access to Key Vault; secrets would be retrieved and used internally by a controlled tool or integration service."**

---

# 29. The Most Important Architecture

Remember this:

```text id="c7x4qm"
                 CWD WORKER
                     │
                     │
              Managed Identity
                     │
                     ▼
                Microsoft
                Entra ID
                     │
                     ▼
                  RBAC
                     │
                     ▼
                KEY VAULT
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
       Secret       Key     Certificate
          │
          ▼
    Controlled Tool
          │
          ▼
    Enterprise API
```

### The 5-line memory trick

**Managed Identity → Who is the application?**

**Entra ID → Authenticate the identity**

**RBAC → What can it access?**

**Key Vault → Where are sensitive credentials/keys/certificates stored?**

**Application/Agent → Uses the secret without exposing it to the LLM**

> **Best interview sentence:**
> **"In my CWD architecture, Managed Identity provides passwordless authentication to Key Vault, RBAC enforces least-privilege access, and Key Vault centrally manages secrets, certificates and cryptographic keys so credentials never need to be embedded in agents, code or containers."**
