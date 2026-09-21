## What is your network architecture?

For the **CWD enterprise AI platform**, I use a **private, segmented network architecture**. The main goal is to ensure that users, agents, MCP servers, data stores, and enterprise systems communicate only through controlled paths.

### CWD network architecture

```text
                         Internet / Users
                               │
                            HTTPS/TLS
                               ↓
                    ┌─────────────────────┐
                    │ Azure Front Door /  │
                    │ WAF / APIM          │
                    └──────────┬──────────┘
                               │
                         Private / TLS
                               ↓
                    ┌─────────────────────┐
                    │      Azure VNet     │
                    │                     │
                    │  ┌───────────────┐  │
                    │  │ Coordinator   │  │
                    │  └───────┬───────┘  │
                    │          │ A2A       │
                    │  ┌───────┴───────┐  │
                    │  │  Delegators   │  │
                    │  └───────┬───────┘  │
                    │          │           │
                    │  ┌───────┴───────┐  │
                    │  │    Workers    │  │
                    │  └───────┬───────┘  │
                    │          │ MCP       │
                    │  ┌───────┴───────┐  │
                    │  │  MCP Servers  │  │
                    │  └───────┬───────┘  │
                    │          │           │
                    └──────────┼───────────┘
                               │
                     Private Endpoints
                               ↓
              ┌────────────────────────────────┐
              │ Enterprise Services             │
              │                                │
              │ Salesforce | ServiceNow        │
              │ SharePoint | Snowflake | Oracle│
              └────────────────────────────────┘
```

### 1. Public entry point is minimized

I don't expose the Coordinator, Workers, databases, or MCP servers directly to the internet.

The external entry point is something like:

```text
User
 ↓ HTTPS
Front Door / WAF
 ↓
APIM
 ↓
Private backend
```

APIM handles API policies such as authentication, authorization, rate limiting, and request validation.

---

### 2. Use VNet segmentation

Within Azure, I logically separate components into network zones/subnets.

For example:

```text
VNet
│
├── Ingress subnet
│     └── APIM / gateway
│
├── Agent subnet
│     ├── Coordinator
│     ├── Sales Delegator
│     ├── IT Delegator
│     └── Workers
│
├── MCP subnet
│     └── MCP Servers
│
└── Data / private endpoint subnet
      ├── Cosmos DB
      ├── Azure AI Search
      ├── Storage
      └── Key Vault
```

The exact subnet design depends on the deployment service and organizational network standards.

---

### 3. Control traffic between zones

I don't allow unrestricted communication.

For example:

```text
Coordinator → Delegator     ALLOW
Delegator → Worker          ALLOW
Worker → MCP                 ALLOW
Worker → Database            only if required
User → MCP                   BLOCK
Internet → Worker            BLOCK
Worker → random internet     BLOCK
```

This follows **least-privilege networking**.

---

### 4. Private endpoints for Azure services

For sensitive services, I use Private Endpoints where supported.

```text
CWD VNet
   │
   ├── Private Endpoint → Key Vault
   ├── Private Endpoint → Storage
   ├── Private Endpoint → Cosmos DB
   └── Private Endpoint → Azure AI Search
```

This keeps service traffic on controlled private connectivity instead of requiring public exposure.

---

### 5. Secure outbound connectivity

Outbound traffic is particularly important for preventing **data exfiltration**.

I don't give Workers unrestricted internet access.

```text
Worker
  ↓
Allowed outbound policy
  ↓
Approved MCP / enterprise endpoint
  ↓
Enterprise system
```

Unexpected destinations can be blocked through firewall/egress controls.

---

### 6. A2A stays inside the controlled network

Coordinator → Delegator communication happens through authenticated APIs/A2A endpoints.

```text
Coordinator
    ↓ HTTPS/TLS + identity
Sales Delegator
```

The Delegator endpoint isn't publicly exposed just because it supports A2A.

---

### 7. MCP is a controlled security boundary

Workers don't directly connect to every enterprise system.

```text
Worker
  ↓
MCP Server
  ↓
Authorization
  ↓
Approved enterprise API
  ↓
Salesforce / ServiceNow
```

This gives us one place to enforce:

* authentication
* authorization
* tool allowlists
* parameter validation
* DLP
* audit
* outbound controls

---

### 8. Data stores are not directly accessible from users

For example:

```text
User
  ✗ → Cosmos DB
  ✗ → Azure AI Search
  ✗ → Key Vault
  ✗ → MCP Server

User
  ↓
Authorized API
  ↓
CWD
  ↓
Required service
```

This reduces the attack surface.

---

### 9. Network security is combined with identity security

I don't rely on the network alone.

My security model is:

```text
Network Security
      +
TLS
      +
Entra ID
      +
RBAC
      +
Data Entitlement
      +
MCP Authorization
      +
DLP
      +
Audit
```

So even if traffic originates from the private network, the service still validates **who is calling and what they're allowed to access**.

---

## Example: Customer Briefing

For:

> **"Give me a customer briefing for C12345."**

The network path is:

```text
User
 ↓ HTTPS
APIM
 ↓
Coordinator
 ↓ A2A / TLS
 ├───────────────┐
 ↓               ↓
Sales           IT
Delegator       Delegator
 ↓               ↓
Customer        Incident
Worker          Worker
 ↓ MCP           ↓ MCP
Salesforce      ServiceNow
 ↓               ↓
 └────── Results ┘
          ↓
     Coordinator
          ↓
      User
```

The important point is that **Salesforce and ServiceNow are not directly exposed to the user or LLM**.

---

## Interview-ready answer

> **“For CWD, I use a private, segmented Azure network architecture. The public entry point is protected by HTTPS, WAF/API Management, and Entra ID, while the Coordinator, Delegators, Workers, and MCP servers run in controlled private network segments. Agent-to-agent A2A communication and Worker-to-MCP communication use TLS and authenticated service identities. Azure services such as Storage, Cosmos DB, Azure AI Search, and Key Vault use private connectivity where appropriate. I restrict east-west and outbound traffic using network security and allowlists, and I don't expose databases or MCP servers directly to users or the internet. Network security is combined with identity, RBAC, data entitlements, MCP authorization, DLP, and auditing.”**

### Easy memory

**Public entry → Private VNet → Segment → Restrict traffic → Private endpoints → Control egress → Identity + RBAC**

### Strong interview line

> **“My network architecture follows zero-trust principles: being inside the private network does not automatically mean the caller is trusted.”**
