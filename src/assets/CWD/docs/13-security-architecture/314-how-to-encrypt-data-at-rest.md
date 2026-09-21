## How do you encrypt data at rest?

**Data at rest** means data stored in databases, files, object storage, logs, checkpoints, backups, and indexes—not data moving between services.

In CWD, I use **encryption at rest + key management + access control**.

### CWD data-at-rest flow

```text id="n3f8kq"
CWD
 ├── Cosmos DB / Redis
 │      → Workflow state / checkpoints
 │
 ├── Blob / Data Lake
 │      → Raw enterprise documents
 │
 ├── Azure AI Search
 │      → RAG index
 │
 ├── Key Vault
 │      → Secrets / keys
 │
 └── Logs / Telemetry
        → Audit / traces
             ↓
       Encryption at Rest
             ↓
       Encryption Keys
             ↓
       Key Management / Key Vault
```

### 1. Enable encryption for storage services

For example:

```text id="x8q2mz"
Documents → Blob Storage → Encrypted
State     → Cosmos DB   → Encrypted
RAG index → AI Search   → Encrypted
Logs      → Log Analytics → Encrypted
```

Azure managed services generally provide encryption at rest by default, but I verify the service configuration and applicable compliance requirements rather than assuming it is sufficient.

---

### 2. Use customer-managed keys when required

For higher-security workloads, an organization may require **customer-managed keys (CMK)**.

Conceptually:

```text id="k4p7sd"
Data
 ↓
Storage Service
 ↓
Encryption Key
 ↓
Azure Key Vault / Managed HSM
```

This gives the organization greater control over the encryption keys and key lifecycle.

---

### 3. Separate key management from application data

I don't put encryption keys directly in:

```text
❌ source code
❌ database
❌ prompts
❌ LangGraph state
❌ A2A messages
```

Keys are managed through appropriate key-management services.

---

### 4. Encrypt CWD workflow state

CWD may persist:

```text id="v7m2qa"
customer_id
intent
worker_results
errors
workflow status
checkpoints
```

If stored in Cosmos DB or another persistence layer, the stored data should be encrypted.

Also, I minimize what gets persisted—**encryption doesn't replace data minimization**.

---

### 5. Protect RAG data

For RAG:

```text id="b6n9rc"
SharePoint
   ↓
Raw documents
   ↓
Blob/Data Lake
   ↓
Chunks + metadata
   ↓
Embeddings
   ↓
Azure AI Search
```

The documents, metadata, and indexes are protected with encryption at rest.

I also preserve ACL/entitlement metadata so encryption isn't treated as authorization.

---

### 6. Protect logs and traces

CWD observability data can contain sensitive information.

I apply:

```text id="j3w5pt"
Redaction / minimization
        +
Encryption at rest
        +
Access control
        +
Retention policy
```

For example, I wouldn't store a customer's full confidential record just because it appeared in an LLM trace.

---

### 7. Backups must also be protected

Encryption needs to cover:

* primary databases
* backups
* snapshots
* replicas
* exported files
* disaster-recovery copies

Otherwise, an encrypted production database could still leak data through an unprotected backup.

---

### 8. Encryption + authorization

A common interview mistake is saying:

> "The database is encrypted, so the data is secure."

Encryption at rest protects **stored data if storage is accessed improperly**, but it doesn't decide whether an authorized application should retrieve that data.

So CWD uses:

```text id="r5x8wc"
Encryption
     +
Identity
     +
RBAC
     +
Data Entitlement
     +
DLP
     +
Audit
```

### Interview-ready answer

> **“For data at rest, I enable encryption across all CWD persistence layers, including Cosmos DB or Redis where applicable, Blob/Data Lake, Azure AI Search, databases, logs, backups, and checkpoints. Azure-managed encryption is used by default where appropriate, and for higher-security workloads we can use customer-managed keys with Key Vault or Managed HSM. I separate key management from application data and never store encryption keys in code or agent state. I also apply data minimization, RBAC, data entitlements, retention, and auditing because encryption alone doesn't provide authorization.”**

### Easy memory

**Encrypt → Manage Keys → Control Access → Minimize → Backup Securely → Audit**

### Strong interview line

> **“Encryption protects the data while it is stored; RBAC and entitlements control who can actually access it.”**
## How do you encrypt data in transit?

**Data in transit** means data moving between CWD components—for example, **User → Coordinator → Delegator → Worker → MCP → Salesforce/ServiceNow**.

I protect it using **TLS/HTTPS, authenticated service-to-service communication, and network controls**.

### CWD flow

```text id="7m3xqa"
User
 ↓ HTTPS / TLS
API Gateway / APIM
 ↓ HTTPS / TLS
Coordinator
 ↓ HTTPS / TLS + Auth
A2A
 ↓ HTTPS / TLS
Delegator
 ↓ HTTPS / TLS
Worker
 ↓ HTTPS / TLS + Auth
MCP Server
 ↓ HTTPS / TLS
Salesforce / ServiceNow / SharePoint
```

### 1. Use HTTPS/TLS everywhere

For HTTP-based communication, I use **HTTPS rather than plain HTTP**.

```text
❌ HTTP
User ──────────> API

✅ HTTPS
User ── TLS ──> API
```

TLS encrypts the data while it is traveling across the network.

This protects things like:

* customer IDs
* business data
* A2A messages
* API requests/responses
* authentication tokens
* MCP requests/responses

---

### 2. Secure A2A communication

In CWD, Coordinator → Delegator communication should use authenticated and encrypted communication:

```text
Coordinator
    ↓
HTTPS/TLS
    +
OAuth / workload identity
    ↓
Sales Delegator
```

So we get both:

**Encryption → TLS**

**Identity → OAuth/Entra ID**

---

### 3. Secure MCP communication

Similarly:

```text
Worker
   ↓ HTTPS/TLS
MCP Server
   ↓ HTTPS/TLS
Salesforce / ServiceNow
```

The MCP Server independently authenticates and authorizes the Worker.

---

### 4. Use certificate validation

TLS isn't just about encryption. I also ensure proper certificate validation so the client knows it is communicating with the intended service.

I don't disable certificate verification in production.

```text
Client
 ↓
TLS handshake
 ↓
Validate server certificate
 ↓
Encrypted connection
```

---

### 5. Use strong TLS configuration

For production systems, I use modern TLS configurations and disable obsolete/insecure protocols and cipher suites according to the organization's security baseline.

I would avoid saying:

> "We just enabled HTTPS."

For enterprise architecture, the expectation is **proper TLS configuration and certificate lifecycle management**.

---

### 6. Use private networking where appropriate

For sensitive enterprise workloads, I prefer private connectivity where supported:

```text
id="8n2m5v"
Coordinator
     ↓
Private Network
     ↓
Delegator
     ↓
Private Endpoint
     ↓
Enterprise Service
```

Examples in Azure can include:

* VNet integration
* Private Endpoints
* network security controls
* firewall rules
* restricted egress

**Private networking and TLS complement each other; private networking doesn't replace encryption.**

---

### 7. Don't put secrets in transit unnecessarily

Even though TLS protects network traffic, I still avoid sending secrets through the request.

For example, don't send:

```json
{
  "customer_id": "C12345",
  "salesforce_password": "..."
}
```

Instead, the service authenticates using its workload identity or securely retrieves the required credential.

---

### 8. Secure external API calls

For CWD:

```text
Worker
 ↓
MCP
 ↓
Salesforce / ServiceNow
```

The outbound connection should use the enterprise system's supported secure authentication and TLS configuration.

So the protection is:

```text
TLS
 +
Authentication
 +
Authorization
```

---

### 9. Don't leak sensitive data into logs

TLS protects the network, but if I log the request body afterward, sensitive information can still leak.

Therefore:

```text
Network
 ↓ TLS
Application
 ↓
Redaction / minimization
 ↓
Logs
```

For example, I log:

```text
correlation_id = C789
tool = get_incidents
status = success
latency = 850ms
```

rather than the complete customer record.

---

## Interview-ready answer

> **“I encrypt data in transit by using HTTPS/TLS for communication between all CWD components and external enterprise systems. For example, User-to-API, Coordinator-to-Delegator through A2A, Worker-to-MCP, and MCP-to-Salesforce or ServiceNow all use secure transport. TLS provides encryption, while Entra ID/OAuth or workload identities provide authentication and RBAC provides authorization. For sensitive enterprise workloads, I also use private networking, Private Endpoints, firewall and egress controls. I use proper certificate validation and modern TLS configurations, and I avoid putting secrets or unnecessary sensitive data into requests or logs.”**

### Easy memory

**TLS → Authenticate → Authorize → Private Network → Validate Certificates → Minimize Data → Redact Logs**

### Strong interview line

> **“TLS protects the data while it is moving; authentication and authorization make sure the data is moving between trusted and permitted parties.”**
