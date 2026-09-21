## How do you encrypt data in transit?

**Data in transit** is data moving between CWD components or external systems. I protect it using **TLS/HTTPS**.

### CWD example

```text
User
 ↓ HTTPS/TLS
API Gateway / FastAPI
 ↓ HTTPS/TLS
Coordinator
 ↓ HTTPS/TLS
A2A
 ↓ HTTPS/TLS
Delegator
 ↓ HTTPS/TLS
Worker
 ↓ HTTPS/TLS
MCP Server
 ↓ HTTPS/TLS
Salesforce / ServiceNow / SharePoint
```

### Key controls

**1. TLS/HTTPS everywhere**

I don't allow sensitive CWD communication over plain HTTP.

```text
❌ HTTP
Worker ───────> MCP

✅ HTTPS/TLS
Worker ──encrypted──> MCP
```

TLS protects customer data, A2A messages, MCP requests/responses, and authentication tokens while they are traveling across the network.

**2. Authenticate the connection**

Encryption alone isn't enough. I combine TLS with **OAuth/Entra ID or workload identities**.

```text
TLS       → protects the data
Identity  → verifies who is communicating
RBAC      → controls what they can do
```

**3. Secure A2A and MCP**

For CWD:

```text
Coordinator
   ↓ TLS + OAuth
Sales Delegator
   ↓ TLS
Worker
   ↓ TLS + authentication
MCP Server
   ↓ TLS
Salesforce
```

**4. Use private networking**

For sensitive enterprise workloads, I use controls such as:

* VNet/private networking
* Private Endpoints
* firewall rules
* restricted outbound access
* network segmentation

Private networking adds isolation, while TLS still provides encryption.

**5. Validate certificates**

Services verify the server certificate during the TLS connection. I never disable certificate validation in production.

**6. Don't send secrets unnecessarily**

Even with TLS, I don't put passwords/API keys into A2A messages, prompts, or MCP parameters. I use Managed Identity/OAuth or securely managed credentials.

### Interview-ready answer

> **“I encrypt data in transit using HTTPS/TLS across the entire CWD communication path—User to API, Coordinator to Delegators through A2A, Worker to MCP, and MCP to enterprise systems such as Salesforce and ServiceNow. I combine TLS with Entra ID/OAuth or workload identity for authentication and RBAC for authorization. For sensitive workloads, I also use private networking, Private Endpoints, firewall and egress controls, and proper certificate validation. I also minimize sensitive data in transit and never pass secrets through LLM or agent messages.”**

### Easy memory

**TLS → Authenticate → Authorize → Private Network → Certificate Validation → Minimize Data**

**One-line answer:**

> **“TLS encrypts the data while it is moving; identity and authorization ensure it moves only between trusted and permitted services.”**
